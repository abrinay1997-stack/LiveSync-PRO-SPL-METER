
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from '../Card';
import MeterDisplay from '../MeterDisplay';
import NumericalMonitor from '../RMSMeter';
import { AudioData, WeightingMode } from '../../types';

interface MonitoringCardProps {
  audioData: AudioData;
  weighting: WeightingMode;
  sessionMaxRms: number;
  sessionMaxPeak: number;
  onResetDigital: () => void;
}

const MonitoringCard: React.FC<MonitoringCardProps> = ({
  audioData, weighting, sessionMaxRms, sessionMaxPeak, onResetDigital
}) => (
  <Card title="Signal Monitoring" subtitle={`Reference: ${weighting}-Weighted`} className="lg:col-span-8">
    <div className="flex flex-col items-center justify-center py-2 md:py-4 space-y-6 md:space-y-10">
      <div className="w-full flex justify-center scale-90 md:scale-100">
        <MeterDisplay value={audioData.spl} label={`SPL (${weighting})`} unit="dB" />
      </div>
      <div className="w-full max-w-xl">
        <NumericalMonitor 
          rms={audioData.rms} 
          peak={audioData.peak} 
          maxRms={sessionMaxRms}
          maxPeak={sessionMaxPeak}
          onReset={onResetDigital}
        />
      </div>
      {audioData.clipped && (
        <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 animate-pulse">
          <AlertTriangle size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Hardware Clipping Detected</span>
        </div>
      )}
    </div>
  </Card>
);

export default MonitoringCard;
