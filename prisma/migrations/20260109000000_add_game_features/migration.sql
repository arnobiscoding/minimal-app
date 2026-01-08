-- AlterEnum: Add HALFTIME to GamePhase
ALTER TYPE "GamePhase" ADD VALUE 'HALFTIME';

-- CreateEnum: MatchStatus
CREATE TYPE "MatchStatus" AS ENUM ('ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum: ParticipantStatus
CREATE TYPE "ParticipantStatus" AS ENUM ('JOINED', 'READY', 'DISCONNECTED');

-- AlterTable: Add mmr to QueueEntry
ALTER TABLE "QueueEntry" ADD COLUMN "mmr" INTEGER NOT NULL DEFAULT 1000;

-- CreateIndex: QueueEntry rankTier and mmr
CREATE INDEX "QueueEntry_rankTier_mmr_idx" ON "QueueEntry"("rankTier", "mmr");

-- AlterTable: Update Match table
ALTER TABLE "Match" 
  DROP COLUMN "status",
  ADD COLUMN "status" "MatchStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "roundsToPlay" INTEGER NOT NULL DEFAULT 4,
  ADD COLUMN "currentRoundNumber" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: Match phase and status
CREATE INDEX "Match_phase_status_idx" ON "Match"("phase", "status");
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- AlterTable: Update MatchParticipant table
ALTER TABLE "MatchParticipant"
  ADD COLUMN "status" "ParticipantStatus" NOT NULL DEFAULT 'JOINED',
  ADD COLUMN "ready" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "mmrSnapshot" INTEGER;

-- CreateIndex: MatchParticipant indexes
CREATE UNIQUE INDEX "MatchParticipant_matchId_userId_key" ON "MatchParticipant"("matchId", "userId");
CREATE INDEX "MatchParticipant_matchId_role_idx" ON "MatchParticipant"("matchId", "role");
CREATE INDEX "MatchParticipant_matchId_status_idx" ON "MatchParticipant"("matchId", "status");

-- AlterTable: Update Round table
ALTER TABLE "Round" ADD COLUMN "winnerTeam" TEXT;

-- CreateIndex: Round matchId and roundNumber
CREATE INDEX "Round_matchId_roundNumber_idx" ON "Round"("matchId", "roundNumber");

-- CreateTable: GuessAttempt
CREATE TABLE "GuessAttempt" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuessAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: GuessAttempt indexes
CREATE INDEX "GuessAttempt_matchId_roundId_idx" ON "GuessAttempt"("matchId", "roundId");
CREATE INDEX "GuessAttempt_participantId_idx" ON "GuessAttempt"("participantId");

