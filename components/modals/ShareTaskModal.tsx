'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { validateEmail } from '@/lib/utils';
import ModalWrapper from './ModalWrapper';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function ShareTaskModal({ isOpen, onClose, task }: ShareTaskModalProps) {
  const { users } = useAuth();
  const { showNotification } = useNotifications();
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  
  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setSelectedUsers(selectedValues);
  };
  
  const addEmail = () => {
    if (!email.trim()) return;
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setEmails([...emails, email]);
    setEmail('');
  };
  
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would call an API to share the task
    const totalRecipients = selectedUsers.length + emails.length;
    
    // Show notification
    showNotification('Task Shared', `"${task.title}" shared with ${totalRecipients} recipients`);
    
    // Close modal
    onClose();
  };
  
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Share Task: ${task.title}`}>
      <form onSubmit={handleSubmit}>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Share this task with team members or external collaborators</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="share-users">
            Team Members
          </label>
          <select 
            id="share-users" 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
            multiple
            value={selectedUsers}
            onChange={handleUserSelection}
          >
            {users.map(user => (
              <option key={user.id} value={user.id.toString()}>
                {user.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple users</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="share-email">
            Email
          </label>
          <div className="flex">
            <input 
              id="share-email" 
              type="email" 
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
            />
            <button 
              type="button"
              onClick={addEmail}
              className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        </div>
        
        {emails.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {emails.map((email, index) => (
              <div key={index} className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded flex items-center">
                <span className="mr-2">{email}</span>
                <button 
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-primary hover:text-primary-dark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Permission
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input 
                id="share-view" 
                type="radio" 
                name="share-permission" 
                value="view" 
                className="h-4 w-4 text-primary focus:ring-primary"
                checked={permission === 'view'}
                onChange={() => setPermission('view')}
              />
              <label htmlFor="share-view" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                View Only
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="share-edit" 
                type="radio" 
                name="share-permission" 
                value="edit" 
                className="h-4 w-4 text-primary focus:ring-primary"
                checked={permission === 'edit'}
                onChange={() => setPermission('edit')}
              />
              <label htmlFor="share-edit" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Edit
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
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
            disabled={selectedUsers.length === 0 && emails.length === 0}
          >
            Share
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}