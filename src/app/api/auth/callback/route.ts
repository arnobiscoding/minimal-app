import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    if (code) {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as CookieOptions)
              );
            },
          },
        }
      );

      const { error, data } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }

      // Create user profile in Prisma if it doesn't exist
      if (data.user) {
        try {
          const email = data.user.email;
          if (email) {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (!existingUser) {
              // Generate username from email (before @)
              const usernameBase = email.split("@")[0];
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
                  email: email,
                  username: username,
                  rankTier: "BRONZE",
                  mmr: 1000,
                  matchesPlayed: 0,
                },
              });
            }
          }
        } catch (dbError) {
          // Log error but don't block auth flow
          console.error("Error creating user profile:", dbError);
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}`
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=No+auth+code+provided`
  );
}
