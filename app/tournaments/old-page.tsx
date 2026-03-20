"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TournamentCard, Tournament } from "@/components/tournament-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Loader2, Gamepad2, Trophy, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { tournamentAPI } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

const allTournaments: Tournament[] = [
  {
    id: "1",
    title: "Free Fire Championship",
    game: "Free Fire",
    entryFee: 0,
    prizePool: 5000,
    date: "Mar 25, 2026",
    time: "7:00 PM",
    slots: 100,
    filledSlots: 87,
    mode: "Squad",
    level: "Easy",
    status: "upcoming",
  },
  {
    id: "2",
    title: "PUBG Elite Showdown",
    game: "PUBG",
    entryFee: 10,
    prizePool: 15000,
    date: "Mar 26, 2026",
    time: "8:00 PM",
    slots: 50,
    filledSlots: 32,
    mode: "Squad",
    level: "Hard",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Solo Survival League",
    game: "Free Fire",
    entryFee: 5,
    prizePool: 3000,
    date: "Mar 27, 2026",
    time: "6:00 PM",
    slots: 200,
    filledSlots: 145,
    mode: "Solo",
    level: "Medium",
    status: "live",
  },
  {
    id: "4",
    title: "Duo Destruction",
    game: "PUBG",
    entryFee: 0,
    prizePool: 2500,
    date: "Mar 28, 2026",
    time: "9:00 PM",
    slots: 80,
    filledSlots: 24,
    mode: "Duo",
    level: "Easy",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Battle Royale Masters",
    game: "Free Fire",
    entryFee: 15,
    prizePool: 10000,
    date: "Mar 29, 2026",
    time: "5:00 PM",
    slots: 100,
    filledSlots: 78,
    mode: "Squad",
    level: "Hard",
    status: "upcoming",
  },
  {
    id: "6",
    title: "PUBG Pro League",
    game: "PUBG",
    entryFee: 20,
    prizePool: 25000,
    date: "Mar 30, 2026",
    time: "7:00 PM",
    slots: 64,
    filledSlots: 64,
    mode: "Squad",
    level: "Hard",
    status: "upcoming",
  },
  {
    id: "7",
    title: "Weekend Warriors",
    game: "Free Fire",
    entryFee: 0,
    prizePool: 1500,
    date: "Mar 22, 2026",
    time: "4:00 PM",
    slots: 150,
    filledSlots: 150,
    mode: "Solo",
    level: "Easy",
    status: "completed",
  },
  {
    id: "8",
    title: "PUBG Clash Royale",
    game: "PUBG",
    entryFee: 5,
    prizePool: 5000,
    date: "Mar 21, 2026",
    time: "8:00 PM",
    slots: 80,
    filledSlots: 80,
    mode: "Duo",
    level: "Medium",
    status: "completed",
  },
]

type GameFilter = "all" | "Free Fire" | "PUBG"
type EntryFilter = "all" | "free" | "paid"
type ModeFilter = "all" | "Solo" | "Duo" | "Squad"
type LevelFilter = "all" | "Easy" | "Medium" | "Hard"
type StatusFilter = "all" | "upcoming" | "live" | "completed"

export default function TournamentsPage() {
  const { user, isAuthenticated } = useAuth()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [featuredTournaments, setFeaturedTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const [tournamentsResponse, featuredResponse] = await Promise.all([
          tournamentAPI.getTournaments({
            search: searchTerm || undefined,
            game: gameFilter !== "all" ? gameFilter : undefined,
            mode: modeFilter !== "all" ? modeFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
          }),
          tournamentAPI.getFeaturedTournaments()
        ])
    const matchesEntry =
      entryFilter === "all" ||
      (entryFilter === "free" && tournament.entryFee === 0) ||
      (entryFilter === "paid" && tournament.entryFee > 0)
    const matchesMode = modeFilter === "all" || tournament.mode === modeFilter
    const matchesLevel = levelFilter === "all" || tournament.level === levelFilter
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter

    return matchesSearch && matchesGame && matchesEntry && matchesMode && matchesLevel && matchesStatus
  })

  const activeFilters = [
    gameFilter !== "all" && gameFilter,
    entryFilter !== "all" && (entryFilter === "free" ? "Free Entry" : "Paid Entry"),
    modeFilter !== "all" && modeFilter,
    levelFilter !== "all" && levelFilter,
    statusFilter !== "all" && statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1),
  ].filter(Boolean)

  const clearAllFilters = () => {
    setGameFilter("all")
    setEntryFilter("all")
    setModeFilter("all")
    setLevelFilter("all")
    setStatusFilter("all")
    setSearch("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl font-bold text-foreground">
              All <span className="text-primary">Tournaments</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse and join tournaments for Free Fire and PUBG
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tournaments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-card border-border focus:border-primary"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 border-border hover:border-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {filter}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Panel */}
          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 overflow-hidden transition-all duration-300",
              showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {/* Game Filter */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Game</h4>
              <div className="space-y-2">
                {(["all", "Free Fire", "PUBG"] as const).map((game) => (
                  <button
                    key={game}
                    onClick={() => setGameFilter(game)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      gameFilter === game
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {game === "all" ? "All Games" : game}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Filter */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Entry Type</h4>
              <div className="space-y-2">
                {(["all", "free", "paid"] as const).map((entry) => (
                  <button
                    key={entry}
                    onClick={() => setEntryFilter(entry)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      entryFilter === entry
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {entry === "all" ? "All Types" : entry === "free" ? "Free Entry" : "Paid Entry"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Filter */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Mode</h4>
              <div className="space-y-2">
                {(["all", "Solo", "Duo", "Squad"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setModeFilter(mode)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      modeFilter === mode
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {mode === "all" ? "All Modes" : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Difficulty Level</h4>
              <div className="space-y-2">
                {(["all", "Easy", "Medium", "Hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(level)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      levelFilter === level
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {level === "all" ? "All Levels" : level}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
              <div className="space-y-2">
                {(["all", "upcoming", "live", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredTournaments.length}</span>{" "}
              tournaments
            </p>
          </div>

          {/* Tournament Grid */}
          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No tournaments found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
