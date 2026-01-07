import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { saveManifestation } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ManifestationProps {
  onBack: () => void;
}

const placeholders = [
  "I want to feel calm today...",
  "I intend to be kinder to myself...",
  "I choose peace over worry...",
  "I welcome joy into my life...",
];

const Manifestation = ({ onBack }: ManifestationProps) => {
  const [intention, setIntention] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!intention.trim()) return;
    saveManifestation(intention);
    setIsSaved(true);
    toast({
      title: "Intention set ✨",
      description: "Your manifestation has been saved.",
    });
  };

  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];

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
        <h2 className="text-xl font-semibold">Set Intention</h2>
      </div>

      <div className="flex-1 flex flex-col px-4">
        <motion.div
          className="aria-card flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              What do you want to manifest today?
            </span>
          </div>

          <textarea
            value={intention}
            onChange={(e) => {
              setIntention(e.target.value);
              setIsSaved(false);
            }}
            placeholder={placeholder}
            className="flex-1 w-full bg-transparent resize-none text-lg focus:outline-none placeholder:text-muted-foreground/50"
            disabled={isSaved}
          />
        </motion.div>

        {!isSaved ? (
          <motion.button
            onClick={handleSave}
            className="aria-button mt-4 w-full"
            whileTap={{ scale: 0.98 }}
            disabled={!intention.trim()}
          >
            Set My Intention
          </motion.button>
        ) : (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-lg font-medium text-primary">✨ Intention Set ✨</p>
            <button
              onClick={onBack}
              className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              Go back
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Manifestation;