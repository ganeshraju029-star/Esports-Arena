"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Zap, Flame, Crosshair } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/6 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,106,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Decorative Icons */}
      <div className="absolute top-1/4 left-[10%] opacity-10">
        <Crosshair className="h-32 w-32 text-primary" />
      </div>
      <div className="absolute bottom-1/4 right-[10%] opacity-10">
        <Flame className="h-28 w-28 text-primary" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in-up">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">Season 4 Now Live</span>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="font-[var(--font-orbitron)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up delay-100">
          <span className="block text-foreground">ESPORTS ARENA</span>
          <span className="block gradient-text text-glow mt-2">
            Compete. Conquer. Win.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 animate-fade-in-up delay-200">
          The ultimate battle royale tournament platform. Join Free Fire & PUBG 
          tournaments, compete against the best players, and claim your victory.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <Link href="/tournaments">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse font-semibold btn-glow"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Join Tournament
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <Users className="mr-2 h-5 w-5" />
              Create Account
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up delay-400">
          {[
            { value: "50K+", label: "Active Players" },
            { value: "1,200+", label: "Tournaments" },
            { value: "$500K+", label: "Prize Pool" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm card-hover"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary text-glow">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Game Badges */}
        <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in-up delay-500">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/30 border border-border">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Free Fire</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/30 border border-border">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">PUBG Mobile</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
