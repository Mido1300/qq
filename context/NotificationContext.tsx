'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { Notification } from '@/types';
import { initialNotifications } from '@/lib/data';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (title: string, message: string) => void;
  markAllAsRead: () => void;
  markAsRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  showNotification: () => {},
  markAllAsRead: () => {},
  markAsRead: () => {}
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const showNotification = (title: string, message: string) => {
    const newNotification: Notification = {
      id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      title,
      message,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      showNotification,
      markAllAsRead,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);