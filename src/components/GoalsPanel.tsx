'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, Calendar, BookOpen, Dumbbell, User, Briefcase, Trash2, Edit2 } from 'lucide-react';
import { useHabitStore, Goal } from '@/store/habitStore';

export const GoalsPanel: React.FC = () => {
  const { goals, addGoal, removeGoal, updateGoal } = useHabitStore();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    targetDate: ''
  });

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'fitness': return <Dumbbell className="w-4 h-4" />;
      case 'career': return <Briefcase className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'academic': return 'from-blue-500 to-indigo-500';
      case 'fitness': return 'from-green-500 to-emerald-500';
      case 'career': return 'from-purple-500 to-pink-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const getCategoryBgColor = (category: Goal['category']) => {
    switch (category) {
      case 'academic': return 'bg-blue-50 border-blue-200';
      case 'fitness': return 'bg-green-50 border-green-200';
      case 'career': return 'bg-purple-50 border-purple-200';
      default: return 'bg-orange-50 border-orange-200';
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      addGoal(newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        targetDate: ''
      });
      setShowAddGoal(false);
    }
  };

  const handleUpdateGoal = (goalId: string) => {
    if (newGoal.title.trim()) {
      updateGoal(goalId, newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        targetDate: ''
      });
      setEditingGoal(null);
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal.id);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate || ''
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const goalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Long-term Goals
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddGoal(true)}
            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              variants={goalVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`mb-4 p-4 rounded-xl border-2 ${getCategoryBgColor(goal.category)} hover:shadow-md transition-shadow`}
            >
              {editingGoal === goal.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Goal title..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    autoFocus
                  />
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Description..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="personal">Personal</option>
                      <option value="academic">Academic</option>
                      <option value="fitness">Fitness</option>
                      <option value="career">Career</option>
                    </select>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateGoal(goal.id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingGoal(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(goal.category)} text-white`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEdit(goal)}
                        className="p-1 rounded text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeGoal(goal.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Goal Form */}
        <AnimatePresence>
          {showAddGoal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Goal title..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <div className="flex gap-2">
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="personal">Personal</option>
                    <option value="academic">Academic</option>
                    <option value="fitness">Fitness</option>
                    <option value="career">Career</option>
                  </select>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddGoal}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Goal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowAddGoal(false);
                      setNewGoal({
                        title: '',
                        description: '',
                        category: 'personal',
                        targetDate: ''
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.length === 0 && !showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No goals set yet. Add your first long-term goal!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
