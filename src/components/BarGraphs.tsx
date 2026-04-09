'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

const COLORS = [
  '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
];

export const BarGraphs: React.FC = () => {
  const { habits, selectedYear, selectedMonth, getDaysInMonth, getHabitDay, calculateStreak } = useHabitStore();

  // Calculate real habit comparison data
  const habitComparisonData = habits.map(habit => {
    let completedDays = 0;
    
    // Count actual completed days for this habit
    for (let day = 1; day <= getDaysInMonth(); day++) {
      const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (getHabitDay(habit.id, date)) {
        completedDays++;
      }
    }
    
    const completionRate = getDaysInMonth() > 0 ? (completedDays / getDaysInMonth()) * 100 : 0;
    const streak = calculateStreak(habit.id);
    
    return {
      name: habit.name.length > 12 ? habit.name.substring(0, 12) + '...' : habit.name,
      completion: Math.round(completionRate),
      streak: streak.current,
      goal: habit.goal,
      color: COLORS[habits.indexOf(habit) % COLORS.length],
    };
  });

  // Calculate real weekly comparison data
  const calculateWeeklyComparisonData = () => {
    const weeks = [
      { week: 'Week 1', start: 1, end: 7 },
      { week: 'Week 2', start: 8, end: 14 },
      { week: 'Week 3', start: 15, end: 21 },
      { week: 'Week 4', start: 22, end: 28 },
    ];

    return weeks.map(week => {
      let totalPossible = 0;
      let totalCompleted = 0;

      habits.forEach(habit => {
        for (let day = week.start; day <= week.end && day <= getDaysInMonth(); day++) {
          const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          totalPossible++;
          if (getHabitDay(habit.id, date)) {
            totalCompleted++;
          }
        }
      });

      return {
        week: week.week,
        completed: totalCompleted,
        target: totalPossible,
        missed: totalPossible - totalCompleted,
      };
    }).filter(week => week.target > 0);
  };

  const weeklyComparisonData = calculateWeeklyComparisonData();

  // Calculate real monthly trend data based on actual user habit completions
  const calculateMonthlyTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, index) => {
      const targetMonth = index;
      const targetYear = selectedYear;
      let totalCompleted = 0;
      let totalPossible = 0;
      
      // Get days in the target month
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      
      // Check for actual habit completions in this specific month
      habits.forEach(habit => {
        let completedDays = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (getHabitDay(habit.id, date)) {
            completedDays++;
          }
        }
        
        totalCompleted += completedDays;
        totalPossible += daysInMonth;
      });
      
      // Calculate completion percentage: (completed / possible) * 100
      const completionPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
      
      return {
        month,
        habits: habits.length,
        completion: completionPercentage,
        totalCompleted,
        totalPossible
      };
    });
  };

  const monthlyTrendData = calculateMonthlyTrendData();

  // Calculate real category performance data
  const calculateCategoryPerformanceData = () => {
    const categoryStats: { [key: string]: { totalScore: number; habitCount: number } } = {};
    
    habits.forEach(habit => {
      const category = habit.category || 'General';
      let completedDays = 0;
      
      // Calculate completion rate for this habit
      for (let day = 1; day <= getDaysInMonth(); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (getHabitDay(habit.id, date)) {
          completedDays++;
        }
      }
      
      const completionRate = getDaysInMonth() > 0 ? (completedDays / getDaysInMonth()) * 100 : 0;
      
      if (!categoryStats[category]) {
        categoryStats[category] = { totalScore: 0, habitCount: 0 };
      }
      categoryStats[category].totalScore += completionRate;
      categoryStats[category].habitCount += 1;
    });
    
    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      score: Math.round(stats.totalScore / stats.habitCount),
      habits: stats.habitCount,
    }));
  };

  const categoryPerformanceData = calculateCategoryPerformanceData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'completion' || entry.name === 'score' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      {/* Habit Completion Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Habit Completion Rates</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">
              Average: {(() => {
                if (habitComparisonData.length === 0) return '0%';
                const totalCompletion = habitComparisonData.reduce((sum, habit) => sum + habit.completion, 0);
                const average = Math.round(totalCompletion / habitComparisonData.length);
                return `${average}%`;
              })()}
            </span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={habitComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                {habitComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Weekly Performance</h3>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="missed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Missed</span>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 col-span-4 lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">6-Month Trend</h3>
          </div>
          <span className="text-sm text-purple-600 font-medium">
            {(() => {
              const validData = monthlyTrendData.filter(d => d.completion > 0);
              if (validData.length < 2) return 'No data';
              
              const firstMonth = validData[0].completion;
              const lastMonth = validData[validData.length - 1].completion;
              
              if (firstMonth === 0 && lastMonth === 0) return 'Growth: 0%';
              if (firstMonth === 0) return `Growth: +${lastMonth}%`;
              
              const growth = ((lastMonth - firstMonth) / firstMonth) * 100;
              const growthStr = growth >= 0 ? `+${Math.round(growth)}%` : `${Math.round(growth)}%`;
              return `Growth: ${growthStr}`;
            })()}
          </span>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#10b981"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                        <p className="text-sm font-medium">{data.month}</p>
                        <p className="text-sm text-green-600">{data.completion}% Completion</p>
                        <p className="text-xs text-gray-500">{data.totalCompleted}/{data.totalPossible} completed</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="completion" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
                label={{ position: 'top', fontSize: 10, fill: '#059669' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Category Performance</h3>
          </div>
          <span className="text-sm text-green-600 font-medium">
              Best: {categoryPerformanceData.length > 0 ? 
                categoryPerformanceData.reduce((best, current) => 
                  current.score > best.score ? current : best
                , categoryPerformanceData[0]).category : 'None'
              }
            </span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <YAxis 
                type="category"
                dataKey="category" 
                stroke="#6b7280"
                fontSize={12}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
