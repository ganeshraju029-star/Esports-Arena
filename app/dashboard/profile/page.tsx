"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Gamepad2, Save, ArrowLeft, Upload, Camera } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.profile?.displayName || user?.username || "",
    bio: user?.profile?.bio || "",
    freeFireId: user?.gameIDs?.freeFire || "",
    freeFireLevel: user?.gameIDs?.freeFireLevel?.toString() || "",
    pubgId: user?.gameIDs?.pubg || "",
    pubgLevel: user?.gameIDs?.pubgLevel?.toString() || ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving profile:", formData)
    setIsEditing(false)
    alert("Profile updated successfully! (Demo Mode)")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
              Player <span className="text-primary">Profile</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your profile information and game IDs
            </p>
          </div>

          {/* Profile Avatar */}
          <Card className="p-8 bg-card border-border mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
                  {user?.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary">
                      {(user?.profile?.displayName || user?.username || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-3 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {user?.profile?.displayName || user?.username}
                </h2>
                <p className="text-muted-foreground mb-4">@{user?.username}</p>
                <Badge variant="outline" className="text-sm">
                  {user?.role === 'admin' ? 'Administrator' : 'Pro Player'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <Label htmlFor="displayName" className="text-foreground mb-2 block">
                  Display Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 h-12 bg-muted border-border disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-10 h-12 bg-muted border-border opacity-50"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-foreground mb-2 block">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 h-12 bg-muted border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/200 characters
                </p>
              </div>
            </div>
          </Card>

          {/* Game IDs */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Game IDs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Fire */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Free Fire</h3>
                </div>
                
                <div>
                  <Label htmlFor="freeFireId" className="text-foreground mb-2 block">
                    Free Fire UID
                  </Label>
                  <Input
                    id="freeFireId"
                    name="freeFireId"
                    value={formData.freeFireId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-12 bg-muted border-border disabled:opacity-50"
                    placeholder="Enter your Free Fire UID"
                  />
                </div>

                <div>
                  <Label htmlFor="freeFireLevel" className="text-foreground mb-2 block">
                    Free Fire Level
                  </Label>
                  <Input
                    id="freeFireLevel"
                    name="freeFireLevel"
                    type="number"
                    value={formData.freeFireLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-12 bg-muted border-border disabled:opacity-50"
                    placeholder="1-100"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              {/* PUBG Mobile */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">PUBG Mobile</h3>
                </div>
                
                <div>
                  <Label htmlFor="pubgId" className="text-foreground mb-2 block">
                    PUBG Mobile ID
                  </Label>
                  <Input
                    id="pubgId"
                    name="pubgId"
                    value={formData.pubgId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-12 bg-muted border-border disabled:opacity-50"
                    placeholder="Enter your PUBG Mobile ID"
                  />
                </div>

                <div>
                  <Label htmlFor="pubgLevel" className="text-foreground mb-2 block">
                    PUBG Mobile Level
                  </Label>
                  <Input
                    id="pubgLevel"
                    name="pubgLevel"
                    type="number"
                    value={formData.pubgLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-12 bg-muted border-border disabled:opacity-50"
                    placeholder="1-100"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Game IDs
                </Button>
              </div>
            )}
          </Card>

          {/* Account Stats */}
          <Card className="p-6 bg-card border-border mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Account Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {user?.stats?.totalTournaments || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Tournaments</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {user?.stats?.totalWins || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Wins</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {user?.wallet?.balance || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Balance (₹)</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {user?.stats?.globalRank ? `#${user.stats.globalRank}` : '-'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Global Rank</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
