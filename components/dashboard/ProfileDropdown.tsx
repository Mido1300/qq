'use client';

import { useState, useRef, useEffect } from 'react';
import { User, UserStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getStatusColor } from '@/lib/utils';
import ProfileModal from '../modals/ProfileModal';

interface ProfileDropdownProps {
  user: User;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setStatusOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const statusOptions = [
    { value: 'online', label: 'Online', color: 'green' },
    { value: 'break', label: 'On Break', color: 'yellow' },
    { value: 'shadow', label: 'Shadow', color: 'gray' },
    { value: 'offline', label: 'Offline', color: 'red' }
  ];
  
  const handleStatusChange = (status: UserStatus) => {
    setCurrentStatus(status);
    setStatusOpen(false);
  };
  
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center focus:outline-none"
          aria-label="Profile"
        >
          <img 
            className={`h-10 w-10 rounded-full object-cover border-2 border-${getStatusColor(currentStatus)}-500`} 
            src={user.avatar} 
            alt={`${user.name}'s avatar`} 
          />
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
            <div className="p-3 border-b dark:border-gray-700">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{user.role}</div>
            </div>
            
            {/* Status Options */}
            <div className="border-b dark:border-gray-700">
              <button 
                onClick={() => setStatusOpen(!statusOpen)}
                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <span className={`h-2 w-2 rounded-full bg-${getStatusColor(currentStatus)}-500 mr-2`}></span>
                <span>{statusOptions.find(s => s.value === currentStatus)?.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-auto"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {statusOpen && (
                <div className="px-2 py-1">
                  {statusOptions.map(status => (
                    <button 
                      key={status.value}
                      onClick={() => handleStatusChange(status.value as UserStatus)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                    >
                      <span className={`h-2 w-2 rounded-full bg-${status.color}-500 mr-2`}></span>
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="py-1">
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  setShowProfileModal(true);
                }}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View Profile
              </button>
              <button 
                onClick={logout}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </>
  );
}