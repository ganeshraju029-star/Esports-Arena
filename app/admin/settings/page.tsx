"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Palette, Key, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    tournamentAlerts: true,
    userRegistrations: true,
  })

  const [privacy, setPrivacy] = useState({
    publicLeaderboard: true,
    showStats: true,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6 lg:ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Settings</h1>
            <p className="text-muted-foreground">Manage admin panel settings and preferences</p>
          </div>

          {/* Notification Settings */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive admin updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Tournament Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about tournament activities</p>
                </div>
                <Switch
                  checked={notifications.tournamentAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tournamentAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">User Registration Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new users register</p>
                </div>
                <Switch
                  checked={notifications.userRegistrations}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, userRegistrations: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Privacy Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Public Leaderboard</Label>
                  <p className="text-sm text-muted-foreground">Make leaderboard visible to all users</p>
                </div>
                <Switch
                  checked={privacy.publicLeaderboard}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, publicLeaderboard: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Show Platform Stats</Label>
                  <p className="text-sm text-muted-foreground">Display platform statistics publicly</p>
                </div>
                <Switch
                  checked={privacy.showStats}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showStats: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-2 block">Current Password</Label>
                <Input
                  type="password"
                  className="h-12 bg-muted border-border"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">New Password</Label>
                <Input
                  type="password"
                  className="h-12 bg-muted border-border"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Confirm New Password</Label>
                <Input
                  type="password"
                  className="h-12 bg-muted border-border"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </Card>

          {/* Appearance Settings */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 rounded-lg border-2 border-primary bg-primary/10">
                    <div className="text-center">
                      <div className="w-full h-8 bg-black rounded mb-2"></div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-muted">
                    <div className="text-center">
                      <div className="w-full h-8 bg-white rounded mb-2 border"></div>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-border bg-muted">
                    <div className="text-center">
                      <div className="w-full h-8 bg-gradient-to-r from-black to-white rounded mb-2"></div>
                      <span className="text-sm font-medium">Auto</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
