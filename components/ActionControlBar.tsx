
import React from 'react';
import { Play, Square } from 'lucide-react';

interface ActionControlBarProps {
  isActive: boolean;
  onToggle: () => void;
}

const ActionControlBar: React.FC<ActionControlBarProps> = ({ isActive, onToggle }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-40 px-4 md:px-6 pb-6 pt-4 pointer-events-none">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
      
      <div className="relative max-w-[220px] md:max-w-md mx-auto flex items-center justify-center pointer-events-auto">
         <div className={`w-full p-1 rounded-2xl border transition-all duration-700 glass shadow-2xl ${isActive ? 'border-cyan-500/40 shadow-cyan-500/20' : 'border-white/5'}`}>
           <button 
            onClick={onToggle} 
            className={`w-full flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-6 rounded-[0.9rem] font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.97] justify-center group overflow-hidden relative ${isActive ? 'bg-zinc-900 text-white' : 'bg-[#0a0a0a] text-white border border-white/10 hover:border-cyan-500/50'}`}
           >
             {/* Hardware-style LED */}
             <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse' : 'bg-zinc-800'}`}></div>
             
             <span className="text-[11px] md:text-sm relative z-10 flex items-center gap-2">
               {isActive ? (
                 <><Square size={14} className="md:w-4 md:h-4 text-cyan-400" fill="currentColor" /> Stop Engine</>
               ) : (
                 <><Play size={14} className="md:w-4 md:h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" fill="currentColor" /> Start Engine</>
               )}
             </span>

             {/* Reflection for metallic feel */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
           </button>
         </div>
      </div>
    </div>
  );
};

export default ActionControlBar;
