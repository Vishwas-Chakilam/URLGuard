import { motion } from 'framer-motion';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { TrophyIcon, ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';
import StatsOverview from './StatsOverview';
import PointsChart from './PointsChart';

export default function UserDashboard() {
  const { stats, achievements } = useGamification();
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Level {stats.level}</h3>
            <ChartBarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.points}</p>
          <p className="text-sm text-gray-500">Total Points</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.points % 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {100 - (stats.points % 100)} points to next level
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Streak</h3>
            <FireIcon className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-500">{stats.streak}</p>
          <p className="text-sm text-gray-500">Days Active</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">URLs Analyzed</h3>
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.urlsAnalyzed}</p>
          <p className="text-sm text-gray-500">Total Scans</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsOverview />
        <PointsChart />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center space-x-4"
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}