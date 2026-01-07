import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Heart, Volume2 } from 'lucide-react';
import { getRandomAffirmation } from '@/lib/affirmations';
import { saveAffirmation } from '@/lib/storage';
import { speak } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';

interface AffirmationsProps {
  mood?: string;
  onBack: () => void;
}

const Affirmations = ({ mood, onBack }: AffirmationsProps) => {
  const [affirmation, setAffirmation] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAffirmation(getRandomAffirmation(mood));
  }, [mood]);

  const handleNew = () => {
    setAffirmation(getRandomAffirmation(mood));
    setIsSaved(false);
  };

  const handleSave = () => {
    saveAffirmation(affirmation);
    setIsSaved(true);
    toast({
      title: "Affirmation saved",
      description: "You can find it in your history.",
    });
  };

  const handleSpeak = () => {
    speak(affirmation);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">Affirmations</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          className="aria-card text-center max-w-md"
          key={affirmation}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-medium text-foreground leading-relaxed">
            "{affirmation}"
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={handleSpeak}
              className="p-3 rounded-xl bg-secondary hover:bg-accent transition-colors touch-manipulation"
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleSave}
              className={`p-3 rounded-xl transition-all touch-manipulation ${
                isSaved
                  ? 'bg-aria-pink text-white'
                  : 'bg-secondary hover:bg-accent'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          onClick={handleNew}
          className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-card shadow-md hover:shadow-lg transition-all text-muted-foreground hover:text-foreground touch-manipulation"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RefreshCw className="w-4 h-4" />
          Show another
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Affirmations;