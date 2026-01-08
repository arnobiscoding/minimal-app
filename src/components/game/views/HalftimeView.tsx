"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import { RefreshCw } from "lucide-react";

interface HalftimeViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onContinue: () => void;
}

export default function HalftimeView({
  match,
  participant,
  onContinue,
}: HalftimeViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-center justify-center">
            <RefreshCw className="h-6 w-6 text-amber-400 animate-spin" />
            Halftime
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-slate-300 text-lg">
            Roles are being swapped...
          </p>
          <p className="text-slate-400 text-sm">
            You are now: <span className="font-bold text-emerald-400">{participant.role}</span>
          </p>
          <p className="text-slate-500 text-xs mt-4">
            Preparing for the second half...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

