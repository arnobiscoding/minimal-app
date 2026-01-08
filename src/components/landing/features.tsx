"use client";

import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeOff, Fingerprint, Lock, Network, Sparkles } from "lucide-react";

const features = [
  {
    title: "Hidden Context",
    description:
      "Spies share a 'Secret Key' that gives meaning to their drawings. Detectives see only chaos.",
    icon: Lock,
    gradient: "from-emerald-500/20 via-emerald-500/10 to-teal-500/20",
    iconGradient: "from-emerald-400 to-emerald-600",
    borderColor: "border-emerald-500/30",
  },
  {
    title: "Ranked Matchmaking",
    description:
      "Climb the ELO ladder. Get matched with agents of similar skill levels in real-time.",
    icon: Network,
    gradient: "from-teal-500/20 via-teal-500/10 to-cyan-500/20",
    iconGradient: "from-teal-400 to-teal-600",
    borderColor: "border-teal-500/30",
  },
  {
    title: "Deception Tactics",
    description:
      "Use ambiguity as a weapon. Draw broadly to confuse the enemy while signaling your team.",
    icon: EyeOff,
    gradient: "from-cyan-500/20 via-cyan-500/10 to-blue-500/20",
    iconGradient: "from-cyan-400 to-cyan-600",
    borderColor: "border-cyan-500/30",
  },
  {
    title: "Secure Architecture",
    description:
      "Built with Row Level Security. The secret key is physically impossible to intercept via API.",
    icon: Fingerprint,
    gradient: "from-blue-500/20 via-blue-500/10 to-indigo-500/20",
    iconGradient: "from-blue-400 to-blue-600",
    borderColor: "border-blue-500/30",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl py-32 px-4 md:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">Core Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          Mission <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Objectives</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Master the art of digital subterfuge with these core mechanics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Glow effect */}
            <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl group-hover:opacity-100 transition-opacity duration-500`} />
            
            <Card className={`relative h-full rounded-2xl border-2 ${feature.borderColor} bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 text-slate-100 backdrop-blur-xl shadow-2xl group-hover:shadow-lg transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1`}>
              <CardHeader className="pb-4">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.iconGradient} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse delay-75"></div>
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-150"></div>
          </div>
          <span className="text-sm font-medium text-slate-300">
            Ready to begin your mission?
          </span>
        </div>
      </div>
    </section>
  );
}
