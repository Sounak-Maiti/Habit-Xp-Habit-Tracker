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
      habits: defaultHabits.map(h => ({
        ...h,
        id: generateId(),
        createdAt: new Date()
      })),
      habitDays: [],
      goals: defaultGoals.map(g => ({ ...g, id: generateId() })),
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      
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
        set((state) => ({
          habits: state.habits.filter(h => h.id !== habitId),
          habitDays: state.habitDays.filter(hd => hd.habitId !== habitId)
        }));
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
          
          if (existingIndex >= 0) {
            const updatedDays = [...state.habitDays];
            updatedDays[existingIndex] = { 
              habitId, 
              date, 
              completed,
              completedAt: completed ? new Date() : undefined
            };
            return { habitDays: updatedDays };
          } else {
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
      partialize: (state) => ({
        habits: state.habits,
        habitDays: state.habitDays,
        goals: state.goals,
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth
      })
    }
  )
);
