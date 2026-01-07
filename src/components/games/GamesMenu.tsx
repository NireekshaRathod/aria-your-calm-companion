import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Wind, Gamepad2, Palette, Eye } from 'lucide-react';
import OptionCard from '@/components/OptionCard';
import TappingGame from './TappingGame';
import BreathingGame from './BreathingGame';
import SnakeGame from './SnakeGame';
import ColoringGame from './ColoringGame';
import FocusGame from './FocusGame';

interface GamesMenuProps {
  onBack: () => void;
}

type GameType = 'menu' | 'tapping' | 'breathing' | 'snake' | 'coloring' | 'focus';

const GamesMenu = ({ onBack }: GamesMenuProps) => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  if (currentGame === 'tapping') {
    return <TappingGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'breathing') {
    return <BreathingGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'snake') {
    return <SnakeGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'coloring') {
    return <ColoringGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'focus') {
    return <FocusGame onBack={() => setCurrentGame('menu')} />;
  }

  return (
    <motion.div
      className="min-h-screen pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">Relaxing Games</h2>
      </div>

      <div className="px-4 space-y-3">
        <OptionCard
          icon={Sparkles}
          title="Calming Tap"
          description="Tap to create snow, hearts, sparkles & more"
          onClick={() => setCurrentGame('tapping')}
          delay={0}
        />
        <OptionCard
          icon={Wind}
          title="Breathing Guide"
          description="Follow the rhythm to calm your mind"
          onClick={() => setCurrentGame('breathing')}
          delay={0.1}
        />
        <OptionCard
          icon={Gamepad2}
          title="Gentle Snake"
          description="A calm, no-pressure snake game"
          onClick={() => setCurrentGame('snake')}
          delay={0.2}
        />
        <OptionCard
          icon={Palette}
          title="Mindful Coloring"
          description="Draw and color freely"
          onClick={() => setCurrentGame('coloring')}
          delay={0.3}
        />
        <OptionCard
          icon={Eye}
          title="Focus Flow"
          description="Train awareness with gentle focus"
          onClick={() => setCurrentGame('focus')}
          delay={0.4}
        />
      </div>
    </motion.div>
  );
};

export default GamesMenu;