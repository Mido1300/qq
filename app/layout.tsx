import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { TimerProvider } from '@/context/TimerContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'To-Do APP',
  description: 'A modern task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <TaskProvider>
              <NotificationProvider>
                <TimerProvider>
                  {children}
                </TimerProvider>
              </NotificationProvider>
            </TaskProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}