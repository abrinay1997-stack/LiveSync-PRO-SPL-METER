
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { ACOUSTIC_STANDARDS } from '../constants/acoustic-standards';

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

  useEffect(() => {
    const animate = (time: number) => {
      const lastTime = lastTimeRef.current;
      if (lastTime !== null) {
        const deltaTime = (time - lastTime) / 1000; 
        setVisualRms(prev => {
          if (rms > prev) return rms;
          return Math.max(rms, prev - ACOUSTIC_STANDARDS.BALLISTICS.RMS_RELEASE * deltaTime);
        });
        setVisualPeak(prev => {
          if (peak > prev) return peak;
          return Math.max(peak, prev - ACOUSTIC_STANDARDS.BALLISTICS.PEAK_RELEASE * deltaTime);
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [rms, peak]);

  const isSilence = (val: number) => val <= ACOUSTIC_STANDARDS.RANGE.SILENCE_THRESHOLD;

  return (
    <div className="w-full flex flex-col space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Digital IO Metering</span>
        </div>
        {onReset && (
          <button onClick={onReset} className="flex items-center gap-2 px-5 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest transition-all">
            <RotateCcw size={16} /> Refresh Max
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-8 md:gap-12 relative z-10">
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-1 opacity-60">RMS Session Max</span>
            <span className="text-3xl font-black text-white tabular-nums transition-all">
              {isSilence(maxRms) ? '-∞' : maxRms.toFixed(1)} <span className="text-xs text-slate-600 font-bold">dB</span>
            </span>
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Live Input RMS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                {isSilence(visualRms) ? '-∞' : visualRms.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-700">dBFS</span>
            </div>
          </div>
        </div>
        <div className="space-y-6 border-l border-white/5 pl-8 md:pl-12">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-1 opacity-60">Peak Session Max</span>
            <span className={`text-3xl font-black tabular-nums transition-all ${maxPeak > -3 ? 'text-red-500' : 'text-cyan-400'}`}>
              {isSilence(maxPeak) ? '-∞' : maxPeak.toFixed(1)} <span className="text-xs opacity-60 font-bold">dB</span>
            </span>
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Live Input Peak</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tabular-nums tracking-tighter ${visualPeak > -3 ? 'text-red-500' : 'text-cyan-400'}`}>
                {isSilence(visualPeak) ? '-∞' : visualPeak.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-700">dBFS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumericalMonitor;
