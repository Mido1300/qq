import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Task, User, Sort, Filter, UserStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function filterTasks(tasks: Task[], filters: Filter): Task[] {
  return tasks.filter(task => {
    // Search filter
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category && task.category !== filters.category) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    // Status filter
    if (filters.status) {
      if (filters.status === 'Completed' && !task.completed) return false;
      if (filters.status === 'Active' && task.completed) return false;
    }
    
    // Date filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const taskDate = new Date(task.dueDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      if (taskDate < startDate || taskDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
}

export function sortTasks(tasks: Task[], sort: Sort): Task[] {
  return [...tasks].sort((a, b) => {
    let result;
    
    switch (sort.by) {
      case 'dueDate':
        result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        result = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      case 'created':
        result = new Date(a.created).getTime() - new Date(b.created).getTime();
        break;
      default:
        result = 0;
    }
    
    return sort.direction === 'asc' ? result : -result;
  });
}

export function getStatusColor(status: UserStatus): string {
  switch(status) {
    case 'online': return 'green';
    case 'break': return 'yellow';
    case 'shadow': return 'gray';
    case 'offline': return 'red';
    default: return 'gray';
  }
}

export function getPriorityColor(priority: string): string {
  switch(priority) {
    case 'High': return 'red';
    case 'Medium': return 'yellow';
    case 'Low': return 'gray';
    default: return 'gray';
  }
}

export function getUserName(userId: number, users: User[]): string {
  const user = users.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getDueDateStatus(dueDate: string): { status: 'overdue' | 'today' | 'upcoming'; daysRemaining: number } {
  const due = new Date(dueDate);
  const now = new Date();
  
  // Reset time parts for accurate day comparison
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const timeDiff = due.getTime() - today.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  
  if (daysDiff < 0) {
    return { status: 'overdue', daysRemaining: Math.floor(Math.abs(daysDiff)) };
  } else if (daysDiff < 1) {
    return { status: 'today', daysRemaining: 0 };
  } else {
    return { status: 'upcoming', daysRemaining: Math.floor(daysDiff) };
  }
}