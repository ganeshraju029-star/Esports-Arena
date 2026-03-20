"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Gamepad2, Calendar, Clock, Key, Copy, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function MyTournamentsPage() {
  const { user } = useAuth()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState("all") // all, upcoming, completed

  // Mock tournament data
  const mockTournaments = [
    {
      id: "1",
      title: "Free Fire Championship",
      game: "Free Fire",
      date: "Mar 25, 2026",
      time: "7:00 PM",
      status: "upcoming",
      roomId: "FF2026CH",
      password: "arena123",
      hasRoomDetails: true,
      rank: null,
      prize: null
    },
    {
      id: "2",
      title: "PUBG Elite Showdown",
      game: "PUBG",
      date: "Mar 26, 2026",
      time: "8:00 PM",
      status: "upcoming",
      roomId: null,
      password: null,
      hasRoomDetails: false,
      rank: null,
      prize: null
    },
    {
      id: "3",
      title: "Solo Survival League",
      game: "Free Fire",
      date: "Mar 18, 2026",
      time: "6:00 PM",
      status: "completed",
      roomId: "SSL2026",
      password: "survival99",
      hasRoomDetails: true,
      rank: 3,
      prize: 500
    }
  ]

  const filteredTournaments = filter === "all" 
    ? mockTournaments 
    : mockTournaments.filter(t => t.status === filter)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
              My <span className="text-primary">Tournaments</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              View your joined tournaments and track your performance
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-primary" : "border-border"}
            >
              All
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              onClick={() => setFilter("upcoming")}
              className={filter === "upcoming" ? "bg-primary" : "border-border"}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-primary" : "border-border"}
            >
              Completed
            </Button>
          </div>

          {/* Tournaments List */}
          <div className="space-y-4">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((tournament) => (
                <Card key={tournament.id} className="p-6 bg-card border-border">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Tournament Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg text-foreground">{tournament.title}</h3>
                        <Badge
                          variant={tournament.status === "upcoming" ? "default" : "secondary"}
                          className={tournament.status === "upcoming" ? "bg-primary text-primary-foreground" : ""}
                        >
                          {tournament.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="h-4 w-4" />
                          {tournament.game}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {tournament.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {tournament.time}
                        </span>
                      </div>

                      {/* Results */}
                      {tournament.status === "completed" && tournament.rank && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium text-foreground">Rank: #{tournament.rank}</span>
                            </div>
                            {tournament.prize && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-green-600">
                                  Prize: ₹{tournament.prize}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    {tournament.hasRoomDetails && tournament.roomId && (
                      <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50 border border-border min-w-[250px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Room ID</span>
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-foreground flex-1">
                            {tournament.roomId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(tournament.roomId, `room-${tournament.id}`)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {copiedId === `room-${tournament.id}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        
                        {tournament.password && (
                          <>
                            <div className="border-t border-border my-1" />
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Password</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono text-foreground flex-1">
                                {tournament.password}
                              </code>
                              <button
                                onClick={() => copyToClipboard(tournament.password, `pass-${tournament.id}`)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                {copiedId === `pass-${tournament.id}` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* No Room Details */}
                    {tournament.status === "upcoming" && !tournament.hasRoomDetails && (
                      <div className="px-4 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground self-start">
                        Room details coming soon
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 bg-card border-border text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No {filter !== "all" ? filter : ""} tournaments yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter === "all" 
                    ? "Join your first tournament to get started!"
                    : `You don't have any ${filter} tournaments.`
                  }
                </p>
                <Link href="/tournaments">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Browse Tournaments
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Stats Summary */}
          {mockTournaments.some(t => t.status === "completed") && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-card border-border text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {mockTournaments.filter(t => t.status === "completed").length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <div className="h-8 w-8 text-green-600 mx-auto mb-2 text-2xl font-bold">🏆</div>
                <div className="text-2xl font-bold text-green-600">
                  {mockTournaments.filter(t => t.rank === 1).length}
                </div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <div className="h-8 w-8 text-yellow-600 mx-auto mb-2 text-2xl font-bold">💰</div>
                <div className="text-2xl font-bold text-yellow-600">
                  ₹{mockTournaments.reduce((sum, t) => sum + (t.prize || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Winnings</div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
