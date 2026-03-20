"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function TestConnectionPage() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "error">("checking")
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      setBackendStatus("checking")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health`)
      const data = await response.json()
      
      if (response.ok) {
        setBackendStatus("connected")
        setApiResponse(data)
        // Also try to fetch tournaments
        fetchTournaments()
      } else {
        setBackendStatus("error")
      }
    } catch (error) {
      setBackendStatus("error")
      console.error('Backend connection error:', error)
    }
  }

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tournaments?limit=3`)
      const data = await response.json()
      
      if (response.ok && data.data) {
        setTournaments(data.data.tournaments || [])
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Connection <span className="text-primary">Test</span>
          </h1>

          {/* Backend Status */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Backend API Status</h2>
                <p className="text-muted-foreground">
                  {backendStatus === "checking" && "Checking connection..."}
                  {backendStatus === "connected" && "Backend is running and accessible"}
                  {backendStatus === "error" && "Cannot connect to backend"}
                </p>
              </div>
              <div>
                {backendStatus === "checking" && (
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                )}
                {backendStatus === "connected" && (
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                )}
                {backendStatus === "error" && (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
            </div>
          </Card>

          {/* API Response */}
          {apiResponse && (
            <Card className="p-6 bg-card border-border mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">API Health Response</h2>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </Card>
          )}

          {/* Tournaments List */}
          {tournaments.length > 0 && (
            <Card className="p-6 bg-card border-border mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Available Tournaments</h2>
              <div className="space-y-2">
                {tournaments.map((tournament) => (
                  <div key={tournament._id} className="p-3 bg-muted rounded-lg">
                    <div className="font-medium text-foreground">{tournament.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {tournament.game.toUpperCase()} • {tournament.mode} • Prize: ${tournament.prizePool}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={checkBackendConnection}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Recheck Connection
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Reload Page
            </Button>
          </div>

          {/* Troubleshooting Tips */}
          {backendStatus === "error" && (
            <Card className="p-6 bg-card border-border mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Troubleshooting</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Make sure the backend server is running on port 5000</li>
                <li>Check if MongoDB is running</li>
                <li>Verify .env.local has correct API URL</li>
                <li>Check backend logs for errors</li>
                <li>Ensure port 5000 is not blocked by firewall</li>
              </ul>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
