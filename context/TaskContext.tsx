'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task, Filter, Sort, HistoryAction } from '@/types';
import { initialTasks } from '@/lib/data';
import { filterTasks, sortTasks } from '@/lib/utils';

interface TaskContextType {
  tasks: Task[];
  filteredSortedTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'created'>) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  toggleTaskCompletion: (taskId: number) => void;
  filters: Filter;
  setFilters: (filters: Filter) => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
  selectedTasks: number[];
  toggleTaskSelection: (taskId: number) => void;
  clearSelectedTasks: () => void;
  markSelectedTasksComplete: () => void;
  deleteSelectedTasks: () => void;
  view: 'list' | 'graph';
  setView: (view: 'list' | 'graph') => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  filteredSortedTasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskCompletion: () => {},
  filters: { search: '', category: '', priority: '', status: '', dateRange: { start: null, end: null } },
  setFilters: () => {},
  sort: { by: 'dueDate', direction: 'asc' },
  setSort: () => {},
  selectedTasks: [],
  toggleTaskSelection: () => {},
  clearSelectedTasks: () => {},
  markSelectedTasksComplete: () => {},
  deleteSelectedTasks: () => {},
  view: 'list',
  setView: () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<Filter>({
    search: '',
    category: '',
    priority: '',
    status: '',
    dateRange: { start: null, end: null }
  });
  const [sort, setSort] = useState<Sort>({ by: 'dueDate', direction: 'asc' });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [view, setView] = useState<'list' | 'graph'>('list');
  const [history, setHistory] = useState<{ actions: HistoryAction[]; position: number }>({
    actions: [],
    position: -1
  });
  
  // Load tasks from local storage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Failed to parse stored tasks');
      }
    }
  }, []);
  
  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Filter and sort tasks
  const filteredSortedTasks = sortTasks(filterTasks(tasks, filters), sort);
  
  // Add action to history
  const addToHistory = (action: HistoryAction) => {
    // If we're not at the end of the history, remove future actions
    if (history.position < history.actions.length - 1) {
      const newActions = history.actions.slice(0, history.position + 1);
      setHistory({
        actions: [...newActions, action],
        position: newActions.length
      });
    } else {
      setHistory({
        actions: [...history.actions, action],
        position: history.actions.length
      });
    }
  };
  
  // Add task
  const addTask = (task: Omit<Task, 'id' | 'created'>) => {
    const newTask: Task = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      created: new Date().toISOString().split('T')[0],
    };
    
    setTasks(prev => [...prev, newTask]);
    
    addToHistory({
      type: 'addTask',
      task: newTask
    });
  };
  
  // Update task
  const updateTask = (taskId: number, updates: Partial<Task>) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    addToHistory({
      type: 'editTask',
      taskId,
      previousState: { ...taskToUpdate }
    });
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));
  };
  
  // Delete task
  const deleteTask = (taskId: number) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    
    addToHistory({
      type: 'deleteTask',
      task: { ...taskToDelete }
    });
    
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    addToHistory({
      type: 'toggleCompletion',
      taskId,
      previousState: task.completed
    });
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };
  
  // Toggle task selection
  const toggleTaskSelection = (taskId: number) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    } else {
      setSelectedTasks(prev => [...prev, taskId]);
    }
  };
  
  // Clear selected tasks
  const clearSelectedTasks = () => {
    setSelectedTasks([]);
  };
  
  // Mark selected tasks complete
  const markSelectedTasksComplete = () => {
    if (selectedTasks.length === 0) return;
    
    // Create a record of previous states
    const previousState: Record<number, boolean> = {};
    selectedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        previousState[taskId] = task.completed;
      }
    });
    
    addToHistory({
      type: 'bulkToggleCompletion',
      taskIds: [...selectedTasks],
      previousState
    });
    
    setTasks(prev => prev.map(t => 
      selectedTasks.includes(t.id) ? { ...t, completed: true } : t
    ));
    
    setSelectedTasks([]);
  };
  
  // Delete selected tasks
  const deleteSelectedTasks = () => {
    if (selectedTasks.length === 0) return;
    
    // Get tasks to delete for history
    const tasksToDelete = tasks.filter(t => selectedTasks.includes(t.id));
    
    addToHistory({
      type: 'deleteMultipleTasks',
      tasks: tasksToDelete.map(t => ({ ...t }))
    });
    
    setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
  };
  
  // Undo
  const undo = () => {
    if (history.position < 0) return;
    
    const action = history.actions[history.position];
    
    // Perform undo based on action type
    switch (action.type) {
      case 'addTask':
        if (action.task) {
          setTasks(prev => prev.filter(t => t.id !== action.task!.id));
        }
        break;
        
      case 'deleteTask':
        if (action.task) {
          setTasks(prev => [...prev, action.task!]);
        }
        break;
        
      case 'deleteMultipleTasks':
        if (action.tasks) {
          setTasks(prev => [...prev, ...action.tasks!]);
        }
        break;
        
      case 'editTask':
        if (action.taskId && action.previousState) {
          setTasks(prev => prev.map(t => 
            t.id === action.taskId ? { ...action.previousState as Task } : t
          ));
        }
        break;
        
      case 'toggleCompletion':
        if (action.taskId !== undefined && action.previousState !== undefined) {
          setTasks(prev => prev.map(t => 
            t.id === action.taskId ? { ...t, completed: action.previousState as boolean } : t
          ));
        }
        break;
        
      case 'bulkToggleCompletion':
        if (action.taskIds && action.previousState) {
          const prevState = action.previousState as Record<number, boolean>;
          setTasks(prev => prev.map(t => 
            action.taskIds!.includes(t.id) ? { ...t, completed: prevState[t.id] } : t
          ));
        }
        break;
    }
    
    setHistory(prev => ({
      ...prev,
      position: prev.position - 1
    }));
  };
  
  // Redo
  const redo = () => {
    if (history.position >= history.actions.length - 1) return;
    
    const nextPosition = history.position + 1;
    const action = history.actions[nextPosition];
    
    // Perform redo based on action type
    switch (action.type) {
      case 'addTask':
        if (action.task) {
          setTasks(prev => [...prev, action.task!]);
        }
        break;
        
      case 'deleteTask':
        if (action.task) {
          setTasks(prev => prev.filter(t => t.id !== action.task!.id));
        }
        break;
        
      case 'deleteMultipleTasks':
        if (action.tasks) {
          const taskIds = action.tasks.map(t => t.id);
          setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
        }
        break;
        
      case 'editTask':
        // For edit, we don't have the "new" state, just the previous state
        // We'll just apply the action again manually
        if (action.taskId !== undefined) {
          const currentTasks = [...tasks];
          const taskIndex = currentTasks.findIndex(t => t.id === action.taskId);
          if (taskIndex >= 0) {
            const updatedTask = { ...currentTasks[taskIndex] };
            setTasks(prev => prev.map(t => t.id === action.taskId ? updatedTask : t));
          }
        }
        break;
        
      case 'toggleCompletion':
        if (action.taskId !== undefined && action.previousState !== undefined) {
          setTasks(prev => prev.map(t => 
            t.id === action.taskId ? { ...t, completed: !action.previousState as boolean } : t
          ));
        }
        break;
        
      case 'bulkToggleCompletion':
        if (action.taskIds) {
          setTasks(prev => prev.map(t => 
            action.taskIds!.includes(t.id) ? { ...t, completed: true } : t
          ));
        }
        break;
    }
    
    setHistory(prev => ({
      ...prev,
      position: nextPosition
    }));
  };
  
  // Calculate whether undo/redo are available
  const canUndo = history.position >= 0;
  const canRedo = history.position < history.actions.length - 1;

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredSortedTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      filters,
      setFilters,
      sort,
      setSort,
      selectedTasks,
      toggleTaskSelection,
      clearSelectedTasks,
      markSelectedTasksComplete,
      deleteSelectedTasks,
      view,
      setView,
      undo,
      redo,
      canUndo,
      canRedo
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);