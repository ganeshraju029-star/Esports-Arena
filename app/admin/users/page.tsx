"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Gamepad2,
  Trophy,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  gameIdFF: string
  gameIdPUBG: string
  status: "active" | "pending" | "banned"
  joinedDate: string
  tournamentsJoined: number
  wins: number
}

const users: User[] = [
  { id: "1", name: "ShadowStrike", email: "shadow@email.com", avatar: "SS", gameIdFF: "FF123456789", gameIdPUBG: "PUBG987654", status: "active", joinedDate: "Jan 15, 2026", tournamentsJoined: 24, wins: 18 },
  { id: "2", name: "PhoenixRise", email: "phoenix@email.com", avatar: "PR", gameIdFF: "FF987654321", gameIdPUBG: "PUBG123456", status: "active", joinedDate: "Feb 10, 2026", tournamentsJoined: 18, wins: 12 },
  { id: "3", name: "NightHawk", email: "night@email.com", avatar: "NH", gameIdFF: "FF456789123", gameIdPUBG: "", status: "active", joinedDate: "Feb 28, 2026", tournamentsJoined: 15, wins: 9 },
  { id: "4", name: "ThunderBolt", email: "thunder@email.com", avatar: "TB", gameIdFF: "", gameIdPUBG: "PUBG789456", status: "pending", joinedDate: "Mar 05, 2026", tournamentsJoined: 8, wins: 5 },
  { id: "5", name: "VenomKing", email: "venom@email.com", avatar: "VK", gameIdFF: "FF789123456", gameIdPUBG: "PUBG456789", status: "active", joinedDate: "Mar 12, 2026", tournamentsJoined: 12, wins: 7 },
  { id: "6", name: "BlazeFury", email: "blaze@email.com", avatar: "BF", gameIdFF: "FF321654987", gameIdPUBG: "PUBG321654", status: "banned", joinedDate: "Dec 20, 2025", tournamentsJoined: 5, wins: 2 },
  { id: "7", name: "StormBreaker", email: "storm@email.com", avatar: "SB", gameIdFF: "FF654987321", gameIdPUBG: "", status: "active", joinedDate: "Mar 18, 2026", tournamentsJoined: 3, wins: 1 },
  { id: "8", name: "IronWolf", email: "iron@email.com", avatar: "IW", gameIdFF: "", gameIdPUBG: "PUBG654321", status: "active", joinedDate: "Mar 19, 2026", tournamentsJoined: 2, wins: 0 },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [viewUserOpen, setViewUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const viewUser = (user: User) => {
    setSelectedUser(user)
    setViewUserOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
              Registered <span className="text-primary">Users</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and manage all registered players
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-2xl font-bold text-green-500">{users.filter(u => u.status === "active").length}</div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Pending Verification</div>
              <div className="text-2xl font-bold text-yellow-500">{users.filter(u => u.status === "pending").length}</div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-card border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Joined</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Stats</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {user.joinedDate}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{user.tournamentsJoined}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-500 font-medium">{user.wins} wins</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : user.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              : "bg-red-500/20 text-red-500 border-red-500/30"
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewUser(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            {user.status === "pending" && (
                              <DropdownMenuItem className="text-green-500">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {user.status !== "banned" && (
                              <DropdownMenuItem className="text-destructive">
                                <Ban className="h-4 w-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* View User Dialog */}
      <Dialog open={viewUserOpen} onOpenChange={setViewUserOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Player Profile</DialogTitle>
            <DialogDescription>
              Detailed information about this player
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge
                      className={
                        selectedUser.status === "active"
                          ? "bg-green-500/20 text-green-500 mt-1"
                          : selectedUser.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-500 mt-1"
                          : "bg-red-500/20 text-red-500 mt-1"
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="font-medium text-foreground">{selectedUser.joinedDate}</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Game IDs
                  </div>
                  <div className="mt-2 space-y-2">
                    {selectedUser.gameIdFF && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Free Fire:</span>
                        <code className="font-mono text-foreground">{selectedUser.gameIdFF}</code>
                      </div>
                    )}
                    {selectedUser.gameIdPUBG && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PUBG:</span>
                        <code className="font-mono text-foreground">{selectedUser.gameIdPUBG}</code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedUser.tournamentsJoined}</div>
                    <div className="text-sm text-muted-foreground">Tournaments</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-green-500">{selectedUser.wins}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
