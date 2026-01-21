
import { WeightingMode, ResponseSpeed, PropagationModel } from '../types';

export interface AudioData {
  rms: number;
  peak: number;
  spl: number;
  sourceSpl: number;
  leq: number;
  distanceLoss: number;
  clipped: boolean;
}

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
  
  // Constante de compensación del sistema para alinear Web Audio con DAWs
  private readonly SYSTEM_GAIN_COMPENSATION = 6.0;

  private currentSettings = { 
    weighting: 'A' as WeightingMode, 
    speed: 'FAST' as ResponseSpeed, 
    offset: 105,
    distance: 1,
    model: 'POINT' as PropagationModel,
    digitalTrim: 0, 
    aes17: false    
  };

  public updateSettings(settings: { 
    weighting: WeightingMode; 
    speed: ResponseSpeed; 
    offset: number;
    distance: number;
    model: PropagationModel;
    digitalTrim: number;
    aes17: boolean;
  }) {
    const oldWeighting = this.currentSettings.weighting;
    this.currentSettings = settings;
    
    if (this.audioContext && oldWeighting !== settings.weighting) {
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

  private calculateDistanceLoss(): number {
    const d = Math.max(1, this.currentSettings.distance);
    return this.currentSettings.model === 'POINT' ? 20 * Math.log10(d) : 10 * Math.log10(d);
  }

  public async start(
    settings: { 
      weighting: WeightingMode; 
      speed: ResponseSpeed; 
      offset: number;
      distance: number;
      model: PropagationModel;
      digitalTrim: number;
      aes17: boolean;
    },
    onUpdate: (data: AudioData) => void
  ) {
    this.currentSettings = settings;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
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

      const update = () => {
        if (!this.analyser || !this.dataArray || !this.audioContext) return;
        
        const totalGainDb = this.SYSTEM_GAIN_COMPENSATION + this.currentSettings.digitalTrim;
        const totalGainFactor = Math.pow(10, totalGainDb / 20);
        
        const aes17Factor = this.currentSettings.aes17 ? Math.sqrt(2) : 1.0;

        const t = this.currentSettings.speed === 'FAST' ? 0.125 : 1.0;
        const alpha = 1 - Math.exp(-1 / ((this.audioContext.sampleRate / this.analyser.fftSize) * t));

        // Use 'any' cast to satisfy the compiler's strict Float32Array vs Float32Array<ArrayBufferLike> check
        // which often occurs in environments with SharedArrayBuffer support enabled.
        this.analyser.getFloatTimeDomainData(this.dataArray as any);

        let sumSquare = 0;
        let maxVal = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
          const sample = this.dataArray[i] * totalGainFactor; 
          const absVal = Math.abs(sample);
          if (absVal > maxVal) maxVal = absVal;
          sumSquare += sample * sample;
        }

        const instantPower = sumSquare / this.dataArray.length;
        this.lastPower = (instantPower * alpha) + (this.lastPower * (1 - alpha));
        
        const rawRms = Math.sqrt(this.lastPower);
        const rmsDbFS = 20 * Math.log10((rawRms * aes17Factor) || 1e-9);
        const peakDbFS = 20 * Math.log10(maxVal || 1e-9);

        const currentSPL = Math.max(0, rmsDbFS + this.currentSettings.offset);
        const distanceLoss = this.calculateDistanceLoss();
        
        this.leqAccumulator += Math.pow(10, currentSPL / 10);
        this.leqCount++;

        onUpdate({
          rms: rmsDbFS,
          peak: peakDbFS,
          spl: currentSPL,
          sourceSpl: currentSPL + distanceLoss,
          leq: 10 * Math.log10(this.leqAccumulator / this.leqCount),
          distanceLoss: distanceLoss,
          clipped: maxVal >= 0.99
        });

        this.animationId = requestAnimationFrame(update);
      };

      update();
    } catch (err) {
      console.error("Audio Engine Error:", err);
    }
  }

  private setupWeighting(mode: WeightingMode) {
    if (!this.audioContext) return;
    this.weightingFilters.forEach(f => f.disconnect());
    this.weightingFilters = [];

    if (mode === 'Z') return;

    const f1 = this.audioContext.createBiquadFilter(); f1.type = 'highpass'; f1.frequency.value = 20.6; f1.Q.value = 0.5;
    const f2 = this.audioContext.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 107.7; f2.Q.value = 0.5;
    const f3 = this.audioContext.createBiquadFilter(); f3.type = 'lowpass'; f3.frequency.value = 12200; f3.Q.value = 0.5;

    if (mode === 'A') {
      this.weightingFilters = [f1, f2, f3];
    } else if (mode === 'C') {
      const h1 = this.audioContext.createBiquadFilter(); h1.type = 'highpass'; h1.frequency.value = 31.5;
      const l1 = this.audioContext.createBiquadFilter(); l1.type = 'lowpass'; l1.frequency.value = 8000;
      this.weightingFilters = [h1, l1];
    }
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
  }
}
