"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MatchDTO, GamePhase } from "@/lib/game/dto";
import { toast } from "sonner";
import GuidelinesView from "./views/GuidelinesView";
import KeySelectionView from "./views/KeySelectionView";
import PlayingView from "./views/PlayingView";
import HalftimeView from "./views/HalftimeView";
import FinishedView from "./views/FinishedView";
import { Loader2 } from "lucide-react";

interface GameClientProps {
  matchId: string;
  userId: string;
}

export default function GameClient({ matchId, userId }: GameClientProps) {
  const [match, setMatch] = useState<MatchDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch initial match data
  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase.channel(`game_room:${matchId}`);

    channel
      .on("broadcast", { event: "phase-change" }, ({ payload }) => {
        fetchMatch();
      })
      .on("broadcast", { event: "ready-update" }, ({ payload }) => {
        fetchMatch();
      })
      .on("broadcast", { event: "proposal-update" }, ({ payload }) => {
        fetchMatch();
      })
      .on("broadcast", { event: "vote-update" }, ({ payload }) => {
        fetchMatch();
      })
      .on("broadcast", { event: "round-update" }, ({ payload }) => {
        fetchMatch();
      })
      .on("broadcast", { event: "match-cancelled" }, ({ payload }) => {
        toast.error("Match was cancelled");
        router.push("/dashboard");
      })
      .subscribe();

    // Cleanup on unmount - mark as disconnected if leaving
    return () => {
      supabase.removeChannel(channel);
      // Note: We don't auto-leave on unmount as user might just be refreshing
      // They can manually leave if needed
    };
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/match/${matchId}`);
      if (!res.ok) {
        if (res.status === 404 || res.status === 410) {
          // Match not found or cancelled
          toast.error("Match cancelled or not found");
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch match");
      }
      const data = await res.json();
      
      // Check if match is cancelled
      if (data.cancelled || data.status === "CANCELLED") {
        toast.error("Match was cancelled");
        router.push("/dashboard");
        return;
      }

      // Check if user is disconnected
      const currentParticipant = data.participants?.find((p: any) => p.userId === userId);
      if (currentParticipant?.status === "DISCONNECTED") {
        toast.error("You left this match");
        router.push("/dashboard");
        return;
      }

      setMatch(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch match error:", err);
      toast.error("Failed to load game");
      setLoading(false);
    }
  };

  const broadcastUpdate = async (event: string, payload: any) => {
    const channel = supabase.channel(`game_room:${matchId}`);
    await channel.send({
      type: "broadcast",
      event,
      payload,
    });
  };

  if (loading || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentParticipant = match.participants.find((p) => p.userId === userId);
  if (!currentParticipant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Not a participant in this match</p>
      </div>
    );
  }

  // Render based on phase
  switch (match.phase) {
    case "GUIDELINES":
      return (
        <GuidelinesView
          match={match}
          participant={currentParticipant}
          onReady={async () => {
            const res = await fetch("/api/game/ready", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchId }),
            });
            if (res.ok) {
              await broadcastUpdate("ready-update", {});
              fetchMatch();
            }
          }}
          onRefresh={fetchMatch}
        />
      );

    case "KEY_SELECTION":
      return (
        <KeySelectionView
          match={match}
          participant={currentParticipant}
          onPropose={async (text: string) => {
            const res = await fetch("/api/game/proposals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchId, text }),
            });
            if (res.ok) {
              await broadcastUpdate("proposal-update", {});
              fetchMatch();
            }
          }}
          onVote={async (proposalId: string) => {
            const res = await fetch("/api/game/vote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchId, proposalId }),
            });
            if (res.ok) {
              await broadcastUpdate("vote-update", {});
              fetchMatch();
            }
          }}
        />
      );

    case "PLAYING":
      return (
        <PlayingView
          match={match}
          participant={currentParticipant}
          onGuess={async (text: string) => {
            const res = await fetch("/api/game/guess", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchId, text }),
            });
            const data = await res.json();
            if (res.ok) {
              await broadcastUpdate("round-update", {});
              fetchMatch();
              if (data.isCorrect) {
                toast.success("Correct guess!");
              } else {
                toast.error("Wrong guess!");
              }
            }
          }}
        />
      );

    case "HALFTIME":
      return (
        <HalftimeView
          match={match}
          participant={currentParticipant}
          onContinue={async () => {
            // Server should auto-transition, just refetch
            fetchMatch();
          }}
        />
      );

    case "FINISHED":
      return (
        <FinishedView
          match={match}
          participant={currentParticipant}
          onReturn={() => router.push("/dashboard")}
        />
      );

    default:
      return <div>Unknown phase: {match.phase}</div>;
  }
}

