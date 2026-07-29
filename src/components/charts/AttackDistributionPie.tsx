import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AttackDistributionProps {
  data?: { name: string; value: number; color: string }[];
}

const defaultData = [
  { name: 'Normal', value: 7850, color: '#10B981' },
  { name: 'DoS Attack', value: 1240, color: '#EF4444' },
  { name: 'Fuzzy Attack', value: 680, color: '#F97316' },
  { name: 'Gear Injection', value: 340, color: '#EAB308' },
  { name: 'RPM Spoofing', value: 210, color: '#A855F7' },
];

export const AttackDistributionPie: React.FC<AttackDistributionProps> = ({ data = defaultData }) => {
  return (
    <div className="w-full h-[260px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#374151',
              borderRadius: '8px',
              color: '#F3F4F6',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
            formatter={(value: any) => [`${value} packets`, 'Count']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

