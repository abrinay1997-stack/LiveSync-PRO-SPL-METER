
import { AudioData, EngineSettings, WeightingMode } from '../types';
import { createWeightingFilters } from './filter-factory';
import * as DSP from '../utils/dsp-logic';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private weightingFilters: BiquadFilterNode[] = [];
  private dataArray: Float32Array | null = null;
  private animationId: number | null = null;

  private lastPower = 0;
  private leqAccumulator = 0;
  private leqCount = 0;
  
  private readonly SYSTEM_GAIN_COMPENSATION = 6.0;

  private currentSettings: EngineSettings = { 
    weighting: 'A', 
    speed: 'FAST', 
    offset: 105,
    distance: 1,
    model: 'POINT',
    digitalTrim: 0, 
    aes17: false
  };

  public updateSettings(settings: EngineSettings) {
    const oldWeighting = this.currentSettings.weighting;
    const oldDeviceId = this.currentSettings.deviceId;
    this.currentSettings = settings;
    
    if (this.audioContext && oldDeviceId !== settings.deviceId) {
      this.stop();
    } else if (this.audioContext && oldWeighting !== settings.weighting) {
      this.setupWeighting(settings.weighting);
      this.reconnectNodes();
    }
  }

  private reconnectNodes() {
    if (!this.microphone || !this.analyser) return;
    this.microphone.disconnect();
    this.weightingFilters.forEach(f => f.disconnect());
    
    let lastNode: AudioNode = this.microphone;
    this.weightingFilters.forEach(f => {
      lastNode.connect(f);
      lastNode = f;
    });
    lastNode.connect(this.analyser);
  }

  public async start(settings: EngineSettings, onUpdate: (data: AudioData) => void) {
    this.currentSettings = settings;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          deviceId: settings.deviceId ? { exact: settings.deviceId } : undefined,
          echoCancellation: false, 
          autoGainControl: false, 
          noiseSuppression: false,
          channelCount: 1
        }
      });

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 48000
      });

      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0;

      this.setupWeighting(this.currentSettings.weighting);
      this.reconnectNodes();

      this.dataArray = new Float32Array(this.analyser.fftSize);

      const loop = () => {
        if (!this.analyser || !this.dataArray || !this.audioContext) return;
        
        const totalGainDb = this.SYSTEM_GAIN_COMPENSATION + this.currentSettings.digitalTrim;
        const totalGainFactor = Math.pow(10, totalGainDb / 20);
        const aes17Factor = this.currentSettings.aes17 ? Math.sqrt(2) : 1.0;
        
        // Constantes de tiempo para Respuesta Temporal
        const t = this.currentSettings.speed === 'FAST' ? 0.125 : 1.0;
        const alpha = 1 - Math.exp(-1 / ((this.audioContext.sampleRate / this.analyser.fftSize) * t));

        this.analyser.getFloatTimeDomainData(this.dataArray);

        // --- DSP Logic ---
        const { instantPower, maxAbs } = DSP.analyzeSignal(this.dataArray, totalGainFactor);
        
        // Integración temporal (Suavizado Exponencial)
        this.lastPower = (instantPower * alpha) + (this.lastPower * (1 - alpha));
        
        const rmsDbFS = DSP.powerToDbFS(this.lastPower, aes17Factor);
        const peakDbFS = DSP.peakToDbFS(maxAbs);
        const currentSPL = Math.max(0, rmsDbFS + this.currentSettings.offset);
        const distanceLoss = DSP.calculateDistanceLoss(this.currentSettings.distance, this.currentSettings.model);
        
        const leqUpdate = DSP.updateLeq(currentSPL, this.leqAccumulator, this.leqCount);
        this.leqAccumulator = leqUpdate.nextAcc;
        this.leqCount = leqUpdate.nextCount;

        onUpdate({
          rms: rmsDbFS,
          peak: peakDbFS,
          spl: currentSPL,
          sourceSpl: currentSPL + distanceLoss,
          leq: leqUpdate.leq,
          distanceLoss: distanceLoss,
          clipped: maxAbs >= 0.99
        });

        this.animationId = requestAnimationFrame(loop);
      };

      loop();
    } catch (err) {
      console.error("Audio Engine Error:", err);
      throw err;
    }
  }

  private setupWeighting(mode: WeightingMode) {
    if (!this.audioContext) return;
    this.weightingFilters.forEach(f => f.disconnect());
    this.weightingFilters = createWeightingFilters(this.audioContext, mode);
  }

  public resetLeq() {
    this.leqAccumulator = 0;
    this.leqCount = 0;
  }

  public stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.audioContext) this.audioContext.close();
    this.audioContext = null;
    this.analyser = null;
    this.stream = null;
    this.microphone = null;
    this.weightingFilters = [];
  }
}
