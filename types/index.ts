export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  role: string;
  avatar: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  assignedTo: number;
  subtasks: string[];
  notes: string;
  created: string;
  timer: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
}

export interface Filter {
  search: string;
  category: string;
  priority: string;
  status: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export interface Sort {
  by: 'dueDate' | 'priority' | 'title' | 'created';
  direction: 'asc' | 'desc';
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface ChartDataset {
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  borderWidth?: number;
  label?: string;
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataState {
  status: ChartData;
  priority: ChartData;
  timeline: ChartData;
  category: ChartData;
}

export type UserStatus = 'online' | 'break' | 'shadow' | 'offline';

export interface AppState {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  notifications: Notification[];
  status: UserStatus;
  filters: Filter;
  sort: Sort;
  view: 'list' | 'graph';
  selectedTasks: number[];
  activeTimer: {
    taskId: number | null;
    startTime: Date | null;
    elapsed: number;
    interval: NodeJS.Timeout | null;
  };
  workTimer: {
    startTime: Date | null;
    elapsed: number;
    interval: NodeJS.Timeout | null;
  };
  darkMode: boolean;
}

export interface TimerState {
  taskId: number | null;
  startTime: Date | null;
  elapsed: number;
  isRunning: boolean;
}

export interface WorkTimerState {
  startTime: Date | null;
  elapsed: number;
  isRunning: boolean;
}

export interface HistoryAction {
  type: string;
  taskId?: number;
  taskIds?: number[];
  task?: Task;
  tasks?: Task[];
  previousState?: any;
  previousTasks?: Task[];
}

export interface History {
  actions: HistoryAction[];
  position: number;
}