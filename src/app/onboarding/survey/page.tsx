'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const QUESTIONS = [
  {
    id: 'question_1_hours_per_day',
    question: 'How many hours per day do you typically work on focused tasks?',
    type: 'number' as const,
    placeholder: 'Enter hours (0-16)',
    min: 0,
    max: 16,
  },
  {
    id: 'question_2_time_loss',
    question: 'What time of day do you lose focus most often?',
    type: 'select' as const,
    options: ['Morning', 'Afternoon', 'Evening', 'Night', 'Varies'],
  },
  {
    id: 'question_3_main_distraction',
    question: 'What is your biggest distraction?',
    type: 'select' as const,
    options: ['Social Media', 'Phone Notifications', 'Email', 'Colleagues/Family', 'Other'],
  },
  {
    id: 'question_4_interruptions',
    question: 'How many times do you get interrupted during a typical work session?',
    type: 'number' as const,
    placeholder: 'Enter count (0-20)',
    min: 0,
    max: 20,
  },
  {
    id: 'question_5_productivity_rating',
    question: 'Rate your current productivity level (1-10)',
    type: 'number' as const,
    placeholder: 'Enter rating (1-10)',
    min: 1,
    max: 10,
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswer = (value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: question.type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: session.user.id,
          ...answers,
        });

      if (error) {
        console.error('Error saving survey:', error);
        alert('Failed to save survey. Please try again.');
        return;
      }

      // Redirect to ascendant selection
      router.push('/onboarding/ascendant');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = answers[question.id] !== undefined && answers[question.id] !== '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Tell Us About Your Focus</h1>
          <p className="text-text-secondary">
            This helps us personalize your experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-dark-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-teal to-accent-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-text-secondary text-sm mt-2 text-center">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 animate-slide-up">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

          {question.type === 'number' ? (
            <Input
              type="number"
              placeholder={question.placeholder}
              min={question.min}
              max={question.max}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="text-lg"
              autoFocus
            />
          ) : (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    answers[question.id] === option
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
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              Back
            </Button>

            {isLastQuestion ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!canProceed || isLoading}
                isLoading={isLoading}
              >
                Complete Survey
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/onboarding/ascendant')}
            className="text-text-secondary text-sm hover:text-white transition-colors"
          >
            Skip survey
          </button>
        </div>
      </div>
    </div>
  );
}
