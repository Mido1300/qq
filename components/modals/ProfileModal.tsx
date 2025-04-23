'use client';

import { useState } from 'react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import ModalWrapper from './ModalWrapper';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const { updateUser } = useAuth();
  const { showNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    role: user.role
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('profile-edit-', '')]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Update user data
    updateUser(formData);
    
    // Show notification
    showNotification('Profile Updated', 'Your profile has been updated successfully');
    
    // Close modal
    onClose();
  };
  
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="User Profile">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <img 
            className="h-24 w-24 rounded-full object-cover border-2 border-primary" 
            src={user.avatar} 
            alt="Profile Picture" 
          />
          <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          </button>
        </div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="profile-edit-name">
              Name
            </label>
            <input 
              id="profile-edit-name" 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="profile-edit-email">
              Email
            </label>
            <input 
              id="profile-edit-email" 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="profile-edit-phone">
              Phone
            </label>
            <input 
              id="profile-edit-phone" 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="profile-edit-country">
              Country
            </label>
            <select 
              id="profile-edit-country" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="AE">United Arab Emirates</option>
              <option value="EG">Egypt</option>
              <option value="SA">Saudi Arabia</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="profile-edit-role">
              Role
            </label>
            <select 
              id="profile-edit-role" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Customer">Customer</option>
            </select>
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
            Save Changes
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}