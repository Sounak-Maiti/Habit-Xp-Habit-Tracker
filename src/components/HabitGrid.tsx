'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { formatDate, getWeeksInMonth, getDaysInWeek, isToday } from '@/utils/calendar';

export const HabitGrid: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    toggleHabitDay, 
    getHabitDay,
    addHabit,
    removeHabit,
    getDaysInMonth
  } = useHabitStore();

  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  const daysInMonth = getDaysInMonth();
  const weeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        goal: daysInMonth,
        color: '#8b5cf6', // Use consistent purple color instead of random
        category: 'personal'
      });
      setNewHabitName('');
      setShowAddHabit(false);
    }
  };

  const getWeekDays = (weekNumber: number) => {
    return getDaysInWeek(selectedYear, selectedMonth, weekNumber);
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cellVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header Row */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="grid grid-cols-[200px,1fr] gap-4 p-4">
          <div className="font-semibold text-gray-700">Habits</div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map(week => (
              <div key={week} className="text-center">
                <div className="text-sm font-semibold text-gray-700 mb-1">Week {week}</div>
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500">
                  {getWeekDays(week).map(day => (
                    <div key={day} className={`text-center ${isToday(selectedYear, selectedMonth, day) ? 'font-bold text-purple-600' : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Habit Rows */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {habits.map((habit, habitIndex) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: habitIndex * 0.1 }}
              className="grid grid-cols-[200px,1fr] gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Habit Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="font-medium text-gray-800 truncate">
                    {habit.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeHabit(habit.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Habit Days Grid */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map(week => (
                  <div key={week} className="grid grid-cols-7 gap-1">
                    {getWeekDays(week).map(day => {
                      const date = formatDate(selectedYear, selectedMonth, day);
                      const isCompleted = getHabitDay(habit.id, date);
                      const isCurrentDay = isToday(selectedYear, selectedMonth, day);
                      
                      return (
                        <motion.button
                          key={day}
                          variants={cellVariants}
                          whileTap="tap"
                          onClick={() => toggleHabitDay(habit.id, date)}
                          className={`
                            w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all
                            ${isCompleted 
                              ? 'bg-gradient-to-br from-purple-500 to-blue-500 border-purple-500 text-white' 
                              : 'bg-white border-gray-200 hover:border-purple-300 text-gray-400'
                            }
                            ${isCurrentDay ? 'ring-2 ring-purple-400 ring-offset-1' : ''}
                          `}
                        >
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              />
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Habit Row */}
        <motion.div className="p-4">
          <AnimatePresence>
            {showAddHabit ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[200px,1fr] gap-4"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                    placeholder="New habit name..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddHabit}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowAddHabit(false);
                      setNewHabitName('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddHabit(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Habit
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
