'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ASCENDANTS } from '@/lib/constants';
import { ascendantCardVariants } from '@/lib/onboardingAnimations';

interface AscendantSelectionProps {
  answers: Record<string, any>;
}

export function AscendantSelection({ answers }: AscendantSelectionProps) {
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
      // Save survey responses
      if (Object.keys(answers).length > 0) {
        const { error: surveyError } = await supabase
          .from('survey_responses')
          .insert({
            user_id: session.user.id,
            ...answers,
          });

        if (surveyError) {
          console.error('Error saving survey:', surveyError);
        }
      }

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

  const starterAscendants = ASCENDANTS.filter(a => a.starter);
  const lockedAscendants = ASCENDANTS.filter(a => !a.starter);
  const selected = ASCENDANTS.find(a => a.id === selectedAscendant);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gradient">Choose Your Ascendant</h1>
          <p className="text-xl text-text-secondary">
            Select your companion to begin your focus journey
          </p>
        </div>

        {/* Starter Ascendants */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Available Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {starterAscendants.map((ascendant, index) => (
              <motion.button
                key={ascendant.id}
                custom={index}
                variants={ascendantCardVariants}
                initial="initial"
                animate={selectedAscendant === ascendant.id ? 'selected' : 'animate'}
                whileHover="hover"
                onClick={() => setSelectedAscendant(ascendant.id)}
                className={`glass-card p-8 text-left transition-all duration-300 ${
                  selectedAscendant === ascendant.id
                    ? 'border-2 border-primary-teal'
                    : 'border-2 border-transparent'
                }`}
              >
                {/* Ascendant Icon */}
                <div
                  className="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-5xl font-bold mx-auto"
                  style={{
                    backgroundColor: ascendant.color + '30',
                    color: ascendant.color,
                    boxShadow: `0 0 30px ${ascendant.color}40`,
                  }}
                >
                  {ascendant.name.charAt(0)}
                </div>

                <h3 className="text-2xl font-bold mb-2 text-center">{ascendant.name}</h3>
                <p className="text-sm text-accent-gold mb-3 text-center">{ascendant.title}</p>
                <p className="text-sm text-text-secondary text-center">{ascendant.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Locked Ascendants */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-text-secondary">
            Unlock Through Focus
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {lockedAscendants.map((ascendant, index) => (
              <motion.div
                key={ascendant.id}
                custom={index + starterAscendants.length}
                variants={ascendantCardVariants}
                initial="initial"
                animate="animate"
                className="glass-card p-4 text-center opacity-50"
              >
                <div
                  className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-2xl font-bold mx-auto"
                  style={{
                    backgroundColor: '#5A5A5A20',
                    color: '#5A5A5A',
                  }}
                >
                  🔒
                </div>
                <h4 className="text-sm font-bold text-locked">{ascendant.name}</h4>
                <p className="text-xs text-locked mt-1">Lvl 10+</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Info */}
        {selected && (
          <motion.div
            className="glass-card p-6 mb-8 max-w-2xl mx-auto border-2 border-primary-teal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
                style={{
                  backgroundColor: selected.color + '30',
                  color: selected.color,
                  boxShadow: `0 0 20px ${selected.color}40`,
                }}
              >
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selected.name} Selected</h3>
                <p className="text-sm text-text-secondary">
                  Your companion will grow with you as you complete focus sessions
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || !selectedAscendant}
            className="min-w-[250px]"
          >
            Begin Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
