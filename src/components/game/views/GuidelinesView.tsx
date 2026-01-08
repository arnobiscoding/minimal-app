"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import { Shield, Users, CheckCircle2, X, LogOut } from "lucide-react";
import { toast } from "sonner";

interface GuidelinesViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onReady: () => void;
  onRefresh?: () => void;
}

export default function GuidelinesView({
  match,
  participant,
  onReady,
  onRefresh,
}: GuidelinesViewProps) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  
  // Filter out disconnected participants
  const activeParticipants = match.participants.filter((p) => p.status !== "DISCONNECTED");
  const readyCount = activeParticipants.filter((p) => p.ready).length;
  const allReady = activeParticipants.length === 4 && activeParticipants.every((p) => p.ready);
  const hasDisconnected = match.participants.some((p) => p.status === "DISCONNECTED");

  // Periodically check if match was cancelled
  useEffect(() => {
    if (activeParticipants.length < 4) {
      const interval = setInterval(async () => {
        if (onRefresh) {
          onRefresh();
        }
      }, 3000); // Check every 3 seconds
      return () => clearInterval(interval);
    }
  }, [activeParticipants.length, onRefresh]);

  const handleLeave = async () => {
    setLeaving(true);
    try {
      const res = await fetch("/api/game/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id }),
      });
      
      if (res.ok) {
        toast.info("Left the match");
        router.push("/dashboard");
      } else {
        toast.error("Failed to leave match");
        setLeaving(false);
      }
    } catch (err) {
      toast.error("Failed to leave match");
      setLeaving(false);
    }
  };

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

        {/* Warning if disconnected players */}
        {hasDisconnected && (
          <Card className="bg-gradient-to-br from-amber-900/20 to-red-900/20 border-2 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-amber-300">
                <X className="h-5 w-5" />
                <p className="text-sm">
                  Some players have left. This match may be cancelled.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Users className="h-6 w-6 text-slate-400" />
              Agents ({readyCount}/{activeParticipants.length} Ready)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {match.participants.map((p) => {
                const isDisconnected = p.status === "DISCONNECTED";
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-lg border-2 ${
                      isDisconnected
                        ? "border-red-500/30 bg-red-950/20 opacity-50"
                        : p.ready
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-950/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isDisconnected ? "text-red-400 line-through" : "text-white"}`}>
                          {p.username}
                        </p>
                        <p className="text-xs text-slate-400">
                          {isDisconnected ? "Disconnected" : p.role}
                        </p>
                      </div>
                      {isDisconnected ? (
                        <X className="h-5 w-5 text-red-400" />
                      ) : p.ready ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ready Button */}
        <div className="text-center space-y-4">
          {activeParticipants.length < 4 ? (
            <div className="space-y-4">
              <p className="text-red-400 font-semibold">
                Not enough players ({activeParticipants.length}/4)
              </p>
              <p className="text-slate-400 text-sm">
                This match will be cancelled. You can leave and join a new match.
              </p>
              <Button
                onClick={handleLeave}
                disabled={leaving}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {leaving ? "Leaving..." : "Leave Match"}
              </Button>
            </div>
          ) : !participant.ready ? (
            <div className="space-y-4">
              <Button
                onClick={onReady}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-6 text-lg"
              >
                I'm Ready
              </Button>
              <div>
                <Button
                  onClick={handleLeave}
                  disabled={leaving}
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {leaving ? "Leaving..." : "Leave Match"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-emerald-400 font-semibold">✓ You're ready!</p>
              <p className="text-slate-400">
                Waiting for {activeParticipants.length - readyCount} more agent{activeParticipants.length - readyCount !== 1 ? "s" : ""}...
              </p>
              <Button
                onClick={handleLeave}
                disabled={leaving}
                variant="ghost"
                className="text-slate-400 hover:text-slate-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {leaving ? "Leaving..." : "Leave Match"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

