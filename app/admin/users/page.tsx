"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Eye, Edit } from "lucide-react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock user data
  const users = [
    { 
      id: "1", 
      username: "ProGamer123", 
      email: "pro@example.com", 
      role: "player",
      games: ["Free Fire", "PUBG"], 
      rank: 1, 
      points: 2500,
      joinedAt: "2026-01-15"
    },
    { 
      id: "2", 
      username: "EliteSniper", 
      email: "elite@example.com", 
      role: "player",
      games: ["Free Fire"], 
      rank: 5, 
      points: 1800,
      joinedAt: "2026-02-10"
    },
    { 
      id: "3", 
      username: "ShadowKiller", 
      email: "shadow@example.com", 
      role: "player",
      games: ["PUBG", "COD"], 
      rank: 3, 
      points: 2100,
      joinedAt: "2026-01-20"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6 lg:ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">View and manage all registered users</p>
          </div>

          {/* Search */}
          <Card className="p-4 mb-6 bg-card border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-muted border-border"
              />
            </div>
          </Card>

          {/* Users Table */}
          <Card className="p-6 bg-card border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Username</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Games</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Points</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Joined</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-foreground">{user.username}</div>
                          <Badge variant="outline" className="text-xs mt-1">{user.role}</Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {user.games.map((game: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {game}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">#{user.rank}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-primary">{user.points}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
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

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                <p className="text-muted-foreground">Users will appear here once they register</p>
              </div>
            )}
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
