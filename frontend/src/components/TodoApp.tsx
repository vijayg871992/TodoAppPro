import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, TrendingUp, Clock, Star, AlertTriangle, LogOut } from 'lucide-react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SearchBar from './SearchBar';
import Analytics from './Analytics';
import AnalyticsStats from './AnalyticsStats';
import RecentActivityDetails from './RecentActivityDetails';
import { taskAPI } from '../services/api';
import { Task } from '../types';
import { useAuth } from '../context/AuthContext';

function TodoApp() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'created'>('created');
  const [filterBy, setFilterBy] = useState<'all' | 'pending' | 'progress' | 'completed' | 'starred'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [nextImportantTask, setNextImportantTask] = useState<Task | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Get unique categories from API
    const getUniqueCategories = async () => {
      try {
        const response = await fetch('/todoapppro/api/tasks/categories', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data.categories);
        } else {
          // Fallback to extracting from tasks
          const allTasks = await taskAPI.getTasks();
          const categories = [...new Set(allTasks.map(task => task.category).filter(Boolean))];
          setAvailableCategories(categories);
        }
      } catch (error) {
        setAvailableCategories([]);
      }
    };
    
    getUniqueCategories();
  }, [tasks]);

  useEffect(() => {
    // Initialize app data on mount
    const initializeApp = async () => {
      try {
        await Promise.all([fetchTasks(), fetchNextImportantTask(), fetchAnalytics(), fetchHistory()]);
      } catch (error) {
        // App will gracefully handle individual component failures
      }
    };
    
    initializeApp();
  }, [sortBy, filterBy, categoryFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (sortBy !== 'created') params.sort = sortBy;
      if (filterBy !== 'all' && filterBy !== 'starred') {
        const statusMap = {
          'pending': 'Pending',
          'progress': 'In Progress', 
          'completed': 'Completed'
        };
        params.status = statusMap[filterBy];
      }
      
      let data = await taskAPI.getTasks(params);
      
      // Client-side filtering for starred tasks
      if (filterBy === 'starred') {
        data = data.filter(task => !!(task.flags & (1 << 1)));
      }
      
      // Client-side filtering by category
      if (categoryFilter !== 'all') {
        data = data.filter(task => task.category === categoryFilter);
      }
      
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextImportantTask = async () => {
    try {
      const task = await taskAPI.getNextImportantTask();
      setNextImportantTask(task);
    } catch (error) {
      // Next important task is optional feature
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await taskAPI.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      // Analytics failure shouldn't break the app
      setAnalytics({ avg: 0, trend: [], completedTasks: 0, pendingTasks: 0 });
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await taskAPI.getTaskHistory();
      setHistory(data.slice(0, 20)); // Show last 20 activities
    } catch (error) {
      // History failure shouldn't break the app
      setHistory([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        setLoading(true);
        const results = await taskAPI.searchTasks(query);
        setTasks(results);
      } catch (error) {
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      fetchTasks();
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await taskAPI.createTask(taskData);
      toast.success('Task created successfully!');
      setIsFormOpen(false);
      fetchTasks();
      fetchNextImportantTask();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskAPI.updateTask(id, updates);
      // More specific success message based on the update
      if (updates.status === 'Completed') {
        toast.success('✅ Task completed successfully!');
      } else if (updates.status === 'In Progress') {
        toast.success('🔄 Task set to In Progress');
      } else if (updates.status === 'Pending') {
        toast.success('⏳ Task set to Pending');
      } else {
        toast.success('Task updated successfully!');
      }
      setEditingTask(null);
      fetchTasks();
      fetchNextImportantTask();
      fetchAnalytics();
      fetchHistory();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.deleteTask(id);
      toast.success('Task deleted successfully!');
      fetchTasks();
      fetchNextImportantTask();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleFlag = async (task: Task, flagPosition: number) => {
    try {
      const currentValue = !!(task.flags & (1 << flagPosition));
      await taskAPI.updateTaskFlags(task._id, flagPosition, !currentValue);
      toast.success('Task flag updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task flag');
    }
  };

  const handleUndo = async () => {
    try {
      const result = await taskAPI.undoLastCommand();
      if (result.undone) {
        toast.success(`Undid: ${result.undone.action}`);
        fetchTasks();
      } else {
        toast.info('Nothing to undo');
      }
    } catch (error) {
      toast.error('Undo failed');
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'Medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                TodoAppPro 🚀
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}! Advanced task management with 19 DSAs
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Next Important Task Banner */}
        {nextImportantTask && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-blue-800 dark:text-blue-300">Next Important Task</span>
            </div>
            <div className="text-blue-900 dark:text-blue-100">
              <strong>{nextImportantTask.title}</strong> - {nextImportantTask.priority} priority
              {nextImportantTask.dueDate && (
                <span className="ml-2 text-sm">
                  Due: {new Date(nextImportantTask.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
            
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Undo
            </button>

            <div className="relative z-10">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full cursor-pointer relative z-10"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="created">Sort by Created</option>
                <option value="priority">Sort by Priority</option>
                <option value="deadline">Sort by Deadline</option>
              </select>
            </div>

            <div className="relative z-10">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full cursor-pointer relative z-10"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="starred">⭐ Starred</option>
              </select>
            </div>

            <div className="relative z-10">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full cursor-pointer relative z-10"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="all">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>📁 {category}</option>
                ))}
              </select>
            </div>
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Analytics Productivity Trend Graph - Keep at top */}
        <div className="mb-6">
          <Analytics />
        </div>

        {/* Main Content - Task List */}
        <div className="mb-6">
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            onToggleFlag={handleToggleFlag}
            getPriorityIcon={getPriorityIcon}
          />
        </div>

        {/* Analytics Stats - Below Tasks */}
        <div className="mb-6">
          <AnalyticsStats analytics={analytics} history={history} />
        </div>

        {/* Recent Activity Details - At Bottom */}
        <div className="mb-6">
          <RecentActivityDetails history={history} />
        </div>

        {/* Task Form Modal */}
        {(isFormOpen || editingTask) && (
          <TaskForm
            task={editingTask}
            isOpen={isFormOpen || !!editingTask}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask._id, data) : 
              handleCreateTask
            }
          />
        )}
      </div>
    </div>
  );
}

export default TodoApp;