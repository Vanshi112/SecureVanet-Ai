import React from 'react';
import { VehicleStatus } from '../../types';
import { Gauge, Zap, Disc, Compass, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleStatusGridProps {
  vehicle: VehicleStatus;
}

export const VehicleStatusGrid: React.FC<VehicleStatusGridProps> = ({ vehicle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Speed</span>
          <Gauge className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono-tech text-white">{vehicle.speed.toFixed(1)}</span>
          <span className="text-xs font-medium text-slate-400">km/h</span>
        </div>
        <div className="mt-2 w-full bg-slate-800 rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (vehicle.speed / 180) * 100)}%` }}
          />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">RPM</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono-tech text-white">{vehicle.rpm}</span>
          <span className="text-xs font-medium text-slate-400">rpm</span>
        </div>
        <div className="mt-2 w-full bg-slate-800 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              vehicle.rpm > 5500 ? 'bg-red-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, (vehicle.rpm / 7000) * 100)}%` }}
          />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Brake</span>
          <Disc className={`w-4 h-4 ${vehicle.brake ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-xs font-bold rounded ${
              vehicle.brake
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {vehicle.brake ? 'ENGAGED' : 'RELEASED'}
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500">Hydraulic Pressure Nominal</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gear</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono-tech text-cyan-400">{vehicle.gear}</span>
          <span className="text-xs font-medium text-slate-400">Position</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500">Auto Drive Mode</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Steering</span>
          <Compass className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono-tech text-white">
            {vehicle.steeringAngle > 0 ? `+${vehicle.steeringAngle}` : vehicle.steeringAngle}°
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500">CAN ID 0x0250 Sensor</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bus Load</span>
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span
            className={`text-xl font-bold font-mono-tech ${
              vehicle.busLoad > 75 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {vehicle.busLoad.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              vehicle.busLoad > 75 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${vehicle.busLoad}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};

