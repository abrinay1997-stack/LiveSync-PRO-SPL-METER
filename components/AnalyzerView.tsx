
import React from 'react';
import MonitoringCard from './analyzer/MonitoringCard';
import AcousticSummaryCard from './analyzer/AcousticSummaryCard';
import { AudioData, WeightingMode } from '../types';

interface AnalyzerViewProps {
  audioData: AudioData;
  weighting: WeightingMode;
  sessionMaxRms: number;
  sessionMaxPeak: number;
  globalSplPeak: number;
  sessionMaxSource: number;
  distance: number;
  onResetDigital: () => void;
  onResetSource: () => void;
  onResetLeq: () => void;
  onResetSplPeak: () => void;
}

const AnalyzerView: React.FC<AnalyzerViewProps> = (props) => {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-10">
        <MonitoringCard 
          audioData={props.audioData}
          weighting={props.weighting}
          sessionMaxRms={props.sessionMaxRms}
          sessionMaxPeak={props.sessionMaxPeak}
          onResetDigital={props.onResetDigital}
        />

        <AcousticSummaryCard 
          audioData={props.audioData}
          sessionMaxSource={props.sessionMaxSource}
          globalSplPeak={props.globalSplPeak}
          distance={props.distance}
          onResetSource={props.onResetSource}
          onResetLeq={props.onResetLeq}
          onResetSplPeak={props.onResetSplPeak}
        />
      </div>
    </div>
  );
};

export default AnalyzerView;
