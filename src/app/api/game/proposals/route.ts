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

    if (participant.role !== "SPY") {
      return NextResponse.json({ error: "Only spies can propose keys" }, { status: 403 });
    }

    if (participant.match.phase !== "KEY_SELECTION") {
      return NextResponse.json({ error: "Not in key selection phase" }, { status: 400 });
    }

    // Check if already proposed
    const existing = await prisma.keyProposal.findFirst({
      where: {
        matchId,
        userId: userProfile.id,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already proposed a key" }, { status: 400 });
    }

    // Create proposal
    await prisma.keyProposal.create({
      data: {
        matchId,
        userId: userProfile.id,
        text: text.toUpperCase().trim(),
        votes: 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Proposal error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

