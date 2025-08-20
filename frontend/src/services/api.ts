import axios from 'axios';
import { Task, TaskFormData, Analytics, TaskHistory } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/todoapppro/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('todoapppro_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taskAPI = {
  // Get all tasks with optional filters
  getTasks: async (params?: { sort?: string; priority?: string; status?: string }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: Partial<TaskFormData>): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Search tasks using multiple DSA algorithms
  searchTasks: async (query: string): Promise<Task[]> => {
    const response = await api.get('/tasks/search', { params: { q: query } });
    return response.data;
  },

  // Get autocomplete suggestions using Trie
  getAutocomplete: async (prefix: string): Promise<string[]> => {
    const response = await api.get('/tasks/autocomplete', { params: { prefix } });
    return response.data.suggestions;
  },

  // Get next important task using Priority Queue
  getNextImportantTask: async (): Promise<Task | null> => {
    const response = await api.get('/tasks/next-important');
    return response.data;
  },

  // Get task dependencies using Graph/Topological Sort
  getTaskDependencies: async (): Promise<string[]> => {
    const response = await api.get('/tasks/dependencies');
    return response.data.sortedTaskIds;
  },

  // Get task history using Linked List
  getTaskHistory: async (): Promise<TaskHistory[]> => {
    const response = await api.get('/tasks/history');
    return response.data;
  },

  // Get productivity analytics using Sliding Window
  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/tasks/analytics');
    return response.data;
  },

  // Update task flags using Bit Manipulation
  updateTaskFlags: async (taskId: string, flagPosition: number, value: boolean): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/flags/${flagPosition}`, { value });
    return response.data;
  },

  // Group related tasks using Union-Find
  groupTasks: async (taskIds: string[]): Promise<void> => {
    await api.post('/tasks/group', { taskIds });
  },

  // Check if tasks are related
  areTasksRelated: async (taskId1: string, taskId2: string): Promise<boolean> => {
    const response = await api.get(`/tasks/${taskId1}/related/${taskId2}`);
    return response.data.related;
  },

  // Undo last command using Stack
  undoLastCommand: async (): Promise<{ undone: any }> => {
    const response = await api.post('/tasks/undo');
    return response.data;
  },
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Professional error handling for production
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);

export default api;