import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Target, Heart } from 'lucide-react';
import { useCharacter, type CharacterId } from '../context/CharacterContext';
import { useAuth } from '../context/AuthContext';
import { CharacterSticker } from './CharacterSticker';

interface OnboardingProps {
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
}

const steps: OnboardingStep[] = [
  {
    id: 'companion',
    title: 'Choose Your Companion',
    description: 'Pick a buddy to focus with you',
    icon: Sparkles,
  },
  {
    id: 'session',
    title: 'Start First Focus Session',
    description: 'Begin your productivity journey',
    icon: Target,
  },
  {
    id: 'mood',
    title: 'Complete Mood Check-in',
    description: 'Track how you feel today',
    icon: Heart,
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const { allCharacters, setCharacter, character } = useCharacter();
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const displayName = profile?.display_name ?? 'there';

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleChooseCompanion = (id: CharacterId) => {
    setCharacter(id);
    handleCompleteStep('companion');
  };

  const handleStartSession = () => {
    handleCompleteStep('session');
  };

  const handleMoodCheckin = () => {
    handleCompleteStep('mood');
  };

  const allCompleted = completedSteps.size === steps.length;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4"
      style={{ background: 'linear-gradient(135deg, #FDF0F5 0%, #F0F4FF 50%, #EFF8F8 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f4aec055, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8e7dbe55, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.95)',
            boxShadow: '0 24px 80px rgba(142,125,190,0.18)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <CharacterSticker characterId={character.id} size={120} />
            </motion.div>
            <h1 className="text-3xl font-black text-[#5b3f8c] mb-2">
              Welcome to Pslyther, {displayName}!
            </h1>
            <p className="text-sm font-medium text-[#8e7dbe]">
              Let's get you set up in 3 quick steps
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, idx) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = idx === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        background: isCompleted ? '#4ade80' : isCurrent ? '#f4aec0' : '#e5e7eb',
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    >
                      {isCompleted ? (
                        <Check size={18} className="text-white" strokeWidth={3} />
                      ) : (
                        <Icon size={18} className={isCurrent ? 'text-white' : 'text-gray-400'} />
                      )}
                    </motion.div>
                    <span className="text-[10px] font-semibold text-center" style={{ color: isCompleted || isCurrent ? '#5b3f8c' : '#9ca3af' }}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#f4aec0] to-[#8e7dbe]"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="companion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold text-[#5b3f8c] mb-4 text-center">
                  Choose Your Companion
                </h2>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {allCharacters.map((char) => (
                    <motion.button
                      key={char.id}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChooseCompanion(char.id as CharacterId)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all"
                      style={{
                        borderColor: character.id === char.id ? char.accentFrom : 'transparent',
                        background: character.id === char.id ? `${char.accentFrom}22` : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      <CharacterSticker characterId={char.id} size={60} />
                      <span className="text-xs font-bold" style={{ color: char.textPrimary }}>
                        {char.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
                {completedSteps.has('companion') && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm font-semibold text-green-600"
                  >
                    Great choice! Moving to next step...
                  </motion.p>
                )}
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="session"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold text-[#5b3f8c] mb-4">
                  Start Your First Focus Session
                </h2>
                <p className="text-sm text-[#8e7dbe] mb-6">
                  Focus sessions help you track productivity and build streaks
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartSession}
                  className="px-8 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #f4aec0, #8e7dbe)',
                    boxShadow: '0 8px 24px rgba(142,125,190,0.3)',
                  }}
                >
                  Start Focus Session
                </motion.button>
                {completedSteps.has('session') && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm font-semibold text-green-600"
                  >
                    Session started! Moving to next step...
                  </motion.p>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold text-[#5b3f8c] mb-4">
                  How Are You Feeling?
                </h2>
                <p className="text-sm text-[#8e7dbe] mb-6">
                  Track your mood to get personalized insights
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Happy', 'Focused', 'Stressed', 'Tired'].map((mood) => (
                    <motion.button
                      key={mood}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMoodCheckin}
                      className="px-6 py-3 rounded-2xl font-semibold text-sm"
                      style={{
                        background: 'rgba(247,207,216,0.3)',
                        border: '1px solid rgba(247,207,216,0.6)',
                        color: '#5b3f8c',
                      }}
                    >
                      {mood}
                    </motion.button>
                  ))}
                </div>
                {completedSteps.has('mood') && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-green-600"
                  >
                    Mood recorded!
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete button */}
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-10 py-4 rounded-2xl font-bold text-white text-lg"
                style={{
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                }}
              >
                Start Using Pslyther
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
