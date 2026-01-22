
import { PropagationModel } from '../types';

const EPSILON = 1e-12; // Valor mínimo para evitar log10(0)

/**
 * Calcula la pérdida por distancia basada en el modelo de propagación
 */
export const calculateDistanceLoss = (distance: number, model: PropagationModel): number => {
  const d = Math.max(1, distance);
  // Fuente puntual: -6dB por duplicación de distancia (20 log10)
  // Line Array: -3dB por duplicación de distancia (10 log10)
  return model === 'POINT' ? 20 * Math.log10(d) : 10 * Math.log10(d);
};

/**
 * Calcula el valor RMS y el Pico de un buffer de muestras
 */
export const analyzeSignal = (samples: Float32Array, gainFactor: number) => {
  let sumSquare = 0;
  let maxVal = 0;

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i] * gainFactor;
    const absVal = Math.abs(sample);
    if (absVal > maxVal) maxVal = absVal;
    sumSquare += sample * sample;
  }

  return {
    instantPower: sumSquare / samples.length,
    maxAbs: maxVal
  };
};

/**
 * Convierte potencia en dBFS aplicando factores de corrección (AES-17)
 */
export const powerToDbFS = (power: number, aes17Factor: number): number => {
  const rawRms = Math.sqrt(power);
  return 20 * Math.log10((rawRms * aes17Factor) + EPSILON);
};

/**
 * Convierte valor pico en dBFS
 */
export const peakToDbFS = (peak: number): number => {
  return 20 * Math.log10(peak + EPSILON);
};

/**
 * Actualiza el acumulador de Leq (Nivel equivalente continuo)
 */
export const updateLeq = (currentSpl: number, accumulator: number, count: number) => {
  const nextAcc = accumulator + Math.pow(10, currentSpl / 10);
  const nextCount = count + 1;
  const leq = 10 * Math.log10((nextAcc / nextCount) + EPSILON);
  return { nextAcc, nextCount, leq };
};
