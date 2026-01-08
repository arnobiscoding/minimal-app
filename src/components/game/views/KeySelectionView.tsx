"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchDTO, ParticipantDTO } from "@/lib/game/dto";
import { Lock, Vote, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KeySelectionViewProps {
  match: MatchDTO;
  participant: ParticipantDTO;
  onPropose: (text: string) => Promise<void>;
  onVote: (proposalId: string) => Promise<void>;
}

export default function KeySelectionView({
  match,
  participant,
  onPropose,
  onVote,
}: KeySelectionViewProps) {
  const [proposalText, setProposalText] = useState("");
  const [loading, setLoading] = useState(false);

  const isSpy = participant.role === "SPY";
  const hasProposed = match.proposals?.some((p) => p.proposerId === participant.userId);

  const handlePropose = async () => {
    if (!proposalText.trim()) {
      toast.error("Please enter a word");
      return;
    }
    setLoading(true);
    try {
      await onPropose(proposalText);
      setProposalText("");
      toast.success("Proposal submitted!");
    } catch (err) {
      toast.error("Failed to submit proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string) => {
    setLoading(true);
    try {
      await onVote(proposalId);
      toast.success("Vote cast!");
    } catch (err) {
      toast.error("Failed to vote");
    } finally {
      setLoading(false);
    }
  };

  if (!isSpy) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Lock className="h-6 w-6 text-cyan-400" />
              Waiting for Spies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-cyan-500/50 rounded-full"></div>
              </div>
              <p className="text-slate-300">
                The spies are selecting their secret key...
              </p>
              <p className="text-sm text-slate-500">
                You'll see the drawing once they're ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            War Room
          </h1>
          <p className="text-slate-400">Propose and vote on the secret key</p>
        </div>

        {/* Propose Section */}
        {!hasProposed && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="text-white">Propose a Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value.toUpperCase())}
                placeholder="Enter a word (e.g., FIRE)"
                className="h-12 text-lg bg-slate-950/50 border-slate-800 text-white"
                maxLength={20}
              />
              <Button
                onClick={handlePropose}
                disabled={loading || !proposalText.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Proposal"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Proposals List */}
        {match.proposals && match.proposals.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Vote className="h-6 w-6 text-emerald-400" />
                Proposals ({match.proposals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {match.proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 rounded-lg border-2 border-slate-800 bg-slate-950/50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-lg">{proposal.text}</p>
                    <p className="text-sm text-slate-400">
                      by {proposal.proposerUsername} • {proposal.votes} vote{proposal.votes !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {hasProposed && (
                    <Button
                      onClick={() => handleVote(proposal.id)}
                      disabled={loading}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Vote
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {hasProposed && (!match.proposals || match.proposals.length === 0) && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-slate-800">
            <CardContent className="p-8 text-center">
              <p className="text-slate-400">Waiting for other spies to propose...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

