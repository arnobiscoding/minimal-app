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

    // Check participant and match
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

    if (participant.match.phase !== "GUIDELINES") {
      return NextResponse.json({ error: "Not in guidelines phase" }, { status: 400 });
    }

    // Mark as ready
    await prisma.matchParticipant.update({
      where: { id: participant.id },
      data: { ready: true },
    });

    // Check if all 4 are ready
    const allParticipants = await prisma.matchParticipant.findMany({
      where: { matchId },
    });

    const allReady = allParticipants.every((p) => p.ready);

    if (allReady) {
      // Transition to KEY_SELECTION
      await prisma.match.update({
        where: { id: matchId },
        data: { phase: "KEY_SELECTION" },
      });
    }

    return NextResponse.json({ success: true, allReady });
  } catch (err) {
    console.error("Ready error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

