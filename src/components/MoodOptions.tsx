import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  BookHeart,
  Sparkles,
  Gamepad2,
  Wind,
  Star,
  ArrowLeft,
} from 'lucide-react';
import OptionCard from '@/components/OptionCard';
import SupportMessage from '@/components/SupportMessage';
import JournalEditor from '@/components/JournalEditor';
import Affirmations from '@/components/Affirmations';
import GamesMenu from '@/components/games/GamesMenu';
import Meditation from '@/components/Meditation';
import Manifestation from '@/components/Manifestation';
import SilentSupport from '@/components/SilentSupport';

type MoodType = 'happy' | 'okay' | 'sad' | 'stressed' | 'overwhelmed';
type ViewType = 'message' | 'options' | 'journal' | 'affirmations' | 'games' | 'meditation' | 'manifestation' | 'silent';

interface MoodOptionsProps {
  mood: MoodType;
  onBack: () => void;
}

const moodOptions: Record<MoodType, { icon: any; title: string; description?: string; view: ViewType; highlighted?: boolean }[]> = {
  happy: [
    { icon: BookHeart, title: 'Journaling', description: 'Capture this feeling', view: 'journal' },
    { icon: Sparkles, title: 'Affirmations', description: 'Embrace positivity', view: 'affirmations' },
    { icon: Gamepad2, title: 'Relaxing Game', description: 'Keep the good vibes', view: 'games' },
    { icon: Wind, title: 'Light Meditation', description: 'Gentle grounding', view: 'meditation' },
    { icon: Star, title: 'Manifestation', description: 'Set an intention', view: 'manifestation' },
  ],
  okay: [
    { icon: BookHeart, title: 'Journaling', description: 'Express freely', view: 'journal' },
    { icon: Sparkles, title: 'Affirmations', description: 'Gentle reminders', view: 'affirmations' },
    { icon: Gamepad2, title: 'Relaxing Game', description: 'Light engagement', view: 'games' },
    { icon: Wind, title: 'Calm Breathing', description: 'Center yourself', view: 'meditation' },
    { icon: HeartHandshake, title: 'Silent Support', description: 'Just be', view: 'silent' },
  ],
  sad: [
    { icon: HeartHandshake, title: 'Silent Support', description: 'I\'m here with you', view: 'silent', highlighted: true },
    { icon: BookHeart, title: 'Journaling', description: 'Release what you feel', view: 'journal' },
    { icon: Sparkles, title: 'Affirmations', description: 'Gentle comfort', view: 'affirmations' },
    { icon: Gamepad2, title: 'Relaxing Game', description: 'Soft distraction', view: 'games' },
    { icon: Wind, title: 'Comfort Meditation', description: 'Warmth for your heart', view: 'meditation' },
  ],
  stressed: [
    { icon: Wind, title: 'Guided Breathing', description: 'Reduce overwhelm', view: 'meditation', highlighted: true },
    { icon: Gamepad2, title: 'Relaxing Game', description: 'Release tension', view: 'games' },
    { icon: BookHeart, title: 'Journaling', description: 'Let it out', view: 'journal' },
    { icon: Sparkles, title: 'Affirmations', description: 'Calm reminders', view: 'affirmations' },
    { icon: HeartHandshake, title: 'Silent Support', description: 'Just breathe', view: 'silent' },
  ],
  overwhelmed: [
    { icon: HeartHandshake, title: 'Silent Support', description: 'Nothing required', view: 'silent', highlighted: true },
  ],
};

const MoodOptions = ({ mood, onBack }: MoodOptionsProps) => {
  const [view, setView] = useState<ViewType>('message');
  const [showMessage, setShowMessage] = useState(true);

  const options = moodOptions[mood];

  // Overwhelmed mode - go straight to silent support
  if (mood === 'overwhelmed') {
    return <SilentSupport onBack={onBack} />;
  }

  if (view === 'journal') {
    return <JournalEditor mood={mood} onBack={() => setView('options')} />;
  }

  if (view === 'affirmations') {
    return <Affirmations mood={mood} onBack={() => setView('options')} />;
  }

  if (view === 'games') {
    return <GamesMenu onBack={() => setView('options')} />;
  }

  if (view === 'meditation') {
    return <Meditation mood={mood} onBack={() => setView('options')} />;
  }

  if (view === 'manifestation') {
    return <Manifestation onBack={() => setView('options')} />;
  }

  if (view === 'silent') {
    return <SilentSupport onBack={() => setView('options')} />;
  }

  return (
    <motion.div
      className="min-h-screen pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {showMessage ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <SupportMessage mood={mood} onDismiss={() => {
            setShowMessage(false);
            setView('options');
          }} />
        </div>
      ) : (
        <>
          <div className="p-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">What would you like?</h2>
          </div>

          <div className="px-4 space-y-3">
            {options.map((option, index) => (
              <OptionCard
                key={option.title}
                icon={option.icon}
                title={option.title}
                description={option.description}
                onClick={() => setView(option.view)}
                delay={index * 0.1}
                highlighted={option.highlighted}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MoodOptions;