import { NextRequest, NextResponse } from "next/server";

// Keep legacy path working: forward to new API callback
export async function GET(request: NextRequest) {
  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectUrl = new URL("/api/auth/callback", origin);
  if (code) redirectUrl.searchParams.set("code", code);
  return NextResponse.redirect(redirectUrl.toString());
}
