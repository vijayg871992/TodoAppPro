"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const index_1 = require("../dsa/index");
class TaskService {
    constructor() {
        this.taskCache = new index_1.TaskHashTable();
        this.commandHistory = new index_1.CommandStack();
        this.notificationQueue = new index_1.TaskQueue();
        this.taskHistory = new index_1.TaskLinkedList();
        this.tagTrie = new index_1.TaskTrie();
        this.dependencyGraph = new index_1.TaskGraph();
        this.taskGroups = new index_1.TaskUnionFind();
        this.priorityQueue = new index_1.TaskPriorityQueue((a, b) => {
            const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;
            if (aPriority !== bPriority)
                return bPriority - aPriority;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }
    async createTask(taskData) {
        const task = new Task_1.default(taskData);
        await task.save();
        // Update DSA structures
        this.taskCache.set(task._id.toString(), task);
        this.priorityQueue.insert(task);
        this.commandHistory.push({ action: 'CREATE', taskId: task._id.toString(), data: taskData });
        this.taskHistory.append({ taskId: task._id.toString(), action: 'created', timestamp: new Date() });
        // Add tags to trie for autocomplete
        task.tags.forEach(tag => this.tagTrie.insert(tag));
        if (taskData.title)
            this.tagTrie.insert(taskData.title);
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
    async getAllTasks() {
        const tasks = await Task_1.default.find().sort({ createdAt: -1 });
        // Update cache
        tasks.forEach(task => this.taskCache.set(task._id.toString(), task));
        return tasks;
    }
    // User-specific methods for authentication
    async getAllTasksForUser(userId) {
        const tasks = await Task_1.default.find({ userId }).sort({ createdAt: -1 });
        // Update cache
        tasks.forEach(task => this.taskCache.set(task._id.toString(), task));
        return tasks;
    }
    async getTasksByPriorityForUser(userId) {
        const tasks = await this.getAllTasksForUser(userId);
        return index_1.DSAAlgorithms.quickSort(tasks, (a, b) => {
            const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;
            return bPriority - aPriority;
        });
    }
    async getTasksByDeadlineForUser(userId) {
        const tasks = await this.getAllTasksForUser(userId);
        return index_1.DSAAlgorithms.mergeSort(tasks, (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    async getTaskById(id) {
        // Check cache first (O(1) lookup)
        const cached = this.taskCache.get(id);
        if (cached)
            return cached;
        const task = await Task_1.default.findById(id);
        if (task)
            this.taskCache.set(id, task);
        return task;
    }
    async updateTask(id, updates) {
        const task = await Task_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!task)
            return null;
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
    async deleteTask(id) {
        const task = await this.getTaskById(id);
        if (!task)
            return false;
        await Task_1.default.findByIdAndDelete(id);
        // Update DSA structures
        this.taskCache.delete(id);
        this.commandHistory.push({ action: 'DELETE', taskId: id, data: task });
        this.taskHistory.append({ taskId: id, action: 'deleted', timestamp: new Date() });
        await this.updateLogs('DELETE', task);
        return true;
    }
    async searchTasks(query) {
        // Use multiple search strategies
        const textSearch = await Task_1.default.find({
            $text: { $search: query }
        }).sort({ score: { $meta: 'textScore' } });
        const regexSearch = await Task_1.default.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        });
        // Combine and deduplicate results
        const taskMap = new index_1.TaskHashTable();
        [...textSearch, ...regexSearch].forEach(task => {
            taskMap.set(task._id.toString(), task);
        });
        return taskMap.keys().map(id => taskMap.get(id));
    }
    getAutocomplete(prefix) {
        return this.tagTrie.search(prefix).slice(0, 10);
    }
    async getTasksByPriority() {
        const tasks = await this.getAllTasks();
        return index_1.DSAAlgorithms.quickSort(tasks, (a, b) => {
            const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;
            return bPriority - aPriority;
        });
    }
    async getTasksByDeadline() {
        const tasks = await this.getAllTasks();
        return index_1.DSAAlgorithms.mergeSort(tasks, (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    getNextImportantTask() {
        return this.priorityQueue.peek();
    }
    async getTaskDependencies() {
        const allTasks = await Task_1.default.find().select('_id');
        allTasks.forEach(task => this.dependencyGraph.addVertex(task._id.toString()));
        return this.dependencyGraph.topologicalSort();
    }
    async groupRelatedTasks(taskIds) {
        for (let i = 1; i < taskIds.length; i++) {
            this.taskGroups.union(taskIds[0], taskIds[i]);
        }
    }
    areTasksRelated(taskId1, taskId2) {
        return this.taskGroups.connected(taskId1, taskId2);
    }
    getTaskHistory() {
        return this.taskHistory.toArray();
    }
    async getProductivityAnalysis(userId) {
        const tasks = await Task_1.default.find({ userId });
        const completionTimes = tasks
            .filter(t => t.status === 'Completed' && t.actualTime > 0)
            .map(t => t.actualTime);
        // Task counts by status
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;
        // Generate meaningful trend data
        let trend = [];
        let avg = 0;
        if (completionTimes.length === 0) {
            // Generate sample trend based on estimated times for demonstration
            const estimatedTimes = tasks
                .filter(t => t.estimatedTime > 0)
                .map(t => t.estimatedTime)
                .slice(0, 7);
            if (estimatedTimes.length > 0) {
                trend = estimatedTimes;
                avg = estimatedTimes.reduce((sum, time) => sum + time, 0) / estimatedTimes.length;
            }
            else {
                trend = [60, 90, 75, 120, 80, 100, 95]; // Sample productivity data
                avg = 88;
            }
        }
        else {
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
            }
            else if (completionTimes.length <= 7) {
                // Use all completion times directly if we have 7 or fewer
                trend = [...completionTimes];
            }
            else {
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
    undoLastCommand() {
        return this.commandHistory.pop();
    }
    async updateTaskFlags(taskId, flagPosition, setValue) {
        const task = await this.getTaskById(taskId);
        if (!task)
            return null;
        let newFlags = task.flags;
        if (setValue) {
            newFlags = index_1.DSAAlgorithms.setBit(newFlags, flagPosition);
        }
        else {
            newFlags = index_1.DSAAlgorithms.clearBit(newFlags, flagPosition);
        }
        return await this.updateTask(taskId, { flags: newFlags });
    }
    isTaskFlagged(task, flagPosition) {
        return index_1.DSAAlgorithms.checkBit(task.flags, flagPosition);
    }
    async updateLogs(action, task) {
        // This will be called to update our logs.md file in real-time
        console.log(`[${new Date().toISOString()}] ${action}: ${task.title} (${task._id})`);
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map