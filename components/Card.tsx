
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  // Fix: Added optional icon property to CardProps to support icon rendering in the card header
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = "", glow = true, icon }) => {
  return (
    <div className={`bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-slide-up ${className}`}>
      {/* Glow superior */}
      {glow && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
      )}
      
      {title && (
        <div className="mb-6">
          {/* Fix: Wrap title and optional icon in a flex container for alignment */}
          <div className="flex items-center gap-3">
            {icon && <div className="text-cyan-400">{icon}</div>}
            <div>
              <h3 className="text-white text-lg font-bold tracking-tight">{title}</h3>
              {subtitle && <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 font-bold">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Card;
