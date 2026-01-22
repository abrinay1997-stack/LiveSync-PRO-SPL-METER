
import React from 'react';
import { triggerHaptic } from '../utils/haptics';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

const SegmentedControl = <T extends string | number>({ 
  options, 
  value, 
  onChange, 
  label 
}: SegmentedControlProps<T>) => {
  const handleClick = (val: T) => {
    if (val !== value) {
      triggerHaptic('light');
      onChange(val);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black block">
          {label}
        </label>
      )}
      <div 
        className="grid gap-2" 
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className={`text-[10px] py-4 rounded-xl border font-black uppercase tracking-widest transition-all active:scale-95 ${
              value === opt.value
                ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'border-white/10 text-slate-500 hover:bg-white/5 hover:border-white/20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
