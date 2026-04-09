'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Zap } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

export const GamificationStats: React.FC = () => {
  const { 
    totalXP, 
    currentLevel, 
    currentStreak, 
    longestStreak, 
    achievements 
  } = useHabitStore();

  const xpToNextLevel = (currentLevel + 1) * 100 - totalXP;
  const currentLevelXP = totalXP % 100;
  const progressPercentage = currentLevelXP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* XP and Level */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-300" />
            <span className="text-2xl font-bold">Level {currentLevel}</span>
          </div>
          <div className="text-sm text-purple-100 mb-2">{totalXP} Total XP</div>
          
          {/* Progress Bar */}
          <div className="w-full bg-purple-800 rounded-full h-2 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-400 h-2 rounded-full"
            />
          </div>
          <div className="text-xs text-purple-200">
            {xpToNextLevel} XP to Level {currentLevel + 1}
          </div>
        </div>

        {/* Current Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-2xl font-bold">{currentStreak}</span>
          </div>
          <div className="text-sm text-purple-100">Day Streak</div>
          <div className="text-xs text-purple-200">Longest: {longestStreak} days</div>
        </div>

        {/* Achievements */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-2xl font-bold">{achievements.length}</span>
          </div>
          <div className="text-sm text-purple-100">Achievements</div>
          <div className="text-xs text-purple-200">Keep going!</div>
        </div>

        {/* Recent Achievement */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-lg font-bold">+10 XP</span>
          </div>
          <div className="text-sm text-purple-100">Per Habit</div>
          <div className="text-xs text-purple-200">+5 XP Streak Bonus</div>
        </div>
      </div>

      {/* Achievement Badges */}
      {achievements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-500">
          <div className="flex flex-wrap gap-2">
            {achievements.slice(-3).map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="bg-purple-800 rounded-full px-3 py-1 text-xs flex items-center gap-1"
              >
                <span className="text-yellow-300">{achievement.icon}</span>
                <span>{achievement.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
