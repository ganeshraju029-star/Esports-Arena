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

        setTournaments(tournamentsResponse.data.data.tournaments)
        setFeaturedTournaments(featuredResponse.data.data.tournaments)
      } catch (error) {
        console.error('Failed to fetch tournaments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [searchTerm, gameFilter, modeFilter, statusFilter])

  const handleJoinTournament = async (tournamentId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    try {
      await tournamentAPI.joinTournament(tournamentId)
      // Refresh tournaments
      window.location.reload()
    } catch (error) {
      console.error('Failed to join tournament:', error)
    }
  }

  const convertToTournamentFormat = (tournament: any): Tournament => ({
    id: tournament._id,
    title: tournament.title,
    game: tournament.game.toUpperCase(),
    entryFee: tournament.entryFee,
    prizePool: tournament.prizePool,
    date: new Date(tournament.schedule.tournamentStart).toLocaleDateString(),
    time: new Date(tournament.schedule.tournamentStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    slots: tournament.maxPlayers,
    filledSlots: tournament.joinedPlayers.length,
    mode: tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1),
    level: tournament.difficulty.charAt(0).toUpperCase() + tournament.difficulty.slice(1),
    status: tournament.status,
    isJoined: tournament.isJoined,
    canJoin: tournament.canJoin,
  })

  const activeFilters = [
    gameFilter !== "all" && gameFilter,
    modeFilter !== "all" && modeFilter,
    statusFilter !== "all" && statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1),
  ].filter(Boolean)

  const clearAllFilters = () => {
    setGameFilter("all")
    setModeFilter("all")
    setStatusFilter("all")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Esports <span className="text-primary">Tournaments</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compete in exciting tournaments and win amazing prizes
          </p>
        </div>

        {/* Featured Tournaments */}
        {featuredTournaments.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Featured Tournaments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament._id}
                  tournament={convertToTournamentFormat(tournament)}
                  onJoin={() => handleJoinTournament(tournament._id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-border hover:bg-primary/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((filter, index) => (
                <Badge key={`${filter}-${index}`} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="h-3 w-3 cursor-pointer" onClick={clearAllFilters} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Game</label>
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="freefire">Free Fire</SelectItem>
                    <SelectItem value="pubg">PUBG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Mode</label>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </section>

        {/* All Tournaments */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Tournaments</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gamepad2 className="h-4 w-4" />
              <span>{tournaments.length} tournaments available</span>
            </div>
          </div>

          {tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament._id}
                  tournament={convertToTournamentFormat(tournament)}
                  onJoin={() => handleJoinTournament(tournament._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tournaments found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new tournaments.
              </p>
              <Button onClick={clearAllFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
