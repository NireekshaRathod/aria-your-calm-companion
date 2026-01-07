import { motion } from 'framer-motion';

interface AriaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const AriaLogo = ({ size = 'md', animate = true }: AriaLogoProps) => {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-xl' },
    md: { container: 'w-24 h-24', text: 'text-3xl' },
    lg: { container: 'w-32 h-32', text: 'text-4xl' },
  };

  return (
    <motion.div
      className={`${sizes[size].container} relative flex items-center justify-center`}
      initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-aria-pink via-aria-lavender to-aria-purple opacity-30"
        animate={animate ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Main circle */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-aria-pink via-aria-lavender to-aria-purple shadow-lg"
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner circle */}
      <div className="absolute inset-4 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
        <span className={`${sizes[size].text} font-display font-bold aria-text-gradient`}>
          A
        </span>
      </div>

      {/* Floating particles */}
      {animate && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-aria-pink/50"
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i - 1) * 30],
            y: [0, -20 - i * 10],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </motion.div>
  );
};

export default AriaLogo;