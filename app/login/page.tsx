"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Gamepad2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login"
  const isAdmin = searchParams.get("role") === "admin"
  
  const { login, register, isLoading, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(initialMode)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    setError("")
    setSuccess("")

    try {
      const result = await login(email, password)
      if (result.success) {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          // Check user role from localStorage since user state might not be updated yet
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (storedUser.role === 'admin') {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const userData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: password,
      confirmPassword: confirmPassword,
      role: isAdmin ? 'admin' : 'player',
      gameIDs: {
        freeFire: formData.get('freeFire') as string || undefined,
        pubg: formData.get('pubg') as string || undefined,
        freeFireLevel: formData.get('freeFireLevel') ? parseInt(formData.get('freeFireLevel') as string) : undefined,
        pubgLevel: formData.get('pubgLevel') ? parseInt(formData.get('pubgLevel') as string) : undefined,
      }
    }

    setError("")
    setSuccess("")

    try {
      const result = await register(userData)
      if (result.success) {
        setSuccess("Registration successful! Redirecting...")
        setTimeout(() => {
          if (isAdmin) {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,106,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="relative mx-auto w-full max-w-md">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Gamepad2 className="h-10 w-10 text-primary" />
            <span className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wider text-foreground">
              ESPORTS <span className="text-primary">ARENA</span>
            </span>
          </div>

          {/* Admin Badge */}
          {isAdmin && (
            <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-primary font-medium">Admin Login Portal</span>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={isAdmin}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      className="pl-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12 bg-muted border-border focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="freeFire">Free Fire ID</Label>
                    <div className="relative">
                      <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="freeFire"
                        name="freeFire"
                        type="text"
                        placeholder="Free Fire UID"
                        className="pl-10 h-12 bg-muted border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeFireLevel">Free Fire Level</Label>
                    <Input
                      id="freeFireLevel"
                      name="freeFireLevel"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1-100"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pubg">PUBG Mobile ID</Label>
                    <Input
                      id="pubg"
                      name="pubg"
                      type="text"
                      placeholder="PUBG Mobile ID"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pubgLevel">PUBG Mobile Level</Label>
                    <Input
                      id="pubgLevel"
                      name="pubgLevel"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1-100"
                      className="h-12 bg-muted border-border focus:border-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Admin Link */}
          {!isAdmin && (
            <div className="mt-8 text-center">
              <Link
                href="/login?role=admin"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-card">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12">
          <h2 className="font-[var(--font-orbitron)] text-4xl font-bold text-foreground mb-4">
            Join the <span className="text-primary text-glow">Arena</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Connect with thousands of players, compete in tournaments, and prove you&apos;re the best.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            {[
              { value: "50K+", label: "Players" },
              { value: "$500K", label: "Prize Pool" },
              { value: "1,200+", label: "Tournaments" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}

export default LoginPage
