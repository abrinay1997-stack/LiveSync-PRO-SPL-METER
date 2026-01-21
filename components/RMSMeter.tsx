
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface NumericalMonitorProps {
  rms: number;
  peak: number;
  maxRms: number;
  maxPeak: number;
  onReset?: () => void;
}

const NumericalMonitor: React.FC<NumericalMonitorProps> = ({ rms, peak, maxRms, maxPeak, onReset }) => {
  const [visualRms, setVisualRms] = useState(rms);
  const [visualPeak, setVisualPeak] = useState(peak);
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Live readout release ballistics (Smooth visual display)
  const RMS_RELEASE_RATE = 12; 
  const PEAK_RELEASE_RATE = 6;  

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = (time - lastTimeRef.current) / 1000; 

        setVisualRms(prev => {
          if (rms > prev) return rms;
          return Math.max(rms, prev - RMS_RELEASE_RATE * deltaTime);
        });

        setVisualPeak(prev => {
          if (peak > prev) return peak;
          return Math.max(peak, prev - PEAK_RELEASE_RATE * deltaTime);
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [rms, peak]);

  return (
    <div className="w-full flex flex-col space-y-4 animate-fade-in bg-black/20 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
        <div className="text-4xl font-black italic">IO</div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Digital IO Metering</span>
        </div>
        {onReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-[9px] font-black text-cyan-400 uppercase tracking-widest transition-all shadow-lg"
          >
            <RotateCcw size={12} /> Refresh Max
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-12 relative z-10">
        {/* RMS Section */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-1 opacity-60">RMS Session Max</span>
            <span className="text-3xl font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all">
              {maxRms <= -89.5 ? '-∞' : maxRms.toFixed(1)} <span className="text-xs text-slate-600">dB</span>
            </span>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Live Input RMS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                {visualRms <= -89.5 ? '-∞' : visualRms.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-700">dBFS</span>
            </div>
          </div>
        </div>

        {/* Peak Section */}
        <div className="space-y-6 border-l border-white/5 pl-12">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-1 opacity-60">Peak Session Max</span>
            <span className={`text-3xl font-black tabular-nums drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all ${maxPeak > -3 ? 'text-red-500' : 'text-cyan-400'}`}>
              {maxPeak <= -89.5 ? '-∞' : maxPeak.toFixed(1)} <span className="text-xs opacity-60">dB</span>
            </span>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Live Input Peak</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tabular-nums tracking-tighter ${visualPeak > -3 ? 'text-red-500' : 'text-cyan-400'}`}>
                {visualPeak <= -89.5 ? '-∞' : visualPeak.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-700">dBFS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background activity bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <div 
          className="h-full bg-cyan-500/40 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          style={{ width: `${Math.min(Math.max((visualPeak + 60) / 60 * 100, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default NumericalMonitor;
