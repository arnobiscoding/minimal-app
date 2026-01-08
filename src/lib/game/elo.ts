/**
 * ELO calculation utilities
 * Winning team: +25 MMR
 * Losing team: -25 MMR
 */

export function calculateELO(
  winnerMMR: number,
  loserMMR: number
): { winnerNewMMR: number; loserNewMMR: number } {
  const K = 25; // Fixed MMR change per match

  return {
    winnerNewMMR: winnerMMR + K,
    loserNewMMR: loserMMR - K,
  };
}

export function getRankTier(mmr: number): string {
  if (mmr >= 2000) return "DIAMOND";
  if (mmr >= 1500) return "GOLD";
  if (mmr >= 1200) return "SILVER";
  return "BRONZE";
}

export async function updateMMRForMatch(
  prisma: any,
  matchId: string
): Promise<void> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!match || match.status !== "FINISHED") {
    return;
  }

  // Calculate team scores
  const spyScore = match.participants
    .filter((p: any) => p.role === "SPY")
    .reduce((sum: number, p: any) => sum + p.score, 0);
  
  const detectiveScore = match.participants
    .filter((p: any) => p.role === "DETECTIVE")
    .reduce((sum: number, p: any) => sum + p.score, 0);

  const spiesWon = spyScore > detectiveScore;

  // Calculate average MMR for each team
  const spyParticipants = match.participants.filter((p: any) => p.role === "SPY");
  const detectiveParticipants = match.participants.filter((p: any) => p.role === "DETECTIVE");
  
  const avgSpyMMR = spyParticipants.reduce((sum: number, p: any) => sum + (p.mmrSnapshot || 1000), 0) / spyParticipants.length;
  const avgDetectiveMMR = detectiveParticipants.reduce((sum: number, p: any) => sum + (p.mmrSnapshot || 1000), 0) / detectiveParticipants.length;

  // Update MMR for all participants
  await Promise.all(
    match.participants.map(async (participant: any) => {
      const isWinner = spiesWon
        ? participant.role === "SPY"
        : participant.role === "DETECTIVE";

      const participantMMR = participant.mmrSnapshot || 1000;
      const opponentAvgMMR = participant.role === "SPY" ? avgDetectiveMMR : avgSpyMMR;

      const { winnerNewMMR, loserNewMMR } = calculateELO(
        participantMMR,
        opponentAvgMMR
      );

      const newMMR = isWinner ? winnerNewMMR : loserNewMMR;
      const newRankTier = getRankTier(newMMR);

      await prisma.user.update({
        where: { id: participant.userId },
        data: {
          mmr: newMMR,
          rankTier: newRankTier,
          matchesPlayed: { increment: 1 },
        },
      });
    })
  );
}

