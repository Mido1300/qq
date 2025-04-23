'use client';

import { useState } from 'react';
import Header from './Header';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import TaskSelection from './TaskSelection';
import AnalyticsView from './AnalyticsView';
import { useTasks } from '@/context/TaskContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
  const { view } = useTasks();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TaskStats />
        </motion.div>
        
        <TaskFilters />
        
        <TaskSelection />
        
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskList />
            </motion.div>
          ) : (
            <motion.div
              key="graph-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}