import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';

interface FocusGameProps {
  onBack: () => void;
}

const FocusGame = ({ onBack }: FocusGameProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('Focus on the glowing orb');

  const orbPositions = [
    { x: '20%', y: '30%' },
    { x: '80%', y: '25%' },
    { x: '50%', y: '50%' },
    { x: '25%', y: '70%' },
    { x: '75%', y: '75%' },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * orbPositions.length);
      setActiveIndex(newIndex);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleOrbClick = (index: number) => {
    if (index === activeIndex) {
      setScore(prev => prev + 1);
      setMessage(['Well done!', 'Nice focus!', 'You found it!', 'Great awareness!'][Math.floor(Math.random() * 4)]);
      setActiveIndex(null);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Focus Flow</h2>
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">{score}</span>
        </div>
      </div>

      <div className="px-4 pb-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Game area */}
      <div className="flex-1 relative mx-4 mb-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-accent/30 overflow-hidden">
        {orbPositions.map((pos, index) => (
          <motion.button
            key={index}
            className={`absolute w-16 h-16 rounded-full transition-all duration-500 touch-manipulation -translate-x-1/2 -translate-y-1/2 ${
              activeIndex === index
                ? 'bg-gradient-to-br from-aria-pink to-aria-purple shadow-lg scale-110'
                : 'bg-card/50 shadow-md'
            }`}
            style={{ left: pos.x, top: pos.y }}
            onClick={() => handleOrbClick(index)}
            animate={
              activeIndex === index
                ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
                : { scale: 1 }
            }
            transition={{ repeat: activeIndex === index ? Infinity : 0, duration: 1.5 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <motion.button
              onClick={() => setIsPlaying(true)}
              className="aria-button"
              whileTap={{ scale: 0.95 }}
            >
              Start Focusing
            </motion.button>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground pb-4 px-4">
        Tap the glowing orb when it appears. Train your awareness gently.
      </p>
    </motion.div>
  );
};

export default FocusGame;