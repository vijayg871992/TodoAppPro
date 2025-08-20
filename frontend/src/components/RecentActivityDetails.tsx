import React from 'react';
import { History } from 'lucide-react';

interface RecentActivityDetailsProps {
  history: any[];
}

const RecentActivityDetails: React.FC<RecentActivityDetailsProps> = ({ history }) => {
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return 'bg-green-500';
      case 'updated': return 'bg-blue-500';  
      case 'deleted': return 'bg-red-500';
      case 'completed': return 'bg-purple-500';
      case 'status_changed': return 'bg-orange-500';
      case 'priority_changed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return '+';
      case 'updated': return '✓';
      case 'deleted': return '×';
      case 'completed': return '✓';
      case 'status_changed': return '🔄';
      case 'priority_changed': return '⚡';
      default: return '•';
    }
  };
  
  const getActionText = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return 'Task created';
      case 'updated': return 'Task updated';
      case 'deleted': return 'Task deleted';
      case 'completed': return 'Task completed';
      case 'status_changed': return 'Status changed';
      case 'priority_changed': return 'Priority changed';
      default: return `Task ${action.toLowerCase()}`;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-500" />
          <h4 className="font-medium text-gray-900 dark:text-white text-base">
            Recent Activity Details
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">(Linked List)</span>
        </div>
        {history.length > 5 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
            {history.length} total
          </span>
        )}
      </div>

      <div className="h-48 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#9CA3AF #F3F4F6'
      }}>
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} className="flex items-start gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 -mx-3 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className={`w-7 h-7 ${getActionColor(item.action)} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                {getActionIcon(item.action)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm block">
                  {getActionText(item.action)}
                </span>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 h-full flex items-center justify-center">
            <div>
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityDetails;