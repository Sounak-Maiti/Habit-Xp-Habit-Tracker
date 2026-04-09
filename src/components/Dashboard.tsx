'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { getMonthName } from '@/utils/calendar';

export const Dashboard: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getDaysInMonth,
    getMonthlyProgress,
    getBestDay
  } = useHabitStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const daysInMonth = getDaysInMonth();
  const monthlyProgress = getMonthlyProgress();
  const bestDay = getBestDay();
  
  // Calculate monthly stats
  const totalTarget = habits.length * daysInMonth;
  const totalCompleted = monthlyProgress.reduce((sum, progress) => {
    return sum + (progress / 100) * habits.length;
  }, 0);
  const totalLeft = totalTarget - totalCompleted;
  const overallPercentage = totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  if (!mounted) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="h-5 bg-gray-200 rounded mb-2 w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {getMonthName(selectedMonth)} {selectedYear}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{daysInMonth} days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">
              {Math.round(totalCompleted)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {Math.round(totalLeft)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Left</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              {totalTarget}
            </span>
          </div>
          <p className="text-sm text-gray-600">Target</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {overallPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">Progress</p>
        </motion.div>
      </div>

      {/* Monthly Progress Bar */}
      <motion.div variants={itemVariants} className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Progress</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex gap-1 h-8">
            {monthlyProgress.map((progress, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.02 }}
                className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-sm opacity-80"
                style={{ 
                  opacity: 0.3 + (progress / 100) * 0.7,
                  minHeight: '2px'
                }}
                title={`Day ${index + 1}: ${progress.toFixed(0)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Day 1</span>
            <span>Day {daysInMonth}</span>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Best Performance Day</h3>
          <p className="text-lg font-bold text-purple-600">{bestDay.day}</p>
          <p className="text-sm text-gray-600">{bestDay.rate.toFixed(1)}% completion rate</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Habits</h3>
          <p className="text-lg font-bold text-blue-600">{habits.length}</p>
          <p className="text-sm text-gray-600">Being tracked this month</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
