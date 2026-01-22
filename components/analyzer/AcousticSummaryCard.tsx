
import React from 'react';
import { TrendingUp, Zap, RotateCcw, Info } from 'lucide-react';
import Card from '../Card';
import MetricBox from '../MetricBox';
import { AudioData } from '../../types';

interface AcousticSummaryCardProps {
  audioData: AudioData;
  sessionMaxSource: number;
  globalSplPeak: number;
  distance: number;
  onResetSource: () => void;
  onResetLeq: () => void;
  onResetSplPeak: () => void;
}

const AcousticSummaryCard: React.FC<AcousticSummaryCardProps> = ({
  audioData, sessionMaxSource, globalSplPeak, distance,
  onResetSource, onResetLeq, onResetSplPeak
}) => (
  <Card title="Acoustic Summary" subtitle="Calculated Metrics" className="lg:col-span-4">
    <div className="flex flex-col space-y-4">
      <div className="bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Source Estimation</p>
            <div className="text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {audioData.sourceSpl.toFixed(1)} <span className="text-sm font-bold text-cyan-500">dB</span>
            </div>
          </div>
          <button onClick={onResetSource} className="p-4 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl transition-colors text-cyan-500 shadow-lg active:scale-90">
            <RotateCcw size={22} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 pt-4 border-t border-cyan-500/10">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Peak Session Max:</span>
          <span className="text-sm font-black text-cyan-400 tabular-nums">{sessionMaxSource.toFixed(1)} dB</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">@{distance}m distance compensation</p>
      </div>

      <MetricBox 
        icon={<TrendingUp size={18} className="text-purple-400" />}
        label="Leq (Integrated)" value={audioData.leq} unit="dB" 
        onReset={onResetLeq} showReset 
      />
      <MetricBox 
        icon={<Zap size={18} className="text-cyan-400" />}
        label="SPL Peak Hold" value={globalSplPeak} unit="dB" 
        color="text-cyan-400" 
        onReset={onResetSplPeak} showReset
      />
      
      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
        <Info size={16} className="text-slate-500" />
        <p className="text-[9px] text-slate-500 uppercase font-bold leading-tight">Mics build-in often filter below 40Hz and above 16kHz.</p>
      </div>
    </div>
  </Card>
);

export default AcousticSummaryCard;
