"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Trophy,
  ArrowLeft,
  Medal,
  Award,
  Crown,
  Check,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Sample data
const tournament = {
  id: "1",
  title: "Free Fire Championship Season 5",
  game: "Free Fire",
  prizePool: 5000,
}

const participants = [
  { id: "1", name: "ShadowStrike", avatar: "SS", points: 0 },
  { id: "2", name: "PhoenixRise", avatar: "PR", points: 0 },
  { id: "3", name: "NightHawk", avatar: "NH", points: 0 },
  { id: "4", name: "ThunderBolt", avatar: "TB", points: 0 },
  { id: "5", name: "VenomKing", avatar: "VK", points: 0 },
  { id: "6", name: "BlazeFury", avatar: "BF", points: 0 },
  { id: "7", name: "StormBreaker", avatar: "SB", points: 0 },
  { id: "8", name: "IronWolf", avatar: "IW", points: 0 },
]

const prizePositions = [
  { position: 1, label: "1st Place", prize: 2500, icon: Crown, color: "text-yellow-500" },
  { position: 2, label: "2nd Place", prize: 1500, icon: Medal, color: "text-gray-400" },
  { position: 3, label: "3rd Place", prize: 700, icon: Award, color: "text-orange-600" },
]

export default function DeclareWinnersPage() {
  const router = useRouter()
  const [winners, setWinners] = useState<{ [key: number]: string }>({})
  const [search, setSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectWinner = (position: number, playerId: string) => {
    setWinners((prev) => ({ ...prev, [position]: playerId }))
  }

  const getSelectedPlayer = (playerId: string) => {
    return participants.find((p) => p.id === playerId)
  }

  const isPlayerSelected = (playerId: string) => {
    return Object.values(winners).includes(playerId)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSuccess(true)
    setTimeout(() => {
      router.push("/admin/tournaments")
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 flex items-center justify-center min-h-screen">
          <Card className="p-8 bg-card border-border text-center max-w-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Winners Declared!</h2>
            <p className="text-muted-foreground mb-4">
              The winners have been announced and prizes will be distributed to their wallets.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to tournaments...</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/tournaments"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tournaments
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
                  Declare <span className="text-primary">Winners</span>
                </h1>
                <p className="text-muted-foreground">{tournament.title}</p>
              </div>
            </div>
          </div>

          {/* Prize Positions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {prizePositions.map((pos) => {
              const selectedPlayer = winners[pos.position]
                ? getSelectedPlayer(winners[pos.position])
                : null

              return (
                <Card
                  key={pos.position}
                  className={`p-6 bg-card border-2 ${
                    selectedPlayer ? "border-primary/50" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        pos.position === 1
                          ? "bg-yellow-500/20"
                          : pos.position === 2
                          ? "bg-gray-400/20"
                          : "bg-orange-600/20"
                      }`}
                    >
                      <pos.icon className={`h-8 w-8 ${pos.color}`} />
                    </div>
                  </div>
                  <h3 className="text-center font-semibold text-foreground mb-1">{pos.label}</h3>
                  <p className="text-center text-primary font-bold text-xl mb-4">
                    ${pos.prize.toLocaleString()}
                  </p>

                  {selectedPlayer ? (
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {selectedPlayer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{selectedPlayer.name}</span>
                    </div>
                  ) : (
                    <Select onValueChange={(value) => handleSelectWinner(pos.position, value)}>
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select winner" />
                      </SelectTrigger>
                      <SelectContent>
                        {participants
                          .filter((p) => !isPlayerSelected(p.id))
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {p.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                {p.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}

                  {selectedPlayer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const newWinners = { ...winners }
                        delete newWinners[pos.position]
                        setWinners(newWinners)
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>

          {/* All Participants */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl text-foreground">All Participants</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {filteredParticipants.map((player) => {
                const isSelected = isPlayerSelected(player.id)
                const position = Object.entries(winners).find(([, id]) => id === player.id)?.[0]

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isSelected
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={`${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{player.name}</div>
                      {position && (
                        <div className="text-xs text-primary">
                          {position === "1" ? "1st" : position === "2" ? "2nd" : "3rd"} Place
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Link href="/admin/tournaments" className="flex-1">
              <Button variant="outline" className="w-full h-12 border-border">
                Cancel
              </Button>
            </Link>
            <Button
              className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={Object.keys(winners).length < 3 || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Declaring Winners...
                </span>
              ) : (
                <>
                  <Trophy className="mr-2 h-5 w-5" />
                  Declare Winners
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
