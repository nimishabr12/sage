'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { OrbAnimation } from './components/OrbAnimation';
import { AscendantsFlythrough } from './components/AscendantsFlythrough';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionScreen, Question } from './components/QuestionScreen';
import { StatsScreen } from './components/StatsScreen';
import { SolutionMessage } from './components/SolutionMessage';
import { AscendantSelection } from './components/AscendantSelection';

type OnboardingStage =
  | 'orb'
  | 'flythrough'
  | 'welcome'
  | 'questions'
  | 'stats'
  | 'solution'
  | 'selection';

const QUESTIONS: Question[] = [
  {
    id: 'question_1_hours_per_day',
    question: 'How many hours per day do you spend online (social media, browsing, etc.)?',
    type: 'slider',
    min: 0,
    max: 16,
    step: 0.5,
    unit: 'hours',
  },
  {
    id: 'question_2_time_loss',
    question: 'How often do you feel distracted or lose focus?',
    type: 'radio',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'],
  },
  {
    id: 'question_3_main_distraction',
    question: 'What distracts you the most?',
    type: 'multiselect',
    options: ['Social Media', 'News Sites', 'Games', 'Email', 'Other'],
  },
  {
    id: 'question_4_interruptions',
    question: 'How many times do you get interrupted during a typical work session?',
    type: 'slider',
    min: 0,
    max: 20,
    step: 1,
    unit: 'times',
  },
  {
    id: 'question_5_productivity_rating',
    question: 'Rate your current productivity level',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stage, setStage] = useState<OnboardingStage>('orb');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Don't render until we've checked authentication
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

  const handleAnswer = (answer: any) => {
    const question = QUESTIONS[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [question.id]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStage('stats');
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== null;

  // Get user's hours per day for stats screen
  const userHoursPerDay = answers['question_1_hours_per_day'] || 0;

  return (
    <AnimatePresence mode="wait">
      {stage === 'orb' && (
        <OrbAnimation
          key="orb"
          onComplete={() => setStage('flythrough')}
        />
      )}

      {stage === 'flythrough' && (
        <AscendantsFlythrough
          key="flythrough"
          onComplete={() => setStage('welcome')}
        />
      )}

      {stage === 'welcome' && (
        <WelcomeScreen
          key="welcome"
          onContinue={() => setStage('questions')}
        />
      )}

      {stage === 'questions' && (
        <QuestionScreen
          key={`question-${currentQuestionIndex}`}
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={QUESTIONS.length}
          answer={currentAnswer}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          onBack={handleBackQuestion}
          canGoBack={currentQuestionIndex > 0}
          canProceed={canProceed}
        />
      )}

      {stage === 'stats' && (
        <StatsScreen
          key="stats"
          userHoursPerDay={userHoursPerDay}
          onContinue={() => setStage('solution')}
        />
      )}

      {stage === 'solution' && (
        <SolutionMessage
          key="solution"
          onContinue={() => setStage('selection')}
        />
      )}

      {stage === 'selection' && (
        <AscendantSelection
          key="selection"
          answers={answers}
        />
      )}
    </AnimatePresence>
  );
}
