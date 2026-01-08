import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Megamind. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="#features"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
