import Link from 'next/link'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error || 'An authentication error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auth Error</h1>
          <p className="text-gray-600 mb-6">{decodeURIComponent(error)}</p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-red-800 font-mono break-words">{error}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"\n              className="block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"\n            >\n              Try Again\n            </Link>\n            <Link\n              href="/"\n              className="block px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-lg transition"\n            >\n              Back to Home\n            </Link>\n          </div>\n        </div>\n\n        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">\n          <p>If the problem persists, please contact support.</p>\n        </div>\n      </div>\n    </div>\n  )\n}\n