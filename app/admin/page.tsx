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
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Trash2,
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
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.profile.displayName || user?.username}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Tournaments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Tournaments</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentTournaments.map((tournament: any) => (
                <div key={tournament._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{tournament.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{tournament.participants} participants</p>
                      <p className="text-xs text-muted-foreground">₹{tournament.prizePool.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
