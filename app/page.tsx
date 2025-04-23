'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const { currentUser } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // This helps prevent hydration mismatch as auth state is determined client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // Show a simple loading state before client-side code runs
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return currentUser ? <Dashboard /> : <AuthPage />;
}