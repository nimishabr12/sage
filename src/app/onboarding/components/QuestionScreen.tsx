'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { questionVariants } from '@/lib/onboardingAnimations';
import { Button } from '@/components/ui/Button';

export type QuestionType = 'slider' | 'radio' | 'multiselect';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
}

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  canProceed: boolean;
}

export function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onBack,
  canGoBack,
  canProceed,
}: QuestionScreenProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-dark-card rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-teal to-accent-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-text-secondary text-sm mt-2 text-center">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

            {/* Slider Input */}
            {question.type === 'slider' && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-primary-teal">
                    {answer || question.min || 0}
                  </span>
                  {question.unit && (
                    <span className="text-2xl text-text-secondary ml-2">{question.unit}</span>
                  )}
                </div>
                <input
                  type="range"
                  min={question.min || 0}
                  max={question.max || 10}
                  step={question.step || 1}
                  value={answer || question.min || 0}
                  onChange={(e) => onAnswer(Number(e.target.value))}
                  className="w-full h-3 bg-dark-card rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-teal
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary-teal/50
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary-teal [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg
                    [&::-moz-range-thumb]:shadow-primary-teal/50"
                  style={{
                    background: `linear-gradient(to right, #0F766E 0%, #0F766E ${
                      ((answer || question.min || 0) / (question.max || 10)) * 100
                    }%, #252525 ${((answer || question.min || 0) / (question.max || 10)) * 100}%, #252525 100%)`,
                  }}
                />
              </div>
            )}

            {/* Radio/Select Options */}
            {(question.type === 'radio' || question.type === 'multiselect') && (
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (question.type === 'multiselect') {
                        const current = Array.isArray(answer) ? answer : [];
                        if (current.includes(option)) {
                          onAnswer(current.filter((o: string) => o !== option));
                        } else {
                          onAnswer([...current, option]);
                        }
                      } else {
                        onAnswer(option);
                      }
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      question.type === 'multiselect'
                        ? Array.isArray(answer) && answer.includes(option)
                          ? 'border-primary-teal bg-primary-teal/10 text-white'
                          : 'border-white/10 hover:border-white/30 text-text-secondary hover:text-white'
                        : answer === option
                        ? 'border-primary-teal bg-primary-teal/10 text-white'
                        : 'border-white/10 hover:border-white/30 text-text-secondary hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={onBack}
                disabled={!canGoBack}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={onNext}
                disabled={!canProceed}
              >
                {currentIndex === totalQuestions - 1 ? 'Continue' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
