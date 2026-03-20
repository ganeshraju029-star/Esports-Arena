import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Gamepad2,
  DollarSign,
  ArrowLeft,
  Check,
  Share2,
  Info,
} from "lucide-react"
import Link from "next/link"

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}

// Sample tournament data
const tournament = {
  id: "1",
  title: "Free Fire Championship Season 5",
  game: "Free Fire",
  entryFee: 0,
  prizePool: 5000,
  date: "Mar 25, 2026",
  time: "7:00 PM IST",
  slots: 100,
  filledSlots: 87,
  mode: "Squad",
  level: "Easy" as const,
  status: "upcoming" as const,
  description: "Join the most anticipated Free Fire tournament of the season! Battle against the best squads and prove your dominance in the arena. Top 3 teams will receive cash prizes and exclusive in-game rewards.",
  rules: [
    "Each squad must have exactly 4 players",
    "Players must join the room 15 minutes before start time",
    "Custom room details will be shared 30 minutes before the match",
    "No emulators allowed - mobile devices only",
    "Hacking or cheating will result in permanent ban",
  ],
  prizeBreakdown: [
    { position: "1st Place", prize: 2500 },
    { position: "2nd Place", prize: 1500 },
    { position: "3rd Place", prize: 700 },
    { position: "4th-5th Place", prize: 150 },
  ],
  registeredPlayers: [
    { name: "ShadowStrike", avatar: "SS" },
    { name: "PhoenixRise", avatar: "PR" },
    { name: "NightHawk", avatar: "NH" },
    { name: "ThunderBolt", avatar: "TB" },
    { name: "VenomKing", avatar: "VK" },
    { name: "BlazeFury", avatar: "BF" },
  ],
}

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  const slotsLeft = tournament.slots - tournament.filledSlots
  const isFree = tournament.entryFee === 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Back Link */}
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tournaments
          </Link>

          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Tournament Banner */}
            <div className="flex-1">
              <div className="relative h-48 sm:h-64 rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-[var(--font-orbitron)] text-6xl sm:text-8xl font-bold text-primary/20 uppercase">
                    {tournament.game}
                  </span>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {tournament.status.toUpperCase()}
                  </Badge>
                  <Badge variant={isFree ? "outline" : "default"} className={isFree ? "border-green-500 text-green-500" : ""}>
                    {isFree ? "FREE ENTRY" : `$${tournament.entryFee} Entry`}
                  </Badge>
                </div>
              </div>

              <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-6">
                {tournament.title}
              </h1>

              <p className="text-muted-foreground mt-4 leading-relaxed">
                {tournament.description}
              </p>
            </div>

            {/* Join Card */}
            <div className="lg:w-80">
              <Card className="p-6 bg-card border-border sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary text-glow">
                    ${tournament.prizePool.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Prize Pool</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Gamepad2 className="h-4 w-4" />
                      Game
                    </span>
                    <span className="text-foreground font-medium">{tournament.game}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Mode
                    </span>
                    <span className="text-foreground font-medium">{tournament.mode}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Date
                    </span>
                    <span className="text-foreground font-medium">{tournament.date}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Time
                    </span>
                    <span className="text-foreground font-medium">{tournament.time}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Entry
                    </span>
                    <span className={isFree ? "text-green-500 font-medium" : "text-foreground font-medium"}>
                      {isFree ? "Free" : `$${tournament.entryFee}`}
                    </span>
                  </div>
                </div>

                {/* Slots Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Slots</span>
                    <span className="text-foreground">
                      {tournament.filledSlots} / {tournament.slots}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(tournament.filledSlots / tournament.slots) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {slotsLeft} slots remaining
                  </p>
                </div>

                <Button
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse font-semibold"
                  asChild
                >
                  <Link href="/login">
                    <Trophy className="mr-2 h-5 w-5" />
                    Join Tournament
                  </Link>
                </Button>

                <Button variant="outline" className="w-full mt-3 border-border">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </Card>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rules */}
            <Card className="p-6 bg-card border-border">
              <h2 className="font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Tournament Rules
              </h2>
              <ul className="space-y-3">
                {tournament.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    {rule}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Prize Breakdown */}
            <Card className="p-6 bg-card border-border">
              <h2 className="font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Prize Distribution
              </h2>
              <div className="space-y-3">
                {tournament.prizeBreakdown.map((prize, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0
                        ? "bg-yellow-500/10 border border-yellow-500/30"
                        : index === 1
                        ? "bg-gray-400/10 border border-gray-400/30"
                        : index === 2
                        ? "bg-orange-600/10 border border-orange-600/30"
                        : "bg-muted/30 border border-border"
                    }`}
                  >
                    <span className="font-medium text-foreground">{prize.position}</span>
                    <span className="text-primary font-bold">${prize.prize.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Registered Players Preview */}
          <Card className="p-6 bg-card border-border mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Registered Players
              </h2>
              <Badge variant="outline">{tournament.filledSlots} Players</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {tournament.registeredPlayers.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">{player.name}</span>
                </div>
              ))}
              {tournament.filledSlots > 6 && (
                <div className="flex items-center px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="text-sm text-primary">+{tournament.filledSlots - 6} more</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
