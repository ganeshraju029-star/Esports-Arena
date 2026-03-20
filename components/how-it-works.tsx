"use client"

import { UserPlus, Gamepad2, Trophy, Wallet } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your free account and set up your gaming profile with your in-game ID",
  },
  {
    icon: Gamepad2,
    title: "Join Tournament",
    description: "Browse tournaments, select your favorite game, and register for upcoming matches",
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    description: "Play your matches, climb the leaderboard, and prove you're the best",
  },
  {
    icon: Wallet,
    title: "Claim Rewards",
    description: "Winners receive their prizes directly to their wallet. It's that simple!",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl font-bold text-foreground">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your esports journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
