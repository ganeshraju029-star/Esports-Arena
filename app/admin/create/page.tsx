"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trophy, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setSuccess(true)
    // Redirect after success
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Tournament Created!</h2>
            <p className="text-muted-foreground mb-4">
              Your tournament has been successfully created and is now visible to players.
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
                  Create <span className="text-primary">Tournament</span>
                </h1>
                <p className="text-muted-foreground">Set up a new tournament for players</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="p-6 sm:p-8 bg-card border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tournament Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Free Fire Championship Season 5"
                  className="h-12 bg-muted border-border focus:border-primary"
                  required
                />
              </div>

              {/* Game, Mode & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Game</Label>
                  <Select required>
                    <SelectTrigger className="h-12 bg-muted border-border">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freefire">Free Fire</SelectItem>
                      <SelectItem value="pubg">PUBG Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select required>
                    <SelectTrigger className="h-12 bg-muted border-border">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="duo">Duo</SelectItem>
                      <SelectItem value="squad">Squad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select required>
                    <SelectTrigger className="h-12 bg-muted border-border">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Easy
                        </span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500" />
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="hard">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Hard
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Level Requirements */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                <h3 className="font-medium text-foreground">Player Level Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Set minimum and maximum level requirements for participants based on their game ID levels
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Level</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 10"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Level</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 50 (leave empty for no limit)"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Level Based On</Label>
                  <Select>
                    <SelectTrigger className="h-12 bg-muted border-border">
                      <SelectValue placeholder="Select game for level requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freefire">Free Fire Level</SelectItem>
                      <SelectItem value="pubg">PUBG Mobile Level</SelectItem>
                      <SelectItem value="any">Any Game Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    className="h-12 bg-muted border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    className="h-12 bg-muted border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Entry Fee & Prize Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    placeholder="0 for free entry"
                    className="h-12 bg-muted border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prizePool">Prize Pool ($)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    min="0"
                    placeholder="e.g., 5000"
                    className="h-12 bg-muted border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="slots">Maximum Participants</Label>
                <Input
                  id="slots"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  className="h-12 bg-muted border-border focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add tournament rules, requirements, or other details..."
                  className="min-h-[120px] bg-muted border-border focus:border-primary resize-none"
                />
              </div>

              {/* Room Details (Optional) */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                <h3 className="font-medium text-foreground">Room Details (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  You can add these later before the tournament starts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId">Room ID</Label>
                    <Input
                      id="roomId"
                      placeholder="e.g., FF2026CH"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomPassword">Room Password</Label>
                    <Input
                      id="roomPassword"
                      placeholder="e.g., arena123"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link href="/admin" className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-12 border-border">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Tournament"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
