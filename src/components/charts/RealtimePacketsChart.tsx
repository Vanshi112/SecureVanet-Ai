import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RealtimePacketsChartProps {
  packetsPerSec: number;
}

export const RealtimePacketsChart: React.FC<RealtimePacketsChartProps> = ({ packetsPerSec }) => {
  const [data, setData] = useState<{ time: string; pps: number }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setData(prev => [
        ...prev.slice(-19),
        { time: timeStr, pps: packetsPerSec + Math.floor(Math.random() * 40 - 20) },
      ]);
    }, 1000);

    return () => clearInterval(timer);
  }, [packetsPerSec]);

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="ppsColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#4B5563" tick={{ fontSize: 10 }} />
          <YAxis stroke="#4B5563" tick={{ fontSize: 10 }} domain={['dataMin - 100', 'dataMax + 100']} />
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
            dataKey="pps"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#ppsColor)"
            name="Packets / sec"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

