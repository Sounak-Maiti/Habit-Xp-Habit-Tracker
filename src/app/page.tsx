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
import { StockCharts } from '@/components/StockCharts';
import { BarGraphs } from '@/components/BarGraphs';
import { Histograms } from '@/components/Histograms';
import { useHabitStore } from '@/store/habitStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getDaysInMonth, 
    getHabitDay,
    calculateStreak 
  } = useHabitStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <div className="w-full">
          {/* Top Section - Dashboard and Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Dashboard />
            </div>
            <div>
              <GoalsPanel />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="mb-6">
            <CalendarHeader />
            <div className="mt-4">
              <HabitGrid />
            </div>
          </div>

          {/* Habit Stats - Full Width */}
          <div className="mb-6">
            <HabitStats />
          </div>

          {/* Weekly Progress - Full Width */}
          <div className="mb-6">
            <WeeklyProgress />
          </div>

          {/* Analytics Grid - Properly Separated */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Column 1 - Heatmap */}
            <div className="lg:col-span-1">
              <Heatmap />
            </div>

            {/* Column 2 - Pie Charts */}
            <div className="lg:col-span-1">
              <PieCharts />
            </div>
          </div>

          {/* Charts Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Stock Charts */}
            <div>
              <StockCharts />
            </div>
            
            {/* Bar Graphs */}
            <div>
              <BarGraphs />
            </div>
          </div>

          {/* Histograms Section */}
          <div className="mb-6">
            <Histograms />
          </div>

          {/* Bottom Section - Quick Stats and Quotes */}
          <div className="mb-6">
            {/* Quick Stats and Quotes - Takes full width */}
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-700">Daily Focus</span>
                    <span className="text-sm font-bold text-purple-900">{quickStats.dailyFocus} habits</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Weekly Goal</span>
                    <span className="text-sm font-bold text-blue-900">{quickStats.weeklyCompleted}/{quickStats.weeklyTotal}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Monthly Target</span>
                    <span className="text-sm font-bold text-green-900">{quickStats.monthlyCompleted}/{quickStats.monthlyTotal}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">Current Streak</span>
                    <span className="text-sm font-bold text-orange-900">{quickStats.currentStreak} days</span>
                  </div>
                </div>
              </motion.div>

              {/* Motivational Quotes */}
              <MotivationalQuotes />
            </div>
          </div>
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
    </div>
  );
}
