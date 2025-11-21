'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Welcome to Your Dashboard!
          </h1>
          <p className="text-xl text-text-secondary">
            Hello, <span className="text-primary-teal font-semibold">{session.user?.name}</span>
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Onboarding Complete!</h2>
          <p className="text-lg text-text-secondary mb-8">
            You've successfully completed the authentication and onboarding flow.
            <br />
            The dashboard features are coming next!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 border-2 border-primary-teal/30">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-bold text-lg mb-2">Focus Timer</h3>
              <p className="text-sm text-text-secondary">Coming soon</p>
            </div>

            <div className="glass-card p-6 border-2 border-accent-gold/30">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-bold text-lg mb-2">Your Ascendant</h3>
              <p className="text-sm text-text-secondary">Coming soon</p>
            </div>

            <div className="glass-card p-6 border-2 border-accent-orange/30">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-bold text-lg mb-2">Leaderboard</h3>
              <p className="text-sm text-text-secondary">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
