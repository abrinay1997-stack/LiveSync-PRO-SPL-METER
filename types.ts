
export type WeightingMode = 'Z' | 'A' | 'C';
export type ResponseSpeed = 'FAST' | 'SLOW';
export type PropagationModel = 'POINT' | 'LINE'; // Point Source (-6dB) vs Line Array (-3dB)

export interface MeterSettings {
  calibrationOffset: number;
  weighting: WeightingMode;
  speed: ResponseSpeed;
  distance: number;
  model: PropagationModel;
}
