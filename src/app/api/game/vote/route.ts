import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { matchId, proposalId } = await request.json();

    if (!matchId || !proposalId) {
      return NextResponse.json({ error: "matchId and proposalId required" }, { status: 400 });
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

    if (participant.role !== "SPY") {
      return NextResponse.json({ error: "Only spies can vote" }, { status: 403 });
    }

    if (participant.match.phase !== "KEY_SELECTION") {
      return NextResponse.json({ error: "Not in key selection phase" }, { status: 400 });
    }

    // Get proposal
    const proposal = await prisma.keyProposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal || proposal.matchId !== matchId) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Increment votes
    await prisma.keyProposal.update({
      where: { id: proposalId },
      data: { votes: { increment: 1 } },
    });

    // Check if majority (2+ votes from 2 spies)
    const updatedProposal = await prisma.keyProposal.findUnique({
      where: { id: proposalId },
    });

    if (updatedProposal && updatedProposal.votes >= 2) {
      // Set final key and transition to PLAYING
      await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: { id: matchId },
          data: {
            phase: "PLAYING",
            finalKey: updatedProposal.text,
            currentRoundNumber: 1,
          },
        });

        // Create first round
        const spies = await tx.matchParticipant.findMany({
          where: {
            matchId,
            role: "SPY",
          },
        });

        if (spies.length >= 1) {
          await tx.round.create({
            data: {
              matchId,
              roundNumber: 1,
              drawerId: spies[0].userId,
              targetWord: updatedProposal.text,
            },
          });
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

