'use client';

import { motion } from 'framer-motion';
import { messageVariants } from '@/lib/onboardingAnimations';
import { Button } from '@/components/ui/Button';

interface SolutionMessageProps {
  onContinue: () => void;
}

export function SolutionMessage({ onContinue }: SolutionMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <motion.div
        className="text-center max-w-2xl"
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="text-8xl mb-4">🌟</div>
        </motion.div>

        <h1 className="text-5xl font-bold mb-6 text-gradient">
          Don't Worry!
        </h1>

        <p className="text-2xl text-text-secondary mb-4 leading-relaxed">
          Your <span className="text-primary-teal font-semibold">Ascendants</span> are here to save you!
        </p>

        <p className="text-lg text-text-secondary mb-8">
          These mystical companions will guide you on your journey to peak focus and productivity.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            className="min-w-[250px]"
          >
            Meet Your Ascendants
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
