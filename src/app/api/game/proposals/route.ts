import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { proposalSchema } from "@/lib/validation";
import { handleError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  let matchId: string | undefined;
  
  try {
    const body = await request.json();
    matchId = body?.matchId;
    
    // Validate input
    const validationResult = proposalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const validated = validationResult.data;
    matchId = validated.matchId;

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
      throw new ForbiddenError("Only spies can propose keys");
    }

    if (participant.match.phase !== "KEY_SELECTION") {
      return NextResponse.json(
        { error: "Not in key selection phase" },
        { status: 400 }
      );
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
        matchId: validated.matchId,
        userId: userProfile.id,
        text: validated.text,
        votes: 0,
      },
    });

    logger.info("Proposal created", { matchId: validated.matchId, userId: userProfile.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Proposal error", err instanceof Error ? err : new Error(String(err)), {
      matchId,
    });
    
    const { statusCode, response } = handleError(err);
    return NextResponse.json(response, { status: statusCode });
  }
}

