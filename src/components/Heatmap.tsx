'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { formatDate, getDaysInMonth, isToday } from '@/utils/calendar';

interface DayData {
  day: number;
  date: string;
  completedCount: number;
  percentage: number;
  isToday: boolean;
}

export const Heatmap: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getHabitDay
  } = useHabitStore();

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Generate heatmap data for each day
  const heatmapData: DayData[] = Array.from({ length: daysInMonth }, (_, dayIndex) => {
    const day = dayIndex + 1;
    const date = formatDate(selectedYear, selectedMonth, day);
    
    let completedCount = 0;
    habits.forEach(habit => {
      if (getHabitDay(habit.id, date)) {
        completedCount++;
      }
    });

    const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
    
    return {
      day,
      date,
      completedCount,
      percentage,
      isToday: isToday(selectedYear, selectedMonth, day)
    };
  });

  const getIntensityColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-100';
    if (percentage <= 20) return 'bg-blue-200';
    if (percentage <= 40) return 'bg-blue-300';
    if (percentage <= 60) return 'bg-blue-400';
    if (percentage <= 80) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  const getIntensityColorClass = (percentage: number) => {
    if (percentage === 0) return 'text-gray-400';
    if (percentage <= 20) return 'text-blue-400';
    if (percentage <= 40) return 'text-blue-500';
    if (percentage <= 60) return 'text-blue-600';
    if (percentage <= 80) return 'text-blue-700';
    return 'text-blue-800';
  };

  const getWeeks = (): DayData[][] => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      
      // Start new week on Sunday (day 1) or when we've collected 7 days
      if ((index + 1) % 7 === 0 || index === heatmapData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const weeks = getWeeks();

  // Calculate statistics
  const totalCompleted = heatmapData.reduce((sum, day) => sum + day.completedCount, 0);
  const totalPossible = habits.length * daysInMonth;
  const averagePercentage = heatmapData.length > 0 
    ? heatmapData.reduce((sum, day) => sum + day.percentage, 0) / heatmapData.length 
    : 0;
  const bestDay = heatmapData.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  , { percentage: 0, day: 0 });
  const currentStreak = calculateCurrentStreak();

  function calculateCurrentStreak(): number {
    let streak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].percentage > 0) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    return streak;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cellVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500"
      >
        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No habits to visualize. Add habits to see your consistency heatmap!</p>
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
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Consistency Heatmap
        </h3>
      </div>

      <div className="p-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalCompleted}/{totalPossible}
            </div>
            <div className="text-xs text-gray-600">Total Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {averagePercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {bestDay.day > 0 ? bestDay.day : '-'}
            </div>
            <div className="text-xs text-gray-600">Best Day</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
            </div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mb-4">
          <div className="grid grid-cols-8 gap-1">
            {/* Day labels */}
            <div className="text-xs text-gray-500 font-medium">Day</div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-xs text-gray-500 font-medium text-center">
                {day}
              </div>
            ))}

            {/* Week rows */}
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                <div className="text-xs text-gray-500 font-medium">
                  W{weekIndex + 1}
                </div>
                {week.map((dayData, dayIndex) => (
                  dayData ? (
                    <motion.div
                      key={dayIndex}
                      variants={cellVariants}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="relative group"
                    >
                      <div
                        className={`
                          w-8 h-8 rounded-sm border border-gray-200 cursor-pointer
                          ${getIntensityColor(dayData.percentage)}
                          ${dayData.isToday ? 'ring-2 ring-purple-400 ring-offset-1' : ''}
                        `}
                        title={`Day ${dayData.day}: ${dayData.completedCount}/${habits.length} habits (${dayData.percentage.toFixed(0)}%)`}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        <div>Day {dayData.day}</div>
                        <div>{dayData.completedCount}/{habits.length} habits</div>
                        <div>{dayData.percentage.toFixed(0)}%</div>
                      </div>
                    </motion.div>
                  ) : (
                    <div key={dayIndex} className="w-8 h-8" />
                  )
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 20, 40, 60, 80, 100].map((percentage) => (
              <div
                key={percentage}
                className={`w-4 h-4 rounded-sm border border-gray-200 ${getIntensityColor(percentage)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
        >
          <h4 className="font-semibold text-gray-800 mb-2">Insights</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Most productive day: Day {bestDay.day} ({bestDay.percentage.toFixed(0)}% completion)</div>
            <div>Current consistency streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
            <div>Monthly consistency: {averagePercentage.toFixed(1)}% average daily completion</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
