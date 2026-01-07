import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = request.headers.get('origin') || 'http://localhost:3000'

  try {
    if (code) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as CookieOptions)
              )
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  } catch (err) {
    console.error('Auth callback exception:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}`)
  }

  // If no code provided
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No+auth+code+provided`)
}
