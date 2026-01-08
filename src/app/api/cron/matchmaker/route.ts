import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Cron job to match players in queue
 * Secured by CRON_SECRET header
 * Should be called every 10-30 seconds
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev-secret";
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Group by rank tier and find groups of 4
    const rankTiers = ["BRONZE", "SILVER", "GOLD", "DIAMOND"];
    let matchesCreated = 0;

    for (const tier of rankTiers) {
      // Get queue entries for this tier
      const queueEntries = await prisma.queueEntry.findMany({
        where: { rankTier: tier },
        orderBy: { joinedAt: "asc" },
      });

      // Group into sets of 4
      for (let i = 0; i < queueEntries.length; i += 4) {
        const group = queueEntries.slice(i, i + 4);
        
        if (group.length === 4) {
          // Check MMR range (within ±100)
          const avgMMR = group.reduce((sum, e) => sum + e.mmr, 0) / 4;
          const inRange = group.every(
            (e) => Math.abs(e.mmr - avgMMR) <= 100
          );

          if (inRange) {
            // Create match
            await createMatch(group);
            matchesCreated++;
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      matchesCreated,
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    console.error("Matchmaker cron error:", err);
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

