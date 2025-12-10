import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', threats: 4 },
  { name: '04:00', threats: 3 },
  { name: '08:00', threats: 15 },
  { name: '12:00', threats: 25 },
  { name: '16:00', threats: 18 },
  { name: '20:00', threats: 32 },
  { name: '24:00', threats: 20 },
];

const ThreatChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area type="monotone" dataKey="threats" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreatChart;
