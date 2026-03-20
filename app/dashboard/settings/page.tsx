"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, Palette, ArrowLeft, Save, Key, Globe, Smartphone } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function SettingsPage() {
  const { user } = useAuth()
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    tournamentReminders: true,
    matchResults: true,
    promotionalEmails: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showStats: true,
    allowMessages: true
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'dark'
  })

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings...`)
    alert(`${section} settings saved successfully! (Demo Mode)`);
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
              Account <span className="text-primary">Settings</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Notification Settings */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your account via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Tournament Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified before your tournaments start</p>
                </div>
                <Switch
                  checked={notifications.tournamentReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tournamentReminders: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Match Results</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications when matches end</p>
                </div>
                <Switch
                  checked={notifications.matchResults}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, matchResults: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive news about new tournaments and features</p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, promotionalEmails: checked }))}
                />
              </div>
            </div>

            <Button 
              onClick={() => handleSave("Notification")}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
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
                  <Label className="text-foreground">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your profile and stats</p>
                </div>
                <Switch
                  checked={privacy.publicProfile}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, publicProfile: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Show Statistics</Label>
                  <p className="text-sm text-muted-foreground">Display your gaming statistics on your profile</p>
                </div>
                <Switch
                  checked={privacy.showStats}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showStats: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">Let other players send you messages</p>
                </div>
                <Switch
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessages: checked }))}
                />
              </div>
            </div>

            <Button 
              onClick={() => handleSave("Privacy")}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Privacy Settings
            </Button>
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
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'dark' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      appearance.theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-full h-8 bg-black rounded mb-2"></div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'light' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      appearance.theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-full h-8 bg-white rounded mb-2 border"></div>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'auto' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      appearance.theme === 'auto'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-full h-8 bg-gradient-to-r from-black to-white rounded mb-2"></div>
                      <span className="text-sm font-medium">Auto</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSave("Appearance")}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </Card>

          {/* Account Information */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Account Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Username</span>
                <span className="text-foreground font-medium">@{user?.username}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Account Type</span>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role === 'admin' ? 'Administrator' : 'Player'}
                </Badge>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-card border-border mt-6 border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
