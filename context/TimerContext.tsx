'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { TimerState, WorkTimerState } from '@/types';
import { useTasks } from './TaskContext';
import { formatTime } from '@/lib/utils';

interface TimerContextType {
  taskTimer: TimerState;
  workTimer: WorkTimerState;
  startTaskTimer: (taskId: number) => void;
  pauseTaskTimer: () => void;
  resumeTaskTimer: () => void;
  stopTaskTimer: () => void;
  startWorkTimer: () => void;
  pauseWorkTimer: () => void;
  stopWorkTimer: () => void;
  formattedTaskTime: string;
  formattedWorkTime: string;
}

const TimerContext = createContext<TimerContextType>({
  taskTimer: {
    taskId: null,
    startTime: null,
    elapsed: 0,
    isRunning: false
  },
  workTimer: {
    startTime: null,
    elapsed: 0,
    isRunning: false
  },
  startTaskTimer: () => {},
  pauseTaskTimer: () => {},
  resumeTaskTimer: () => {},
  stopTaskTimer: () => {},
  startWorkTimer: () => {},
  pauseWorkTimer: () => {},
  stopWorkTimer: () => {},
  formattedTaskTime: '00:00:00',
  formattedWorkTime: '00:00:00'
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const { tasks, updateTask } = useTasks();
  
  const [taskTimer, setTaskTimer] = useState<TimerState>({
    taskId: null,
    startTime: null,
    elapsed: 0,
    isRunning: false
  });
  
  const [workTimer, setWorkTimer] = useState<WorkTimerState>({
    startTime: null,
    elapsed: 0,
    isRunning: false
  });
  
  const [taskInterval, setTaskInterval] = useState<NodeJS.Timeout | null>(null);
  const [workInterval, setWorkInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Format times
  const formattedTaskTime = formatTime(taskTimer.elapsed);
  const formattedWorkTime = formatTime(workTimer.elapsed);
  
  // Task timer functions
  const startTaskTimer = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // If there's already a timer running, stop it
    if (taskTimer.isRunning) {
      stopTaskTimer();
    }
    
    setTaskTimer({
      taskId,
      startTime: new Date(),
      elapsed: task.timer,
      isRunning: true
    });
    
    // Start interval
    const interval = setInterval(() => {
      setTaskTimer(prev => ({
        ...prev,
        elapsed: task.timer + (new Date().getTime() - (prev.startTime?.getTime() || 0))
      }));
    }, 1000);
    
    setTaskInterval(interval);
  };
  
  const pauseTaskTimer = () => {
    if (!taskTimer.isRunning || !taskTimer.taskId) return;
    
    // Clear interval
    if (taskInterval) {
      clearInterval(taskInterval);
      setTaskInterval(null);
    }
    
    // Save current elapsed time
    const currentElapsed = taskTimer.elapsed;
    setTaskTimer(prev => ({
      ...prev,
      isRunning: false
    }));
    
    // Update task with current timer value
    updateTask(taskTimer.taskId, { timer: currentElapsed });
  };
  
  const resumeTaskTimer = () => {
    if (taskTimer.isRunning || !taskTimer.taskId) return;
    
    setTaskTimer(prev => ({
      ...prev,
      startTime: new Date(),
      isRunning: true
    }));
    
    // Restart interval
    const interval = setInterval(() => {
      setTaskTimer(prev => ({
        ...prev,
        elapsed: prev.elapsed + 1000
      }));
    }, 1000);
    
    setTaskInterval(interval);
  };
  
  const stopTaskTimer = () => {
    if (!taskTimer.taskId) return;
    
    // Clear interval
    if (taskInterval) {
      clearInterval(taskInterval);
      setTaskInterval(null);
    }
    
    // Save final elapsed time
    const finalElapsed = taskTimer.elapsed;
    
    // Update task with final timer value
    updateTask(taskTimer.taskId, { timer: finalElapsed });
    
    // Reset timer state
    setTaskTimer({
      taskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false
    });
  };
  
  // Work timer functions
  const startWorkTimer = () => {
    if (workTimer.isRunning) return;
    
    setWorkTimer(prev => ({
      ...prev,
      startTime: new Date(),
      isRunning: true
    }));
    
    // Start interval
    const interval = setInterval(() => {
      setWorkTimer(prev => ({
        ...prev,
        elapsed: prev.elapsed + 1000
      }));
    }, 1000);
    
    setWorkInterval(interval);
  };
  
  const pauseWorkTimer = () => {
    if (!workTimer.isRunning) return;
    
    // Clear interval
    if (workInterval) {
      clearInterval(workInterval);
      setWorkInterval(null);
    }
    
    setWorkTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };
  
  const stopWorkTimer = () => {
    // Clear interval
    if (workInterval) {
      clearInterval(workInterval);
      setWorkInterval(null);
    }
    
    // Reset timer state
    setWorkTimer({
      startTime: null,
      elapsed: 0,
      isRunning: false
    });
  };
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (taskInterval) clearInterval(taskInterval);
      if (workInterval) clearInterval(workInterval);
    };
  }, [taskInterval, workInterval]);
  
  return (
    <TimerContext.Provider value={{
      taskTimer,
      workTimer,
      startTaskTimer,
      pauseTaskTimer,
      resumeTaskTimer,
      stopTaskTimer,
      startWorkTimer,
      pauseWorkTimer,
      stopWorkTimer,
      formattedTaskTime,
      formattedWorkTime
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = () => useContext(TimerContext);