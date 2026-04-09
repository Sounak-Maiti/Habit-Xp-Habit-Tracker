import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Habit {
  id: string;
  name: string;
  goal: number;
  color: string;
  category: string;
  createdAt: Date;
}

export interface HabitDay {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: Date; // When the habit was completed
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'fitness' | 'personal' | 'career';
  targetDate?: string;
}

export interface WeeklyProgress {
  week: number;
  completed: number;
  total: number;
  percentage: number;
}

export interface StreakData {
  current: number;
  best: number;
  lastCompletedDate?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  xpReward: number;
}

export interface HabitStats {
  habitId: string;
  habitName: string;
  goal: number;
  completed: number;
  left: number;
  percentage: number;
  streak: StreakData;
}

interface HabitStore {
  // State
  habits: Habit[];
  habitDays: HabitDay[];
  goals: Goal[];
  selectedYear: number;
  selectedMonth: number;
  
  // Gamification State
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  
  // Computed values
  monthlyStats: {
    totalCompleted: number;
    totalTarget: number;
    totalLeft: number;
    percentage: number;
  };
  
  weeklyProgress: WeeklyProgress[];
  habitStats: HabitStats[];
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  removeHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  
  toggleHabitDay: (habitId: string, date: string) => void;
  setHabitDay: (habitId: string, date: string, completed: boolean) => void;
  getHabitDayDetails: (habitId: string, date: string) => HabitDay | undefined;
  
  // Gamification Actions
  addXP: (amount: number) => void;
  removeXP: (amount: number) => void;
  calculateLevel: (xp: number) => number;
  checkLevelUp: () => boolean;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  
  // Computed getters
  getDaysInMonth: () => number;
  getWeeksInMonth: () => number;
  getHabitDay: (habitId: string, date: string) => boolean;
  getHabitCompletionRate: (habitId: string) => number;
  getMonthlyProgress: () => number[];
  getBestDay: () => { day: string; rate: number };
  calculateStreak: (habitId: string) => StreakData;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultHabits: Omit<Habit, 'id' | 'createdAt'>[] = [
  { name: 'Morning Exercise', goal: 30, color: '#8b5cf6', category: 'fitness' },
  { name: 'Read for 30 mins', goal: 30, color: '#3b82f6', category: 'personal' },
  { name: 'Meditate', goal: 30, color: '#10b981', category: 'personal' },
  { name: 'Drink 8 glasses of water', goal: 30, color: '#06b6d4', category: 'health' },
  { name: 'No social media before noon', goal: 30, color: '#f59e0b', category: 'personal' },
];

const defaultGoals: Omit<Goal, 'id'>[] = [
  {
    title: 'Complete Online Course',
    description: 'Finish the advanced React course by end of month',
    category: 'academic',
    targetDate: '2025-12-31'
  },
  {
    title: 'Run 5K Under 25 Minutes',
    description: 'Improve running speed and endurance',
    category: 'fitness'
  },
  {
    title: 'Read 24 Books This Year',
    description: 'Average 2 books per month',
    category: 'personal'
  },
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      // Initial state
      habits: [],
      habitDays: [],
      goals: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      
      // Gamification State
      totalXP: 0,
      currentLevel: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: [],
      
      monthlyStats: {
        totalCompleted: 0,
        totalTarget: 0,
        totalLeft: 0,
        percentage: 0
      },
      
      weeklyProgress: [],
      habitStats: [],
      
      // Actions
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: generateId(),
          createdAt: new Date()
        };
        set((state) => ({
          habits: [...state.habits, newHabit]
        }));
      },
      
      removeHabit: (habitId) => {
        set((state) => {
          // Find all habit days for this habit that were completed
          const completedHabitDays = state.habitDays.filter(hd => hd.habitId === habitId && hd.completed);
          
          // Calculate XP to remove (10 XP per completed day + streak bonuses)
          let xpToRemove = 0;
          completedHabitDays.forEach(hd => {
            // Calculate streak bonus for this specific day
            const streakBonus = state.calculateStreak(habitId).current > 0 ? 5 : 0;
            xpToRemove += 10 + streakBonus;
          });
          
          // Remove the habit and its days
          const newHabits = state.habits.filter(h => h.id !== habitId);
          const newHabitDays = state.habitDays.filter(hd => hd.habitId !== habitId);
          
          // Calculate new XP and level
          const newXP = Math.max(0, state.totalXP - xpToRemove);
          const newLevel = Math.floor(newXP / 100);
          
          return {
            habits: newHabits,
            habitDays: newHabitDays,
            totalXP: newXP,
            currentLevel: newLevel
          };
        });
      },
      
      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map(h => 
            h.id === habitId ? { ...h, ...updates } : h
          )
        }));
      },
      
      toggleHabitDay: (habitId, date) => {
        const currentState = get();
        const isCompleted = currentState.getHabitDay(habitId, date);
        currentState.setHabitDay(habitId, date, !isCompleted);
      },
      
      setHabitDay: (habitId, date, completed) => {
        set((state) => {
          const existingIndex = state.habitDays.findIndex(
            hd => hd.habitId === habitId && hd.date === date
          );
          
          const wasPreviouslyCompleted = existingIndex >= 0 ? state.habitDays[existingIndex].completed : false;
          
          if (existingIndex >= 0) {
            const updatedDays = [...state.habitDays];
            updatedDays[existingIndex] = { 
              habitId, 
              date, 
              completed,
              completedAt: completed ? new Date() : undefined
            };
            
            // Handle XP changes fairly
            if (completed && !wasPreviouslyCompleted) {
              // Gaining XP for new completion
              const streakBonus = state.calculateStreak(habitId).current > 0 ? 5 : 0;
              state.addXP(10 + streakBonus);
            } else if (!completed && wasPreviouslyCompleted) {
              // Losing XP for unchecking (fairness)
              const streakBonus = state.calculateStreak(habitId).current > 0 ? 5 : 0;
              state.removeXP(10 + streakBonus);
            }
            // If completed stays same, no XP change (prevents abuse)
            
            return { habitDays: updatedDays };
          } else {
            // New habit day
            if (completed) {
              const streakBonus = state.calculateStreak(habitId).current > 0 ? 5 : 0;
              state.addXP(10 + streakBonus);
            }
            
            return {
              habitDays: [...state.habitDays, { 
                habitId, 
                date, 
                completed,
                completedAt: completed ? new Date() : undefined
              }]
            };
          }
        });
      },
      
      // Gamification Functions
      addXP: (amount) => {
        set((state) => {
          const newXP = state.totalXP + amount;
          const newLevel = Math.floor(newXP / 100);
          const leveledUp = newLevel > state.currentLevel;
          
          // Check for level up achievements (direct update to avoid recursion)
          const updatedAchievements = [...state.achievements];
          if (leveledUp && !updatedAchievements.find(a => a.id === `level-${newLevel}`)) {
            const achievementTemplates: { [key: string]: Omit<Achievement, 'unlockedAt'> } = {
              'level-1': {
                id: 'level-1',
                name: 'Level 1',
                description: 'Reach level 1',
                icon: '1',
                xpReward: 10
              },
              'level-2': {
                id: 'level-2',
                name: 'Level 2',
                description: 'Reach level 2',
                icon: '2',
                xpReward: 20
              },
              'level-3': {
                id: 'level-3',
                name: 'Level 3',
                description: 'Reach level 3',
                icon: '3',
                xpReward: 30
              }
            };
            
            const template = achievementTemplates[`level-${newLevel}`];
            if (template) {
              updatedAchievements.push({
                ...template,
                unlockedAt: new Date()
              });
            }
          }
          
          return {
            totalXP: newXP,
            currentLevel: newLevel,
            achievements: updatedAchievements
          };
        });
      },
      
      removeXP: (amount) => {
        set((state) => {
          const newXP = Math.max(0, state.totalXP - amount);
          const newLevel = Math.floor(newXP / 100);
          
          return {
            totalXP: newXP,
            currentLevel: newLevel
          };
        });
      },
      
      calculateLevel: (xp) => {
        return Math.floor(xp / 100);
      },
      
      checkLevelUp: () => {
        const state = get();
        const newLevel = Math.floor(state.totalXP / 100);
        return newLevel > state.currentLevel;
      },
      
      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.find(a => a.id === achievementId)) {
            return state; // Already unlocked
          }
          
          // Define achievement templates
          const achievementTemplates: { [key: string]: Omit<Achievement, 'unlockedAt'> } = {
            'first-habit': {
              id: 'first-habit',
              name: 'First Habit Completed',
              description: 'Complete your first habit',
              icon: '1',
              xpReward: 50
            },
            '7-day-streak': {
              id: '7-day-streak',
              name: '7 Day Streak',
              description: 'Maintain a 7-day streak',
              icon: '7',
              xpReward: 100
            },
            'level-1': {
              id: 'level-1',
              name: 'Level 1',
              description: 'Reach level 1',
              icon: '1',
              xpReward: 10
            },
            'level-2': {
              id: 'level-2',
              name: 'Level 2',
              description: 'Reach level 2',
              icon: '2',
              xpReward: 20
            },
            'level-3': {
              id: 'level-3',
              name: 'Level 3',
              description: 'Reach level 3',
              icon: '3',
              xpReward: 30
            }
          };
          
          const template = achievementTemplates[achievementId];
          if (!template) return state;
          
          const newAchievement: Achievement = {
            ...template,
            unlockedAt: new Date()
          };
          
          // Award XP for achievement (direct update to avoid recursion)
          const newXP = state.totalXP + template.xpReward;
          const newLevel = Math.floor(newXP / 100);
          
          return {
            totalXP: newXP,
            currentLevel: newLevel,
            achievements: [...state.achievements, newAchievement]
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          let maxStreak = 0;
          let currentStreak = 0;
          
          state.habits.forEach(habit => {
            const streak = state.calculateStreak(habit.id);
            maxStreak = Math.max(maxStreak, streak.best);
            currentStreak = Math.max(currentStreak, streak.current);
          });
          
          // Check for streak achievements
          if (currentStreak >= 7) {
            state.unlockAchievement('7-day-streak');
          }
          
          return {
            currentStreak,
            longestStreak: Math.max(state.longestStreak, maxStreak)
          };
        });
      },
      
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: generateId()
        };
        set((state) => ({
          goals: [...state.goals, newGoal]
        }));
      },
      
      removeGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter(g => g.id !== goalId)
        }));
      },
      
      updateGoal: (goalId, updates) => {
        set((state) => ({
          goals: state.goals.map(g => 
            g.id === goalId ? { ...g, ...updates } : g
          )
        }));
      },
      
      setSelectedYear: (year) => set({ selectedYear: year }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      
      // Computed getters
      getDaysInMonth: () => {
        const { selectedYear, selectedMonth } = get();
        return new Date(selectedYear, selectedMonth + 1, 0).getDate();
      },
      
      getWeeksInMonth: () => {
        const { selectedYear, selectedMonth } = get();
        const firstDay = new Date(selectedYear, selectedMonth, 1);
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
        const startWeek = Math.ceil(firstDay.getDate() / 7);
        const endWeek = Math.ceil(lastDay.getDate() / 7);
        return endWeek - startWeek + 1;
      },
      
      getHabitDay: (habitId, date) => {
        const { habitDays } = get();
        const habitDay = habitDays.find(hd => hd.habitId === habitId && hd.date === date);
        return habitDay?.completed || false;
      },
      
      getHabitDayDetails: (habitId, date) => {
        const { habitDays } = get();
        return habitDays.find(hd => hd.habitId === habitId && hd.date === date);
      },
      
      getHabitCompletionRate: (habitId) => {
        const state = get();
        const daysInMonth = state.getDaysInMonth();
        const { selectedYear, selectedMonth } = state;
        
        let completed = 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (state.getHabitDay(habitId, date)) {
            completed++;
          }
        }
        
        return daysInMonth > 0 ? (completed / daysInMonth) * 100 : 0;
      },
      
      getMonthlyProgress: () => {
        const state = get();
        const daysInMonth = state.getDaysInMonth();
        const progress = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${state.selectedYear}-${String(state.selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          let completed = 0;
          state.habits.forEach(habit => {
            if (state.getHabitDay(habit.id, date)) {
              completed++;
            }
          });
          
          progress.push(state.habits.length > 0 ? (completed / state.habits.length) * 100 : 0);
        }
        
        return progress;
      },
      
      getBestDay: () => {
        const state = get();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayRates = dayNames.map((day, index) => {
          let totalCompleted = 0;
          let totalPossible = 0;
          
          state.habitDays.forEach(hd => {
            const dayDate = new Date(hd.date);
            if (dayDate.getDay() === index) {
              totalPossible++;
              if (hd.completed) totalCompleted++;
            }
          });
          
          return {
            day,
            rate: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0
          };
        });
        
        return dayRates.reduce((best, current) => 
          current.rate > best.rate ? current : best
        , { day: 'Monday', rate: 0 });
      },
      
      calculateStreak: (habitId) => {
        const state = get();
        const { selectedYear, selectedMonth } = state;
        const daysInMonth = state.getDaysInMonth();
        
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        let lastCompletedDate: string | undefined;
        
        // Calculate current streak (from today backwards)
        for (let day = daysInMonth; day >= 1; day--) {
          const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          if (state.getHabitDay(habitId, date)) {
            if (currentStreak === 0) {
              lastCompletedDate = date;
            }
            currentStreak++;
          } else if (currentStreak > 0) {
            break;
          }
        }
        
        // Calculate best streak (throughout the month)
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          if (state.getHabitDay(habitId, date)) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
        
        return {
          current: currentStreak,
          best: bestStreak,
          lastCompletedDate
        };
      }
    }),
    {
      name: 'habit-tracker-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from version 0 (no version) to version 1
        if (version === 0) {
          // Ensure XP-related fields exist and are properly initialized
          return {
            ...persistedState,
            totalXP: persistedState.totalXP || 0,
            currentLevel: persistedState.currentLevel || 0,
            currentStreak: persistedState.currentStreak || 0,
            longestStreak: persistedState.longestStreak || 0,
            achievements: persistedState.achievements || []
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        habits: state.habits,
        habitDays: state.habitDays,
        goals: state.goals,
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        totalXP: state.totalXP,
        currentLevel: state.currentLevel,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        achievements: state.achievements
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure XP and level are synchronized on rehydration
        if (state && state.totalXP && state.currentLevel !== Math.floor(state.totalXP / 100)) {
          state.currentLevel = Math.floor(state.totalXP / 100);
        }
      }
    }
  )
);
