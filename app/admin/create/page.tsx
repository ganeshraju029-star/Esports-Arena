"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Plus } from "lucide-react"

export default function AdminCreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    game: "freefire",
    mode: "solo",
    entryFee: 0,
    prizePool: 0,
    maxPlayers: 100,
    date: "",
    time: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating tournament:", formData)
    alert("Tournament created successfully! (Demo Mode)")
    setFormData({
      title: "",
      game: "freefire",
      mode: "solo",
      entryFee: 0,
      prizePool: 0,
      maxPlayers: 100,
      date: "",
      time: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6 lg:ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Tournament</h1>
            <p className="text-muted-foreground">Fill in the details to create a new tournament</p>
          </div>

          <Card className="p-6 bg-card border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-foreground mb-2 block">
                    Tournament Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-12 bg-muted border-border"
                    placeholder="e.g., Free Fire Championship"
                    required
                  />
                </div>

                {/* Game Selection */}
                <div>
                  <Label htmlFor="game" className="text-foreground mb-2 block">
                    Game
                  </Label>
                  <select
                    id="game"
                    value={formData.game}
                    onChange={(e) => setFormData({...formData, game: e.target.value})}
                    className="w-full px-4 py-2 h-12 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="freefire">Free Fire</option>
                    <option value="pubg">PUBG Mobile</option>
                    <option value="cod">Call of Duty</option>
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <Label htmlFor="mode" className="text-foreground mb-2 block">
                    Mode
                  </Label>
                  <select
                    id="mode"
                    value={formData.mode}
                    onChange={(e) => setFormData({...formData, mode: e.target.value})}
                    className="w-full px-4 py-2 h-12 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="squad">Squad</option>
                  </select>
                </div>

                {/* Entry Fee */}
                <div>
                  <Label htmlFor="entryFee" className="text-foreground mb-2 block">
                    Entry Fee (₹)
                  </Label>
                  <Input
                    id="entryFee"
                    type="number"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({...formData, entryFee: parseInt(e.target.value)})}
                    className="h-12 bg-muted border-border"
                    placeholder="0 for free"
                    min="0"
                  />
                </div>

                {/* Prize Pool */}
                <div>
                  <Label htmlFor="prizePool" className="text-foreground mb-2 block">
                    Prize Pool (₹)
                  </Label>
                  <Input
                    id="prizePool"
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({...formData, prizePool: parseInt(e.target.value)})}
                    className="h-12 bg-muted border-border"
                    placeholder="Total prize money"
                    min="0"
                  />
                </div>

                {/* Max Players */}
                <div>
                  <Label htmlFor="maxPlayers" className="text-foreground mb-2 block">
                    Max Players
                  </Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
                    className="h-12 bg-muted border-border"
                    placeholder="100"
                    min="1"
                  />
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date" className="text-foreground mb-2 block">
                    Tournament Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-12 bg-muted border-border"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <Label htmlFor="time" className="text-foreground mb-2 block">
                    Tournament Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="h-12 bg-muted border-border"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Tournament
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({
                    title: "",
                    game: "freefire",
                    mode: "solo",
                    entryFee: 0,
                    prizePool: 0,
                    maxPlayers: 100,
                    date: "",
                    time: "",
                  })}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
