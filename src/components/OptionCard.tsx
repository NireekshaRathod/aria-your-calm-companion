import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OptionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
  delay?: number;
  highlighted?: boolean;
}

const OptionCard = ({ icon: Icon, title, description, onClick, delay = 0, highlighted = false }: OptionCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 touch-manipulation ${
        highlighted
          ? 'bg-gradient-to-br from-aria-pink to-aria-purple text-white shadow-lg'
          : 'bg-card hover:bg-accent shadow-md hover:shadow-lg'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${highlighted ? 'bg-white/20' : 'bg-secondary'}`}>
          <Icon className={`w-6 h-6 ${highlighted ? 'text-white' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className={`font-semibold ${highlighted ? 'text-white' : 'text-foreground'}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm ${highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default OptionCard;