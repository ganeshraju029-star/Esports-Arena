"use client"

import { Calendar, Users, Trophy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Tournament {
  id: string
  title: string
  game: "Free Fire" | "PUBG"
  entryFee: number
  prizePool: number
  date: string
  time: string
  slots: number
  filledSlots: number
  mode: "Solo" | "Duo" | "Squad"
  level: "Easy" | "Medium" | "Hard"
  status: "upcoming" | "live" | "completed"
}

interface TournamentCardProps {
  tournament: Tournament
  variant?: "default" | "featured"
}

export function TournamentCard({ tournament, variant = "default" }: TournamentCardProps) {
  const isFree = tournament.entryFee === 0
  const slotsLeft = tournament.slots - tournament.filledSlots
  const isAlmostFull = slotsLeft <= tournament.slots * 0.2

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1",
        variant === "featured"
          ? "bg-card border-2 border-primary/50 glow-border"
          : "bg-card border border-border hover:border-primary/50"
      )}
    >
      {/* Game Banner */}
      <div className="relative h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[var(--font-orbitron)] text-3xl font-bold text-primary/50 uppercase">
            {tournament.game}
          </span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {tournament.status === "live" ? (
            <Badge className="bg-red-500/90 text-foreground live-indicator">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-foreground inline-block animate-pulse" />
              LIVE
            </Badge>
          ) : tournament.status === "upcoming" ? (
            <Badge className="bg-primary/90 text-primary-foreground">UPCOMING</Badge>
          ) : (
            <Badge variant="secondary">COMPLETED</Badge>
          )}
        </div>

        {/* Entry Type */}
        <div className="absolute top-3 right-3">
          <Badge variant={isFree ? "outline" : "default"} className={isFree ? "border-green-500 text-green-500" : ""}>
            {isFree ? "FREE" : `$${tournament.entryFee}`}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Mode */}
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tournament.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {tournament.mode}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                tournament.level === "Easy" && "border-green-500 text-green-500",
                tournament.level === "Medium" && "border-yellow-500 text-yellow-500",
                tournament.level === "Hard" && "border-red-500 text-red-500"
              )}
            >
              {tournament.level}
            </Badge>
            <span className="text-xs text-muted-foreground">{tournament.game}</span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4 text-primary" />
            <span>${tournament.prizePool.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className={isAlmostFull ? "text-orange-400" : ""}>
              {slotsLeft} slots left
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{tournament.time}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Registration</span>
            <span>{Math.round((tournament.filledSlots / tournament.slots) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isAlmostFull ? "bg-orange-500" : "bg-primary"
              )}
              style={{ width: `${(tournament.filledSlots / tournament.slots) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/tournaments/${tournament.id}`}>
          <Button
            className={cn(
              "w-full",
              tournament.status === "completed"
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            disabled={tournament.status === "completed"}
          >
            {tournament.status === "completed" ? "View Results" : "Join Now"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
