'use client';

import { motion } from 'framer-motion';
import { orbVariants } from '@/lib/onboardingAnimations';

interface OrbAnimationProps {
  onComplete: () => void;
}

export function OrbAnimation({ onComplete }: OrbAnimationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <motion.div
        className="w-[200px] h-[200px] rounded-full bg-primary-teal"
        variants={orbVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={onComplete}
        style={{
          background: 'radial-gradient(circle, rgba(15, 118, 110, 1) 0%, rgba(15, 118, 110, 0.6) 100%)',
        }}
      />
    </div>
  );
}
