import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Palette } from 'lucide-react';

interface ColoringGameProps {
  onBack: () => void;
}

const colors = [
  'hsl(330, 70%, 75%)', // aria-pink
  'hsl(270, 60%, 80%)', // aria-lavender
  'hsl(280, 50%, 70%)', // aria-purple
  'hsl(220, 60%, 85%)', // aria-blue
  'hsl(20, 70%, 85%)',  // aria-peach
  'hsl(160, 50%, 85%)', // aria-mint
];

const patterns = [
  // Mandala pattern
  `M150,50 Q200,100 150,150 Q100,100 150,50 
   M150,50 Q150,20 180,50 Q150,80 150,50
   M150,50 Q120,50 150,20 Q150,50 150,50`,
  // Flower pattern
  `M150,150 C180,120 180,80 150,50 C120,80 120,120 150,150
   M150,150 C180,150 200,120 200,90 C200,150 180,150 150,150
   M150,150 C120,150 100,120 100,90 C100,150 120,150 150,150`,
  // Heart pattern
  `M150,180 C100,130 100,80 150,100 C200,80 200,130 150,180
   M150,80 C130,60 110,70 120,90 M150,80 C170,60 190,70 180,90`,
  // Wave pattern
  `M50,150 Q100,100 150,150 Q200,200 250,150
   M50,120 Q100,70 150,120 Q200,170 250,120
   M50,180 Q100,130 150,180 Q200,230 250,180`,
];

const ColoringGame = ({ onBack }: ColoringGameProps) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [strokes, setStrokes] = useState<Array<{ d: string; color: string }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentPath(`M${pos.x},${pos.y}`);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    setCurrentPath(prev => `${prev} L${pos.x},${pos.y}`);
  };

  const handleEnd = () => {
    if (isDrawing && currentPath) {
      setStrokes(prev => [...prev, { d: currentPath, color: selectedColor }]);
    }
    setIsDrawing(false);
    setCurrentPath('');
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentPath('');
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
        <h2 className="text-lg font-semibold">Mindful Coloring</h2>
        <button onClick={handleClear} className="p-2 rounded-xl hover:bg-secondary touch-manipulation">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Color palette */}
      <div className="flex justify-center gap-3 px-4 pb-4">
        <div className="flex items-center gap-2 mr-2">
          <Palette className="w-5 h-5 text-muted-foreground" />
        </div>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-xl transition-all touch-manipulation ${
              selectedColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl bg-card shadow-lg overflow-hidden touch-manipulation">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 300 300"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {/* Background pattern */}
          <g stroke="hsl(var(--border))" strokeWidth="1" fill="none" opacity="0.3">
            {patterns.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* User strokes */}
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={stroke.d}
              stroke={stroke.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.8"
            />
          ))}

          {/* Current stroke */}
          {currentPath && (
            <path
              d={currentPath}
              stroke={selectedColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.8"
            />
          )}
        </svg>
      </div>

      <p className="text-center text-sm text-muted-foreground pb-4">
        Draw freely. There are no rules here.
      </p>
    </motion.div>
  );
};

export default ColoringGame;