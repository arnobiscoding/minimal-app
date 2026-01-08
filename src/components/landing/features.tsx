import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeOff, Fingerprint, Lock, Network } from "lucide-react";

const features = [
  {
    title: "Hidden Context",
    description:
      "Spies share a 'Secret Key' that gives meaning to their drawings. Detectives see only chaos.",
    icon: Lock,
  },
  {
    title: "Ranked Matchmaking",
    description:
      "Climb the ELO ladder. Get matched with agents of similar skill levels in real-time.",
    icon: Network,
  },
  {
    title: "Deception Tactics",
    description:
      "Use ambiguity as a weapon. Draw broadly to confuse the enemy while signaling your team.",
    icon: EyeOff,
  },
  {
    title: "Secure Architecture",
    description:
      "Built with Row Level Security. The secret key is physically impossible to intercept via API.",
    icon: Fingerprint,
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="container py-24 px-4 md:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          Mission Objectives
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Master the art of digital subterfuge with these core mechanics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <Card
            key={i}
            className="bg-slate-900/50 border-slate-800 text-slate-100 backdrop-blur-sm"
          >
            <CardHeader>
              <feature.icon className="h-10 w-10 text-emerald-500 mb-4" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-slate-400">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
