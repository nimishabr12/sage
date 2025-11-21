'use client';

import { motion } from 'framer-motion';
import { ascendantVariants } from '@/lib/onboardingAnimations';
import { ASCENDANTS } from '@/lib/constants';

interface AscendantsFlythroughProps {
  onComplete: () => void;
}

export function AscendantsFlythrough({ onComplete }: AscendantsFlythroughProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg overflow-hidden">
      <div className="relative w-full h-full">
        {ASCENDANTS.map((ascendant, index) => (
          <motion.div
            key={ascendant.id}
            className="absolute top-1/2 left-0 transform -translate-y-1/2"
            custom={index}
            variants={ascendantVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={() => {
              // Only trigger completion after the last ascendant
              if (index === ASCENDANTS.length - 1) {
                setTimeout(onComplete, 500);
              }
            }}
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold"
              style={{
                backgroundColor: ascendant.color + '40',
                color: ascendant.color,
                boxShadow: `0 0 40px ${ascendant.color}60`,
              }}
            >
              {ascendant.name.charAt(0)}
            </div>
            <div className="text-center mt-4">
              <p className="text-white font-bold text-xl">{ascendant.name}</p>
              <p className="text-text-secondary text-sm">{ascendant.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
