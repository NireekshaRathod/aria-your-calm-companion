import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Save, Trash2 } from 'lucide-react';
import { saveJournal } from '@/lib/storage';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';

interface JournalEditorProps {
  mood?: string;
  onBack: () => void;
  onSave?: () => void;
}

const placeholders: Record<string, string> = {
  happy: "What's making you feel good right now?",
  okay: "Just write what comes to mind...",
  sad: "You don't need to make sense, just express...",
  stressed: "Let it all out. No one else will see this...",
  overwhelmed: "One word at a time. No pressure...",
  default: "What's on your mind?",
};

const JournalEditor = ({ mood, onBack, onSave }: JournalEditorProps) => {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoice();

  const placeholder = placeholders[mood || 'default'] || placeholders.default;

  // Auto-save while typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content && !isSaved) {
        // Auto-save draft (optional)
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [content, isSaved]);

  // Update content from voice transcript
  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSave = () => {
    if (!content.trim()) return;
    saveJournal(content, mood, false);
    setIsSaved(true);
    toast({
      title: "Journal saved",
      description: "Your thoughts are safely stored.",
    });
    onSave?.();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClear = () => {
    setContent('');
    setIsSaved(false);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">Journal</h2>
        <div className="flex gap-2">
          {content && !isSaved && (
            <button
              onClick={handleClear}
              className="p-2 rounded-xl hover:bg-secondary touch-manipulation text-muted-foreground"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4">
        <motion.div
          className="aria-card flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsSaved(false);
            }}
            placeholder={placeholder}
            className="flex-1 w-full bg-transparent resize-none text-lg focus:outline-none placeholder:text-muted-foreground/50"
            autoFocus
            disabled={isSaved}
          />

          {/* Character count */}
          <div className="text-right text-sm text-muted-foreground mt-2">
            {content.length} characters
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <motion.button
            onClick={handleVoiceToggle}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all touch-manipulation ${
              isListening
                ? 'bg-destructive text-white animate-pulse'
                : 'bg-card shadow-md hover:shadow-lg'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" /> Voice Journal
              </>
            )}
          </motion.button>

          {!isSaved && (
            <motion.button
              onClick={handleSave}
              className="aria-button flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
              disabled={!content.trim()}
            >
              <Save className="w-5 h-5" /> Save
            </motion.button>
          )}
        </div>

        {isSaved && (
          <motion.p
            className="text-center text-primary mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✓ Saved to your history
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default JournalEditor;