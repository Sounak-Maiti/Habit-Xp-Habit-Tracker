'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

export const StockCharts: React.FC = () => {
  const { habits, selectedYear, selectedMonth, getDaysInMonth, getHabitDay } = useHabitStore();

  // Generate real performance data based on actual user habit completion
  const generateRealPerformanceData = () => {
    const daysInMonth = getDaysInMonth();
    const data = [];
    let cumulativePerformance = 50; // Start at 50 as baseline
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Calculate actual completion rate for this day
      let completedToday = 0;
      habits.forEach(habit => {
        if (getHabitDay(habit.id, date)) {
          completedToday++;
        }
      });
      
      const dailyCompletionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
      
      // Calculate cumulative performance (weighted average)
      cumulativePerformance = (cumulativePerformance * 0.7) + (dailyCompletionRate * 0.3);
      
      // Generate realistic metrics based on actual data
      const baseValue = Math.round(cumulativePerformance);
      
      data.push({
        day: day,
        value: Math.max(0, Math.min(100, baseValue)),
        volume: completedToday * 100, // Volume based on actual activity
        high: Math.min(100, baseValue + 5), // Small variation based on actual data
        low: Math.max(0, baseValue - 5),
        open: Math.max(0, Math.min(100, baseValue)),
        close: Math.max(0, Math.min(100, baseValue)),
        actualCompletion: Math.round(dailyCompletionRate),
      });
    }
    
    return data;
  };

  // Generate data for multiple habits
  const habitPerformanceData = habits.map((habit, index) => {
    const data = generateRealPerformanceData(); // Show all available days
    return {
      habitName: habit.name,
      color: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][index % 5],
      data: data.map((d: any) => ({ ...d, value: d.actualCompletion || d.value })),
    };
  });

  // Overall performance trend
  const overallTrendData = generateRealPerformanceData();

  // Custom tooltip for stock charts
  const StockTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">Day {label}</p>
          <p className="text-sm text-purple-600">Value: {data.value}</p>
          <p className="text-sm text-gray-600">High: {data.high}</p>
          <p className="text-sm text-gray-600">Low: {data.low}</p>
          <p className="text-sm text-gray-600">Volume: {data.volume}</p>
        </div>
      );
    }
    return null;
  };

  const SimpleTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">Day {label}</p>
          <p className="text-sm text-purple-600">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Overall Performance Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Overall Performance Trend</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overallTrendData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<StockTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Habit Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Individual Habit Performance</h3>
        </div>
        
        <div className="space-y-4">
          {habitPerformanceData.slice(0, Math.min(3, habitPerformanceData.length)).map((habit, index) => (
            <div key={habit.habitName} className="h-40 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{habit.habitName}</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-green-600 font-medium">
                    +{Math.round(habit.data[habit.data.length - 1]?.actualCompletion || 0)}%
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={habit.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9ca3af"
                      fontSize={10}
                      tick={false}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={10}
                      tick={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={habit.color} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume and Volatility */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Activity Volume</h3>
          </div>
          <span className="text-sm text-purple-600 font-medium">Daily Tracking</span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overallTrendData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
                        <p className="font-medium text-gray-800">Day {label}</p>
                        <p className="text-sm text-purple-600">Volume: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#ec4899" 
                fillOpacity={1} 
                fill="url(#colorVolume)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
