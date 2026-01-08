import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import GameClient from "@/components/game/GameClient";

export default async function GamePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    redirect("/login");
  }

  const userProfile = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!userProfile) {
    redirect("/dashboard");
  }

  // Check if user is participant
  const participant = await prisma.matchParticipant.findFirst({
    where: {
      matchId,
      userId: userProfile.id,
    },
  });

  if (!participant) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <GameClient matchId={matchId} userId={userProfile.id} />
    </main>
  );
}

