'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, TrendingUp, Activity, Award } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { CalendarHeader } from '@/components/CalendarHeader';
import { HabitGrid } from '@/components/HabitGrid';
import { HabitStats } from '@/components/HabitStats';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { GoalsPanel } from '@/components/GoalsPanel';
import { Heatmap } from '@/components/Heatmap';
import { MotivationalQuotes } from '@/components/MotivationalQuotes';
import { Logo } from '@/components/Logo';
import { PieCharts } from '@/components/PieCharts';
import { PerformanceHistogram } from '@/components/PerformanceHistogram';
import { BarGraphs } from '@/components/BarGraphs';
import { Histograms } from '@/components/Histograms';
import { GamificationStats } from '@/components/GamificationStats';
import { LevelBadge } from '@/components/LevelBadge';
import { AnimatedPlant } from '@/components/AnimatedPlant';
import { useHabitStore } from '@/store/habitStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showLevelBadge, setShowLevelBadge] = useState(false);
  const [lastLevel, setLastLevel] = useState(0);
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getDaysInMonth, 
    getHabitDay,
    calculateStreak,
    currentLevel 
  } = useHabitStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Level up detection
  useEffect(() => {
    if (mounted && currentLevel > lastLevel) {
      setShowLevelBadge(true);
    }
    setLastLevel(currentLevel);
  }, [currentLevel, lastLevel, mounted]);

  // Calculate real quick stats
  const calculateQuickStats = () => {
    // Daily Focus - number of active habits
    const dailyFocus = habits.length;

    // Weekly Goal - calculate actual weekly progress
    let weeklyCompleted = 0;
    let weeklyTotal = 0;
    const currentWeekStart = 1; // Simplified - would need actual week calculation
    
    habits.forEach(habit => {
      for (let day = currentWeekStart; day <= Math.min(currentWeekStart + 6, getDaysInMonth()); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        weeklyTotal++;
        if (getHabitDay(habit.id, date)) {
          weeklyCompleted++;
        }
      }
    });

    // Monthly Target - calculate actual monthly progress
    let monthlyCompleted = 0;
    let monthlyTotal = 0;
    
    habits.forEach(habit => {
      for (let day = 1; day <= getDaysInMonth(); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        monthlyTotal++;
        if (getHabitDay(habit.id, date)) {
          monthlyCompleted++;
        }
      }
    });

    // Current Streak - get the longest current streak across all habits
    let currentStreak = 0;
    habits.forEach(habit => {
      const streak = calculateStreak(habit.id);
      currentStreak = Math.max(currentStreak, streak.current);
    });

    return {
      dailyFocus,
      weeklyCompleted,
      weeklyTotal,
      monthlyCompleted,
      monthlyTotal,
      currentStreak,
    };
  };

  const quickStats = calculateQuickStats();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="animate-pulse">
          <div className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 h-16"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-32"></div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 flex-shrink-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4 text-sm text-purple-500">
              <div className="flex items-center gap-1 text-purple-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <Activity className="w-4 h-4" />
                <span>Track Daily</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4"
      >
        <div className="w-full space-y-6">
          {/* Gamification Stats */}
          <GamificationStats />

          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="text-center py-6"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Level Up Your Life with Habits
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Earn XP for consistency, build habits like a game
            </motion.p>
          </motion.div>

          {/* Dashboard Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <Dashboard />
            </div>
            <div>
              <GoalsPanel />
            </div>
          </motion.div>

          {/* Calendar Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <CalendarHeader />
            <HabitGrid />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <HabitStats />
            <WeeklyProgress />
          </motion.div>

          {/* Analytics Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Heatmap />
            <PieCharts />
          </motion.div>

          {/* Charts Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <PerformanceHistogram />
            <BarGraphs />
          </motion.div>

          {/* Animated Plant Section */}
          <motion.div
            variants={itemVariants}
          >
            <AnimatedPlant />
          </motion.div>

          {/* Histograms Section */}
          <motion.div
            variants={itemVariants}
          >
            <Histograms />
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg p-8 border border-purple-100"
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-900">{quickStats.dailyFocus}</div>
                    <div className="text-sm text-purple-700 mt-1">Daily Focus</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-900">{quickStats.weeklyCompleted}/{quickStats.weeklyTotal}</div>
                    <div className="text-sm text-blue-700 mt-1">Weekly Goal</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-900">{quickStats.monthlyCompleted}/{quickStats.monthlyTotal}</div>
                    <div className="text-sm text-green-700 mt-1">Monthly Target</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-900">{quickStats.currentStreak}</div>
                    <div className="text-sm text-orange-700 mt-1">Current Streak</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Motivational Quotes */}
            <motion.div
              variants={itemVariants}
            >
              <MotivationalQuotes />
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-lavender-50 to-pastel-purple-50 backdrop-blur-sm border-t border-lavender-200 flex-shrink-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-purple-600">
            <p>© 2025 Habit Tracker. Build consistency, achieve your goals with style.</p>
          </div>
        </div>
      </motion.footer>

      {/* Level Badge Modal */}
      <LevelBadge 
        isVisible={showLevelBadge} 
        onClose={() => setShowLevelBadge(false)} 
      />
    </div>
  );
}
