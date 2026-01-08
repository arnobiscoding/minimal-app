/**
 * ELO calculation utilities
 * Winning team: +25 MMR
 * Losing team: -25 MMR
 */

import { MMR_CONFIG } from "../constants";
import type { PrismaClient } from "../../generated/prisma/client";

export function calculateELO(
  winnerMMR: number,
  loserMMR: number
): { winnerNewMMR: number; loserNewMMR: number } {
  const K = MMR_CONFIG.MMR_CHANGE;

  return {
    winnerNewMMR: winnerMMR + K,
    loserNewMMR: loserMMR - K,
  };
}

export function getRankTier(mmr: number): "BRONZE" | "SILVER" | "GOLD" | "DIAMOND" {
  if (mmr >= MMR_CONFIG.RANK_THRESHOLDS.DIAMOND) return "DIAMOND";
  if (mmr >= MMR_CONFIG.RANK_THRESHOLDS.GOLD) return "GOLD";
  if (mmr >= MMR_CONFIG.RANK_THRESHOLDS.SILVER) return "SILVER";
  return "BRONZE";
}

export async function updateMMRForMatch(
  prisma: PrismaClient,
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
    .filter((p) => p.role === "SPY")
    .reduce((sum, p) => sum + p.score, 0);
  
  const detectiveScore = match.participants
    .filter((p) => p.role === "DETECTIVE")
    .reduce((sum, p) => sum + p.score, 0);

  const spiesWon = spyScore > detectiveScore;

  // Calculate average MMR for each team
  const spyParticipants = match.participants.filter((p) => p.role === "SPY");
  const detectiveParticipants = match.participants.filter((p) => p.role === "DETECTIVE");
  
  const avgSpyMMR = spyParticipants.reduce(
    (sum, p) => sum + (p.mmrSnapshot || MMR_CONFIG.DEFAULT_MMR),
    0
  ) / spyParticipants.length;
  
  const avgDetectiveMMR = detectiveParticipants.reduce(
    (sum, p) => sum + (p.mmrSnapshot || MMR_CONFIG.DEFAULT_MMR),
    0
  ) / detectiveParticipants.length;

  // Update MMR for all participants
  await Promise.all(
    match.participants.map(async (participant) => {
      const isWinner = spiesWon
        ? participant.role === "SPY"
        : participant.role === "DETECTIVE";

      const participantMMR = participant.mmrSnapshot || MMR_CONFIG.DEFAULT_MMR;
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

