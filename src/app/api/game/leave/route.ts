import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { matchId } = await request.json();

    if (!matchId) {
      return NextResponse.json({ error: "matchId required" }, { status: 400 });
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

    // Find participant
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

    // Mark as disconnected
    await prisma.matchParticipant.update({
      where: { id: participant.id },
      data: { status: "DISCONNECTED" },
    });

    // Check remaining participants
    const remainingParticipants = await prisma.matchParticipant.findMany({
      where: {
        matchId,
        status: { not: "DISCONNECTED" },
      },
    });

    // If less than 4 participants remain, cancel the match
    if (remainingParticipants.length < 4) {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: "CANCELLED",
          phase: "FINISHED",
          endedAt: new Date(),
        },
      });

      // Remove all participants from this match
      await prisma.matchParticipant.deleteMany({
        where: { matchId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leave match error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

