'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { useTimers } from '@/context/TimerContext';
import { useNotifications } from '@/context/NotificationContext';
import { formatTime, getDueDateStatus, getPriorityColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import EditTaskModal from '../modals/EditTaskModal';
import ShareTaskModal from '../modals/ShareTaskModal';
import ConfirmationModal from '../modals/ConfirmationModal';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { users } = useAuth();
  const { toggleTaskCompletion, toggleTaskSelection, selectedTasks, deleteTask } = useTasks();
  const { taskTimer, startTaskTimer, stopTaskTimer } = useTimers();
  const { showNotification } = useNotifications();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const isSelected = selectedTasks.includes(task.id);
  const isTimerActive = taskTimer.taskId === task.id && taskTimer.isRunning;
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
    
    if (!task.completed) {
      showNotification('Task Completed', `"${task.title}" marked as complete`);
    }
  };
  
  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isTimerActive) {
      stopTaskTimer();
    } else {
      startTaskTimer(task.id);
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareModal(true);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };
  
  const confirmDelete = () => {
    deleteTask(task.id);
    showNotification('Task Deleted', `"${task.title}" has been deleted`);
    setShowDeleteConfirmation(false);
  };
  
  const handleTaskClick = () => {
    toggleTaskSelection(task.id);
  };
  
  // Get assignee
  const assignee = users.find(u => u.id === task.assignedTo);
  
  // Get due date status
  const dueStatus = getDueDateStatus(task.dueDate);
  
  // Format due date
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString();
  
  return (
    <>
      <div 
        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${task.completed ? 'bg-green-50 dark:bg-green-900/5' : ''} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800' : ''}`}
        onClick={handleTaskClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <input 
              type="checkbox" 
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 mt-1"
              checked={task.completed}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded">
                    {task.category}
                  </span>
                  <span className={`bg-${getPriorityColor(task.priority)}-100 dark:bg-${getPriorityColor(task.priority)}-900/20 text-${getPriorityColor(task.priority)}-800 dark:text-${getPriorityColor(task.priority)}-400 text-xs px-2 py-1 rounded`}>
                    {task.priority}
                  </span>
                  <span className="text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span>{formattedDueDate}</span>
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{assignee?.name || 'Unassigned'}</span>
                </div>
                
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                    {task.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="h-1 w-1 bg-gray-500 dark:bg-gray-400 rounded-full mr-2"></span>
                        <span>{subtask}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex flex-col items-end space-y-1 mb-2">
                  {dueStatus.status === 'overdue' && (
                    <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded">
                      Overdue by {dueStatus.daysRemaining} {dueStatus.daysRemaining === 1 ? 'day' : 'days'}
                    </span>
                  )}
                  {dueStatus.status === 'today' && (
                    <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded">
                      Due today
                    </span>
                  )}
                  {dueStatus.status === 'upcoming' && dueStatus.daysRemaining <= 3 && (
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded">
                      Due in {dueStatus.daysRemaining} {dueStatus.daysRemaining === 1 ? 'day' : 'days'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-3 pt-2 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleTimerToggle}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isTimerActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`} 
                  title={isTimerActive ? 'Stop Timer' : 'Start Timer'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {isTimerActive ? formatTime(taskTimer.elapsed) : formatTime(task.timer)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleShare}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Share Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                </button>
                <button 
                  onClick={handleEdit}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Edit Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-400 hover:text-red-500" 
                  title="Delete Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showEditModal && (
        <EditTaskModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={task}
        />
      )}
      
      {showShareModal && (
        <ShareTaskModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          task={task}
        />
      )}
      
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </>
  );
}