import express from 'express';
import { TaskService } from '../services/TaskService';
import { authenticate, AuthRequest } from '../middleware/auth';
import Task, { ITask } from '../models/Task';

const router = express.Router();
const taskService = new TaskService();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/tasks - Get all tasks for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { sort, priority, status } = req.query;
    const userId = req.user._id;
    let tasks = await taskService.getAllTasksForUser(userId);
    
    // Apply filters
    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    
    // Apply sorting using DSA algorithms
    if (sort === 'priority') {
      tasks = await taskService.getTasksByPriorityForUser(userId);
    } else if (sort === 'deadline') {
      tasks = await taskService.getTasksByDeadlineForUser(userId);
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/search?q=query - Search tasks
router.get('/search', async (req: AuthRequest, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const tasks = await taskService.searchTasksForUser(req.user._id, query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/tasks/autocomplete?prefix=text - Get autocomplete suggestions
router.get('/autocomplete', async (req, res) => {
  try {
    const prefix = req.query.prefix as string;
    if (!prefix) {
      return res.status(400).json({ error: 'Prefix required' });
    }
    
    const suggestions = taskService.getAutocomplete(prefix);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Autocomplete failed' });
  }
});

// GET /api/tasks/next-important - Get next important task using priority queue
router.get('/next-important', authenticate, async (req: AuthRequest, res) => {
  try {
    const task = await taskService.getNextImportantTaskForUser(req.user._id);
    res.json(task || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get next important task' });
  }
});

// GET /api/tasks/dependencies - Get task dependencies using topological sort
router.get('/dependencies', async (req, res) => {
  try {
    const sortedTasks = await taskService.getTaskDependencies();
    res.json({ sortedTaskIds: sortedTasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task dependencies' });
  }
});

// GET /api/tasks/history - Get task history using linked list
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    // Generate user-specific recent activity from actual tasks
    const tasks = await Task.find({ userId: req.user!._id }).sort({ updatedAt: -1 }).limit(10);
    const history = tasks.map((task: ITask) => ({
      taskId: task._id.toString(),
      action: task.status === 'Completed' ? 'completed' : 
              task.status === 'In Progress' ? 'started' : 'created',
      timestamp: task.updatedAt || task.createdAt
    }));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task history' });
  }
});

// GET /api/tasks/analytics - Get productivity analytics using sliding window
router.get('/analytics', authenticate, async (req: AuthRequest, res) => {
  try {
    const analytics = await taskService.getProductivityAnalysis(req.user!._id);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// GET /api/tasks/categories - Get user's categories
router.get('/categories', authenticate, async (req: AuthRequest, res) => {
  try {
    const categories = await Task.distinct('category', { userId: req.user._id });
    res.json({ categories: categories.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const taskData = { ...req.body, userId: req.user._id };
    const task = await taskService.createTask(taskData);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id/flags/:flag - Update task flags using bit manipulation
router.patch('/:id/flags/:flag', async (req, res) => {
  try {
    const taskId = req.params.id;
    const flagPosition = parseInt(req.params.flag);
    const { value } = req.body; // true or false
    
    if (isNaN(flagPosition) || flagPosition < 0 || flagPosition > 31) {
      return res.status(400).json({ error: 'Invalid flag position (0-31)' });
    }
    
    const task = await taskService.updateTaskFlags(taskId, flagPosition, !!value);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task flags' });
  }
});

// POST /api/tasks/group - Group related tasks using union-find
router.post('/group', async (req, res) => {
  try {
    const { taskIds } = req.body;
    if (!Array.isArray(taskIds) || taskIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 task IDs required' });
    }
    
    await taskService.groupRelatedTasks(taskIds);
    res.json({ message: 'Tasks grouped successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to group tasks' });
  }
});

// GET /api/tasks/:id1/related/:id2 - Check if tasks are related
router.get('/:id1/related/:id2', async (req, res) => {
  try {
    const related = taskService.areTasksRelated(req.params.id1, req.params.id2);
    res.json({ related });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check task relation' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// POST /api/tasks/undo - Undo last command using stack
router.post('/undo', async (req, res) => {
  try {
    const lastCommand = taskService.undoLastCommand();
    if (!lastCommand) {
      return res.status(400).json({ error: 'No command to undo' });
    }
    res.json({ undone: lastCommand });
  } catch (error) {
    res.status(500).json({ error: 'Failed to undo command' });
  }
});

export default router;