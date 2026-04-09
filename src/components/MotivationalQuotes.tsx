'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';

const motivationalQuotes = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: "consistency"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "excellence"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "action"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "beginning"
  },
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    category: "journey"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "future"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
    category: "motivation"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "courage"
  },
  {
    text: "Your limitation\u2014it's only your imagination.",
    author: "Unknown",
    category: "potential"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "Dream it. Believe it. Build it.",
    author: "Unknown",
    category: "dreams"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    category: "effort"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    category: "endurance"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
    category: "daily"
  },
  {
    text: "Little things make big days.",
    author: "Unknown",
    category: "details"
  },
  {
    text: "It's going to be hard, but hard does not mean impossible.",
    author: "Unknown",
    category: "challenge"
  },
  {
    text: "Don't wait for opportunity. Create it.",
    author: "Unknown",
    category: "opportunity"
  },
  {
    text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    author: "Unknown",
    category: "strength"
  }
];

const categoryColors = {
  consistency: 'from-purple-100 to-lavender-100',
  excellence: 'from-blue-100 to-indigo-100',
  action: 'from-green-100 to-emerald-100',
  beginning: 'from-yellow-100 to-orange-100',
  journey: 'from-pink-100 to-rose-100',
  passion: 'from-red-100 to-pink-100',
  persistence: 'from-indigo-100 to-purple-100',
  future: 'from-cyan-100 to-blue-100',
  motivation: 'from-amber-100 to-yellow-100',
  courage: 'from-orange-100 to-red-100',
  potential: 'from-teal-100 to-cyan-100',
  growth: 'from-lime-100 to-green-100',
  dreams: 'from-violet-100 to-purple-100',
  effort: 'from-rose-100 to-pink-100',
  endurance: 'from-fuchsia-100 to-pink-100',
  daily: 'from-sky-100 to-blue-100',
  details: 'from-emerald-100 to-green-100',
  challenge: 'from-orange-100 to-amber-100',
  opportunity: 'from-purple-100 to-indigo-100',
  strength: 'from-blue-100 to-purple-100'
};

export const MotivationalQuotes: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const currentQuote = motivationalQuotes[currentQuoteIndex];
  const categoryGradient = categoryColors[currentQuote.category as keyof typeof categoryColors];

  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    setIsAutoRotating(false); // Stop auto-rotation when manually changed
  };

  const handleRandomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (newIndex === currentQuoteIndex);
    
    setCurrentQuoteIndex(newIndex);
    setIsAutoRotating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`bg-gradient-to-br ${categoryGradient} rounded-xl p-6 border border-purple-200 relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-lavender-200 rounded-full opacity-20 -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 capitalize">
              {currentQuote.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-lg transition-colors ${
                isAutoRotating 
                  ? 'bg-purple-200 text-purple-700' 
                  : 'bg-white text-gray-600'
              }`}
              title={isAutoRotating ? "Stop auto-rotation" : "Start auto-rotation"}
            >
              <RefreshCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRandomQuote}
              className="p-2 rounded-lg bg-white text-gray-600 hover:bg-purple-100 transition-colors"
              title="Random quote"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="text-lg font-medium text-gray-800 italic mb-3 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-gray-600 block not-italic">
              \u2014 {currentQuote.author}
            </cite>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            {motivationalQuotes.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => {
                  setCurrentQuoteIndex(index);
                  setIsAutoRotating(false);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuoteIndex 
                    ? 'bg-purple-600' 
                    : 'bg-purple-300 hover:bg-purple-400'
                }`}
                title={`Quote ${index + 1}`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuote}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Next \u2192
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
