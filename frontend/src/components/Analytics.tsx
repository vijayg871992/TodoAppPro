import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { taskAPI } from '../services/api';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await taskAPI.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      // Analytics failure shouldn't break the app
      setAnalytics({ avg: 0, trend: [] });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Productivity Trend
        </h3>
      </div>

      {/* Productivity Trend Chart - Full Width */}
      {analytics && analytics.trend && analytics.trend.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-lg">
          <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Productivity Trend (Sliding Window)
          </div>
          <div className="flex items-end gap-2 md:gap-3 h-32 md:h-48 bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-inner overflow-x-auto">
            {analytics.trend.map((value: number, index: number) => {
              const maxValue = Math.max(...analytics.trend);
              const minValue = Math.min(...analytics.trend);
              const range = maxValue - minValue || 1;
              const normalizedHeight = maxValue > 0 ? ((value - minValue) / range) * 80 + 20 : 20;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full min-w-[40px]">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-t-lg w-full transition-all cursor-pointer min-h-[12px] shadow-sm"
                    style={{
                      height: `${normalizedHeight}%`,
                    }}
                    title={`Period ${index + 1}: ${value}min`}
                  />
                  <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-3 text-center font-medium">
            Time periods (most recent data)
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;