'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ASCENDANTS } from '@/lib/constants';

export default function AscendantSelectionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedAscendant, setSelectedAscendant] = useState<string>('solis');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      // Create ascendant entries for user
      const ascendantsToCreate = ASCENDANTS.map(ascendant => ({
        user_id: session.user.id,
        ascendant_name: ascendant.id,
        is_unlocked: ascendant.id === selectedAscendant,
        unlocked_at: ascendant.id === selectedAscendant ? new Date().toISOString() : null,
        current_evolution_stage: 0,
      }));

      const { error: ascendantError } = await supabase
        .from('ascendants')
        .insert(ascendantsToCreate);

      if (ascendantError) {
        console.error('Error creating ascendants:', ascendantError);
        alert('Failed to save ascendant selection. Please try again.');
        return;
      }

      // Update user's selected ascendant
      const { error: userError } = await supabase
        .from('users')
        .update({ selected_ascendant: selectedAscendant })
        .eq('id', session.user.id);

      if (userError) {
        console.error('Error updating user:', userError);
        alert('Failed to update user profile. Please try again.');
        return;
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selected = ASCENDANTS.find(a => a.id === selectedAscendant);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Choose Your Ascendant</h1>
          <p className="text-text-secondary">
            Select your companion to begin your focus journey
          </p>
        </div>

        {/* Ascendant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ASCENDANTS.map((ascendant, index) => (
            <button
              key={ascendant.id}
              onClick={() => setSelectedAscendant(ascendant.id)}
              disabled={!ascendant.starter}
              className={`glass-card p-6 text-left transition-all duration-300 animate-slide-up ${
                ascendant.starter
                  ? selectedAscendant === ascendant.id
                    ? 'border-2 border-primary-teal shadow-lg shadow-primary-teal/30'
                    : 'hover:border-white/30 hover:scale-105'
                  : 'locked'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Ascendant Icon Placeholder */}
              <div
                className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-3xl font-bold"
                style={{
                  backgroundColor: ascendant.starter ? ascendant.color + '20' : '#5A5A5A20',
                  color: ascendant.starter ? ascendant.color : '#5A5A5A',
                }}
              >
                {ascendant.name.charAt(0)}
              </div>

              <h3 className="text-xl font-bold mb-1">{ascendant.name}</h3>
              <p className="text-sm text-accent-gold mb-2">{ascendant.title}</p>
              <p className="text-sm text-text-secondary">{ascendant.description}</p>

              {!ascendant.starter && (
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-locked/20 text-locked text-xs">
                  🔒 Unlock at Level 10
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Ascendant Info */}
        {selected && (
          <div className="glass-card p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{
                  backgroundColor: selected.color + '20',
                  color: selected.color,
                }}
              >
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{selected.name} Selected</h3>
                <p className="text-sm text-text-secondary">
                  Your companion will grow with you as you complete focus sessions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || !selectedAscendant}
            className="min-w-[200px]"
          >
            Begin Your Journey
          </Button>
        </div>

        {/* Evolution Preview */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Your ascendant will evolve through 4 stages:
          </p>
          <div className="flex justify-center gap-4">
            {['Hatchling', 'Awakened', 'Ascended', 'Transcendent'].map((stage, index) => (
              <div
                key={stage}
                className="text-xs"
                style={{ opacity: 1 - index * 0.2 }}
              >
                <div className="text-text-secondary">{stage}</div>
                <div className="text-accent-gold text-[10px]">Lvl {[1, 10, 25, 50][index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
