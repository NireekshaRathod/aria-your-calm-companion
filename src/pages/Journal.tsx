import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Mic, MicOff, Save, Volume2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { saveJournal } from '@/lib/storage';
import { useVoice, speak } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';

const placeholders = [
  "What's on your mind today?",
  "How are you really feeling?",
  "Let your thoughts flow freely...",
  "No judgment here. Just write...",
  "This is your safe space...",
];

const Journal = () => {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [placeholder] = useState(placeholders[Math.floor(Math.random() * placeholders.length)]);
  const { toast } = useToast();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoice();

  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSave = () => {
    if (!content.trim()) return;
    saveJournal(content, undefined, isListening);
    setIsSaved(true);
    toast({
      title: "Journal saved 📝",
      description: "Your thoughts are safely stored.",
    });
  };

  const handleNew = () => {
    setContent('');
    setIsSaved(false);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReadBack = () => {
    if (content) {
      speak(content);
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen pb-24 aria-gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-aria-lavender to-aria-purple">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">Journal</h1>
        </div>

        <div className="px-4">
          <motion.div
            className="aria-card min-h-[50vh] flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isListening && (
              <motion.div
                className="flex items-center gap-2 mb-4 text-destructive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-medium">Recording...</span>
              </motion.div>
            )}

            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsSaved(false);
              }}
              placeholder={placeholder}
              className="flex-1 w-full bg-transparent resize-none text-lg focus:outline-none placeholder:text-muted-foreground/50"
              disabled={isSaved}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {content.length} characters
              </span>
              {content && (
                <button
                  onClick={handleReadBack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={handleVoiceToggle}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all touch-manipulation ${
                isListening
                  ? 'bg-destructive text-white'
                  : 'bg-card shadow-md hover:shadow-lg'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" /> Stop
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" /> Voice
                </>
              )}
            </motion.button>

            {!isSaved ? (
              <motion.button
                onClick={handleSave}
                className="flex-1 aria-button flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                disabled={!content.trim()}
              >
                <Save className="w-5 h-5" /> Save
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNew}
                className="flex-1 aria-button flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <PenLine className="w-5 h-5" /> New Entry
              </motion.button>
            )}
          </div>

          {isSaved && (
            <motion.p
              className="text-center text-primary mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Saved to history
            </motion.p>
          )}
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default Journal;