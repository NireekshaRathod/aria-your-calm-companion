import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface BreathingGameProps {
  onBack: () => void;
}

const BreathingGame = ({ onBack }: BreathingGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [seconds, setSeconds] = useState(4);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  };

  const phaseMessages = {
    inhale: 'Breathe in...',
    hold: 'Hold...',
    exhale: 'Breathe out...',
    rest: 'Rest...',
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // Move to next phase
          setPhase(current => {
            const phases: typeof phase[] = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(current);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            return nextPhase;
          });
          return phaseDurations[
            (['inhale', 'hold', 'exhale', 'rest'] as const)[
              (['inhale', 'hold', 'exhale', 'rest'].indexOf(phase) + 1) % 4
            ]
          ];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, phase]);

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
      case 'rest':
        return 1;
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Breathing Guide</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Breathing circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-aria-pink/30 to-aria-lavender/30"
            animate={{ scale: isPlaying ? getCircleScale() : 1 }}
            transition={{ duration: phaseDurations[phase], ease: 'easeInOut' }}
          />
          
          {/* Main circle */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-aria-pink via-aria-lavender to-aria-purple shadow-lg"
            animate={{ scale: isPlaying ? getCircleScale() : 1 }}
            transition={{ duration: phaseDurations[phase], ease: 'easeInOut' }}
          />
          
          {/* Inner content */}
          <div className="relative z-10 text-center text-white">
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                className="text-xl font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isPlaying ? phaseMessages[phase] : 'Ready?'}
              </motion.p>
            </AnimatePresence>
            {isPlaying && (
              <motion.p
                className="text-4xl font-bold mt-2"
                key={seconds}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {seconds}
              </motion.p>
            )}
          </div>
        </div>

        {/* Controls */}
        <motion.button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              setPhase('inhale');
              setSeconds(phaseDurations.inhale);
            }
          }}
          className="aria-button flex items-center gap-3"
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> Start
            </>
          )}
        </motion.button>

        <p className="text-muted-foreground text-sm mt-6 text-center max-w-xs">
          Follow the circle. Breathe in as it grows, hold, then release as it shrinks.
        </p>
      </div>
    </motion.div>
  );
};

export default BreathingGame;