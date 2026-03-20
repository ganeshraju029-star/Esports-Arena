"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Plus, Search, Filter } from "lucide-react"

export default function AdminTournamentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock tournament data
  const tournaments = [
    {
      _id: "1",
      title: "Free Fire Championship",
      game: "freefire",
      status: "active",
      participants: 85,
      prizePool: 5000,
      entryFee: 100,
      maxPlayers: 100,
    },
    {
      _id: "2",
      title: "PUBG Elite Showdown",
      game: "pubg",
      status: "upcoming",
      participants: 50,
      prizePool: 10000,
      entryFee: 200,
      maxPlayers: 100,
    },
    {
      _id: "3",
      title: "Call of Duty Masters",
      game: "cod",
      status: "completed",
      participants: 72,
      prizePool: 15000,
      entryFee: 150,
      maxPlayers: 100,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6 lg:ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tournament Management</h1>
            <p className="text-muted-foreground">View and manage all tournaments</p>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 bg-card border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-muted border-border"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 h-12 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Tournaments List */}
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <Card key={tournament._id} className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{tournament.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {tournament.game.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant={tournament.status === 'active' ? 'default' : tournament.status === 'completed' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {tournament.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{tournament.participants}/{tournament.maxPlayers} players</p>
                      <p className="text-xs text-muted-foreground">Entry: ₹{tournament.entryFee}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">₹{tournament.prizePool.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
