import { useState } from 'react';
import { format } from 'date-fns';
import { useUrlHistory } from '../contexts/UrlHistoryContext';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function History() {
  const { history } = useUrlHistory();
  const [filter, setFilter] = useState<'all' | 'safe' | 'malicious'>('all');

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Analysis History</h1>
      
      <div className="mb-6 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'safe' | 'malicious')}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="all">All URLs</option>
          <option value="safe">Safe URLs</option>
          <option value="malicious">Malicious URLs</option>
        </select>
      </div>

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Analysis Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status === 'safe' ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Safe
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Malicious
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm truncate max-w-md">
                    {item.url}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(item.timestamp, 'PPp')}
                </td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No analysis history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}