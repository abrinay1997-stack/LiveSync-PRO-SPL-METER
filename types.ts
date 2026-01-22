
export type WeightingMode = 'Z' | 'A' | 'C';
export type ResponseSpeed = 'FAST' | 'SLOW';
export type PropagationModel = 'POINT' | 'LINE';

export interface AudioData {
  rms: number;
  peak: number;
  spl: number;
  sourceSpl: number;
  leq: number;
  distanceLoss: number;
  clipped: boolean;
}

export interface EngineSettings {
  weighting: WeightingMode;
  speed: ResponseSpeed;
  offset: number;
  distance: number;
  model: PropagationModel;
  digitalTrim: number;
  aes17: boolean;
  deviceId?: string;
}

export interface MeterSettings {
  calibrationOffset: number;
  weighting: WeightingMode;
  speed: ResponseSpeed;
  distance: number;
  model: PropagationModel;
}
