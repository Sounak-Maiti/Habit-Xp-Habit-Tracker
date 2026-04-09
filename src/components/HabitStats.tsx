'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Award, Flame } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

export const HabitStats: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getDaysInMonth,
    getHabitCompletionRate,
    calculateStreak
  } = useHabitStore();

  const daysInMonth = getDaysInMonth();

  const stats = habits.map(habit => {
    const completionRate = getHabitCompletionRate(habit.id);
    const completed = Math.round((completionRate / 100) * daysInMonth);
    const left = habit.goal - completed;
    const streak = calculateStreak(habit.id);

    return {
      habitId: habit.id,
      habitName: habit.name,
      goal: habit.goal,
      completed,
      left: Math.max(0, left),
      percentage: completionRate,
      streak,
      color: habit.color
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500"
      >
        <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No habits tracked yet. Add your first habit to see statistics!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Habit Statistics
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Habit Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goal
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Left
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Streak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {stats.map((stat, index) => (
                <motion.tr
                  key={stat.habitId}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {stat.habitName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-600">{stat.goal}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-green-600">{stat.completed}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-medium ${
                      stat.left === 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {stat.left}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[45px]">
                        {stat.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {stat.streak.current}
                        </div>
                        <div className="text-xs text-gray-500">
                          Best: {stat.streak.best}
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: stats.length * 0.1 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-t border-gray-200"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.reduce((sum, stat) => sum + stat.completed, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.reduce((sum, stat) => sum + stat.left, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Left</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.filter(stat => stat.percentage >= 80).length}
            </div>
            <div className="text-xs text-gray-600">On Track (80%+)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...stats.map(stat => stat.streak.current), 0)}
            </div>
            <div className="text-xs text-gray-600">Best Current Streak</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
