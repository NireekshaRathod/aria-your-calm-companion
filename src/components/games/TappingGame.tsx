import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Snowflake, Heart, Sparkles, Star, Cloud } from 'lucide-react';

type EffectType = 'snow' | 'hearts' | 'sparkles' | 'stars' | 'clouds';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: EffectType;
}

interface TappingGameProps {
  onBack: () => void;
}

const effectColors: Record<EffectType, string> = {
  snow: 'text-aria-blue',
  hearts: 'text-aria-pink',
  sparkles: 'text-aria-lavender',
  stars: 'text-aria-peach',
  clouds: 'text-aria-mint',
};

const effectIcons: Record<EffectType, typeof Snowflake> = {
  snow: Snowflake,
  hearts: Heart,
  sparkles: Sparkles,
  stars: Star,
  clouds: Cloud,
};

const TappingGame = ({ onBack }: TappingGameProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [effect, setEffect] = useState<EffectType>('snow');
  const [particleCount, setParticleCount] = useState(0);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Create multiple particles per tap
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: particleCount + i,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        type: effect,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
    setParticleCount(prev => prev + 8);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  }, [effect, particleCount]);

  const Icon = effectIcons[effect];

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
        <h2 className="text-lg font-semibold">Calming Tap</h2>
        <div className="w-10" />
      </div>

      {/* Effect selector */}
      <div className="flex justify-center gap-3 px-4 pb-4">
        {(Object.keys(effectIcons) as EffectType[]).map((type) => {
          const EffectIcon = effectIcons[type];
          return (
            <button
              key={type}
              onClick={() => setEffect(type)}
              className={`p-3 rounded-xl transition-all touch-manipulation ${
                effect === type
                  ? 'bg-gradient-to-br from-aria-pink to-aria-purple text-white shadow-lg scale-110'
                  : 'bg-card shadow-md'
              }`}
            >
              <EffectIcon className={`w-5 h-5 ${effect !== type ? effectColors[type] : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Tap area */}
      <div
        className="flex-1 relative overflow-hidden cursor-pointer bg-gradient-to-b from-secondary/50 to-accent/30 rounded-t-3xl mx-2 touch-manipulation"
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground text-lg">Tap anywhere</p>
        </div>

        <AnimatePresence>
          {particles.map((particle) => {
            const ParticleIcon = effectIcons[particle.type];
            return (
              <motion.div
                key={particle.id}
                className={`absolute pointer-events-none ${effectColors[particle.type]}`}
                initial={{ 
                  x: particle.x - 12, 
                  y: particle.y - 12, 
                  scale: 0, 
                  opacity: 1,
                  rotate: 0 
                }}
                animate={{
                  y: particle.y + 100 + Math.random() * 50,
                  scale: [0, 1.5, 1],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 + Math.random() * 0.5, ease: 'easeOut' }}
              >
                <ParticleIcon className="w-6 h-6 fill-current" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TappingGame;