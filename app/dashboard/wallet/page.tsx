"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import WalletCard from "@/components/payment/WalletCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wallet, History, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function WalletPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock transaction data
  const transactions = [
    {
      id: "1",
      type: "deposit",
      amount: 1000,
      status: "completed",
      description: "Wallet top-up",
      date: "2026-03-20T12:00:00Z",
      paymentMethod: "Razorpay"
    },
    {
      id: "2", 
      type: "tournament_entry",
      amount: -100,
      status: "completed",
      description: "Free Fire Championship entry fee",
      date: "2026-03-19T15:30:00Z",
      paymentMethod: "Wallet"
    },
    {
      id: "3",
      type: "prize",
      amount: 500,
      status: "completed", 
      description: "Prize from Solo Survival League",
      date: "2026-03-18T20:15:00Z",
      paymentMethod: "System"
    }
  ]

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'prize':
        return 'text-green-600 bg-green-100'
      case 'withdrawal':
      case 'tournament_entry':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'withdrawal':
        return 'Withdrawal'
      case 'tournament_entry':
        return 'Tournament Entry'
      case 'prize':
        return 'Prize Won'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-foreground">
              Wallet <span className="text-primary">Management</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your funds and view transaction history
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === "overview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wallet className="h-4 w-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === "transactions"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="h-4 w-4" />
                Transactions
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Wallet Card */}
              <div className="lg:col-span-1">
                <WalletCard />
              </div>

              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatAmount(user?.wallet.totalEarnings || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {formatAmount(user?.wallet.totalSpent || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className={`text-2xl font-bold ${
                        (user?.wallet.totalEarnings || 0) - (user?.wallet.totalSpent || 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {formatAmount((user?.wallet.totalEarnings || 0) - (user?.wallet.totalSpent || 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Profit</div>
                    </div>
                  </div>
                </Card>

                {/* Recent Transactions */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("transactions")}>
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getTypeColor(transaction.type).split(' ')[1]}`}>
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(transaction.date)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(transaction.type)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getTypeColor(transaction.type).split(' ')[1]}`}>
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)} • {transaction.paymentMethod}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your transaction history will appear here once you start playing.
                  </p>
                  <Link href="/tournaments">
                    <Button>Browse Tournaments</Button>
                  </Link>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
