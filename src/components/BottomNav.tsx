import { Home, BookHeart, GraduationCap, History, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookHeart, label: 'Journal', path: '/journal' },
  { icon: GraduationCap, label: 'Study', path: '/study' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border safe-area-inset"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 touch-manipulation"
            >
              <motion.div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-aria-pink to-aria-purple text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;