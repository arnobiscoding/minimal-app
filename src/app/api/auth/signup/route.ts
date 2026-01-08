import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    const redirectTo = `${origin}/api/auth/callback`;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If session is returned (email confirmation disabled), create profile immediately
    if (data.user && data.session) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.user.email! },
        });

        if (!existingUser) {
          // Generate username from email (before @)
          const usernameBase = data.user.email!.split("@")[0];
          let username = usernameBase;
          let counter = 1;

          // Ensure username is unique
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${usernameBase}${counter}`;
            counter++;
          }

          // Create user profile
          await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email!,
              username: username,
              rankTier: "BRONZE",
              mmr: 1000,
              matchesPlayed: 0,
            },
          });
        }
      } catch (dbError) {
        // Log error but don't block signup flow
        console.error("Error creating user profile during signup:", dbError);
      }
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
