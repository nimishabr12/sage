'use client';

import { motion } from 'framer-motion';
import { welcomeVariants } from '@/lib/onboardingAnimations';
import { Button } from '@/components/ui/Button';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <motion.div
        className="text-center max-w-2xl"
        variants={welcomeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h1 className="text-5xl font-bold mb-6 text-gradient">
          Welcome to SAGE
        </h1>
        <p className="text-xl text-text-secondary mb-8 leading-relaxed">
          We're glad you decided to take a step towards productivity!
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          className="animate-pulse-slow"
        >
          Let's Begin
        </Button>
      </motion.div>
    </div>
  );
}
