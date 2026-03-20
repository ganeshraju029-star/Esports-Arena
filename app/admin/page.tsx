"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
  Trophy,
  Users,
  Gamepad2,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTournaments: 0,
    totalUsers: 0,
    activeTournaments: 0,
    totalRevenue: 0,
  })
  const [recentTournaments, setRecentTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      window.location.href = '/login'
      return
    }

    // Load admin data
    const loadAdminData = async () => {
      try {
        setLoading(true)
        
        // Check if we're in production (Netlify) or development
        const isProduction = process.env.NODE_ENV === 'production';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        // In production (Netlify), use mock data
        if (isProduction && !apiBaseUrl.includes('localhost')) {
          // Mock admin stats for Netlify demo
          setStats({
            totalTournaments: 25,
            totalUsers: 1240,
            activeTournaments: 8,
            totalRevenue: 125000,
          });
          
          // Mock recent tournaments
          setRecentTournaments([
            {
              _id: '1',
              title: 'Free Fire Championship',
              game: 'freefire',
              status: 'active',
              participants: 85,
              prizePool: 5000,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              _id: '2',
              title: 'PUBG Elite Showdown',
              game: 'pubg',
              status: 'completed',
              participants: 50,
              prizePool: 10000,
              createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
            {
              _id: '3',
              title: 'Call of Duty Masters',
              game: 'cod',
              status: 'upcoming',
              participants: 0,
              prizePool: 15000,
              createdAt: new Date(Date.now() - 259200000).toISOString(),
            },
          ]);
        } else {
          // In development, fetch from real API
          const token = localStorage.getItem('token');
          
          const [statsResponse, tournamentsResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/admin/stats`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }),
            fetch(`${apiBaseUrl}/admin/tournaments?limit=5`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }),
          ]);
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData.data);
          }
          
          if (tournamentsResponse.ok) {
            const tournamentsData = await tournamentsResponse.json();
            setRecentTournaments(tournamentsData.data);
          }
        }
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Tournaments",
      value: stats.totalTournaments,
      icon: Trophy,
      change: "+3 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: "+120 this week",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Tournaments",
      value: stats.activeTournaments,
      icon: Activity,
      change: "+2 today",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+₹15,000 this month",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-8 lg:ml-64">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.profile.displayName || user?.username}!
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 7 days
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                Download Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Tournaments */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recent Tournaments</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your latest tournaments</p>
              </div>
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentTournaments.map((tournament: any) => (
                <div 
                  key={tournament._id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tournament.title}</h3>
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
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(tournament.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{tournament.participants} players</p>
                      <p className="text-xs text-muted-foreground">Prize: ₹{tournament.prizePool.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recentTournaments.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tournaments yet</h3>
                <p className="text-muted-foreground mb-4">Create your first tournament to get started</p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Tournament
                </Button>
              </div>
            )}
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
