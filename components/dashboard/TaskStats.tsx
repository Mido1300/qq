'use client';

import { useTasks } from '@/context/TaskContext';
import { motion } from 'framer-motion';

export default function TaskStats() {
  const { tasks } = useTasks();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Calculate productivity score
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="col-span-1 md:col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-primary">Total Tasks</h2>
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-300"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-500 dark:text-blue-300">{totalTasks}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Completed Tasks</h2>
        <div className="flex items-center">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 dark:text-green-300"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500 dark:text-green-300">{completedTasks}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="col-span-1 md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-yellow-600 dark:text-yellow-400">Pending Tasks</h2>
        <div className="flex items-center">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 dark:text-yellow-300"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">{pendingTasks}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}