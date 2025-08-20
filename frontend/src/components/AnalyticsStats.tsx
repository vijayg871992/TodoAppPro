import React from 'react';
import { Clock, CheckCircle, AlertCircle, History } from 'lucide-react';

interface AnalyticsStatsProps {
  analytics: any;
  history: any[];
}

const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({ analytics, history }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Average Completion Time */}
      {analytics && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between lg:flex-col lg:items-center lg:text-center">
            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 lg:flex-col">
              <Clock className="h-4 w-4" />
              <span>Average Completion Time</span>
            </span>
            <span className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 lg:mt-2">
              {analytics.avg}min
            </span>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between lg:flex-col lg:items-center lg:text-center">
          <div className="flex items-center gap-2 lg:flex-col">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 lg:mt-2">
            {analytics?.completedTasks || 0}
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between lg:flex-col lg:items-center lg:text-center">
          <div className="flex items-center gap-2 lg:flex-col">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400 lg:mt-2">
            {analytics?.pendingTasks || 0}
          </div>
        </div>
      </div>

      {/* Recent Activity Count */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between lg:flex-col lg:items-center lg:text-center">
          <div className="flex items-center gap-2 lg:flex-col">
            <History className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Recent Activity</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400 lg:mt-2">
            {history.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsStats;