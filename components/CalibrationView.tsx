
import React from 'react';
import HardwareSelector from './calibration/HardwareSelector';
import TrimControl from './calibration/TrimControl';
import OffsetControl from './calibration/OffsetControl';
import PropagationControl from './calibration/PropagationControl';
import { PropagationModel } from '../types';

interface CalibrationViewProps {
  digitalTrim: number;
  setDigitalTrim: (val: number | ((prev: number) => number)) => void;
  aes17: boolean;
  setAes17: (val: boolean) => void;
  offset: number;
  setOffset: (val: number | ((prev: number) => number)) => void;
  distance: number;
  setDistance: (val: number | ((prev: number) => number)) => void;
  model: PropagationModel;
  setModel: (m: PropagationModel) => void;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  onRefreshDevices: () => void;
}

const CalibrationView: React.FC<CalibrationViewProps> = (props) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
      
      {/* 1. Hardware Interface Selection */}
      <HardwareSelector 
        devices={props.devices}
        selectedDeviceId={props.selectedDeviceId}
        onDeviceChange={props.onDeviceChange}
        onRefreshDevices={props.onRefreshDevices}
      />

      {/* 2. Digital Gain Staging */}
      <TrimControl 
        digitalTrim={props.digitalTrim}
        setDigitalTrim={props.setDigitalTrim}
        aes17={props.aes17}
        setAes17={props.setAes17}
      />

      {/* 3. Physical SPL Calibration */}
      <OffsetControl 
        offset={props.offset}
        setOffset={props.setOffset}
      />

      {/* 4. Acoustic Prediction Settings */}
      <PropagationControl 
        distance={props.distance}
        setDistance={props.setDistance}
        model={props.model}
        setModel={props.setModel}
      />

    </div>
  );
};

export default CalibrationView;
