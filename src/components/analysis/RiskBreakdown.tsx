import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

type RiskBreakdownProps = {
  features: {
    urlLength: number;
    domainAge: number;
    hasSpecialChars: boolean;
    tldsCount: number;
  };
};

export default function RiskBreakdown({ features }: RiskBreakdownProps) {
  const data = [
    {
      name: 'URL Length',
      risk: features.urlLength > 100 ? 75 : features.urlLength > 50 ? 50 : 25,
    },
    {
      name: 'Domain Age',
      risk: features.domainAge < 30 ? 80 : features.domainAge < 180 ? 40 : 20,
    },
    {
      name: 'Special Chars',
      risk: features.hasSpecialChars ? 70 : 20,
    },
    {
      name: 'TLDs Count',
      risk: features.tldsCount > 1 ? 85 : 15,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Risk Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="risk"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}