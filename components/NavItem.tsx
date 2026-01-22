
import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl transition-all cursor-pointer group ${active ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`${active ? 'text-cyan-400' : ''}`}>{icon}</div>
    <span className="text-base font-bold tracking-tight">{label}</span>
    {active && <div className="ml-auto w-2.5 h-10 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>}
  </div>
);

export default NavItem;
