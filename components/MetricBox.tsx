
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface MetricBoxProps {
  label: string;
  value: number;
  unit: string;
  icon?: React.ReactNode;
  color?: string;
  showReset?: boolean;
  onReset?: () => void;
}

const MetricBox: React.FC<MetricBoxProps> = ({ 
  label, value, unit, icon, color = "text-white", showReset, onReset 
}) => (
  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col group relative shadow-md">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      {showReset && (
        <button onClick={onReset} className="text-slate-600 hover:text-white transition-all p-4 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-90 shadow-lg border border-white/5">
          <RotateCcw size={22}/>
        </button>
      )}
    </div>
    <div className={`text-4xl font-black tabular-nums ${color}`}>
      {value.toFixed(1)} <span className="text-sm text-slate-600 uppercase font-bold">{unit}</span>
    </div>
  </div>
);

export default MetricBox;
