import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const trafficData = [
  { name: 'Nominal Traffic', value: 84.5, color: '#10B981' },
  { name: 'Suspicious Anomalies', value: 5.2, color: '#F59E0B' },
  { name: 'Malicious Intrusion', value: 10.3, color: '#EF4444' },
];

export const TrafficStatusDonut: React.FC = () => {
  return (
    <div className="w-full h-[220px] relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={trafficData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {trafficData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
            formatter={(value: any) => [`${value}%`, 'Volume']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold font-mono-tech text-white">84.5%</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Nominal</span>
      </div>
    </div>
  );
};

