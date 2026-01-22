
import { WeightingMode } from '../types';

export const createWeightingFilters = (context: AudioContext, mode: WeightingMode): BiquadFilterNode[] => {
  if (mode === 'Z') return [];

  const filters: BiquadFilterNode[] = [];

  if (mode === 'A') {
    // Filtros para Curva A (Simplificados para Biquad)
    const f1 = context.createBiquadFilter(); f1.type = 'highpass'; f1.frequency.value = 20.6; f1.Q.value = 0.5;
    const f2 = context.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 107.7; f2.Q.value = 0.5;
    const f3 = context.createBiquadFilter(); f3.type = 'lowpass'; f3.frequency.value = 12200; f3.Q.value = 0.5;
    filters.push(f1, f2, f3);
  } else if (mode === 'C') {
    // Filtros para Curva C
    const h1 = context.createBiquadFilter(); h1.type = 'highpass'; h1.frequency.value = 31.5;
    const l1 = context.createBiquadFilter(); l1.type = 'lowpass'; l1.frequency.value = 8000;
    filters.push(h1, l1);
  }

  return filters;
};
