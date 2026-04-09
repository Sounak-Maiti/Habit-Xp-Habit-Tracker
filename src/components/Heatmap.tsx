'use client';

import React, { useState, useEffect } from 'react';
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
    habitDays, 
    getHabitDay,
    calculateStreak 
  } = useHabitStore();

  // Day timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Global times state
  const [globalTimes, setGlobalTimes] = useState([
    { city: 'New York', timezone: 'America/New_York', time: '', offset: '' },
    { city: 'London', timezone: 'Europe/London', time: '', offset: '' },
    { city: 'Delhi', timezone: 'Asia/Kolkata', time: '', offset: '' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo', time: '', offset: '' },
    { city: 'Sydney', timezone: 'Australia/Sydney', time: '', offset: '' },
    { city: 'Dubai', timezone: 'Asia/Dubai', time: '', offset: '' }
  ]);

  // Update timer every second
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    updateGlobalTimes();
    const interval = setInterval(() => {
      updateTimer();
      updateGlobalTimes();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update global times
  const updateGlobalTimes = () => {
    const now = new Date();
    const updatedTimes = globalTimes.map(city => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: city.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      const timeString = now.toLocaleTimeString('en-US', options);
      
      // Get timezone offset
      const timeZoneDate = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const offset = (timeZoneDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
      const offsetString = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
      
      return {
        ...city,
        time: timeString,
        offset: offsetString
      };
    });
    
    setGlobalTimes(updatedTimes);
  };

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
  const bestDay = heatmapData.length > 0 
    ? heatmapData.reduce((best, current) => 
        current.percentage > best.percentage ? current : best
      , { percentage: 0, day: 0 })
    : { percentage: 0, day: 0 };
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
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-600" />
          Consistency Heatmap
        </h3>
      </div>

      <div className="p-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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

        {/* Day Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Day Timer</h4>
              <p className="text-xs text-gray-600">Time remaining until midnight</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-purple-200">
                <div className="flex items-center gap-1 text-2xl font-bold text-purple-700">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-purple-400">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-purple-400">:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Global Times</h4>
              <p className="text-xs text-gray-600">Important cities around the world</p>
            </div>
          </div>
          <div className="space-y-2">
            {globalTimes.map((city, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">{city.city}</div>
                <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-blue-200">
                  <div className="text-sm font-bold text-blue-700">{city.time}</div>
                  <div className="text-xs text-gray-500">{city.offset}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3D Rotating Globe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">World Clock</h4>
              <p className="text-xs text-gray-600">Global time visualization</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="relative w-24 h-24">
              {/* 3D Globe Container */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg overflow-hidden">
                {/* Globe Surface */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 animate-spin" style={{ animationDuration: '20s' }}>
                  {/* Continents simplified representation */}
                  <div className="absolute top-4 left-6 w-8 h-6 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute top-8 right-4 w-6 h-4 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute bottom-6 left-8 w-4 h-3 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute bottom-8 right-6 w-6 h-5 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute top-12 left-4 w-3 h-2 bg-green-600 rounded-full opacity-70"></div>
                </div>
                {/* Globe Shine Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-30"></div>
                {/* Globe Shadow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black opacity-20"></div>
              </div>
              {/* Globe Stand */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Virtual Pet - Animated Dog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl border border-pink-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Your Virtual Pet</h4>
              <p className="text-xs text-gray-600">Watch your playful companion!</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="relative w-32 h-32">
              {/* Dog Body */}
              <div className="absolute bottom-8 left-8 w-16 h-12 bg-amber-600 rounded-full">
                {/* Dog Head */}
                <div className="absolute -top-2 left-6 w-10 h-10 bg-amber-600 rounded-full">
                  {/* Dog Ears */}
                  <div className="absolute top-0 left-0 w-3 h-6 bg-amber-700 rounded-full transform -rotate-12"></div>
                  <div className="absolute top-0 right-0 w-3 h-6 bg-amber-700 rounded-full transform rotate-12"></div>
                  {/* Dog Eyes */}
                  <div className="absolute top-3 left-2 w-1 h-1 bg-black rounded-full animate-pulse"></div>
                  <div className="absolute top-3 right-2 w-1 h-1 bg-black rounded-full animate-pulse"></div>
                  {/* Dog Nose */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                </div>
                {/* Dog Tail */}
                <div className="absolute -right-2 top-2 w-8 h-2 bg-amber-600 rounded-full animate-pulse origin-left">
                  <div className="absolute inset-0 bg-amber-700 rounded-full"></div>
                </div>
                {/* Dog Legs */}
                <div className="absolute bottom-0 left-2 w-2 h-4 bg-amber-700 rounded-full"></div>
                <div className="absolute bottom-0 right-2 w-2 h-4 bg-amber-700 rounded-full"></div>
              </div>
              
              {/* Ball */}
              <motion.div
                animate={{
                  x: [0, 20, 0, -20, 0],
                  y: [0, -10, 0, -10, 0],
                  rotate: [0, 180, 360, 540, 720]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-6 right-4 w-6 h-6 bg-red-500 rounded-full shadow-lg"
              >
                <div className="absolute inset-1 bg-red-400 rounded-full"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-70"></div>
              </motion.div>

              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-400 rounded-full opacity-50"></div>
              
              {/* Motion Lines */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute bottom-10 left-2 w-4 h-0.5 bg-gray-400 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                className="absolute bottom-12 left-4 w-3 h-0.5 bg-gray-400 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                className="absolute bottom-8 left-6 w-2 h-0.5 bg-gray-400 rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
