export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  dependencies: string[];
  category: string;
  estimatedTime: number;
  actualTime: number;
  flags: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  tags: string[];
  dueDate: string;
  category: string;
  estimatedTime: number;
  dependencies: string[];
}

export interface SearchResults {
  tasks: Task[];
  suggestions: string[];
}

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  productivityTrend: number[];
}

export interface TaskHistory {
  taskId: string;
  action: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}