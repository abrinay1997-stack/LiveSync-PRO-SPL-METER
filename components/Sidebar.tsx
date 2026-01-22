
import React from 'react';
import { BarChart3, Settings, RotateCcw } from 'lucide-react';
import Logo from './Logo';
import NavItem from './NavItem';
import Button from './Button';
import SegmentedControl from './SegmentedControl';
import ShortcutsMenu from './ShortcutsMenu';
import { WeightingMode } from '../types';

interface SidebarProps {
  currentView: 'analyzer' | 'calibration';
  setView: (view: 'analyzer' | 'calibration') => void;
  weighting: WeightingMode;
  setWeighting: (m: WeightingMode) => void;
  onResetPeaks: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, setView, weighting, setWeighting, onResetPeaks, isOpen, setIsOpen 
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass border-r border-white/5 transform transition-all duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <Logo />
          <nav className="mt-12 space-y-2 flex-shrink-0">
            <NavItem 
              icon={<BarChart3 size={20} />} 
              label="Live Sound Engine" 
              active={currentView === 'analyzer'} 
              onClick={() => { setView('analyzer'); setIsOpen(false); }} 
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="System Calibration" 
              active={currentView === 'calibration'} 
              onClick={() => { setView('calibration'); setIsOpen(false); }} 
            />
          </nav>

          <div className="mt-8 bg-[#0f0f0f] p-5 rounded-2xl border border-white/5 space-y-6 flex-shrink-0">
            <SegmentedControl 
              label="Weighting Curve"
              value={weighting}
              onChange={setWeighting}
              options={[
                { label: 'Z', value: 'Z' },
                { label: 'A', value: 'A' },
                { label: 'C', value: 'C' },
              ]}
            />
            
            <Button 
              fullWidth
              onClick={onResetPeaks}
              icon={<RotateCcw size={18} />}
            >
              Reset Session
            </Button>
          </div>

          <ShortcutsMenu />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
