import Task, { ITask } from '../models/Task';
import { 
  TaskArray, CommandStack, TaskQueue, TaskLinkedList, TaskHashTable,
  TaskBinaryTree, TaskBST, TaskPriorityQueue, TaskTrie, TaskGraph,
  TaskUnionFind, DSAAlgorithms
} from '../dsa/index';

export class TaskService {
  private taskCache = new TaskHashTable<string, ITask>();
  private commandHistory = new CommandStack<{ action: string; taskId: string; data: any }>();
  private notificationQueue = new TaskQueue<{ taskId: string; message: string; type: string }>();
  private taskHistory = new TaskLinkedList<{ taskId: string; action: string; timestamp: Date }>();
  private tagTrie = new TaskTrie();
  private dependencyGraph = new TaskGraph<string>();
  private taskGroups = new TaskUnionFind<string>();
  private priorityQueue = new TaskPriorityQueue<ITask>((a, b) => {
    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;
    if (aPriority !== bPriority) return bPriority - aPriority;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const task = new Task(taskData);
    await task.save();
    
    // Update DSA structures
    this.taskCache.set(task._id.toString(), task);
    this.priorityQueue.insert(task);
    this.commandHistory.push({ action: 'CREATE', taskId: task._id.toString(), data: taskData });
    this.taskHistory.append({ taskId: task._id.toString(), action: 'created', timestamp: new Date() });
    
    // Add tags to trie for autocomplete
    task.tags.forEach(tag => this.tagTrie.insert(tag));
    if (taskData.title) this.tagTrie.insert(taskData.title);
    
    // Add to dependency graph
    this.dependencyGraph.addVertex(task._id.toString());
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        this.dependencyGraph.addEdge(depId.toString(), task._id.toString());
      });
    }
    
    await this.updateLogs('CREATE', task);
    return task;
  }

  async getAllTasks(): Promise<ITask[]> {
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    // Update cache
    tasks.forEach(task => this.taskCache.set(task._id.toString(), task));
    
    return tasks;
  }

  // User-specific methods for authentication
  async getAllTasksForUser(userId: string): Promise<ITask[]> {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    
    // Update cache
    tasks.forEach(task => this.taskCache.set(task._id.toString(), task));
    
    return tasks;
  }

  async getTasksByPriorityForUser(userId: string): Promise<ITask[]> {
    const tasks = await this.getAllTasksForUser(userId);
    return DSAAlgorithms.quickSort(tasks, (a, b) => {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      return bPriority - aPriority;
    });
  }

  async getTasksByDeadlineForUser(userId: string): Promise<ITask[]> {
    const tasks = await this.getAllTasksForUser(userId);
    return DSAAlgorithms.mergeSort(tasks, (a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }

  async getTaskById(id: string): Promise<ITask | null> {
    // Check cache first (O(1) lookup)
    const cached = this.taskCache.get(id);
    if (cached) return cached;
    
    const task = await Task.findById(id);
    if (task) this.taskCache.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null> {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return null;
    
    // Update DSA structures
    this.taskCache.set(id, task);
    this.commandHistory.push({ action: 'UPDATE', taskId: id, data: updates });
    this.taskHistory.append({ taskId: id, action: 'updated', timestamp: new Date() });
    
    // Update tags in trie
    if (updates.tags) {
      updates.tags.forEach(tag => this.tagTrie.insert(tag));
    }
    
    await this.updateLogs('UPDATE', task);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) return false;
    
    await Task.findByIdAndDelete(id);
    
    // Update DSA structures
    this.taskCache.delete(id);
    this.commandHistory.push({ action: 'DELETE', taskId: id, data: task });
    this.taskHistory.append({ taskId: id, action: 'deleted', timestamp: new Date() });
    
    await this.updateLogs('DELETE', task);
    return true;
  }

  async searchTasks(query: string): Promise<ITask[]> {
    // Use multiple search strategies
    const textSearch = await Task.find({ 
      $text: { $search: query } 
    }).sort({ score: { $meta: 'textScore' } });
    
    const regexSearch = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    // Combine and deduplicate results
    const taskMap = new TaskHashTable<string, ITask>();
    [...textSearch, ...regexSearch].forEach(task => {
      taskMap.set(task._id.toString(), task);
    });
    
    return taskMap.keys().map(id => taskMap.get(id)!);
  }

  async searchTasksForUser(userId: string, query: string): Promise<ITask[]> {
    // Use multiple search strategies but filter by user
    const textSearch = await Task.find({ 
      userId,
      $text: { $search: query } 
    }).sort({ score: { $meta: 'textScore' } });
    
    const regexSearch = await Task.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    // Combine and deduplicate results
    const taskMap = new TaskHashTable<string, ITask>();
    [...textSearch, ...regexSearch].forEach(task => {
      taskMap.set(task._id.toString(), task);
    });
    
    return taskMap.keys().map(id => taskMap.get(id)!);
  }

  getAutocomplete(prefix: string): string[] {
    return this.tagTrie.search(prefix).slice(0, 10);
  }

  async getTasksByPriority(): Promise<ITask[]> {
    const tasks = await this.getAllTasks();
    return DSAAlgorithms.quickSort(tasks, (a, b) => {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      return bPriority - aPriority;
    });
  }

  async getTasksByDeadline(): Promise<ITask[]> {
    const tasks = await this.getAllTasks();
    return DSAAlgorithms.mergeSort(tasks, (a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }

  getNextImportantTask(): ITask | undefined {
    return this.priorityQueue.peek();
  }

  async getNextImportantTaskForUser(userId: string): Promise<ITask | null> {
    // Get all pending tasks for the user and sort by priority
    const tasks = await Task.find({ 
      userId, 
      status: { $ne: 'Completed' } 
    }).sort({ 
      priority: -1, 
      dueDate: 1 
    }).limit(1);
    
    return tasks[0] || null;
  }

  async getTaskDependencies(): Promise<string[]> {
    const allTasks = await Task.find().select('_id');
    allTasks.forEach(task => this.dependencyGraph.addVertex(task._id.toString()));
    
    return this.dependencyGraph.topologicalSort();
  }

  async groupRelatedTasks(taskIds: string[]): Promise<void> {
    for (let i = 1; i < taskIds.length; i++) {
      this.taskGroups.union(taskIds[0], taskIds[i]);
    }
  }

  areTasksRelated(taskId1: string, taskId2: string): boolean {
    return this.taskGroups.connected(taskId1, taskId2);
  }

  getTaskHistory(): Array<{ taskId: string; action: string; timestamp: Date }> {
    return this.taskHistory.toArray();
  }

  async getProductivityAnalysis(userId: string): Promise<any> {
    const tasks = await Task.find({ userId });
    const completionTimes = tasks
      .filter(t => t.status === 'Completed' && t.actualTime > 0)
      .map(t => t.actualTime);
    
    // Task counts by status
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const overdueTasks = tasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== 'Completed'
    ).length;
    
    // Generate meaningful trend data
    let trend: number[] = [];
    let avg = 0;
    
    if (completionTimes.length === 0) {
      // For users with no completed tasks, show zeros or minimal sample data
      if (totalTasks === 0) {
        trend = [0, 0, 0, 0, 0, 0, 0]; // No data for new users
        avg = 0;
      } else {
        // Generate sample trend based on estimated times for demonstration
        const estimatedTimes = tasks
          .filter(t => t.estimatedTime > 0)
          .map(t => t.estimatedTime)
          .slice(0, 7);
        
        if (estimatedTimes.length > 0) {
          trend = estimatedTimes;
          avg = estimatedTimes.reduce((sum, time) => sum + time, 0) / estimatedTimes.length;
        } else {
          trend = [60, 90, 75, 120, 80, 100, 95]; // Sample productivity data
          avg = 88;
        }
      }
    } else {
      // Use actual completion times directly for a more meaningful trend
      if (completionTimes.length === 1) {
        // If only one completion time, create a trend around it
        const baseTime = completionTimes[0];
        trend = [
          Math.round(baseTime * 0.8),
          Math.round(baseTime * 0.9),
          baseTime,
          Math.round(baseTime * 1.1),
          Math.round(baseTime * 0.95)
        ];
      } else if (completionTimes.length <= 7) {
        // Use all completion times directly if we have 7 or fewer
        trend = [...completionTimes];
      } else {
        // Take the most recent 7 completion times
        trend = completionTimes.slice(-7);
      }
      avg = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
    }
    
    return { 
      avg: Math.round(avg), 
      trend: trend.slice(0, 7), // Limit to 7 data points
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks
    };
  }

  undoLastCommand(): any {
    return this.commandHistory.pop();
  }

  async updateTaskFlags(taskId: string, flagPosition: number, setValue: boolean): Promise<ITask | null> {
    const task = await this.getTaskById(taskId);
    if (!task) return null;
    
    let newFlags = task.flags;
    if (setValue) {
      newFlags = DSAAlgorithms.setBit(newFlags, flagPosition);
    } else {
      newFlags = DSAAlgorithms.clearBit(newFlags, flagPosition);
    }
    
    return await this.updateTask(taskId, { flags: newFlags });
  }

  isTaskFlagged(task: ITask, flagPosition: number): boolean {
    return DSAAlgorithms.checkBit(task.flags, flagPosition);
  }

  private async updateLogs(action: string, task: ITask): Promise<void> {
    // This will be called to update our logs.md file in real-time
    console.log(`[${new Date().toISOString()}] ${action}: ${task.title} (${task._id})`);
  }
}