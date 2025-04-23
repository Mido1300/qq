'use client';

import { useTasks } from '@/context/TaskContext';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskList() {
  const { filteredSortedTasks } = useTasks();
  
  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-primary">Tasks</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredSortedTasks.length} {filteredSortedTasks.length === 1 ? 'task' : 'tasks'} found
          </div>
        </div>
        
        <div className="divide-y dark:divide-gray-700">
          <AnimatePresence initial={false}>
            {filteredSortedTasks.length > 0 ? (
              filteredSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    exit: { duration: 0.2, delay: 0 }
                  }}
                >
                  <TaskItem task={task} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-gray-500 dark:text-gray-400"
              >
                No tasks found matching your filters
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}