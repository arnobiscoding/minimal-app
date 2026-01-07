import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative text-center px-6 max-w-5xl mx-auto py-20">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-purple-300">Production Ready Auth</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Modern Auth for
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Your Next Project</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          A production-ready authentication system built with Next.js 14, Supabase Auth, and Tailwind CSS. Perfect for your hackathon or startup.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/login"
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur"
          >
            View Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-8 backdrop-blur hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-bold text-white mb-3">Enterprise Security</h3>
            <p className="text-slate-300 leading-relaxed">
              Server-side authentication with secure session management and automatic token refresh.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8 backdrop-blur hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-slate-300 leading-relaxed">
              Built with Next.js 14 App Router and optimized for performance at scale.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-2xl p-8 backdrop-blur hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-white mb-3">Beautiful Design</h3>
            <p className="text-slate-300 leading-relaxed">
              Modern UI with Tailwind CSS, glassmorphism effects, and smooth animations.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 rounded-2xl p-10 backdrop-blur mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">Email & Password Auth</p>
                <p className="text-slate-400 text-sm">Secure password-based authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">OAuth Integration</p>
                <p className="text-slate-400 text-sm">Sign in with Google and other providers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">Protected Routes</p>
                <p className="text-slate-400 text-sm">Middleware-based route protection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">Session Management</p>
                <p className="text-slate-400 text-sm">Automatic token refresh and validation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-slate-400 mb-6">
            Ready to build something awesome?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-200 transform hover:scale-105"
          >
            Start Building Now →
          </Link>
        </div>
      </div>
    </div>
  )
}
