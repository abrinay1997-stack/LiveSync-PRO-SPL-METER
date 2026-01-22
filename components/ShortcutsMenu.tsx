
import React from 'react';
import { Monitor, MessageSquareDot, LifeBuoy, ExternalLink } from 'lucide-react';

const ShortcutsMenu: React.FC = () => {
  return (
    <div className="space-y-3 mt-6">
      <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-600 px-3 mb-2">
        Accesos Directos
      </p>
      
      {/* Item: Aplicación */}
      <a 
        href="https://livesyncpro.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between group w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <Monitor size={16} />
          </div>
          <span className="text-sm font-bold text-slate-300">Aplicación</span>
        </div>
        <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </a>

      {/* Item: Chat */}
      <a 
        href="https://support.livesyncpro.com/#chat" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between group w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <MessageSquareDot size={16} />
          </div>
          <span className="text-sm font-bold text-slate-300">Chat Soporte</span>
        </div>
        <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </a>

      {/* Item: Base de Conocimiento */}
      <a 
        href="https://support.livesyncpro.com/#inicio" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between group w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-500/10 text-slate-400 rounded-lg">
            <LifeBuoy size={16} />
          </div>
          <span className="text-sm font-bold text-slate-300">Base Conocimiento</span>
        </div>
        <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </a>

      {/* Footer Branding */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5">
         <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1">LiveSync Cloud</div>
         <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Sincronización activa para todos tus dispositivos.</p>
      </div>
    </div>
  );
};

export default ShortcutsMenu;
