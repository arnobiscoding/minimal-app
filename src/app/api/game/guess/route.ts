import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { matchId, text } = await request.json();

    if (!matchId || !text) {
      return NextResponse.json({ error: "matchId and text required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Check participant and role
    const participant = await prisma.matchParticipant.findFirst({
      where: {
        matchId,
        userId: userProfile.id,
      },
      include: {
        match: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    if (participant.role !== "DETECTIVE") {
      return NextResponse.json({ error: "Only detectives can guess" }, { status: 403 });
    }

    if (participant.match.phase !== "PLAYING") {
      return NextResponse.json({ error: "Not in playing phase" }, { status: 400 });
    }

    // Get current round
    const currentRound = await prisma.round.findFirst({
      where: {
        matchId,
        roundNumber: participant.match.currentRoundNumber,
      },
    });

    if (!currentRound) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    // Check if already guessed
    const existingGuess = await prisma.guessAttempt.findFirst({
      where: {
        matchId,
        roundId: currentRound.id,
        participantId: participant.id,
      },
    });

    if (existingGuess) {
      return NextResponse.json({ error: "Already guessed this round" }, { status: 400 });
    }

    // Check if correct
    const isCorrect = text.toUpperCase().trim() === currentRound.targetWord?.toUpperCase().trim();

    // Record guess
    await prisma.guessAttempt.create({
      data: {
        matchId,
        roundId: currentRound.id,
        participantId: participant.id,
        text: text.toUpperCase().trim(),
        isCorrect,
      },
    });

    if (isCorrect) {
      // Detectives win the round
      await prisma.$transaction(async (tx) => {
        await tx.round.update({
          where: { id: currentRound.id },
          data: {
            winnerId: participant.userId,
            winnerTeam: "DETECTIVE",
            endedAt: new Date(),
          },
        });

        // Update scores
        await tx.matchParticipant.updateMany({
          where: {
            matchId,
            role: "DETECTIVE",
          },
          data: {
            score: { increment: 1 },
          },
        });

        // Check if game is over or move to next round
        const match = await tx.match.findUnique({
          where: { id: matchId },
        });

        if (match && match.currentRoundNumber >= match.roundsToPlay) {
          // Game finished
          await tx.match.update({
            where: { id: matchId },
            data: {
              phase: "FINISHED",
              status: "FINISHED",
              endedAt: new Date(),
            },
          });
          
          // Update ELO (import and call)
          const { updateMMRForMatch } = await import("@/lib/game/elo");
          // Note: ELO update happens after transaction
          setTimeout(() => {
            updateMMRForMatch(prisma, matchId).catch(console.error);
          }, 1000);
        } else {
          // Move to next round or halftime
          const nextRoundNumber = match!.currentRoundNumber + 1;
          
          if (nextRoundNumber === 3) {
            // Halftime - swap roles
            await tx.match.update({
              where: { id: matchId },
              data: {
                phase: "HALFTIME",
                currentRoundNumber: nextRoundNumber,
              },
            });

            // Swap roles
            const allParticipants = await tx.matchParticipant.findMany({
              where: { matchId },
            });

            await Promise.all(
              allParticipants.map((p) =>
                tx.matchParticipant.update({
                  where: { id: p.id },
                  data: {
                    role: p.role === "SPY" ? "DETECTIVE" : "SPY",
                    ready: false,
                  },
                })
              )
            );
          } else {
            // Continue playing
            const spies = await tx.matchParticipant.findMany({
              where: {
                matchId,
                role: "SPY",
              },
            });

            const drawerIndex = (nextRoundNumber - 1) % spies.length;
            await tx.round.create({
              data: {
                matchId,
                roundNumber: nextRoundNumber,
                drawerId: spies[drawerIndex].userId,
                targetWord: match!.finalKey!,
              },
            });

            await tx.match.update({
              where: { id: matchId },
              data: {
                phase: "PLAYING",
                currentRoundNumber: nextRoundNumber,
              },
            });
          }
        }
      });
    }

    return NextResponse.json({ success: true, isCorrect });
  } catch (err) {
    console.error("Guess error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

