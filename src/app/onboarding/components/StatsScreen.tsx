'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { statsVariants } from '@/lib/onboardingAnimations';
import { animateStaggeredNumbers } from '@/lib/onboardingAnimations';
import { Button } from '@/components/ui/Button';

interface StatsScreenProps {
  userHoursPerDay: number;
  onContinue: () => void;
}

export function StatsScreen({ userHoursPerDay, onContinue }: StatsScreenProps) {
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  const stat4Ref = useRef<HTMLSpanElement>(null);
  const userStatRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Calculate user's yearly time loss
    const userYearlyHours = userHoursPerDay * 365;

    // Animate numbers sequentially
    const elements = [
      { element: stat1Ref.current!, from: 0, to: 4 },
      { element: stat2Ref.current!, from: 0, to: 6 },
      { element: stat3Ref.current!, from: 0, to: 1500 },
      { element: stat4Ref.current!, from: 0, to: 2200 },
      { element: userStatRef.current!, from: 0, to: Math.round(userYearlyHours) },
    ];

    animateStaggeredNumbers(elements, 300);
  }, [userHoursPerDay]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <motion.div
        className="w-full max-w-3xl text-center"
        variants={statsVariants}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-4xl font-bold mb-12">Let's Put This in Perspective</h1>

        <div className="space-y-8 mb-12">
          {/* General Stats */}
          <div className="glass-card p-8">
            <p className="text-xl text-text-secondary mb-4">
              The average person spends
            </p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span
                ref={stat1Ref}
                className="text-6xl font-bold text-accent-orange"
              >
                0
              </span>
              <span className="text-4xl text-text-secondary">to</span>
              <span
                ref={stat2Ref}
                className="text-6xl font-bold text-accent-orange"
              >
                0
              </span>
              <span className="text-3xl text-text-secondary">hours/day</span>
            </div>
            <p className="text-lg text-text-secondary">online scrolling and distracted</p>
          </div>

          {/* Yearly Calculation */}
          <div className="glass-card p-8 border-2 border-accent-orange/30">
            <p className="text-xl text-text-secondary mb-4">
              That's
            </p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span
                ref={stat3Ref}
                className="text-6xl font-bold text-accent-gold"
              >
                0
              </span>
              <span className="text-4xl text-text-secondary">to</span>
              <span
                ref={stat4Ref}
                className="text-6xl font-bold text-accent-gold"
              >
                0
              </span>
              <span className="text-3xl text-text-secondary">hours</span>
            </div>
            <p className="text-xl font-semibold text-accent-gold">per year!</p>
          </div>

          {/* Personalized Stat */}
          {userHoursPerDay > 0 && (
            <motion.div
              className="glass-card p-8 bg-primary-teal/10 border-2 border-primary-teal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <p className="text-xl text-text-secondary mb-4">
                Based on your response, you could be losing
              </p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span
                  ref={userStatRef}
                  className="text-7xl font-bold text-primary-teal"
                >
                  0
                </span>
                <span className="text-3xl text-text-secondary">hours/year</span>
              </div>
              <p className="text-lg text-primary-teal font-semibold">
                to distractions and lack of focus
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            className="min-w-[200px]"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
