import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-gradient">SAGE</span>
        </h1>
        <p className="text-2xl text-text-secondary mb-8">
          Focus Timer + Gamified AI Companion
        </p>
        <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto">
          Break free from distractions. Level up your focus.
          Your AI companion awaits.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup" className="btn-primary">
            Get Started
          </Link>
          <Link href="/auth/login" className="btn-secondary">
            Sign In
          </Link>
        </div>

        {/* Preview Card */}
        <div className="glass-card mt-16 p-8 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-teal to-accent-gold animate-pulse-slow" />
          <h3 className="text-xl font-semibold mb-2">Your Ascendant Awaits</h3>
          <p className="text-text-secondary text-sm">
            Choose your companion and begin your journey to peak productivity
          </p>
        </div>
      </div>
    </main>
  )
}
