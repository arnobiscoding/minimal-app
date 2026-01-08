"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Crosshair } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="container flex flex-col items-center text-center px-4 md:px-8">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Secure Transmission Active
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
          Secrets travel <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            unseen in plain sight.
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          A competitive multiplayer game of <strong>Steganography</strong>. Draw
          with a secret key. Deceive the Detectives. Deliver the message before
          it's intercepted.
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
              className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 h-12 px-8"
            >
              Read Briefing <Crosshair className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
