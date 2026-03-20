"use client"

import { Trophy, Medal, Award } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const winners = [
  {
    rank: 1,
    name: "ShadowStrike",
    game: "Free Fire",
    tournament: "Champions League S3",
    prize: 5000,
    matches: 42,
    wins: 38,
    avatar: "SS",
  },
  {
    rank: 2,
    name: "PhoenixRise",
    game: "PUBG",
    tournament: "Elite Showdown",
    prize: 3500,
    matches: 38,
    wins: 32,
    avatar: "PR",
  },
  {
    rank: 3,
    name: "NightHawk",
    game: "Free Fire",
    tournament: "Solo Masters",
    prize: 2000,
    matches: 35,
    wins: 28,
    avatar: "NH",
  },
]

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
  return <Award className="h-6 w-6 text-orange-600" />
}

export function FeaturedWinners() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl font-bold text-foreground">
            Featured <span className="text-primary">Champions</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Meet our top performers who dominated the arena this season
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-xl bg-card border transition-all duration-300 card-hover ${
                winner.rank === 1
                  ? "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] md:-mt-4"
                  : winner.rank === 2
                  ? "border-gray-400/50"
                  : "border-orange-600/50"
              }`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    winner.rank === 1
                      ? "bg-yellow-500/20 border-2 border-yellow-500"
                      : winner.rank === 2
                      ? "bg-gray-400/20 border-2 border-gray-400"
                      : "bg-orange-600/20 border-2 border-orange-600"
                  }`}
                >
                  <RankIcon rank={winner.rank} />
                </div>
              </div>

              {/* Winner Info */}
              <div className="text-center pt-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                    {winner.avatar}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-semibold text-xl text-foreground">{winner.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{winner.game}</p>

                {/* Tournament */}
                <div className="mt-4 py-2 px-4 rounded-full bg-primary/10 inline-block">
                  <span className="text-sm text-primary font-medium">{winner.tournament}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div>
                    <div className="text-lg font-bold text-primary">${winner.prize.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Prize Won</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{winner.matches}</div>
                    <div className="text-xs text-muted-foreground">Matches</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">{winner.wins}</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
