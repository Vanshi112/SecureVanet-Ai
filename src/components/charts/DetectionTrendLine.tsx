import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultTrendData = [
  { time: '00:00', normal: 1200, attack: 40 },
  { time: '04:00', normal: 1450, attack: 25 },
  { time: '08:00', normal: 1800, attack: 180 },
  { time: '12:00', normal: 2100, attack: 410 },
  { time: '16:00', normal: 1950, attack: 95 },
  { time: '20:00', normal: 1600, attack: 300 },
  { time: '24:00', normal: 1350, attack: 50 },
];

export const DetectionTrendLine: React.FC = () => {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={defaultTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="normalColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="attackColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis dataKey="time" stroke="#6B7280" tick={{ fontSize: 11 }} />
          <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
          />
          <Area
            type="monotone"
            dataKey="normal"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#normalColor)"
            name="Normal Packets"
          />
          <Area
            type="monotone"
            dataKey="attack"
            stroke="#EF4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#attackColor)"
            name="Attack Packets"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

