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
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState({
    totalTournaments: 0,
    totalUsers: 0,
    activeTournaments: 0,
    totalRevenue: 0,
  })
  const [recentTournaments, setRecentTournaments] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTournament, setNewTournament] = useState({
    title: '',
    game: 'freefire',
    mode: 'solo',
    entryFee: 0,
    prizePool: 0,
    maxPlayers: 100,
    date: '',
    time: ''
  })

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

          // Mock participants
          setParticipants([
            { id: '1', username: 'ProGamer123', email: 'pro@example.com', games: ['Free Fire', 'PUBG'], rank: 1, points: 2500 },
            { id: '2', username: 'EliteSniper', email: 'elite@example.com', games: ['Free Fire'], rank: 5, points: 1800 },
            { id: '3', username: 'ShadowKiller', email: 'shadow@example.com', games: ['PUBG', 'COD'], rank: 3, points: 2100 },
          ]);
        } else {
          // In development, fetch from real API
          const token = localStorage.getItem('token');
          
          const [statsResponse, tournamentsResponse, participantsResponse] = await Promise.all([
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
            fetch(`${apiBaseUrl}/admin/users`, {
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

          if (participantsResponse.ok) {
            const usersData = await participantsResponse.json();
            setParticipants(usersData.data.users || []);
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

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating tournament:', newTournament)
    alert('Tournament created successfully! (Demo Mode)')
    setShowCreateForm(false)
    setNewTournament({
      title: '',
      game: 'freefire',
      mode: 'solo',
      entryFee: 0,
      prizePool: 0,
      maxPlayers: 100,
      date: '',
      time: ''
    })
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

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return renderOverview()
      case 'create-tournament':
        return renderCreateTournament()
      case 'participants':
        return renderParticipants()
      case 'manage-matches':
        return renderManageMatches()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <>
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
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setActiveSection('create-tournament')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create New
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
    </>
  )

  const renderCreateTournament = () => (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create New Tournament</h2>
        <p className="text-muted-foreground">Fill in the details to create a new tournament</p>
      </div>

      <form onSubmit={handleCreateTournament} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tournament Title
            </label>
            <input
              type="text"
              value={newTournament.title}
              onChange={(e) => setNewTournament({...newTournament, title: e.target.value})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Free Fire Championship"
              required
            />
          </div>

          {/* Game Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Game
            </label>
            <select
              value={newTournament.game}
              onChange={(e) => setNewTournament({...newTournament, game: e.target.value})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="freefire">Free Fire</option>
              <option value="pubg">PUBG Mobile</option>
              <option value="cod">Call of Duty</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mode
            </label>
            <select
              value={newTournament.mode}
              onChange={(e) => setNewTournament({...newTournament, mode: e.target.value})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="squad">Squad</option>
            </select>
          </div>

          {/* Entry Fee */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Entry Fee (₹)
            </label>
            <input
              type="number"
              value={newTournament.entryFee}
              onChange={(e) => setNewTournament({...newTournament, entryFee: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0 for free"
              min="0"
            />
          </div>

          {/* Prize Pool */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Prize Pool (₹)
            </label>
            <input
              type="number"
              value={newTournament.prizePool}
              onChange={(e) => setNewTournament({...newTournament, prizePool: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Total prize money"
              min="0"
            />
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Max Players
            </label>
            <input
              type="number"
              value={newTournament.maxPlayers}
              onChange={(e) => setNewTournament({...newTournament, maxPlayers: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="100"
              min="1"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tournament Date
            </label>
            <input
              type="date"
              value={newTournament.date}
              onChange={(e) => setNewTournament({...newTournament, date: e.target.value})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tournament Time
            </label>
            <input
              type="time"
              value={newTournament.time}
              onChange={(e) => setNewTournament({...newTournament, time: e.target.value})}
              className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Tournament
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )

  const renderParticipants = () => (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Registered Users</h2>
        <p className="text-muted-foreground">View and manage all registered participants</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Username</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Games</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Points</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((user: any) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 text-sm text-foreground">{user.username}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  <div className="flex gap-1 flex-wrap">
                    {user.games.map((game: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {game}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-foreground">#{user.rank}</td>
                <td className="py-3 px-4 text-sm text-primary font-medium">{user.points}</td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {participants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No participants yet</h3>
          <p className="text-muted-foreground">Users will appear here once they register</p>
        </div>
      )}
    </Card>
  )

  const renderManageMatches = () => (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Manage Matches</h2>
        <p className="text-muted-foreground">Add room details and declare winners</p>
      </div>

      <div className="space-y-4">
        {recentTournaments.filter(t => t.status === 'active').map((tournament: any) => (
          <div key={tournament._id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{tournament.title}</h3>
                <p className="text-sm text-muted-foreground">{tournament.participants} participants</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Room ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Room Password
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Password"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Room Details
              </Button>
              <Button variant="outline">
                Declare Winner
              </Button>
            </div>
          </div>
        ))}

        {recentTournaments.filter(t => t.status === 'active').length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No active matches</h3>
            <p className="text-muted-foreground">Start a tournament to manage matches</p>
          </div>
        )}
      </div>
    </Card>
  )

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.profile.displayName || user?.username}!
            </p>
          </div>

          {renderSection()}
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
