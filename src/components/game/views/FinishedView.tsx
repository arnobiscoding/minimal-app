"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import { Trophy, Home } from "lucide-react";

interface FinishedViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onReturn: () => void;
}

export default function FinishedView({
  match,
  participant,
  onReturn,
}: FinishedViewProps) {
  const spyScore = match.participants
    .filter((p) => p.role === "SPY")
    .reduce((sum, p) => sum + p.score, 0);
  
  const detectiveScore = match.participants
    .filter((p) => p.role === "DETECTIVE")
    .reduce((sum, p) => sum + p.score, 0);

  const spiesWon = spyScore > detectiveScore;
  const participantWon = (participant.role === "SPY" && spiesWon) || 
                         (participant.role === "DETECTIVE" && !spiesWon);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-center justify-center text-3xl">
            <Trophy className="h-8 w-8 text-amber-400" />
            Game Finished
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className={`text-4xl font-bold mb-2 ${participantWon ? "text-emerald-400" : "text-red-400"}`}>
              {participantWon ? "Victory!" : "Defeat"}
            </p>
            <p className="text-slate-400">Final Scores</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-lg border-2 ${spiesWon ? "border-emerald-500/50 bg-emerald-500/10" : "border-slate-800"}`}>
              <p className="text-sm text-slate-400 mb-2">SPIES</p>
              <p className="text-3xl font-bold text-white">{spyScore}</p>
            </div>
            <div className={`p-6 rounded-lg border-2 ${!spiesWon ? "border-cyan-500/50 bg-cyan-500/10" : "border-slate-800"}`}>
              <p className="text-sm text-slate-400 mb-2">DETECTIVES</p>
              <p className="text-3xl font-bold text-white">{detectiveScore}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              onClick={onReturn}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

