import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50"
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-10 backdrop-blur">
            <h2 className="text-5xl font-bold text-white mb-3">
              Welcome back! 👋
            </h2>
            <p className="text-xl text-slate-300">
              You're signed in as{' '}
              <span className="font-bold text-blue-400">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* User Info Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:border-slate-600/50 transition">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Profile Information</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Email Address</p>
                <p className="text-lg font-semibold text-white break-all">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">User ID</p>
                  <p className="text-sm font-mono text-blue-400 break-all">{user.id.substring(0, 12)}...</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Last Sign In</p>
                  <p className="text-sm font-semibold text-white">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">✓</span>
                <span className="text-white font-semibold">Protected Session</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">✓</span>
                <span className="text-white font-semibold">Server Auth</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">✓</span>
                <span className="text-white font-semibold">Middleware</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">✓</span>
                <span className="text-white font-semibold">OAuth Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 backdrop-blur hover:border-indigo-500/40 transition">
            <div className="text-3xl mb-3">🔐</div>
            <h4 className="text-lg font-bold text-white mb-2">Secure Auth</h4>
            <p className="text-slate-400 text-sm">Server-side authentication with secure session management</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6 backdrop-blur hover:border-purple-500/40 transition">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="text-lg font-bold text-white mb-2">Fast & Reliable</h4>
            <p className="text-slate-400 text-sm">Built with Next.js App Router for optimal performance</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-xl p-6 backdrop-blur hover:border-pink-500/40 transition">
            <div className="text-3xl mb-3">🎨</div>
            <h4 className="text-lg font-bold text-white mb-2">Beautiful UI</h4>
            <p className="text-slate-400 text-sm">Modern design with Tailwind CSS and glassmorphism</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
