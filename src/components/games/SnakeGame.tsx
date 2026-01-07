import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onBack: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 12;
const CELL_SIZE = 24;

const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 6, y: 6 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef(direction);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 6, y: 6 }]);
    setFood({ x: 3, y: 3 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        let newHead: Position;

        switch (directionRef.current) {
          case 'UP':
            newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE };
            break;
          case 'LEFT':
            newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y };
            break;
        }

        // Check self collision
        if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          return newSnake;
        }

        return newSnake.slice(0, -1);
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, generateFood]);

  const handleTouch = useCallback((e: React.TouchEvent, type: 'start' | 'end') => {
    if (type === 'start') {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (type === 'end' && touchStartRef.current) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && directionRef.current !== 'LEFT') setDirection('RIGHT');
        else if (dx < -30 && directionRef.current !== 'RIGHT') setDirection('LEFT');
      } else {
        if (dy > 30 && directionRef.current !== 'UP') setDirection('DOWN');
        else if (dy < -30 && directionRef.current !== 'DOWN') setDirection('UP');
      }
    }
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Gentle Snake</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <p className="text-sm text-muted-foreground mb-4">
          Swipe to guide the snake. No rush, just flow.
        </p>

        {/* Game board */}
        <div
          className="relative rounded-2xl bg-gradient-to-br from-secondary to-accent/50 p-2 shadow-lg touch-manipulation"
          style={{ width: GRID_SIZE * CELL_SIZE + 16, height: GRID_SIZE * CELL_SIZE + 16 }}
          onTouchStart={(e) => handleTouch(e, 'start')}
          onTouchEnd={(e) => handleTouch(e, 'end')}
        >
          <div
            className="relative rounded-xl bg-card/50 overflow-hidden"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid lines */}
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-border/20"
                style={{ left: i * CELL_SIZE, top: 0, width: 1, height: '100%' }}
              />
            ))}
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-border/20"
                style={{ left: 0, top: i * CELL_SIZE, width: '100%', height: 1 }}
              />
            ))}

            {/* Food */}
            <motion.div
              className="absolute rounded-full bg-gradient-to-br from-aria-peach to-aria-pink"
              style={{
                left: food.x * CELL_SIZE + 2,
                top: food.y * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Snake */}
            {snake.map((segment, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-lg ${
                  i === 0
                    ? 'bg-gradient-to-br from-aria-purple to-aria-lavender'
                    : 'bg-gradient-to-br from-aria-lavender to-aria-blue'
                }`}
                style={{
                  left: segment.x * CELL_SIZE + 2,
                  top: segment.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
            ))}
          </div>

          {/* Game over overlay */}
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Nice try! 🌟</p>
                <p className="text-sm text-muted-foreground">Length: {snake.length}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          {!isPlaying && !gameOver && (
            <motion.button
              onClick={() => setIsPlaying(true)}
              className="aria-button flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" /> Start
            </motion.button>
          )}
          {(gameOver || isPlaying) && (
            <motion.button
              onClick={resetGame}
              className="aria-button flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SnakeGame;