// ARIA Local Storage System
export interface MoodEntry {
  id: string;
  mood: 'happy' | 'okay' | 'sad' | 'stressed' | 'overwhelmed';
  timestamp: Date;
  note?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood?: string;
  timestamp: Date;
  isVoice?: boolean;
}

export interface Affirmation {
  id: string;
  text: string;
  savedAt: Date;
}

export interface Manifestation {
  id: string;
  intention: string;
  createdAt: Date;
}

export interface StudySubject {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyPlan {
  id: string;
  subjects: StudySubject[];
  hoursPerDay: number;
  isExamWeek: boolean;
  createdAt: Date;
}

export interface AriaSettings {
  darkMode: boolean;
  silentMode: boolean;
  notifications: {
    enabled: boolean;
    moodReminders: boolean;
    affirmations: boolean;
    studyNudges: boolean;
  };
}

const STORAGE_KEYS = {
  MOODS: 'aria_moods',
  JOURNALS: 'aria_journals',
  AFFIRMATIONS: 'aria_saved_affirmations',
  MANIFESTATIONS: 'aria_manifestations',
  STUDY_PLANS: 'aria_study_plans',
  SETTINGS: 'aria_settings',
};

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      // Convert date strings back to Date objects
      if (Array.isArray(parsed)) {
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp ? new Date(entry.timestamp) : undefined,
          savedAt: entry.savedAt ? new Date(entry.savedAt) : undefined,
          createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
        })) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Mood functions
export const saveMood = (mood: MoodEntry['mood'], note?: string): MoodEntry => {
  const entry: MoodEntry = {
    id: crypto.randomUUID(),
    mood,
    timestamp: new Date(),
    note,
  };
  const moods = getFromStorage<MoodEntry[]>(STORAGE_KEYS.MOODS, []);
  moods.unshift(entry);
  saveToStorage(STORAGE_KEYS.MOODS, moods);
  return entry;
};

export const getMoods = (): MoodEntry[] => {
  return getFromStorage<MoodEntry[]>(STORAGE_KEYS.MOODS, []);
};

// Journal functions
export const saveJournal = (content: string, mood?: string, isVoice = false): JournalEntry => {
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    content,
    mood,
    timestamp: new Date(),
    isVoice,
  };
  const journals = getFromStorage<JournalEntry[]>(STORAGE_KEYS.JOURNALS, []);
  journals.unshift(entry);
  saveToStorage(STORAGE_KEYS.JOURNALS, journals);
  return entry;
};

export const getJournals = (): JournalEntry[] => {
  return getFromStorage<JournalEntry[]>(STORAGE_KEYS.JOURNALS, []);
};

// Affirmation functions
export const saveAffirmation = (text: string): Affirmation => {
  const entry: Affirmation = {
    id: crypto.randomUUID(),
    text,
    savedAt: new Date(),
  };
  const affirmations = getFromStorage<Affirmation[]>(STORAGE_KEYS.AFFIRMATIONS, []);
  affirmations.unshift(entry);
  saveToStorage(STORAGE_KEYS.AFFIRMATIONS, affirmations);
  return entry;
};

export const getSavedAffirmations = (): Affirmation[] => {
  return getFromStorage<Affirmation[]>(STORAGE_KEYS.AFFIRMATIONS, []);
};

// Manifestation functions
export const saveManifestation = (intention: string): Manifestation => {
  const entry: Manifestation = {
    id: crypto.randomUUID(),
    intention,
    createdAt: new Date(),
  };
  const manifestations = getFromStorage<Manifestation[]>(STORAGE_KEYS.MANIFESTATIONS, []);
  manifestations.unshift(entry);
  saveToStorage(STORAGE_KEYS.MANIFESTATIONS, manifestations);
  return entry;
};

export const getManifestations = (): Manifestation[] => {
  return getFromStorage<Manifestation[]>(STORAGE_KEYS.MANIFESTATIONS, []);
};

// Study plan functions
export const saveStudyPlan = (plan: Omit<StudyPlan, 'id' | 'createdAt'>): StudyPlan => {
  const entry: StudyPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  const plans = getFromStorage<StudyPlan[]>(STORAGE_KEYS.STUDY_PLANS, []);
  plans.unshift(entry);
  saveToStorage(STORAGE_KEYS.STUDY_PLANS, plans);
  return entry;
};

export const getStudyPlans = (): StudyPlan[] => {
  return getFromStorage<StudyPlan[]>(STORAGE_KEYS.STUDY_PLANS, []);
};

// Settings functions
export const getSettings = (): AriaSettings => {
  return getFromStorage<AriaSettings>(STORAGE_KEYS.SETTINGS, {
    darkMode: false,
    silentMode: false,
    notifications: {
      enabled: true,
      moodReminders: true,
      affirmations: true,
      studyNudges: true,
    },
  });
};

export const saveSettings = (settings: AriaSettings): void => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

// Get all history
export const getAllHistory = () => {
  return {
    moods: getMoods(),
    journals: getJournals(),
    affirmations: getSavedAffirmations(),
    manifestations: getManifestations(),
    studyPlans: getStudyPlans(),
  };
};

// Get mood streak
export const getMoodStreak = (): number => {
  const moods = getMoods();
  if (moods.length === 0) return 0;
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const firstMoodDate = new Date(moods[0].timestamp);
  firstMoodDate.setHours(0, 0, 0, 0);
  
  if (firstMoodDate.getTime() !== today.getTime()) return 0;
  
  for (let i = 1; i < moods.length; i++) {
    const currentDate = new Date(moods[i].timestamp);
    currentDate.setHours(0, 0, 0, 0);
    
    const prevDate = new Date(moods[i - 1].timestamp);
    prevDate.setHours(0, 0, 0, 0);
    
    const diffDays = (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }
  
  return streak;
};