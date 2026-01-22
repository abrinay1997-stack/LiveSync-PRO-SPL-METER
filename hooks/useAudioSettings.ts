
import { useState, useCallback, useEffect, useRef } from 'react';
import { WeightingMode, ResponseSpeed, PropagationModel, EngineSettings } from '../types';

const STORAGE_KEY = 'livesync_pro_settings_v1';

export const useAudioSettings = () => {
  // Estado inicial intentando cargar desde localStorage
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [weighting, setWeighting] = useState<WeightingMode>('Z');
  const [speed, setSpeed] = useState<ResponseSpeed>('FAST');
  const [offset, setOffset] = useState(105);
  const [distance, setDistance] = useState(1);
  const [model, setModel] = useState<PropagationModel>('POINT');
  const [digitalTrim, setDigitalTrim] = useState(0);
  const [aes17, setAes17] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  // Cargar configuración al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.weighting) setWeighting(parsed.weighting);
        if (parsed.speed) setSpeed(parsed.speed);
        if (parsed.offset !== undefined) setOffset(parsed.offset);
        if (parsed.distance !== undefined) setDistance(parsed.distance);
        if (parsed.model) setModel(parsed.model);
        if (parsed.digitalTrim !== undefined) setDigitalTrim(parsed.digitalTrim);
        if (parsed.aes17 !== undefined) setAes17(parsed.aes17);
        if (parsed.selectedDeviceId) setSelectedDeviceId(parsed.selectedDeviceId);
      } catch (e) {
        console.error("Failed to load settings from storage", e);
      }
    }
    setSettingsLoaded(true);
  }, []);

  // Guardar configuración cuando cambie algo
  useEffect(() => {
    if (!settingsLoaded) return;
    const settingsToSave = {
      weighting, speed, offset, distance, model, digitalTrim, aes17, selectedDeviceId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
  }, [weighting, speed, offset, distance, model, digitalTrim, aes17, selectedDeviceId, settingsLoaded]);

  const refreshDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter(d => d.kind === 'audioinput'));
    } catch (err) {
      console.error("Hardware enumeration failed:", err);
    }
  }, []);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  const getEngineSettings = useCallback((): EngineSettings => ({
    weighting, speed, offset, distance, model, digitalTrim, aes17,
    deviceId: selectedDeviceId === 'default' ? undefined : selectedDeviceId
  }), [weighting, speed, offset, distance, model, digitalTrim, aes17, selectedDeviceId]);

  return {
    settings: { weighting, speed, offset, distance, model, digitalTrim, aes17, selectedDeviceId, devices },
    setters: { setWeighting, setSpeed, setOffset, setDistance, setModel, setDigitalTrim, setAes17, setSelectedDeviceId },
    refreshDevices,
    getEngineSettings
  };
};
