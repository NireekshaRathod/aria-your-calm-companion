import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, PenLine, HeartHandshake } from 'lucide-react';
import AriaLogo from '@/components/AriaLogo';
import MoodButton from '@/components/MoodButton';
import MoodOptions from '@/components/MoodOptions';
import JournalEditor from '@/components/JournalEditor';
import SilentSupport from '@/components/SilentSupport';
import BottomNav from '@/components/BottomNav';
import { saveMood } from '@/lib/storage';

type ViewType = 'home' | 'emojis' | 'write' | 'silent' | 'mood-options';
type MoodType = 'happy' | 'okay' | 'sad' | 'stressed' | 'overwhelmed';

const Index = () => {
  const [view, setView] = useState<ViewType>('home');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleMoodSelect = (mood: MoodType) => {
    saveMood(mood);
    setSelectedMood(mood);
    setView('mood-options');
  };

  const handleBack = () => {
    if (view === 'mood-options') {
      setView('emojis');
      setSelectedMood(null);
    } else {
      setView('home');
    }
  };

  // Silent support mode
  if (view === 'silent') {
    return <SilentSupport onBack={() => setView('home')} />;
  }

  // Journal mode
  if (view === 'write') {
    return (
      <>
        <JournalEditor onBack={() => setView('home')} />
        <BottomNav />
      </>
    );
  }

  // Mood options after selecting emotion
  if (view === 'mood-options' && selectedMood) {
    return (
      <>
        <MoodOptions mood={selectedMood} onBack={handleBack} />
        <BottomNav />
      </>
    );
  }

  // Emoji selection screen
  if (view === 'emojis') {
    return (
      <>
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center px-4 pb-24 aria-gradient-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h2
            className="text-2xl font-semibold text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            How are you feeling?
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-4 max-w-sm">
            <MoodButton emoji="😊" label="Happy" mood="happy" onClick={() => handleMoodSelect('happy')} delay={0} />
            <MoodButton emoji="😐" label="Okay" mood="okay" onClick={() => handleMoodSelect('okay')} delay={0.1} />
            <MoodButton emoji="😔" label="Sad" mood="sad" onClick={() => handleMoodSelect('sad')} delay={0.2} />
            <MoodButton emoji="😰" label="Stressed" mood="stressed" onClick={() => handleMoodSelect('stressed')} delay={0.3} />
            <MoodButton emoji="🛑" label="Overwhelmed" mood="overwhelmed" onClick={() => handleMoodSelect('overwhelmed')} delay={0.4} />
          </div>

          <motion.button
            onClick={() => setView('home')}
            className="mt-8 text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Go back
          </motion.button>
        </motion.div>
        <BottomNav />
      </>
    );
  }

  // Home screen
  return (
    <>
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 aria-gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AriaLogo size="lg" />
        </motion.div>

        {/* App name */}
        <motion.h1
          className="text-4xl font-display font-bold aria-text-gradient mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          ARIA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-muted-foreground mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your gentle wellness companion
        </motion.p>

        {/* Main question */}
        <motion.h2
          className="text-2xl font-semibold text-center mt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          How are you feeling right now?
        </motion.h2>

        {/* Three main options */}
        <div className="w-full max-w-sm space-y-4">
          <motion.button
            onClick={() => setView('emojis')}
            className="w-full aria-card flex items-center gap-4 hover:shadow-lg transition-all touch-manipulation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-aria-peach to-aria-pink">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Emojis</h3>
              <p className="text-sm text-muted-foreground">Quick mood check-in</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setView('write')}
            className="w-full aria-card flex items-center gap-4 hover:shadow-lg transition-all touch-manipulation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-aria-lavender to-aria-purple">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Write / Voice It</h3>
              <p className="text-sm text-muted-foreground">Express through journaling</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setView('silent')}
            className="w-full aria-card flex items-center gap-4 hover:shadow-lg transition-all touch-manipulation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-aria-blue to-aria-mint">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Silent Support</h3>
              <p className="text-sm text-muted-foreground">Just be here with me</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default Index;