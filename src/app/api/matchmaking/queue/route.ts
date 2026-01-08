import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const userProfile = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Check if already in queue
    const existingEntry = await prisma.queueEntry.findUnique({
      where: { userId: userProfile.id },
    });

    if (existingEntry) {
      return NextResponse.json({ 
        message: "Already in queue",
        inQueue: true 
      });
    }

    // Add to queue
    await prisma.queueEntry.create({
      data: {
        userId: userProfile.id,
        rankTier: userProfile.rankTier,
        mmr: userProfile.mmr,
      },
    });

    // Check if we can immediately match (4 players of same rank)
    const queueEntries = await prisma.queueEntry.findMany({
      where: {
        rankTier: userProfile.rankTier,
        mmr: {
          gte: userProfile.mmr - 100,
          lte: userProfile.mmr + 100,
        },
      },
      orderBy: { joinedAt: "asc" },
      take: 4,
    });

    if (queueEntries.length >= 4) {
      // Create match immediately
      const matchId = await createMatch(queueEntries);
      return NextResponse.json({ 
        matchId,
        inQueue: false 
      });
    }

    return NextResponse.json({ 
      message: "Joined queue",
      inQueue: true 
    });
  } catch (err) {
    console.error("Queue join error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function createMatch(queueEntries: Array<{ userId: string; mmr: number }>) {
  return await prisma.$transaction(async (tx) => {
    // Create match
    const match = await tx.match.create({
      data: {
        phase: "GUIDELINES",
        status: "ACTIVE",
        roundsToPlay: 4,
        currentRoundNumber: 0,
      },
    });

    // Assign roles: first 2 are SPY, last 2 are DETECTIVE
    const roles: Array<"SPY" | "DETECTIVE"> = ["SPY", "SPY", "DETECTIVE", "DETECTIVE"];

    // Create participants
    await Promise.all(
      queueEntries.map((entry, index) =>
        tx.matchParticipant.create({
          data: {
            matchId: match.id,
            userId: entry.userId,
            role: roles[index],
            status: "JOINED",
            ready: false,
            mmrSnapshot: entry.mmr,
          },
        })
      )
    );

    // Remove from queue
    await tx.queueEntry.deleteMany({
      where: {
        userId: { in: queueEntries.map((e) => e.userId) },
      },
    });

    return match.id;
  });
}

