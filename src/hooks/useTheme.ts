import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '@/lib/storage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => getSettings().darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      const settings = getSettings();
      saveSettings({ ...settings, darkMode: newValue });
      return newValue;
    });
  };

  return { isDark, toggleTheme };
};