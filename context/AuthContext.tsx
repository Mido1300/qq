'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { initialUsers } from '@/lib/data';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: Omit<User, 'id' | 'avatar'>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({ success: false, message: 'Auth context not initialized' }),
  register: async () => ({ success: false, message: 'Auth context not initialized' }),
  logout: () => {},
  updateUser: () => {},
  users: []
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: 'Login successful' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };
  
  const register = async (userData: Omit<User, 'id' | 'avatar'>): Promise<{ success: boolean; message: string }> => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser: User = {
      ...userData,
      id: users.length + 1,
      avatar: 'https://i.imgur.com/ShelJwI.jpg' // Default avatar
    };
    
    // Add to users array
    setUsers(prev => [...prev, newUser]);
    
    // Set as current user
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, message: 'Registration successful' };
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    
    // Update in users array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    
    // Update in local storage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);