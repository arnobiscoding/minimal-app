import DashboardClient from "@/components/dashboard/DashboardClient";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Secure Auth Check
  let user = null as null | { id: string; email: string | null };
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
    if (result.error || !user || !user.email) {
      redirect("/login");
    }
  } catch {
    // Gracefully handle fetch failures in dev/edge environments
    redirect("/login");
  }

  // 2. Fetch or Create User Profile from Prisma
  let userProfile = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      username: true,
      rankTier: true,
      mmr: true,
      matchesPlayed: true,
      avatarUrl: true,
    },
  });

  // Edge Case: User logged in via Auth but no DB profile exists yet
  // Auto-create the profile
  if (!userProfile) {
    try {
      // Generate username from email (before @)
      const usernameBase = user.email.split("@")[0];
      let username = usernameBase;
      let counter = 1;

      // Ensure username is unique
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${usernameBase}${counter}`;
        counter++;
      }

      // Create user profile
      userProfile = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          username: username,
          rankTier: "BRONZE",
          mmr: 1000,
          matchesPlayed: 0,
        },
        select: {
          id: true,
          username: true,
          rankTier: true,
          mmr: true,
          matchesPlayed: true,
          avatarUrl: true,
        },
      });
    } catch (dbError) {
      console.error("Error creating user profile:", dbError);
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center p-10">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Creation Error</h1>
            <p className="text-slate-400 mb-6">
              There was an error creating your profile. Please try logging out and back in.
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      );
    }
  }

  // 3. Render the Client UI
  return (
    <main className="min-h-screen bg-slate-950">
      <DashboardClient user={userProfile} />
    </main>
  );
}
