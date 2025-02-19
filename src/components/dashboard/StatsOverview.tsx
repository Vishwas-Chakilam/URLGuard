import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useGamification } from '../../contexts/GamificationContext';

const COLORS = ['#10B981', '#EF4444'];

export default function StatsOverview() {
  const { stats } = useGamification();

  const data = [
    { name: 'Safe URLs', value: stats.urlsAnalyzed - stats.maliciousDetected },
    { name: 'Malicious URLs', value: stats.maliciousDetected },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Analysis Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Safe URLs</p>
          <p className="text-2xl font-bold text-green-500">
            {stats.urlsAnalyzed - stats.maliciousDetected}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Malicious URLs</p>
          <p className="text-2xl font-bold text-red-500">
            {stats.maliciousDetected}
          </p>
        </div>
      </div>
    </div>
  );
}