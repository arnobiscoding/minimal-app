"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import DrawingBoard from "@/components/features/game/DrawingBoard";
import { Target, MessageSquare, Lock } from "lucide-react";
import { toast } from "sonner";

interface PlayingViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onGuess: (text: string) => Promise<void>;
}

export default function PlayingView({
  match,
  participant,
  onGuess,
}: PlayingViewProps) {
  const [guessText, setGuessText] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const isSpy = participant.role === "SPY";
  const isDetective = participant.role === "DETECTIVE";
  const canDraw = isSpy && match.currentRound?.drawerId === participant.userId;

  const handleGuess = async () => {
    if (!guessText.trim()) {
      toast.error("Please enter a guess");
      return;
    }
    setHasGuessed(true);
    await onGuess(guessText);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Context Panel */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Target className="h-6 w-6 text-emerald-400" />
              Mission Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Round</p>
              <p className="text-2xl font-bold text-white">
                {match.currentRoundNumber} / {match.roundsToPlay}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Your Role</p>
              <p className="text-lg font-semibold text-emerald-400">{participant.role}</p>
            </div>
            {isSpy && match.finalKey && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Secret Key</p>
                <p className="text-xl font-bold text-emerald-400">{match.finalKey}</p>
              </div>
            )}
            {isDetective && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Secret Key</p>
                <p className="text-xl font-bold text-slate-600 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  UNKNOWN
                </p>
              </div>
            )}
            {match.currentRound?.targetWord && isSpy && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Target Word</p>
                <p className="text-xl font-bold text-cyan-400">
                  {match.currentRound.targetWord}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Center: Drawing Board */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">
              {canDraw ? "Draw Here" : "Watch Drawing"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <DrawingBoard
                gameId={match.id}
                role={participant.role}
                userId={participant.userId}
                activeDrawerId={match.currentRound?.drawerId || null}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right: Chat/Guess Panel */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <MessageSquare className="h-6 w-6 text-emerald-400" />
              {isDetective ? "Make Your Guess" : "Chat"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDetective ? (
              <div className="space-y-4">
                <p className="text-slate-400 text-sm">
                  You have one guess per round. What word are the spies drawing?
                </p>
                <Input
                  value={guessText}
                  onChange={(e) => setGuessText(e.target.value.toUpperCase())}
                  placeholder="Enter your guess"
                  className="h-12 text-lg bg-slate-950/50 border-slate-800 text-white"
                  disabled={hasGuessed}
                />
                <Button
                  onClick={handleGuess}
                  disabled={hasGuessed || !guessText.trim()}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  {hasGuessed ? "Already Guessed" : "Submit Guess"}
                </Button>
                {hasGuessed && (
                  <p className="text-sm text-slate-500 text-center">
                    Waiting for result...
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-64 bg-slate-950/50 rounded-lg p-4 overflow-y-auto">
                  <p className="text-slate-500 text-sm">Chat coming soon...</p>
                </div>
                <Input
                  placeholder="Type a message..."
                  className="bg-slate-950/50 border-slate-800 text-white"
                  disabled
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

