'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { formatDate, getWeeksInMonth, getDaysInWeek } from '@/utils/calendar';

export const WeeklyProgress: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getHabitDay
  } = useHabitStore();

  const weeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);

  const weeklyData = Array.from({ length: weeksInMonth }, (_, weekIndex) => {
    const weekNumber = weekIndex + 1;
    const weekDays = getDaysInWeek(selectedYear, selectedMonth, weekNumber);
    
    let totalCompleted = 0;
    let totalPossible = 0;

    habits.forEach(habit => {
      weekDays.forEach(day => {
        const date = formatDate(selectedYear, selectedMonth, day);
        totalPossible++;
        if (getHabitDay(habit.id, date)) {
          totalCompleted++;
        }
      });
    });

    const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    return {
      week: weekNumber,
      completed: totalCompleted,
      total: totalPossible,
      percentage
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

  const weekVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-blue-500 to-cyan-500';
    if (percentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getProgressTextColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500"
      >
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No habits to track. Add habits to see weekly progress!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-sm overflow-hidden pb-8"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Weekly Progress
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyData.map((week, index) => (
            <motion.div
              key={week.week}
              variants={weekVariants}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">Week {week.week}</h4>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getProgressColor(week.percentage)}`} />
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="relative">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${week.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className={`h-full bg-gradient-to-r ${getProgressColor(week.percentage)} rounded-full`}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 mix-blend-difference">
                      {week.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${getProgressTextColor(week.percentage)}`} />
                    <span className="font-medium text-gray-900">
                      {week.completed}/{week.total}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {week.total > 0 ? Math.round(week.percentage) : 0}%
                  </div>
                </div>

                {/* Mini visualization */}
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const isActive = week.total > 0 && (dayIndex / 7) * 100 < week.percentage;
                    return (
                      <motion.div
                        key={dayIndex}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + dayIndex * 0.02 }}
                        className={`w-2 h-2 rounded-full ${
                          isActive 
                            ? `bg-gradient-to-r ${getProgressColor(week.percentage)}` 
                            : 'bg-gray-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: weeklyData.length * 0.1 }}
          className="mt-16 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {weeklyData.reduce((sum, week) => sum + week.completed, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {weeklyData.reduce((sum, week) => sum + week.total, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Possible</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {weeklyData.length > 0 
                  ? (weeklyData.reduce((sum, week) => sum + week.percentage, 0) / weeklyData.length).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Weekly Rate</div>
            </div>
          </div>

          {/* Best Week */}
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-700">
                Best Week: Week {weeklyData.length > 0 ? weeklyData.reduce((best, current) => 
                  current.percentage > best.percentage ? current : best
                , weeklyData[0]).week : 0} 
                ({weeklyData.length > 0 ? Math.max(...weeklyData.map(w => w.percentage)).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
