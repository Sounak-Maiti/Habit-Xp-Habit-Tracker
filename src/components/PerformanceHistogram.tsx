'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { formatDate, getDaysInMonth } from '@/utils/calendar';

export const PerformanceHistogram: React.FC = () => {
  const { habits, selectedYear, selectedMonth, getDaysInMonth, getHabitDay } = useHabitStore();

  // Generate performance data for histogram - only completed days
  const generatePerformanceData = () => {
    const today = new Date().getDate();
    const data = [];
    
    for (let day = 1; day <= today; day++) {
      const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Use actual user data only for completed days
      let completedToday = 0;
      habits.forEach(habit => {
        if (getHabitDay(habit.id, date)) {
          completedToday++;
        }
      });
      
      const dailyCompletionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
      
      data.push({
        day: `Day ${day}`,
        performance: Math.round(dailyCompletionRate), // Show actual daily completion rate
        completed: completedToday,
        total: habits.length,
        isFuture: false
      });
    }
    
    return data;
  };

  // Calculate current performance percentage
  const calculatePerformancePercentage = () => {
    const data = generatePerformanceData();
    if (data.length === 0) return 0;
    
    // Return today's actual performance percentage
    const currentPerformance = data[data.length - 1].performance;
    return currentPerformance;
  };

  const performanceData = generatePerformanceData();
  const performancePercentage = calculatePerformancePercentage();

  // Custom tooltip for histogram
  const HistogramTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-purple-600">Performance: {data.performance}%</p>
          <p className="text-sm text-gray-600">
            Completed: {data.completed}/{data.total} habits
          </p>
          {data.isFuture && (
            <p className="text-xs text-blue-500 italic">Projected</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Color based on performance level
  const getBarColor = (performance: number) => {
    if (performance >= 80) return '#10b981'; // Green for high performance
    if (performance >= 50) return '#f59e0b'; // Yellow for medium performance
    return '#ef4444'; // Red for low performance
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Overall Performance Histogram */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${performancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performancePercentage >= 0 ? '+' : ''}{performancePercentage}%
            </span>
            {performancePercentage >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                interval={Math.floor(performanceData.length / 10)}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'Performance %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<HistogramTooltip />} />
              <Bar dataKey="performance" radius={[4, 4, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.performance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>High (80%+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium (50-79%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Low (&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Individual Habit Performance */}
      {habits.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Individual Habit Performance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit, index) => {
              const habitData = [];
              const today = new Date().getDate();
              
              for (let day = 1; day <= today; day++) {
                const date = formatDate(selectedYear, selectedMonth, day);
                
                const completedToday = getHabitDay(habit.id, date) ? 1 : 0;
                const performance = completedToday * 100;
                
                habitData.push({
                  day: `Day ${day}`,
                  performance: performance,
                  isFuture: false
                });
              }

              const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
              const color = colors[index % colors.length];

              return (
                <div key={habit.id} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">{habit.name}</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={habitData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 10 }}
                          interval={Math.floor(habitData.length / 5)}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-2 rounded shadow border text-xs">
                                  <p>{data.day}</p>
                                  <p>Performance: {data.performance}%</p>
                                  {data.isFuture && <p className="text-blue-500">Projected</p>}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="performance" radius={[2, 2, 0, 0]} fill={color} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
