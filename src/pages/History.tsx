import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, BookHeart, Sparkles, Star, Smile, Calendar, Volume2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getAllHistory, MoodEntry, JournalEntry, Affirmation, Manifestation } from '@/lib/storage';
import { speak } from '@/hooks/useVoice';
import { format } from 'date-fns';

type TabType = 'all' | 'moods' | 'journals' | 'affirmations' | 'manifestations';

const moodEmojis: Record<string, string> = {
  happy: '😊',
  okay: '😐',
  sad: '😔',
  stressed: '😰',
  overwhelmed: '🛑',
};

const History = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [history, setHistory] = useState(getAllHistory());

  useEffect(() => {
    setHistory(getAllHistory());
  }, []);

  const tabs = [
    { id: 'all', label: 'All', icon: HistoryIcon },
    { id: 'moods', label: 'Moods', icon: Smile },
    { id: 'journals', label: 'Journals', icon: BookHeart },
    { id: 'affirmations', label: 'Saved', icon: Sparkles },
    { id: 'manifestations', label: 'Intentions', icon: Star },
  ];

  const getAllItems = () => {
    const items: Array<{ type: string; data: any; timestamp: Date }> = [];

    history.moods.forEach(m => items.push({ type: 'mood', data: m, timestamp: new Date(m.timestamp) }));
    history.journals.forEach(j => items.push({ type: 'journal', data: j, timestamp: new Date(j.timestamp) }));
    history.affirmations.forEach(a => items.push({ type: 'affirmation', data: a, timestamp: new Date(a.savedAt) }));
    history.manifestations.forEach(m => items.push({ type: 'manifestation', data: m, timestamp: new Date(m.createdAt) }));

    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const renderMood = (mood: MoodEntry) => (
    <motion.div
      className="aria-card flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-3xl">{moodEmojis[mood.mood]}</span>
      <div className="flex-1">
        <p className="font-medium capitalize">{mood.mood}</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(mood.timestamp), 'MMM d, yyyy • h:mm a')}
        </p>
      </div>
    </motion.div>
  );

  const renderJournal = (journal: JournalEntry) => (
    <motion.div
      className="aria-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(journal.timestamp), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>
        <button
          onClick={() => speak(journal.content)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-foreground line-clamp-4">{journal.content}</p>
      {journal.isVoice && (
        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
          🎤 Voice entry
        </span>
      )}
    </motion.div>
  );

  const renderAffirmation = (affirmation: Affirmation) => (
    <motion.div
      className="aria-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-aria-pink" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(affirmation.savedAt), 'MMM d, yyyy')}
          </span>
        </div>
        <button
          onClick={() => speak(affirmation.text)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-foreground italic">"{affirmation.text}"</p>
    </motion.div>
  );

  const renderManifestation = (manifestation: Manifestation) => (
    <motion.div
      className="aria-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-aria-peach" />
        <span className="text-sm text-muted-foreground">
          {format(new Date(manifestation.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
      <p className="text-foreground">✨ {manifestation.intention}</p>
    </motion.div>
  );

  const renderItem = (item: { type: string; data: any }) => {
    switch (item.type) {
      case 'mood':
        return renderMood(item.data);
      case 'journal':
        return renderJournal(item.data);
      case 'affirmation':
        return renderAffirmation(item.data);
      case 'manifestation':
        return renderManifestation(item.data);
      default:
        return null;
    }
  };

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'moods':
        return history.moods.map(m => ({ type: 'mood', data: m, timestamp: new Date(m.timestamp) }));
      case 'journals':
        return history.journals.map(j => ({ type: 'journal', data: j, timestamp: new Date(j.timestamp) }));
      case 'affirmations':
        return history.affirmations.map(a => ({ type: 'affirmation', data: a, timestamp: new Date(a.savedAt) }));
      case 'manifestations':
        return history.manifestations.map(m => ({ type: 'manifestation', data: m, timestamp: new Date(m.createdAt) }));
      default:
        return getAllItems();
    }
  };

  const items = getFilteredItems();

  return (
    <>
      <motion.div
        className="min-h-screen pb-24 aria-gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-aria-peach to-aria-pink">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">History</h1>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all touch-manipulation ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-aria-pink to-aria-purple text-white'
                      : 'bg-card shadow-md'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-4">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-muted-foreground">Nothing here yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your memories will appear here.
                </p>
              </motion.div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.type}-${index}`}>
                  {renderItem(item)}
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default History;