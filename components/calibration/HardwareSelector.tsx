
import React from 'react';
import { Cpu, RefreshCw, Mic2, CheckCircle2 } from 'lucide-react';
import Card from '../Card';

interface HardwareSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  onRefreshDevices: () => void;
}

const HardwareSelector: React.FC<HardwareSelectorProps> = ({
  devices, selectedDeviceId, onDeviceChange, onRefreshDevices
}) => {
  return (
    <Card title="Hardware Interface" subtitle="I/O Management" icon={<Cpu />} className="md:col-span-2">
      <div className="flex flex-col md:flex-row gap-8 items-start py-2">
        <div className="flex-grow w-full space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Inputs</label>
            <button 
              onClick={onRefreshDevices}
              className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
            >
              <RefreshCw size={12} /> Scan for Hardware
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {devices.length === 0 ? (
              <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-500 font-bold uppercase">
                No devices detected. Grant mic permissions.
              </div>
            ) : (
              devices.map(device => (
                <button
                  key={device.deviceId}
                  onClick={() => onDeviceChange(device.deviceId)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selectedDeviceId === device.deviceId ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-3">
                    <Mic2 size={16} className={selectedDeviceId === device.deviceId ? 'text-cyan-400' : 'text-slate-600'} />
                    <span className="text-xs font-bold truncate max-w-[200px] md:max-w-xs">
                      {device.label || `Unknown Input (${device.deviceId.slice(0, 5)}...)`}
                    </span>
                  </div>
                  {selectedDeviceId === device.deviceId && <CheckCircle2 size={16} className="text-cyan-400" />}
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="w-full md:w-64 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
            Using external interfaces provides a <span className="text-cyan-500">flat response</span> and higher <span className="text-cyan-500">headroom</span> for professional FOH applications.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HardwareSelector;
