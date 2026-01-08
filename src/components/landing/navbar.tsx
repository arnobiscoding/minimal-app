"use client";

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-emerald-500" />
          <span className="text-lg font-bold tracking-tight text-white">
            Cipher<span className="text-emerald-500">Canvas</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <Link
            href="#features"
            className="hover:text-emerald-400 transition-colors"
          >
            Mission
          </Link>
          <Link
            href="#rules"
            className="hover:text-emerald-400 transition-colors"
          >
            Protocols
          </Link>
        </nav>

        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  );
}
