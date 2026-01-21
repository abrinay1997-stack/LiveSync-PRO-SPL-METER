
import React, { useEffect, useRef, useState } from 'react';

interface MeterDisplayProps {
  value: number;
  label: string;
  min?: number;
  max?: number;
  unit?: string;
}

const MeterDisplay: React.FC<MeterDisplayProps> = ({ 
  value, 
  label, 
  min = 30, 
  max = 120, 
  unit = "dB"
}) => {
  const [peak, setPeak] = useState(value);
  const peakTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (value > peak) {
      setPeak(value);
      if (peakTimerRef.current) window.clearTimeout(peakTimerRef.current);
      peakTimerRef.current = window.setTimeout(() => setPeak(value), 2000);
    }
  }, [value]);

  const normalized = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const peakNormalized = Math.min(Math.max(((peak - min) / (max - min)) * 100, 0), 100);

  // FOH Color Scaling
  const getMeterColor = (v: number) => {
    if (v > 102) return "from-red-500 to-red-600";
    if (v > 95) return "from-yellow-400 to-yellow-500";
    return "from-cyan-400 to-purple-500";
  };

  const getTextColor = (v: number) => {
    if (v > 102) return "text-red-500";
    if (v > 95) return "text-yellow-400";
    return "text-white";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="relative flex items-center justify-center w-full max-w-[280px] aspect-square">
        <div className={`absolute inset-0 blur-3xl rounded-full opacity-10 transition-colors duration-500 ${value > 95 ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
        
        <div className="text-center z-10">
          <span className={`text-7xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] ${getTextColor(value)}`}>
            {value.toFixed(1)}
          </span>
          <div className="text-slate-400 font-mono text-sm mt-2 font-bold tracking-widest uppercase">{unit}</div>
          <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{label}</div>
        </div>

        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/5" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="4"
            strokeDasharray={`${(normalized / 100) * 289} 289`}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
          {/* Peak Indicator Needle */}
          <line
            x1="50" y1="4" x2="50" y2="10"
            stroke="white" strokeWidth="2"
            transform={`rotate(${(peakNormalized / 100) * 360}, 50, 50)`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
        <div 
          className={`h-full bg-gradient-to-r ${getMeterColor(value)} transition-all duration-75 ease-out shadow-lg`}
          style={{ width: `${normalized}%` }}
        ></div>
        {/* Peak Hold Line */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-white shadow-xl transition-all duration-300"
          style={{ left: `${peakNormalized}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MeterDisplay;
