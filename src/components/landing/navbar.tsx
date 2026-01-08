"use client";

import { Button } from "@/components/ui/button";
import { Menu, ShieldAlert, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-emerald-500/20 bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-emerald-500/5" 
          : "border-b border-white/5 bg-slate-950/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-500/50 transition-all duration-300"></span>
            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg shadow-lg shadow-emerald-500/30">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:via-teal-300 transition-all duration-300">
            Cipher<span className="text-emerald-400">Canvas</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="#features"
            className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5 group"
          >
            <span className="relative z-10">Mission</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-teal-500/10 transition-all duration-300"></span>
          </Link>
          <Link
            href="#rules"
            className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5 group"
          >
            <span className="relative z-10">Protocols</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-teal-500/10 transition-all duration-300"></span>
          </Link>
          <span className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2" />
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
            >
              Log In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Join Operation
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </Button>
          </Link>
        </nav>

        <button
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-emerald-500/20 bg-slate-950/98 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            <Link
              href="#features"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-200"
              onClick={() => setOpen(false)}
            >
              Mission
            </Link>
            <Link
              href="#rules"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-200"
              onClick={() => setOpen(false)}
            >
              Protocols
            </Link>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent my-3" />
            <Link href="/login" className="block" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
              >
                Log In
              </Button>
            </Link>
            <Link href="/login" className="block" onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30">
                <Sparkles className="h-4 w-4 mr-2" />
                Join Operation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
