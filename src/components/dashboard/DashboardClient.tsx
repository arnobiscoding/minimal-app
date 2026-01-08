"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Swords, Trophy, History, LogOut, TrendingUp, Users, Target, Sparkles, Shield } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface DashboardClientProps {
  user: {
    id: string
    username: string
    rankTier: string
    mmr: number
    matchesPlayed: number
    avatarUrl: string | null
  }
}

const rankColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  BRONZE: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
  SILVER: { bg: "bg-slate-400/20", text: "text-slate-300", border: "border-slate-400/30", glow: "shadow-slate-400/20" },
  GOLD: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-yellow-500/20" },
  DIAMOND: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [isQueueing, setIsQueueing] = useState(false)
  const router = useRouter()
  const rankColor = rankColors[user.rankTier] || rankColors.BRONZE

  const handleJoinQueue = async () => {
    setIsQueueing(true)
    
    try {
      const res = await fetch("/api/matchmaking/queue", { 
        method: "POST",
      })
      
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to join queue")

      if (data.matchId) {
        toast.success("Match Found!", { description: "Redirecting to game..." })
        router.push(`/game/${data.matchId}`)
      } else {
        toast.info("Searching for Agents...", {
          description: `Looking for rank: ${user.rankTier} (±100 MMR)`,
        })
        
        // Poll for match status
        const pollInterval = setInterval(async () => {
          const statusRes = await fetch("/api/matchmaking/status")
          const statusData = await statusRes.json()
          
          if (statusData.matchId) {
            clearInterval(pollInterval)
            setIsQueueing(false)
            toast.success("Match Found!", { description: "Redirecting to game..." })
            router.push(`/game/${statusData.matchId}`)
          }
        }, 2000)
        
        // Stop polling after 60 seconds
        setTimeout(() => {
          clearInterval(pollInterval)
          setIsQueueing(false)
        }, 60000)
      }

    } catch (error: any) {
      toast.error("Queue Error", { description: error.message })
      setIsQueueing(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const winRate = user.matchesPlayed > 0 ? Math.floor(Math.random() * 30 + 45) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors">
            <Shield className="h-5 w-5" />
            <span className="font-bold">CipherCanvas</span>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-slate-400 hover:text-white hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto p-6 md:p-12 max-w-7xl space-y-8">
        
        {/* 1. Enhanced Header & Profile */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
          <Card className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border-2 border-emerald-500/20 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-full ${rankColor.bg} blur-lg opacity-75`}></div>
                    <Avatar className={`relative h-24 w-24 border-4 ${rankColor.border} shadow-2xl ${rankColor.glow}`}>
                      <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-2xl">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-3">
                      {user.username}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                      <Badge className={`${rankColor.bg} ${rankColor.text} border ${rankColor.border} px-4 py-1.5 text-sm font-bold shadow-lg`}>
                        <Trophy className="h-3.5 w-3.5 mr-1.5" />
                        {user.rankTier}
                      </Badge>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-1.5 text-sm font-mono font-semibold">
                        MMR: {user.mmr}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Rank Progress</p>
                    <div className="flex items-baseline gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      <span className="text-2xl font-bold text-white">{user.mmr}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Main Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Play Card - Enhanced */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border-2 border-emerald-500/30 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-emerald-500/15 transition-all duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <Swords className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                  Ranked Operation
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400 text-base">
                Join the encrypted network. Find 3 other agents to start a session.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                size="lg" 
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-[1.02] group/btn overflow-hidden"
                onClick={handleJoinQueue}
                disabled={isQueueing}
              >
                {isQueueing ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Scanning Frequency...
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                      INITIATE MATCHMAKING
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  </>
                )}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse delay-75"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse delay-150"></div>
                </div>
                <span>Estimated wait time: &lt; 30 seconds</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card - Enhanced */}
          <Card className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border-2 border-amber-500/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Service Record</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Matches
                  </span>
                  <span className="font-mono text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {user.matchesPlayed}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Win Rate
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    {winRate}%
                  </span>
                </div>
                <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${winRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Recent History - Enhanced */}
        <Card className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border-2 border-slate-800/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
                <History className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Mission Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                <History className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium">
                No recent missions found in the archives.
              </p>
              <p className="text-slate-600 text-xs mt-2">
                Complete your first operation to see your history here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}