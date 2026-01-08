import { Match, MatchParticipant, KeyProposal, Round, User } from "../../generated/prisma/client";

export type Role = "SPY" | "DETECTIVE" | "SPECTATOR";
export type GamePhase = "GUIDELINES" | "KEY_SELECTION" | "PLAYING" | "HALFTIME" | "FINISHED";

export interface MatchDTO {
  id: string;
  phase: GamePhase;
  status: string;
  finalKey: string | null; // Redacted for detectives
  currentRoundNumber: number;
  roundsToPlay: number;
  participants: ParticipantDTO[];
  currentRound?: RoundDTO | null;
  proposals?: ProposalDTO[];
}

export interface ParticipantDTO {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  role: Role;
  status: string;
  ready: boolean;
  score: number;
}

export interface ProposalDTO {
  id: string;
  text: string;
  votes: number;
  proposerId: string;
  proposerUsername: string;
}

export interface RoundDTO {
  id: string;
  roundNumber: number;
  drawerId: string;
  drawerUsername: string;
  targetWord: string | null; // Redacted for detectives
  winnerId: string | null;
  startedAt: Date;
  endedAt: Date | null;
}

/**
 * Builds a MatchDTO with role-based redaction
 */
export function buildMatchDTO(
  match: Match & {
    participants: (MatchParticipant & { user: User })[];
    rounds: Round[];
    proposals: (KeyProposal & { user: User })[];
  },
  currentUserId: string
): MatchDTO {
  const currentParticipant = match.participants.find((p) => p.userId === currentUserId);
  const isSpy = currentParticipant?.role === "SPY";
  const isDetective = currentParticipant?.role === "DETECTIVE";

  // Redact finalKey for detectives
  const finalKey = isSpy ? match.finalKey : null;

  // Get current round
  const currentRound = match.rounds.find(
    (r) => r.roundNumber === match.currentRoundNumber
  );

  // Build participants (include all, but mark disconnected ones)
  const participants: ParticipantDTO[] = match.participants.map((p) => ({
    id: p.id,
    userId: p.userId,
    username: p.user.username,
    avatarUrl: p.user.avatarUrl,
    role: p.role as Role,
    status: p.status,
    ready: p.ready,
    score: p.score,
  }));

  // Build proposals (only visible to spies)
  const proposals: ProposalDTO[] = isSpy
    ? match.proposals.map((p) => ({
        id: p.id,
        text: p.text,
        votes: p.votes,
        proposerId: p.userId,
        proposerUsername: p.user.username,
      }))
    : [];

  // Build current round (redact targetWord for detectives)
  const roundDTO: RoundDTO | null = currentRound
    ? {
        id: currentRound.id,
        roundNumber: currentRound.roundNumber,
        drawerId: currentRound.drawerId,
        drawerUsername:
          match.participants.find((p) => p.userId === currentRound.drawerId)?.user
            .username || "Unknown",
        targetWord: isSpy ? currentRound.targetWord : null,
        winnerId: currentRound.winnerId,
        startedAt: currentRound.startedAt,
        endedAt: currentRound.endedAt,
      }
    : null;

  return {
    id: match.id,
    phase: match.phase as GamePhase,
    status: match.status,
    finalKey,
    currentRoundNumber: match.currentRoundNumber,
    roundsToPlay: match.roundsToPlay,
    participants,
    currentRound: roundDTO,
    proposals: isSpy ? proposals : undefined,
  };
}

