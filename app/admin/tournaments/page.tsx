"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Trophy,
  Users,
  Calendar,
  Check,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Tournament {
  id: string
  title: string
  game: string
  participants: number
  maxParticipants: number
  status: "upcoming" | "live" | "completed"
  date: string
  time: string
  prizePool: number
  entryFee: number
  roomId?: string
  password?: string
}

const tournaments: Tournament[] = [
  { id: "1", title: "Free Fire Championship", game: "Free Fire", participants: 87, maxParticipants: 100, status: "upcoming", date: "Mar 25, 2026", time: "7:00 PM", prizePool: 5000, entryFee: 0 },
  { id: "2", title: "PUBG Elite Showdown", game: "PUBG", participants: 32, maxParticipants: 50, status: "upcoming", date: "Mar 26, 2026", time: "8:00 PM", prizePool: 15000, entryFee: 10 },
  { id: "3", title: "Solo Survival League", game: "Free Fire", participants: 145, maxParticipants: 200, status: "live", date: "Mar 20, 2026", time: "6:00 PM", prizePool: 3000, entryFee: 5, roomId: "SSL2026", password: "survival99" },
  { id: "4", title: "Duo Destruction", game: "PUBG", participants: 24, maxParticipants: 80, status: "upcoming", date: "Mar 28, 2026", time: "9:00 PM", prizePool: 2500, entryFee: 0 },
  { id: "5", title: "Battle Royale Masters", game: "Free Fire", participants: 100, maxParticipants: 100, status: "completed", date: "Mar 18, 2026", time: "5:00 PM", prizePool: 10000, entryFee: 15 },
  { id: "6", title: "PUBG Pro League", game: "PUBG", participants: 64, maxParticipants: 64, status: "completed", date: "Mar 15, 2026", time: "7:00 PM", prizePool: 25000, entryFee: 20 },
]

export default function AdminTournamentsPage() {
  const [search, setSearch] = useState("")
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [roomId, setRoomId] = useState("")
  const [password, setPassword] = useState("")
  const [saved, setSaved] = useState(false)

  const filteredTournaments = tournaments.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveRoomDetails = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setRoomDetailsOpen(false)
      setRoomId("")
      setPassword("")
    }, 1500)
  }

  const openRoomDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setRoomId(tournament.roomId || "")
    setPassword(tournament.password || "")
    setRoomDetailsOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
                Manage <span className="text-primary">Tournaments</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                View and manage all tournaments
              </p>
            </div>
            <Link href="/admin/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tournaments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-card border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Tournaments Table */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tournament</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Participants</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Prize Pool</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTournaments.map((tournament) => (
                    <tr key={tournament.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Trophy className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tournament.title}</div>
                            <div className="text-sm text-muted-foreground">{tournament.game}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {tournament.date}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{tournament.participants}</span>
                          <span className="text-muted-foreground">/ {tournament.maxParticipants}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-primary font-semibold">${tournament.prizePool.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            tournament.status === "live"
                              ? "bg-red-500/20 text-red-500 border-red-500/30"
                              : tournament.status === "upcoming"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {tournament.status === "live" && <span className="mr-1 h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" />}
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openRoomDetails(tournament)}>
                              <Key className="h-4 w-4 mr-2" />
                              Room Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Room Details Dialog */}
      <Dialog open={roomDetailsOpen} onOpenChange={setRoomDetailsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Room Details</DialogTitle>
            <DialogDescription>
              {selectedTournament?.title} - Add or update room credentials
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="room-id">Room ID</Label>
              <Input
                id="room-id"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-password">Room Password</Label>
              <Input
                id="room-password"
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRoomDetailsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveRoomDetails}
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                "Save Details"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
