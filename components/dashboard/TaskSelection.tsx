'use client';

import { useTasks } from '@/context/TaskContext';
import { useNotifications } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useState } from 'react';

export default function TaskSelection() {
  const { selectedTasks, clearSelectedTasks, markSelectedTasksComplete, deleteSelectedTasks } = useTasks();
  const { showNotification } = useNotifications();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const handleMarkComplete = () => {
    markSelectedTasksComplete();
    showNotification('Tasks Completed', `${selectedTasks.length} tasks marked as complete`);
  };
  
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };
  
  const confirmDelete = () => {
    deleteSelectedTasks();
    showNotification('Tasks Deleted', `${selectedTasks.length} tasks have been deleted`);
    setShowDeleteConfirmation(false);
  };
  
  if (selectedTasks.length === 0) return null;
  
  return (
    <>
      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{selectedTasks.length}</span> tasks selected
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleMarkComplete}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block"><path d="M20 6 9 17l-5-5"/></svg> 
                  Mark Complete
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  Delete
                </button>
                <button 
                  onClick={clearSelectedTasks}
                  className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Tasks"
        message={`Are you sure you want to delete ${selectedTasks.length} selected tasks?`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </>
  );
}