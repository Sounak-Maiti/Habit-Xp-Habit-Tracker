'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Share2, X, Download } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

interface LevelBadgeProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ isVisible, onClose }) => {
  const { currentLevel, totalXP, currentStreak } = useHabitStore();
  const [isSharing, setIsSharing] = useState(false);

  const generateBadgeData = () => {
    return {
      level: currentLevel,
      xp: totalXP,
      streak: currentStreak,
      date: new Date().toLocaleDateString(),
      title: `Level ${currentLevel} Habit Master`,
      subtitle: `${totalXP} XP Total`,
      achievement: `Level ${currentLevel} Achieved!`
    };
  };

  const shareBadge = async () => {
    setIsSharing(true);
    const badgeData = generateBadgeData();
    
    const shareText = `I just reached Level ${badgeData.level} in my habit tracker! 
${badgeData.achievement}
${badgeData.subtitle}
${badgeData.streak > 0 ? `Current streak: ${badgeData.streak} days!` : ''}
Join me in leveling up your habits!`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: badgeData.title,
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Badge info copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadBadge = () => {
    // Create a canvas to generate the badge image
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 200);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 200);
    
    // White overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, 400, 200);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${currentLevel}`, 200, 60);
    
    ctx.font = '16px Arial';
    ctx.fillText('Habit Master', 200, 90);
    
    ctx.font = '14px Arial';
    ctx.fillText(`${totalXP} XP Total`, 200, 120);
    
    if (currentStreak > 0) {
      ctx.fillText(`Streak: ${currentStreak} days`, 200, 145);
    }
    
    ctx.font = '12px Arial';
    ctx.fillText(new Date().toLocaleDateString(), 200, 175);
    
    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `level-${currentLevel}-badge.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Badge Content */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3, repeatDelay: 1 }}
                className="inline-block mb-4"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Trophy className="w-12 h-12" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Level {currentLevel} Achieved! 
              </h2>
              <p className="text-gray-600 mb-4">
                You've unlocked new heights in your habit journey!
              </p>
              
              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                  <div className="text-xs text-gray-500">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentLevel}</div>
                  <div className="text-xs text-gray-500">Current Level</div>
                </div>
                {currentStreak > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                    <div className="text-xs text-gray-500">Day Streak</div>
                  </div>
                )}
              </div>
              
              {/* Badge Visual */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-800">Level {currentLevel} Habit Master</span>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {totalXP} XP Total
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={shareBadge}
                disabled={isSharing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                {isSharing ? 'Sharing...' : 'Share Badge'}
              </button>
              
              <button
                onClick={downloadBadge}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              
              <button
                onClick={onClose}
                className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
