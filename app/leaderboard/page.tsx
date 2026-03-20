"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Player {
  rank: number
  previousRank: number
  name: string
  avatar: string
  game: "Free Fire" | "PUBG" | "Both"
  matchesPlayed: number
  wins: number
  points: number
  winRate: number
}

const leaderboardData: Player[] = [
  { rank: 1, previousRank: 1, name: "ShadowStrike", avatar: "SS", game: "Both", matchesPlayed: 245, wins: 198, points: 12850, winRate: 80.8 },
  { rank: 2, previousRank: 4, name: "PhoenixRise", avatar: "PR", game: "PUBG", matchesPlayed: 198, wins: 156, points: 11200, winRate: 78.8 },
  { rank: 3, previousRank: 2, name: "NightHawk", avatar: "NH", game: "Free Fire", matchesPlayed: 220, wins: 168, points: 10950, winRate: 76.4 },
  { rank: 4, previousRank: 3, name: "ThunderBolt", avatar: "TB", game: "Both", matchesPlayed: 185, wins: 142, points: 9800, winRate: 76.8 },
  { rank: 5, previousRank: 7, name: "VenomKing", avatar: "VK", game: "Free Fire", matchesPlayed: 178, wins: 134, points: 9450, winRate: 75.3 },
  { rank: 6, previousRank: 5, name: "BlazeFury", avatar: "BF", game: "PUBG", matchesPlayed: 165, wins: 128, points: 8900, winRate: 77.6 },
  { rank: 7, previousRank: 6, name: "StormBreaker", avatar: "SB", game: "Both", matchesPlayed: 158, wins: 118, points: 8650, winRate: 74.7 },
  { rank: 8, previousRank: 10, name: "IronWolf", avatar: "IW", game: "Free Fire", matchesPlayed: 152, wins: 112, points: 8200, winRate: 73.7 },
  { rank: 9, previousRank: 8, name: "GhostRider", avatar: "GR", game: "PUBG", matchesPlayed: 145, wins: 105, points: 7850, winRate: 72.4 },
  { rank: 10, previousRank: 9, name: "SilentAssassin", avatar: "SA", game: "Both", matchesPlayed: 140, wins: 98, points: 7500, winRate: 70.0 },
  { rank: 11, previousRank: 12, name: "DragonSlayer", avatar: "DS", game: "Free Fire", matchesPlayed: 135, wins: 94, points: 7200, winRate: 69.6 },
  { rank: 12, previousRank: 11, name: "ViperStrike", avatar: "VS", game: "PUBG", matchesPlayed: 130, wins: 88, points: 6900, winRate: 67.7 },
  { rank: 13, previousRank: 15, name: "FrostBite", avatar: "FB", game: "Both", matchesPlayed: 125, wins: 82, points: 6600, winRate: 65.6 },
  { rank: 14, previousRank: 13, name: "RapidFire", avatar: "RF", game: "Free Fire", matchesPlayed: 120, wins: 78, points: 6350, winRate: 65.0 },
  { rank: 15, previousRank: 14, name: "DarkKnight", avatar: "DK", game: "PUBG", matchesPlayed: 115, wins: 72, points: 6100, winRate: 62.6 },
]

type GameFilter = "all" | "Free Fire" | "PUBG" | "Both"

export default function LeaderboardPage() {
  const [gameFilter, setGameFilter] = useState<GameFilter>("all")

  const filteredPlayers = leaderboardData.filter(
    (player) => gameFilter === "all" || player.game === gameFilter || player.game === "Both"
  )

  const getRankChange = (player: Player) => {
    const change = player.previousRank - player.rank
    if (change > 0) return { icon: TrendingUp, color: "text-green-500", value: `+${change}` }
    if (change < 0) return { icon: TrendingDown, color: "text-red-500", value: change.toString() }
    return { icon: Minus, color: "text-muted-foreground", value: "-" }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />
    return null
  }

  const getTopPlayerStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)]"
    if (rank === 2) return "bg-gray-400/10 border-gray-400/30"
    if (rank === 3) return "bg-orange-600/10 border-orange-600/30"
    return ""
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-sm text-primary font-medium">Season 4 Rankings</span>
            </div>
            <h1 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Global <span className="text-primary text-glow">Leaderboard</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Top players competing across Free Fire and PUBG tournaments
            </p>
          </div>

          {/* Game Filter */}
          <div className="flex justify-center gap-2 mb-8">
            {(["all", "Free Fire", "PUBG", "Both"] as const).map((game) => (
              <button
                key={game}
                onClick={() => setGameFilter(game)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  gameFilter === game
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                )}
              >
                {game === "all" ? "All Games" : game === "Both" ? "Multi-Game" : game}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {filteredPlayers.slice(0, 3).map((player, index) => {
              const podiumOrder = [1, 0, 2]
              const displayPlayer = filteredPlayers[podiumOrder[index]]
              if (!displayPlayer) return null
              
              return (
                <div
                  key={displayPlayer.rank}
                  className={cn(
                    "relative p-6 rounded-xl border transition-all hover:-translate-y-1",
                    getTopPlayerStyle(displayPlayer.rank),
                    displayPlayer.rank === 1 && "md:-mt-4"
                  )}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2",
                        displayPlayer.rank === 1 && "bg-yellow-500/20 border-yellow-500",
                        displayPlayer.rank === 2 && "bg-gray-400/20 border-gray-400",
                        displayPlayer.rank === 3 && "bg-orange-600/20 border-orange-600"
                      )}
                    >
                      {getRankIcon(displayPlayer.rank)}
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary">
                      <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                        {displayPlayer.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="font-semibold text-xl text-foreground">{displayPlayer.name}</h3>
                    <Badge variant="outline" className="mt-2">
                      {displayPlayer.game}
                    </Badge>

                    <div className="mt-4 text-3xl font-bold text-primary text-glow">
                      {displayPlayer.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Points</div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                      <div>
                        <div className="text-lg font-semibold text-foreground">{displayPlayer.matchesPlayed}</div>
                        <div className="text-xs text-muted-foreground">Matches</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-500">{displayPlayer.wins}</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-primary">{displayPlayer.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-1 text-center">Change</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2 text-center hidden sm:block">Matches</div>
              <div className="col-span-2 text-center hidden sm:block">Wins</div>
              <div className="col-span-2 text-center">Points</div>
            </div>

            {/* Table Body */}
            {filteredPlayers.map((player) => {
              const rankChange = getRankChange(player)
              const RankChangeIcon = rankChange.icon

              return (
                <div
                  key={player.rank}
                  className={cn(
                    "grid grid-cols-12 gap-4 p-4 items-center border-b border-border last:border-b-0 transition-colors hover:bg-muted/30",
                    player.rank <= 3 && "bg-primary/5"
                  )}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    {player.rank <= 3 ? (
                      <div className="flex justify-center">{getRankIcon(player.rank)}</div>
                    ) : (
                      <span className="text-lg font-bold text-foreground">#{player.rank}</span>
                    )}
                  </div>

                  {/* Rank Change */}
                  <div className="col-span-1 flex justify-center items-center gap-1">
                    <RankChangeIcon className={cn("h-4 w-4", rankChange.color)} />
                    <span className={cn("text-sm", rankChange.color)}>{rankChange.value}</span>
                  </div>

                  {/* Player Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.game}</div>
                    </div>
                  </div>

                  {/* Matches */}
                  <div className="col-span-2 text-center text-foreground hidden sm:block">
                    {player.matchesPlayed}
                  </div>

                  {/* Wins */}
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="text-green-500 font-medium">{player.wins}</span>
                    <span className="text-muted-foreground text-xs ml-1">({player.winRate}%)</span>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-bold text-primary">{player.points.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
