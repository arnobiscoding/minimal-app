import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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

    // Check if in queue
    const queueEntry = await prisma.queueEntry.findUnique({
      where: { userId: userProfile.id },
    });

    if (queueEntry) {
      return NextResponse.json({ 
        inQueue: true,
        matchId: null 
      });
    }

    // Check if in active match (not cancelled or finished)
    const activeParticipant = await prisma.matchParticipant.findFirst({
      where: {
        userId: userProfile.id,
        match: {
          status: "ACTIVE",
        },
        status: { not: "DISCONNECTED" },
      },
      include: {
        match: true,
      },
    });

    if (activeParticipant) {
      // Check if match is still valid (has 4 active participants)
      const activeCount = await prisma.matchParticipant.count({
        where: {
          matchId: activeParticipant.matchId,
          status: { not: "DISCONNECTED" },
        },
      });

      if (activeCount < 4) {
        // Match is invalid, remove user from it
        await prisma.matchParticipant.update({
          where: { id: activeParticipant.id },
          data: { status: "DISCONNECTED" },
        });
        return NextResponse.json({ 
          inQueue: false,
          matchId: null 
        });
      }

      return NextResponse.json({ 
        inQueue: false,
        matchId: activeParticipant.matchId 
      });
    }

    return NextResponse.json({ 
      inQueue: false,
      matchId: null 
    });
  } catch (err) {
    console.error("Queue status error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

