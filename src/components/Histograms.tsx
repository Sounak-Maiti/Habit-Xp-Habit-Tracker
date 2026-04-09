'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { BarChart3, Activity, Target, TrendingUp } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

const HISTOGRAM_COLORS = {
  primary: '#8b5cf6',
  secondary: '#ec4899',
  tertiary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const Histograms: React.FC = () => {
  const { 
    habits, 
    selectedYear, 
    selectedMonth, 
    getDaysInMonth, 
    getHabitDay,
    getHabitDayDetails 
  } = useHabitStore();

  // Calculate real completion frequency distribution (histogram)
  const calculateCompletionFrequency = () => {
    const habitCompletionRates: number[] = [];
    
    habits.forEach(habit => {
      let completedDays = 0;
      
      // Calculate completion rate for this habit
      for (let day = 1; day <= getDaysInMonth(); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (getHabitDay(habit.id, date)) {
          completedDays++;
        }
      }
      
      const completionRate = getDaysInMonth() > 0 ? (completedDays / getDaysInMonth()) * 100 : 0;
      habitCompletionRates.push(completionRate);
    });
    
    // Create frequency distribution
    const data = [];
    for (let i = 0; i <= 10; i++) {
      const rangeMin = i * 10;
      const rangeMax = (i + 1) * 10;
      const range = `${rangeMin}-${rangeMax}%`;
      
      const frequency = habitCompletionRates.filter(rate => 
        rate >= rangeMin && rate < rangeMax
      ).length;
      
      data.push({
        range,
        frequency,
        percentage: rangeMin,
        count: frequency,
      });
    }
    
    return data.filter(item => item.count > 0);
  };

  // Calculate streak lengths for all habits
  const calculateStreakLengths = () => {
    const streakLengths: number[] = [];
    
    habits.forEach(habit => {
      let currentStreak = 0;
      let maxStreak = 0;
      
      for (let day = 1; day <= getDaysInMonth(); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (getHabitDay(habit.id, date)) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      streakLengths.push(maxStreak);
    });
    
    return streakLengths;
  };

  // Calculate real streak length distribution
  const calculateStreakDistribution = () => {
    const streakLengths = calculateStreakLengths();
    
    const data = [
      { range: '0-3 days', count: 0, percentage: 0 },
      { range: '4-7 days', count: 0, percentage: 0 },
      { range: '8-14 days', count: 0, percentage: 0 },
      { range: '15-21 days', count: 0, percentage: 0 },
      { range: '22-30 days', count: 0, percentage: 0 },
      { range: '30+ days', count: 0, percentage: 0 },
    ];
    
    // Distribute streaks into ranges
    streakLengths.forEach(streak => {
      if (streak <= 3) data[0].count++;
      else if (streak <= 7) data[1].count++;
      else if (streak <= 14) data[2].count++;
      else if (streak <= 21) data[3].count++;
      else if (streak <= 30) data[4].count++;
      else data[5].count++;
    });
    
    // Calculate percentages
    const total = streakLengths.length || 1;
    data.forEach(item => {
      item.percentage = Math.round((item.count / total) * 100);
    });
    
    return data.filter(item => item.count > 0);
  };

  // Calculate real hourly activity distribution based on user data
  const calculateHourlyActivity = () => {
    const hours = [];
    const hourlyCounts: { [key: number]: number } = {};
    
    // Initialize all hours with 0
    for (let hour = 6; hour <= 23; hour++) {
      hourlyCounts[hour] = 0;
    }
    
    // Count actual completions by hour using real timestamps
    habits.forEach(habit => {
      for (let day = 1; day <= getDaysInMonth(); day++) {
        const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const habitDay = getHabitDayDetails(habit.id, date);
        
        if (habitDay && habitDay.completed && habitDay.completedAt) {
          const completionDate = typeof habitDay.completedAt === 'string' 
            ? new Date(habitDay.completedAt) 
            : habitDay.completedAt;
          const completionHour = completionDate.getHours();
          
          // Only count if within our display range (6 AM - 11 PM)
          if (completionHour >= 6 && completionHour <= 23) {
            hourlyCounts[completionHour]++;
          }
        }
      }
    });
    
    // Create the data array for the chart
    for (let hour = 6; hour <= 23; hour++) {
      hours.push({
        hour: `${hour}:00`,
        activity: hourlyCounts[hour],
        hourNum: hour,
      });
    }
    
    return hours;
  };

  // Habit Difficulty Distribution removed - not based on user input

  // Calculate real weekly completion distribution
  const calculateWeeklyCompletion = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      let completions = 0;
      
      habits.forEach(habit => {
        // Find all days in the month that match this weekday (0=Sunday, 1=Monday, etc.)
        for (let dayOfMonth = 1; dayOfMonth <= getDaysInMonth(); dayOfMonth++) {
          const date = new Date(selectedYear, selectedMonth, dayOfMonth);
          const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
          
          // Map our index (0=Monday, ..., 6=Sunday) to actual dayOfWeek (0=Sunday, 1=Monday, ..., 6=Saturday)
          const actualDayOfWeek = index === 6 ? 0 : index + 1; // Monday=1, Tuesday=2, ..., Saturday=6, Sunday=0
          
          if (dayOfWeek === actualDayOfWeek) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
            if (getHabitDay(habit.id, dateStr)) {
              completions++;
            }
          }
        }
      });
      
      return {
        day,
        completions,
        dayIndex: index,
        isWeekend: index >= 5,
      };
    });
  };

  const completionFrequencyData = calculateCompletionFrequency();
  const streakLengths = calculateStreakLengths();
  const streakDistributionData = calculateStreakDistribution();
  const hourlyActivityData = calculateHourlyActivity();
  const weeklyCompletionData = calculateWeeklyCompletion();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-purple-600">
            Count: {data.count || data.frequency || data.completions || data.activity}
          </p>
          {data.percentage && (
            <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  const HourlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-purple-600">Activity Level: {data.activity}</p>
          <p className="text-xs text-gray-500">
            {data.hourNum >= 7 && data.hourNum <= 9 ? 'Morning Peak' :
             data.hourNum >= 18 && data.hourNum <= 20 ? 'Evening Peak' : 'Regular Time'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-6"
    >
      {/* Completion Frequency Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Completion Rate Distribution</h3>
          </div>
          <span className="text-sm text-purple-600 font-medium">Frequency Analysis</span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                stroke="#6b7280"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="frequency" fill={HISTOGRAM_COLORS.primary} radius={[4, 4, 0, 0]} />
              <ReferenceLine x="50%" stroke="#ef4444" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Length Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Streak Length Distribution</h3>
          </div>
          <span className="text-sm text-green-600 font-medium">
            Avg: {streakLengths.length > 0 ? Math.round(streakLengths.reduce((sum, streak) => sum + streak, 0) / streakLengths.length) : 0} days
          </span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={streakDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={HISTOGRAM_COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Activity Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Hourly Activity Distribution</h3>
          </div>
          <span className="text-sm text-purple-600 font-medium">Based on your activity</span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hour" 
                stroke="#6b7280"
                fontSize={10}
                interval={2}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'Activity Level', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<HourlyTooltip />} />
              <Bar dataKey="activity" fill={HISTOGRAM_COLORS.tertiary} radius={[4, 4, 0, 0]} />
              <ReferenceLine x="7:00" stroke="#10b981" strokeDasharray="3 3" />
              <ReferenceLine x="19:00" stroke="#10b981" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      {/* Weekly Completion Pattern */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Weekly Completion Pattern</h3>
          </div>
          <span className="text-sm text-purple-600 font-medium">
            {weeklyCompletionData.length >= 7 ? 
              (weeklyCompletionData[5].completions < weeklyCompletionData[1].completions ? 'Weekend: Lower' : 'Weekend: Higher') : 
              'No data'
            }
          </span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'Completions', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completions" radius={[4, 4, 0, 0]}>
                {weeklyCompletionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isWeekend ? HISTOGRAM_COLORS.warning : HISTOGRAM_COLORS.success} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-xs text-gray-600">Weekday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-xs text-gray-600">Weekend</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
