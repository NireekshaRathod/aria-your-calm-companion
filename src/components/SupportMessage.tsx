import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { speak } from '@/hooks/useVoice';

interface SupportMessageProps {
  mood?: string;
  onDismiss?: () => void;
}

const moodMessages: Record<string, string[]> = {
  happy: [
    "That's wonderful! Your joy is contagious. ✨",
    "I'm so glad you're feeling good! Embrace this moment. 🌟",
    "Happiness suits you. What a beautiful feeling! 💖",
  ],
  okay: [
    "It's perfectly fine to feel okay. That's valid too. 🌸",
    "Neutral days are part of the journey. You're doing great. 💫",
    "Not every day needs to be extraordinary. Just being is enough. 🌿",
  ],
  sad: [
    "I'm here with you. It's okay to feel this way. 💙",
    "Sadness is a natural part of being human. Be gentle with yourself. 🫂",
    "You don't have to carry this alone. I'm right here. 💜",
  ],
  stressed: [
    "Take a deep breath. You've got this. 🌬️",
    "One thing at a time. No need to rush. 🌊",
    "Stress is temporary. Your strength is permanent. 💪",
  ],
  overwhelmed: [
    "You don't need to do anything right now. Just be. 🕊️",
    "Everything else can wait. Right now, just breathe. 🌙",
    "I'm here with you. Nothing else matters right now. 💫",
  ],
};

const SupportMessage = ({ mood = 'okay', onDismiss }: SupportMessageProps) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messages = moodMessages[mood] || moodMessages.okay;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    
    // Speak the message
    speak(randomMessage.replace(/[✨🌟💖🌸💫🌿💙🫂💜🌬️🌊💪🕊️🌙]/g, ''));
  }, [mood]);

  return (
    <AnimatePresence>
      <motion.div
        className="aria-card text-center max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-xl font-medium text-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
        
        {onDismiss && (
          <motion.button
            onClick={onDismiss}
            className="mt-6 text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Continue
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SupportMessage;