'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

const COLORS = [
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const PieCharts: React.FC = () => {
  const { habits, selectedYear, selectedMonth, getDaysInMonth, getHabitDay } = useHabitStore();

  // Calculate real habit completion data for pie chart
  const habitCompletionData = habits.map(habit => {
    const totalDays = getDaysInMonth();
    let completedDays = 0;
    
    // Count actual completed days for this habit
    for (let day = 1; day <= totalDays; day++) {
      const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (getHabitDay(habit.id, date)) {
        completedDays++;
      }
    }
    
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return {
      name: habit.name,
      value: Math.round(completionRate),
      completed: completedDays,
      total: totalDays,
    };
  }).filter(habit => habit.value > 0); // Only show habits with some completion

  // Calculate category distribution
  const categoryData = habits.reduce((acc, habit) => {
    const category = habit.category || 'General';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate real weekly performance
  const calculateWeeklyPerformance = () => {
    const weeks = [
      { name: 'Week 1', start: 1, end: 7, fill: '#8b5cf6' },
      { name: 'Week 2', start: 8, end: 14, fill: '#ec4899' },
      { name: 'Week 3', start: 15, end: 21, fill: '#3b82f6' },
      { name: 'Week 4', start: 22, end: 28, fill: '#10b981' },
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

      const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
      return {
        name: week.name,
        value: Math.round(completionRate),
        fill: week.fill,
        completed: totalCompleted,
        total: totalPossible,
      };
    }).filter(week => week.total > 0); // Only show weeks that have days
  };

  const weeklyData = calculateWeeklyPerformance();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-purple-200">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-sm text-purple-600">
            {data.completed ? `${data.completed}/${data.total} days` : `${data.value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if slice is too small

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Habit Completion Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Habit Completion</h3>
          </div>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={habitCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {habitCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Performance */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Weekly Performance</h3>
          </div>
          
          <div className="h-64 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={weeklyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
