"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Crosshair, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32">
      {/* Background Layers */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(16,185,129,0.08),transparent),radial-gradient(800px_400px_at_90%_20%,rgba(34,211,238,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent,transparent_50%,rgba(255,255,255,0.05)_50%,transparent_51%),linear-gradient(to_bottom,transparent,transparent_50%,rgba(255,255,255,0.04)_50%,transparent_51%)] bg-size-[24px_24px] opacity-40" />

      <div className="mx-auto max-w-7xl flex flex-col items-center text-center px-4 md:px-8">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300 backdrop-blur-xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          Secure Transmission Active
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
          Draw the message.
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Hide it in plain sight.
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          A competitive multiplayer game of <strong>steganography</strong>.
          Coordinate with your ally using a secret key while misdirecting your
          opponents.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base"
            >
              Start Assignment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/10 text-slate-200 hover:bg-white/5 h-12 px-8"
            >
              Read Briefing <Crosshair className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Small Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
          {[
            "Real-time matchmaking",
            "RLS-secured backend",
            "Zero-key leakage",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-slate-300">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
