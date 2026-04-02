import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'ESPORTS ARENA - Compete. Conquer. Win.',
  description: 'The ultimate esports tournament platform for Free Fire and PUBG. Join tournaments, compete with the best, and win amazing prizes.',
  generator: 'v0.app',
  keywords: ['esports', 'tournament', 'Free Fire', 'PUBG', 'gaming', 'battle royale'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF6A00',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
