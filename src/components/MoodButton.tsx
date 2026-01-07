import { motion } from 'framer-motion';

interface MoodButtonProps {
  emoji: string;
  label: string;
  mood: string;
  onClick: () => void;
  delay?: number;
}

const MoodButton = ({ emoji, label, mood, onClick, delay = 0 }: MoodButtonProps) => {
  const moodColors: Record<string, string> = {
    happy: 'from-aria-peach to-aria-pink',
    okay: 'from-aria-mint to-aria-blue',
    sad: 'from-aria-blue to-aria-lavender',
    stressed: 'from-aria-lavender to-aria-purple',
    overwhelmed: 'from-aria-purple to-primary',
  };

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 touch-manipulation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${moodColors[mood]} flex items-center justify-center shadow-lg transition-shadow hover:shadow-xl`}
      >
        <span className="text-3xl sm:text-4xl">{emoji}</span>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </motion.button>
  );
};

export default MoodButton;