
import { useState, useCallback } from 'react';
import { AudioData } from '../types';

export const useSessionStats = () => {
  const [globalSplPeak, setGlobalSplPeak] = useState(0);
  const [sessionMaxRms, setSessionMaxRms] = useState(-90);
  const [sessionMaxPeak, setSessionMaxPeak] = useState(-90);
  const [sessionMaxSource, setSessionMaxSource] = useState(0);

  const updateStats = useCallback((data: AudioData) => {
    setGlobalSplPeak(prev => Math.max(prev, data.spl));
    setSessionMaxRms(prev => Math.max(prev, data.rms));
    setSessionMaxPeak(prev => Math.max(prev, data.peak));
    setSessionMaxSource(prev => Math.max(prev, data.sourceSpl));
  }, []);

  const resetStats = useCallback(() => {
    setGlobalSplPeak(0);
    setSessionMaxRms(-90);
    setSessionMaxPeak(-90);
    setSessionMaxSource(0);
  }, []);

  const resetDigital = useCallback(() => {
    setSessionMaxRms(-90);
    setSessionMaxPeak(-90);
  }, []);

  return {
    stats: { globalSplPeak, sessionMaxRms, sessionMaxPeak, sessionMaxSource },
    updateStats,
    resetStats,
    resetDigital
  };
};
