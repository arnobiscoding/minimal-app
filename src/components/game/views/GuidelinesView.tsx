"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import { Shield, Users, CheckCircle2 } from "lucide-react";

interface GuidelinesViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onReady: () => void;
}

export default function GuidelinesView({
  match,
  participant,
  onReady,
}: GuidelinesViewProps) {
  const allReady = match.participants.every((p) => p.ready);
  const readyCount = match.participants.filter((p) => p.ready).length;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Mission Briefing
          </h1>
          <p className="text-slate-400">Prepare for your assignment</p>
        </div>

        {/* Role Card */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Shield className="h-6 w-6 text-emerald-400" />
              Your Role: {participant.role}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participant.role === "SPY" ? (
              <div className="space-y-2 text-slate-300">
                <p className="font-semibold text-emerald-400">Mission Objective:</p>
                <p>You and your teammate must communicate the secret message through drawings.</p>
                <p className="font-semibold text-emerald-400 mt-4">How to Win:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Vote on a secret key word with your teammate</li>
                  <li>Draw the target word while hiding it from detectives</li>
                  <li>Score points by successfully delivering messages</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 text-slate-300">
                <p className="font-semibold text-cyan-400">Mission Objective:</p>
                <p>Intercept the secret message by guessing what the spies are drawing.</p>
                <p className="font-semibold text-cyan-400 mt-4">How to Win:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Watch the drawings carefully</li>
                  <li>Guess the target word before the spies complete their mission</li>
                  <li>You have one guess per round</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Users className="h-6 w-6 text-slate-400" />
              Agents ({readyCount}/4 Ready)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {match.participants.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-lg border-2 ${
                    p.ready
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-950/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{p.username}</p>
                      <p className="text-xs text-slate-400">{p.role}</p>
                    </div>
                    {p.ready && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ready Button */}
        <div className="text-center">
          {!participant.ready ? (
            <Button
              onClick={onReady}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-6 text-lg"
            >
              I'm Ready
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-emerald-400 font-semibold">✓ You're ready!</p>
              <p className="text-slate-400">
                Waiting for {4 - readyCount} more agent{4 - readyCount !== 1 ? "s" : ""}...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

