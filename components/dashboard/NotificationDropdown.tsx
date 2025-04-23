'use client';

import { Notification } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: Notification[];
}

export default function NotificationDropdown({ isOpen, notifications }: NotificationDropdownProps) {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
    >
      <div className="p-3 border-b dark:border-gray-700">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`notification-item p-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
              >
                <div className="font-semibold">{notification.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="p-3 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        )}
      </div>
    </motion.div>
  );
}