import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Volume2, Info, Heart, Download } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getSettings, saveSettings, AriaSettings } from '@/lib/storage';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [settings, setSettings] = useState<AriaSettings>(getSettings());
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: isDark }));
  }, [isDark]);

  const updateSettings = (updates: Partial<AriaSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateNotifications = (updates: Partial<AriaSettings['notifications']>) => {
    const newNotifications = { ...settings.notifications, ...updates };
    updateSettings({ notifications: newNotifications });
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not supported",
        description: "Notifications aren't supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateNotifications({ enabled: true });
      toast({
        title: "Notifications enabled! 🔔",
        description: "You'll receive gentle reminders.",
      });
      
      // Send a test notification
      new Notification("ARIA is here for you 💜", {
        body: "You'll receive gentle check-ins and affirmations.",
        icon: '/favicon.ico',
      });
    } else {
      toast({
        title: "Permission denied",
        description: "You can enable notifications in browser settings.",
        variant: "destructive",
      });
    }
  };

  const handleInstallPWA = () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      toast({
        title: "Install ARIA",
        description: "Use your browser menu to 'Add to Home Screen'",
      });
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen pb-24 aria-gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-aria-purple to-primary">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <div className="px-4 space-y-4">
          {/* Appearance */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold mb-4">Appearance</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {isDark ? 'Calm dark theme' : 'Light and airy'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full transition-all ${
                  isDark ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white shadow-md"
                  animate={{ x: isDark ? 28 : 4 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Notifications</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.notifications.enabled ? (
                    <Bell className="w-5 h-5" />
                  ) : (
                    <BellOff className="w-5 h-5" />
                  )}
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Gentle check-ins & reminders
                    </p>
                  </div>
                </div>
                <button
                  onClick={requestNotificationPermission}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.notifications.enabled ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                    animate={{ x: settings.notifications.enabled ? 28 : 4 }}
                  />
                </button>
              </div>

              {settings.notifications.enabled && (
                <motion.div
                  className="pl-8 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Mood reminders</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.moodReminders}
                      onChange={(e) => updateNotifications({ moodReminders: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Affirmations</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.affirmations}
                      onChange={(e) => updateNotifications({ affirmations: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Study nudges</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.studyNudges}
                      onChange={(e) => updateNotifications({ studyNudges: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </label>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Silent Mode */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5" />
                <div>
                  <p className="font-medium">Silent Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Minimal interactions, maximum peace
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ silentMode: !settings.silentMode })}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.silentMode ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white shadow-md"
                  animate={{ x: settings.silentMode ? 28 : 4 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Install */}
          <motion.button
            onClick={handleInstallPWA}
            className="w-full aria-card flex items-center gap-4 hover:shadow-lg transition-all touch-manipulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">Install ARIA</p>
              <p className="text-sm text-muted-foreground">Add to your home screen</p>
            </div>
          </motion.button>

          {/* About */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5" />
              <h3 className="font-semibold">About ARIA</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ARIA is your gentle emotional wellness companion. Built with care to help you navigate your feelings, one moment at a time.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Heart className="w-4 h-4 fill-current" />
              <span>Made with love for your wellbeing</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default Settings;