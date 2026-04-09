'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';

interface PlantStage {
  size: number;
  leaves: number;
  flowers: number;
  color: string;
}

// Generate dynamic plant stages based on number of habits
const generatePlantStages = (habitCount: number): PlantStage[] => {
  const stages: PlantStage[] = [];
  const maxStages = Math.max(habitCount + 1, 2); // At least 2 stages, plus one for each habit
  
  const greenShades = ['bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800'];
  
  for (let i = 0; i < maxStages; i++) {
    const progress = i / (maxStages - 1); // 0 to 1
    const colorIndex = Math.floor(progress * (greenShades.length - 1));
    
    stages.push({
      size: 20 + (progress * 60), // 20 to 80
      leaves: Math.floor(progress * Math.min(habitCount * 2, 12)), // Up to 12 leaves
      flowers: Math.floor(progress * Math.min(habitCount, 5)), // Up to 5 flowers
      color: greenShades[colorIndex]
    });
  }
  
  return stages;
};

export const AnimatedPlant: React.FC = () => {
  const { habits, habitDays, selectedYear, selectedMonth } = useHabitStore();
  const [currentStage, setCurrentStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  // Calculate plant growth based on TODAY'S habit completion only
  const calculateGrowth = () => {
    if (habits.length === 0) return 0;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let completedToday = 0;
    let totalHabits = habits.length;

    // Check today's completion for each habit
    habits.forEach(habit => {
      const habitDay = habitDays.find(hd => hd.habitId === habit.id && hd.date === todayStr);
      if (habitDay?.completed) {
        completedToday++;
      }
    });

    const completionRate = totalHabits > 0 ? completedToday / totalHabits : 0;
    const plantStages = generatePlantStages(totalHabits);
    const stageIndex = Math.floor(completionRate * (plantStages.length - 1));
    return Math.min(stageIndex, plantStages.length - 1);
  };

  useEffect(() => {
    // Check for midnight reset
    const today = new Date().toDateString();
    if (today !== currentDate) {
      // New day - reset plant to stage 0
      setCurrentStage(0);
      setCurrentDate(today);
      return;
    }

    const newStage = calculateGrowth();
    if (newStage !== currentStage) {
      setIsGrowing(newStage > currentStage);
      setCurrentStage(newStage);
      setTimeout(() => setIsGrowing(false), 500);
    }
  }, [habits, habitDays, selectedYear, selectedMonth, currentDate]);

  const plantStages = generatePlantStages(habits.length);
  const currentPlantStage = plantStages[currentStage] || plantStages[0] || { size: 20, leaves: 0, flowers: 0, color: 'bg-green-200' };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-green-100 min-h-[500px]"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Habit Garden</h3>
        <p className="text-sm text-gray-600">Your habits grow this plant!</p>
      </div>

      <div className="flex justify-center items-end h-64 relative">
        {/* Pot */}
        <motion.div
          className="absolute bottom-0 w-32 h-20 bg-gradient-to-b from-orange-600 to-orange-800 rounded-t-lg"
          style={{ zIndex: 1 }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-orange-900 rounded-t-lg"></div>
        </motion.div>

        {/* Plant Container */}
        <motion.div
          className="relative"
          style={{ zIndex: 2 }}
          animate={{ 
            scale: isGrowing ? [1, 1.1, 1] : 1,
            rotate: isGrowing ? [0, -2, 2, 0] : [0, 1, -1, 0],
          }}
          transition={{ 
            scale: { duration: 0.5 },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Stem */}
          <motion.div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-t from-green-700 to-green-500 rounded-full"
            style={{
              width: `${currentPlantStage.size / 8}px`,
              height: `${currentPlantStage.size}px`,
              bottom: '80px'
            }}
            animate={{
              height: [0, currentPlantStage.size],
              opacity: [0, 1],
              scaleY: [0.8, 1, 1.05, 1]
            }}
            transition={{ 
              height: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 0.6 },
              scaleY: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Leaves */}
          {Array.from({ length: currentPlantStage.leaves }).map((_, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const height = 20 + (index * 15);
            const size = currentPlantStage.size / 4;
            const leafDelay = index * 0.15;
            
            return (
              <motion.div
                key={index}
                className="absolute bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-sm"
                style={{
                  width: `${size}px`,
                  height: `${size * 1.5}px`,
                  bottom: `${80 + height}px`,
                  left: '50%',
                  transformOrigin: 'bottom center'
                }}
                animate={{
                  scale: [0, 1],
                  opacity: [0, 1],
                  rotate: [0, side * 30, side * 25, side * 30],
                  x: [0, side * 20, side * 22, side * 20],
                }}
                transition={{ 
                  scale: { duration: 0.8, delay: leafDelay, ease: "easeOut" },
                  opacity: { duration: 0.5, delay: leafDelay },
                  rotate: { 
                    duration: 4 + index * 0.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: leafDelay
                  },
                  x: { 
                    duration: 3 + index * 0.3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: leafDelay
                  }
                }}
              />
            );
          })}

          {/* Flowers */}
          {Array.from({ length: currentPlantStage.flowers }).map((_, index) => {
            const height = 30 + (index * 20);
            const side = index === 0 ? 0 : (index % 2 === 0 ? -1 : 1) * 15;
            const flowerDelay = 0.8 + index * 0.3;
            
            return (
              <motion.div
                key={`flower-${index}`}
                className="absolute"
                style={{
                  bottom: `${80 + height}px`,
                  left: '50%',
                  transform: `translateX(${side}px)`
                }}
                animate={{
                  rotate: [0, 2, -2, 0],
                  scale: [0.95, 1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 5 + index * 0.7, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Flower petals */}
                {Array.from({ length: 5 }).map((_, petalIndex) => (
                  <motion.div
                    key={petalIndex}
                    className="absolute bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-sm"
                    style={{
                      width: '14px',
                      height: '14px',
                      transform: `rotate(${petalIndex * 72}deg) translateY(-10px)`,
                      transformOrigin: 'center'
                    }}
                    animate={{
                      scale: [0, 1, 1.1, 1],
                      opacity: [0, 0.9, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      scale: { duration: 0.6, delay: flowerDelay + petalIndex * 0.05, ease: "easeOut" },
                      opacity: { duration: 0.4, delay: flowerDelay + petalIndex * 0.05 },
                      rotate: { duration: 2 + petalIndex * 0.2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                ))}
                {/* Flower center */}
                <motion.div
                  className="absolute bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-sm"
                  style={{
                    width: '10px',
                    height: '10px',
                    left: '2px',
                    top: '2px'
                  }}
                  animate={{
                    scale: [0, 1, 1.2, 1],
                    opacity: [0, 1]
                  }}
                  transition={{ 
                    scale: { duration: 0.5, delay: flowerDelay + 0.2, ease: "easeOut" },
                    opacity: { duration: 0.3, delay: flowerDelay + 0.2 }
                  }}
                />
              </motion.div>
            );
          })}

          {/* Growth indicator */}
          {isGrowing && (
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-green-200"
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: [0, -8, -12, -25],
                scale: [0.8, 1, 1.1, 0.9]
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              +1 Growth! 
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Growth Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Growth Progress</span>
          <span>{currentStage + 1}/{plantStages.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
            animate={{ width: `${((currentStage + 1) / plantStages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 text-center text-xs text-gray-500">
        {currentStage === 0 && "Complete today's habits to help your plant grow!"}
        {currentStage > 0 && currentStage < plantStages.length - 1 && `Great progress! Complete more habits for full bloom!`}
        {currentStage === plantStages.length - 1 && "Perfect! All habits completed today! Plant is in full bloom!"}
        <div className="mt-1 text-xs text-gray-400">Plant resets at midnight - start fresh tomorrow!</div>
      </div>
    </motion.div>
  );
};
