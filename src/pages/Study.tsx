import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Clock, CalendarCheck, BookOpen } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { saveStudyPlan, getStudyPlans, StudySubject, StudyPlan } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type DifficultyType = 'easy' | 'medium' | 'hard';

const difficultyColors: Record<DifficultyType, string> = {
  easy: 'bg-aria-mint text-foreground',
  medium: 'bg-aria-peach text-foreground',
  hard: 'bg-aria-pink text-foreground',
};

const Study = () => {
  const [isExamWeek, setIsExamWeek] = useState(false);
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [showPlan, setShowPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const { toast } = useToast();

  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: newSubject, difficulty: 'medium' },
    ]);
    setNewSubject('');
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateDifficulty = (id: string, difficulty: DifficultyType) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, difficulty } : s))
    );
  };

  const generatePlan = () => {
    if (subjects.length === 0) {
      toast({
        title: "No subjects added",
        description: "Add at least one subject to create a plan.",
        variant: "destructive",
      });
      return;
    }

    const plan = saveStudyPlan({
      subjects,
      hoursPerDay,
      isExamWeek,
    });

    setCurrentPlan(plan);
    setShowPlan(true);
    toast({
      title: "Study plan created! 📚",
      description: "Your personalized plan is ready.",
    });
  };

  const calculateStudyTime = (subject: StudySubject): number => {
    const weights = { easy: 1, medium: 2, hard: 3 };
    const totalWeight = subjects.reduce((sum, s) => sum + weights[s.difficulty], 0);
    const subjectWeight = weights[subject.difficulty];
    return Math.round((subjectWeight / totalWeight) * hoursPerDay * 60);
  };

  if (showPlan && currentPlan) {
    return (
      <>
        <motion.div
          className="min-h-screen pb-24 aria-gradient-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-aria-lavender to-aria-purple">
                <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold">Your Plan</h1>
            </div>
            <button
              onClick={() => setShowPlan(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Edit
            </button>
          </div>

          <div className="px-4 space-y-4">
            {isExamWeek && (
              <motion.div
                className="p-4 rounded-2xl bg-aria-pink/20 border border-aria-pink/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm font-medium text-foreground">
                  📚 Exam Week Mode Active
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Extra focus time allocated. Remember to take breaks!
                </p>
              </motion.div>
            )}

            <motion.div
              className="aria-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Daily Schedule
              </h3>

              <div className="space-y-3">
                {currentPlan.subjects.map((subject, index) => {
                  const minutes = calculateStudyTime(subject);
                  return (
                    <motion.div
                      key={subject.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[subject.difficulty]}`}>
                          {subject.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {minutes} min
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total daily study time: <strong>{hoursPerDay} hours</strong>
                </p>
              </div>
            </motion.div>

            <motion.div
              className="aria-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold mb-3">💡 Gentle Reminders</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take a 5-min break every 25 minutes</li>
                <li>• Stay hydrated and snack healthy</li>
                <li>• It's okay to adjust this plan as needed</li>
                <li>• Your wellbeing comes first</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="min-h-screen pb-24 aria-gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-aria-blue to-aria-mint">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">Study Mode</h1>
        </div>

        <div className="px-4 space-y-4">
          {/* Exam week toggle */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Exam Week?</h3>
                <p className="text-sm text-muted-foreground">
                  Extra focus mode for intense study
                </p>
              </div>
              <button
                onClick={() => setIsExamWeek(!isExamWeek)}
                className={`w-14 h-8 rounded-full transition-all ${
                  isExamWeek ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white shadow-md"
                  animate={{ x: isExamWeek ? 28 : 4 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Subjects</h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject..."
                className="flex-1 px-4 py-2 rounded-xl bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
              />
              <button
                onClick={addSubject}
                className="p-2 rounded-xl bg-primary text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {subjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="font-medium">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    {(['easy', 'medium', 'hard'] as DifficultyType[]).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => updateDifficulty(subject.id, diff)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                          subject.difficulty === diff
                            ? difficultyColors[diff]
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {subjects.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No subjects yet. Add one above!
                </p>
              )}
            </div>
          </motion.div>

          {/* Hours per day */}
          <motion.div
            className="aria-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Available Hours Per Day</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xl font-bold text-primary w-12 text-center">
                {hoursPerDay}h
              </span>
            </div>
          </motion.div>

          {/* Generate button */}
          <motion.button
            onClick={generatePlan}
            className="w-full aria-button"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Generate Study Plan
          </motion.button>
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default Study;