'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { useNotifications } from '@/context/NotificationContext';
import ModalWrapper from './ModalWrapper';

export default function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { users } = useAuth();
  const { addTask } = useTasks();
  const { showNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
    notes: ''
  });
  
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('task-', '')]: value }));
  };
  
  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };
  
  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };
  
  const removeSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title) {
      alert('Please enter a task title');
      return;
    }
    
    // Filter out empty subtasks
    const filteredSubtasks = subtasks.filter(s => s.trim() !== '');
    
    // Add the task
    addTask({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority as 'High' | 'Medium' | 'Low',
      dueDate: formData.dueDate,
      completed: false,
      assignedTo: parseInt(formData.assignedTo) || 1,
      subtasks: filteredSubtasks,
      notes: formData.notes,
      timer: 0,
    });
    
    // Show notification
    showNotification('Task Added', `"${formData.title}" has been added`);
    
    // Close the modal
    onClose();
  };
  
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-title">
              Title
            </label>
            <input 
              id="task-title" 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-description">
              Description
            </label>
            <textarea 
              id="task-description" 
              rows={3} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              placeholder="Task description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-category">
                Category
              </label>
              <select 
                id="task-category" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Research">Research</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-priority">
                Priority
              </label>
              <select 
                id="task-priority" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-dueDate">
                Due Date
              </label>
              <input 
                id="task-dueDate" 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-assignedTo">
                Assign To
              </label>
              <select 
                id="task-assignedTo" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sub Tasks
            </label>
            <div className="space-y-2 mb-2">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
                    placeholder="Enter subtask"
                    value={subtask}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={addSubtask}
              className="text-primary hover:text-primary-dark text-sm flex items-center mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Add Subtask
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-notes">
              Additional Notes
            </label>
            <textarea 
              id="task-notes" 
              rows={2} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              placeholder="Additional notes or details"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Task
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}