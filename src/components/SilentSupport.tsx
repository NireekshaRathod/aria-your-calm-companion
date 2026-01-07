import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { silentSupportMessages } from '@/lib/affirmations';
import { speak } from '@/hooks/useVoice';

interface SilentSupportProps {
  onBack: () => void;
}

const SilentSupport = ({ onBack }: SilentSupportProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    // Rotate messages every 8 seconds
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % silentSupportMessages.length);
    }, 8000);

    // Show exit button after 5 seconds
    const timeout = setTimeout(() => setShowExit(true), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleSpeak = () => {
    speak(silentSupportMessages[messageIndex]);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 aria-gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient floating elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-aria-pink/10 to-aria-lavender/10 blur-2xl"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-sm">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-2xl font-medium text-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            onClick={handleSpeak}
          >
            {silentSupportMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>

        <motion.p
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Tap message to hear it
        </motion.p>
      </div>

      {/* Exit option */}
      <AnimatePresence>
        {showExit && (
          <motion.button
            onClick={onBack}
            className="absolute bottom-12 flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <X className="w-4 h-4" />
            Go back when ready
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SilentSupport;