import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SAGE - Focus Timer & AI Companion',
  description: 'Gamified focus timer with AI companions. Break free from distractions and level up your productivity.',
  keywords: ['focus timer', 'productivity', 'pomodoro', 'AI companion', 'gamification'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="cosmic-texture">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
