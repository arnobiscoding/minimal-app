import Link from "next/link";
import { ShieldAlert, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-emerald-500/20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/95 backdrop-blur-xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative">
                <span className="absolute -inset-1 rounded-lg bg-emerald-500/20 blur group-hover:bg-emerald-500/30 transition-all duration-300"></span>
                <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg">
                  <ShieldAlert className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Cipher<span className="text-emerald-400">Canvas</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              A competitive multiplayer game of steganography. Master the art of hidden communication 
              and deception in this thrilling strategic experience.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="#features"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Features
              </Link>
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 w-fit"
              >
                Support
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              &copy; {currentYear} CipherCanvas. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
