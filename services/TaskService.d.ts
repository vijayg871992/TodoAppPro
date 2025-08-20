import { ITask } from '../models/Task';
export declare class TaskService {
    private taskCache;
    private commandHistory;
    private notificationQueue;
    private taskHistory;
    private tagTrie;
    private dependencyGraph;
    private taskGroups;
    private priorityQueue;
    createTask(taskData: Partial<ITask>): Promise<ITask>;
    getAllTasks(): Promise<ITask[]>;
    getAllTasksForUser(userId: string): Promise<ITask[]>;
    getTasksByPriorityForUser(userId: string): Promise<ITask[]>;
    getTasksByDeadlineForUser(userId: string): Promise<ITask[]>;
    getTaskById(id: string): Promise<ITask | null>;
    updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null>;
    deleteTask(id: string): Promise<boolean>;
    searchTasks(query: string): Promise<ITask[]>;
    getAutocomplete(prefix: string): string[];
    getTasksByPriority(): Promise<ITask[]>;
    getTasksByDeadline(): Promise<ITask[]>;
    getNextImportantTask(): ITask | undefined;
    getTaskDependencies(): Promise<string[]>;
    groupRelatedTasks(taskIds: string[]): Promise<void>;
    areTasksRelated(taskId1: string, taskId2: string): boolean;
    getTaskHistory(): Array<{
        taskId: string;
        action: string;
        timestamp: Date;
    }>;
    getProductivityAnalysis(userId: string): Promise<any>;
    undoLastCommand(): any;
    updateTaskFlags(taskId: string, flagPosition: number, setValue: boolean): Promise<ITask | null>;
    isTaskFlagged(task: ITask, flagPosition: number): boolean;
    private updateLogs;
}
//# sourceMappingURL=TaskService.d.ts.map