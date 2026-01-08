"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Crosshair, Sparkles, Shield, Zap, Lock } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-40 md:pt-32 md:pb-48">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,transparent,transparent_50%,rgba(16,185,129,0.03)_50%,transparent_51%),linear-gradient(to_bottom,transparent,transparent_50%,rgba(34,211,238,0.03)_50%,transparent_51%)] bg-[length:48px_48px] opacity-60" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="mx-auto max-w-7xl flex flex-col items-center text-center px-4 md:px-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/20 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-xl mb-8 shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2.5 animate-pulse shadow-sm shadow-emerald-400"></span>
          <Shield className="h-3.5 w-3.5 mr-1.5" />
          Secure Transmission Active
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Draw the message.
          <br className="hidden sm:inline" />
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300%">
            Hide it in plain sight.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          A competitive multiplayer game of <strong className="text-emerald-400">steganography</strong>.
          <br className="hidden sm:inline" />
          Coordinate with your ally using a secret key while misdirecting your opponents.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/login" className="group">
            <Button
              size="lg"
              className="w-full sm:w-auto relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 h-14 px-10 text-base font-bold shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Assignment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </Button>
          </Link>
          <Link href="#features" className="group">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-emerald-500/30 text-slate-200 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/50 h-14 px-10 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Crosshair className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Read Briefing
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          {[
            { icon: Zap, text: "Real-time matchmaking", color: "emerald" },
            { icon: Lock, text: "RLS-secured backend", color: "teal" },
            { icon: Shield, text: "Zero-key leakage", color: "cyan" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="group flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-teal-500/5 transition-all duration-300 cursor-default"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/10 text-${item.color}-300 shadow-lg shadow-${item.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
