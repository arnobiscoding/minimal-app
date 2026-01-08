"use client";

import { Button } from "@/components/ui/button";
import { Menu, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-emerald-500/20 blur"></span>
            <ShieldAlert className="relative h-6 w-6 text-emerald-400" />
          </div>
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
          >
            Cipher<span className="text-emerald-400">Canvas</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#features"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Mission
          </Link>
          <Link
            href="#rules"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Protocols
          </Link>
          <span className="h-5 w-px bg-white/10" />
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/5"
            >
              Log In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Join Operation
            </Button>
          </Link>
        </nav>

        <button
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-white/5"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <Link
              href="#features"
              className="block rounded-md px-2 py-2 text-slate-300 hover:text-white hover:bg-white/5"
            >
              Mission
            </Link>
            <Link
              href="#rules"
              className="block rounded-md px-2 py-2 text-slate-300 hover:text-white hover:bg-white/5"
            >
              Protocols
            </Link>
            <div className="h-px bg-white/10 my-2" />
            <Link href="/login" className="block">
              <Button
                variant="ghost"
                className="w-full text-slate-300 hover:text-white hover:bg-white/5"
              >
                Log In
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Join Operation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
