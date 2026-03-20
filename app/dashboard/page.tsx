"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Gamepad2,
  Target,
  Wallet,
  Calendar,
  Clock,
  Key,
  Copy,
  Bell,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { userAPI, tournamentAPI } from "@/lib/api"

const stats = [
  { label: "Tournaments Joined", value: "24", icon: Trophy, change: "+3 this month" },
  { label: "Matches Played", value: "156", icon: Gamepad2, change: "+12 this week" },
  { label: "Win Rate", value: "73%", icon: Target, change: "+5% improvement" },
  { label: "Earnings", value: "$2,450", icon: Wallet, change: "+$350 this month" },
]

const joinedTournaments = [
  {
    id: "1",
    title: "Free Fire Championship",
    game: "Free Fire",
    date: "Mar 25, 2026",
    time: "7:00 PM",
    status: "upcoming",
    roomId: "FF2026CH",
    password: "arena123",
    hasRoomDetails: true,
  },
  {
    id: "2",
    title: "PUBG Elite Showdown",
    game: "PUBG",
    date: "Mar 26, 2026",
    time: "8:00 PM",
    status: "upcoming",
    roomId: null,
    password: null,
    hasRoomDetails: false,
  },
  {
    id: "3",
    title: "Solo Survival League",
    game: "Free Fire",
    date: "Mar 22, 2026",
    time: "6:00 PM",
    status: "completed",
    roomId: "SSL2026",
    password: "survival99",
    hasRoomDetails: true,
  },
]

const notifications = [
  { id: 1, message: "Room details available for Free Fire Championship!", time: "2 hours ago", type: "info" },
  { id: 2, message: "You placed 3rd in Solo Survival League!", time: "1 day ago", type: "success" },
  { id: 3, message: "New tournament: PUBG Pro League is open for registration", time: "2 days ago", type: "new" },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [userTournaments, setUserTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Check if we're in a browser environment (static deployment)
        const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
        
        if (isBrowser) {
          // Mock data for static deployment
          const mockStats = {
            data: {
              data: {
                stats: {
                  totalTournaments: 0,
                  totalWins: 0,
                  totalKills: 0,
                  totalPoints: 0
                },
                recentActivity: []
              }
            }
          };
          
          const mockTournaments = {
            data: {
              data: {
                tournaments: []
              }
            }
          };

          setUserStats(mockStats.data.data.stats)
          setUserTournaments(mockTournaments.data.data.tournaments)
        } else {
          // This should not execute in Netlify static deployment
          console.warn('Dashboard data fetch attempted in non-browser environment');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Please login to access dashboard</h1>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground">
                Go to Login
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Dynamic stats based on user data
  const stats = [
    { 
      label: "Tournaments Joined", 
      value: userStats?.tournamentStats?.total || user.stats.totalTournaments || 0, 
      icon: Trophy, 
      change: userStats?.tournamentStats?.upcoming > 0 ? `+${userStats.tournamentStats.upcoming} upcoming` : "No upcoming" 
    },
    { 
      label: "Matches Played", 
      value: userStats?.recentMatches?.length || user.stats.totalTournaments || 0, 
      icon: Gamepad2, 
      change: userStats?.recentMatches?.length > 0 ? "Recent matches available" : "No matches yet" 
    },
    { 
      label: "Win Rate", 
      value: user.stats.totalTournaments > 0 
        ? `${Math.round((user.stats.totalWins / user.stats.totalTournaments) * 100)}%` 
        : "0%", 
      icon: Target, 
      change: user.stats.totalWins > 0 ? `${user.stats.totalWins} wins` : "No wins yet" 
    },
    { 
      label: "Earnings", 
      value: `₹${user.wallet.totalEarnings}`, 
      icon: Wallet, 
      change: user.wallet.balance > 0 ? `₹${user.wallet.balance} available` : "No balance" 
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, <span className="text-primary">{user.profile.displayName || user.username}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here&apos;s an overview of your gaming activity
            </p>
          </div>

          {/* Notifications Banner */}
          {notifications.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{notifications[0].message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notifications[0].time}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground shrink-0">New</Badge>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-5 bg-card border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-primary mt-2">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Tournaments */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">My Tournaments</h2>
                <Link href="/dashboard/tournaments">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {userTournaments.length > 0 ? userTournaments.map((tournament) => (
                  <Card key={tournament._id} className="p-5 bg-card border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{tournament.title}</h3>
                          <Badge
                            variant={tournament.status === "upcoming" ? "default" : "secondary"}
                            className={tournament.status === "upcoming" ? "bg-primary text-primary-foreground" : ""}
                          >
                            {tournament.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Gamepad2 className="h-4 w-4" />
                            {tournament.game.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(tournament.schedule.tournamentStart).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(tournament.schedule.tournamentStart).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {/* Room Details */}
                      {tournament.roomDetails?.roomId && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Room:</span>
                            <code className="text-sm font-mono text-foreground">{tournament.roomDetails.roomId}</code>
                            <button
                              onClick={() => copyToClipboard(tournament.roomDetails.roomId, `room-${tournament._id}`)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {copiedId === `room-${tournament._id}` ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          {tournament.roomDetails.roomPassword && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Pass:</span>
                              <code className="text-sm font-mono text-foreground">{tournament.roomDetails.roomPassword}</code>
                              <button
                                onClick={() => copyToClipboard(tournament.roomDetails.roomPassword, `pass-${tournament._id}`)}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {copiedId === `pass-${tournament._id}` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {tournament.status === "upcoming" && !tournament.roomDetails?.roomId && (
                        <div className="px-4 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                          Room details coming soon
                        </div>
                      )}
                    </div>
                  </Card>
                )) : (
                  <Card className="p-8 bg-card border-border text-center">
                    <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No tournaments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Join your first tournament to get started!
                    </p>
                    <Link href="/tournaments">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Browse Tournaments
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            </div>

            {/* Player Profile Card */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Player Profile</h2>
              <Card className="p-6 bg-card border-border">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    {user.profile.avatar ? (
                      <img 
                        src={user.profile.avatar} 
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {(user.profile.displayName || user.username).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{user.profile.displayName || user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.role === 'admin' ? 'Administrator' : 'Pro Player'}</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Game ID (FF)</span>
                      <div className="text-right">
                        <div className="font-mono text-foreground">
                          {user.gameIDs.freeFire || 'Not set'}
                        </div>
                        {user.gameIDs.freeFireLevel && (
                          <div className="text-xs text-primary">Level {user.gameIDs.freeFireLevel}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Game ID (PUBG)</span>
                      <div className="text-right">
                        <div className="font-mono text-foreground">
                          {user.gameIDs.pubg || 'Not set'}
                        </div>
                        {user.gameIDs.pubgLevel && (
                          <div className="text-xs text-primary">Level {user.gameIDs.pubgLevel}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Wins</span>
                      <span className="text-green-500 font-semibold">{user.stats.totalWins}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Global Rank</span>
                      <span className="text-primary font-semibold">
                        {user.stats.globalRank ? `#${user.stats.globalRank}` : 'Not ranked'}
                      </span>
                    </div>
                  </div>

                  <Link href="/dashboard/profile">
                    <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Wallet Card */}
              <Card className="p-6 bg-card border-border mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Wallet Balance</h3>
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">₹{user.wallet.balance}</div>
                <p className="text-sm text-muted-foreground mt-1">Available for withdrawal</p>
                <Link href="/dashboard/wallet">
                  <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
                    Manage Wallet
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
