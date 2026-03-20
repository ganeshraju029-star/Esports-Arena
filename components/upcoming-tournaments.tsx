"use client"

import { TournamentCard, Tournament } from "./tournament-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const sampleTournaments: Tournament[] = [
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
]

export function UpcomingTournaments() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl font-bold text-foreground">
              Upcoming <span className="text-primary">Tournaments</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Register now and secure your spot in the arena
            </p>
          </div>
          <Link href="/tournaments">
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleTournaments.map((tournament, index) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
