import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildMatchDTO } from "@/lib/game/dto";
import { handleError, NotFoundError, ForbiddenError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { matchIdSchema } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    
    // Validate matchId format
    const matchIdValidation = matchIdSchema.safeParse(matchId);
    if (!matchIdValidation.success) {
      return NextResponse.json(
        { error: "Invalid match ID format" },
        { status: 400 }
      );
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

    // Fetch match with all relations first
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        rounds: {
          orderBy: { roundNumber: "asc" },
        },
        proposals: {
          include: {
            user: true,
          },
          orderBy: { votes: "desc" },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Check if user is participant
    const participant = match.participants.find((p) => p.userId === userProfile.id);

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // Check if match is cancelled or has less than 4 active participants
    const activeParticipants = match.participants.filter(
      (p) => p.status !== "DISCONNECTED"
    );

    if (match.status === "CANCELLED" || activeParticipants.length < 4) {
      return NextResponse.json({ 
        error: "Match cancelled or invalid",
        cancelled: true 
      }, { status: 410 }); // 410 Gone
    }

    // Build DTO with role-based redaction
    const matchDTO = buildMatchDTO(match, userProfile.id);

    logger.debug("Match fetched", { matchId, userId: userProfile.id });

    return NextResponse.json(matchDTO);
  } catch (err) {
    logger.error("Get match error", err instanceof Error ? err : new Error(String(err)), {
      matchId: await params.then((p) => p.matchId).catch(() => "unknown"),
    });
    
    const { statusCode, response } = handleError(err);
    return NextResponse.json(response, { status: statusCode });
  }
}

