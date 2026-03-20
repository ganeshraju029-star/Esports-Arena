"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Users,
  DollarSign,
  Gamepad2,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Total Users", value: "12,458", icon: Users, change: "+245 this week", trend: "up" },
  { label: "Active Tournaments", value: "28", icon: Trophy, change: "+5 this month", trend: "up" },
  { label: "Total Revenue", value: "$45,320", icon: DollarSign, change: "+12% growth", trend: "up" },
  { label: "Matches Today", value: "156", icon: Gamepad2, change: "18 ongoing", trend: "neutral" },
]

const recentTournaments = [
  { id: "1", title: "Free Fire Championship", game: "Free Fire", participants: 87, status: "upcoming", date: "Mar 25, 2026" },
  { id: "2", title: "PUBG Elite Showdown", game: "PUBG", participants: 32, status: "upcoming", date: "Mar 26, 2026" },
  { id: "3", title: "Solo Survival League", game: "Free Fire", participants: 145, status: "live", date: "Mar 20, 2026" },
  { id: "4", title: "Duo Destruction", game: "PUBG", participants: 24, status: "upcoming", date: "Mar 28, 2026" },
]

const recentUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", joinedDate: "Mar 20, 2026", status: "active" },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", joinedDate: "Mar 19, 2026", status: "active" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", joinedDate: "Mar 18, 2026", status: "pending" },
  { id: "4", name: "Emma Wilson", email: "emma@example.com", joinedDate: "Mar 17, 2026", status: "active" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage tournaments, users, and platform settings
              </p>
            </div>
            <Link href="/admin/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-5 bg-card border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      <p className="text-xs text-green-500">{stat.change}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tournaments */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Tournaments</h2>
                <Link href="/admin/tournaments">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{tournament.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{tournament.game}</span>
                        <span>•</span>
                        <span>{tournament.participants} participants</span>
                      </div>
                    </div>
                    <Badge
                      className={
                        tournament.status === "live"
                          ? "bg-red-500/90 text-foreground"
                          : "bg-primary text-primary-foreground"
                      }
                    >
                      {tournament.status === "live" ? "LIVE" : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Users */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Users</h2>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={user.status === "active" ? "bg-green-500/20 text-green-500 border-green-500/30" : ""}
                    >
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
