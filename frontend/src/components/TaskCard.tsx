import React from 'react';
import { Edit, Trash2, Star, Archive, Clock, Calendar } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggleFlag: (task: Task, flagPosition: number) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdate,
  onToggleFlag,
  getPriorityIcon,
}) => {
  const isStarred = !!(task.flags & (1 << 1)); // Bit position 1 for starred
  const isArchived = !!(task.flags & (1 << 2)); // Bit position 2 for archived
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const handleStatusChange = (newStatus: Task['status']) => {
    onUpdate(task._id, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-l-red-500';
      case 'High': return 'border-l-orange-500';
      case 'Medium': return 'border-l-yellow-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${getPriorityColor(task.priority)} ${
      isArchived ? 'opacity-60' : ''
    } ${isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white text-base">
              {task.title}
            </h3>
            {getPriorityIcon(task.priority)}
            {isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            {isArchived && <Archive className="h-4 w-4 text-gray-500" />}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFlag(task, 1)}
              className={`p-2 rounded-lg transition-colors ${
                isStarred 
                  ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Toggle Star"
            >
              <Star className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(task._id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
            
            {task.estimatedTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{task.estimatedTime}m</span>
              </div>
            )}
            
            {task.category !== 'General' && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {task.category}
              </span>
            )}
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className={`px-3 py-1 pr-8 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(task.status)}`}
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1rem',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskCard;