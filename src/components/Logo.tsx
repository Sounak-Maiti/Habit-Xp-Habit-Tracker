'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Logo container matching uploaded design */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Habit Tracker
        </h1>
        <p className="text-sm text-gray-600">Build better habits, one day at a time</p>
      </div>
    </div>
  );
};
