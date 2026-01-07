import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wind } from 'lucide-react';

interface MeditationProps {
  mood?: string;
  onBack: () => void;
}

const meditations = {
  default: {
    title: 'Grounding Moment',
    duration: 60,
    steps: [
      { text: 'Find a comfortable position.', duration: 5 },
      { text: 'Close your eyes gently.', duration: 5 },
      { text: 'Take a deep breath in...', duration: 4 },
      { text: 'And slowly release.', duration: 6 },
      { text: 'Feel your body settle.', duration: 8 },
      { text: 'Notice any tension... and let it go.', duration: 10 },
      { text: 'Breathe naturally now.', duration: 10 },
      { text: 'You are present. You are calm.', duration: 8 },
      { text: 'When ready, open your eyes slowly.', duration: 4 },
    ],
  },
  stressed: {
    title: 'Calm Reset',
    duration: 90,
    steps: [
      { text: 'Pause everything. Just for now.', duration: 6 },
      { text: 'Place your hand on your heart.', duration: 5 },
      { text: 'Feel it beating. You are alive.', duration: 8 },
      { text: 'Breathe in calm...', duration: 5 },
      { text: 'Breathe out tension.', duration: 7 },
      { text: 'Nothing needs solving right now.', duration: 10 },
      { text: 'Just breathe. Just be.', duration: 15 },
      { text: 'You are handling this moment.', duration: 10 },
      { text: 'And that is enough.', duration: 8 },
      { text: 'Gently return when ready.', duration: 6 },
    ],
  },
  sad: {
    title: 'Comfort Meditation',
    duration: 90,
    steps: [
      { text: 'It\'s okay to feel what you feel.', duration: 6 },
      { text: 'Allow yourself this moment.', duration: 6 },
      { text: 'Wrap your arms around yourself.', duration: 5 },
      { text: 'Give yourself a gentle hug.', duration: 8 },
      { text: 'You deserve comfort.', duration: 8 },
      { text: 'Breathe warmth into your heart.', duration: 10 },
      { text: 'This feeling is temporary.', duration: 10 },
      { text: 'You are not alone.', duration: 10 },
      { text: 'Kindness flows to you now.', duration: 10 },
      { text: 'Rest here as long as you need.', duration: 7 },
    ],
  },
};

const Meditation = ({ mood, onBack }: MeditationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const meditation = mood && meditations[mood as keyof typeof meditations]
    ? meditations[mood as keyof typeof meditations]
    : meditations.default;

  const startMeditation = () => {
    setIsPlaying(true);
    setStepIndex(0);
    playStep(0);
  };

  const playStep = (index: number) => {
    if (index >= meditation.steps.length) {
      setIsPlaying(false);
      return;
    }

    setStepIndex(index);
    const step = meditation.steps[index];
    
    // Progress animation
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;
      setProgress((elapsed / (step.duration * 1000)) * 100);
      
      if (elapsed >= step.duration * 1000) {
        clearInterval(interval);
        playStep(index + 1);
      }
    }, 100);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">{meditation.title}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {!isPlaying ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-aria-lavender to-aria-purple flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Wind className="w-12 h-12 text-white" />
            </motion.div>

            <p className="text-muted-foreground mb-6">
              ~{Math.ceil(meditation.duration / 60)} min guided experience
            </p>

            <motion.button
              onClick={startMeditation}
              className="aria-button"
              whileTap={{ scale: 0.95 }}
            >
              Begin
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="text-center max-w-sm"
            key={stepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl font-medium text-foreground leading-relaxed">
              {meditation.steps[stepIndex].text}
            </p>

            {/* Progress bar */}
            <div className="mt-12 w-48 h-1 mx-auto bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-aria-pink to-aria-purple"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Step {stepIndex + 1} of {meditation.steps.length}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Meditation;