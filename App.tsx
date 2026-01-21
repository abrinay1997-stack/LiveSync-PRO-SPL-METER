
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Square, BarChart3, Menu, Activity, AlertTriangle, RotateCcw, SlidersHorizontal, Mic2, TrendingUp, Zap, Ruler, Speaker, Link2 } from 'lucide-react';
import Logo from './components/Logo';
import Card from './components/Card';
import MeterDisplay from './components/MeterDisplay';
import NumericalMonitor from './components/RMSMeter';
import { AudioEngine, AudioData } from './services/AudioEngine';
import { WeightingMode, ResponseSpeed, PropagationModel } from './types';

type View = 'analyzer' | 'calibration';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('analyzer');
  const [isActive, setIsActive] = useState(false);
  const [audioData, setAudioData] = useState<AudioData>({
    rms: -60, peak: -60, spl: 0, sourceSpl: 0, leq: 0, distanceLoss: 0, clipped: false
  });
  
  // Session Peaks State (Strict Peak Hold logic)
  const [globalSplPeak, setGlobalSplPeak] = useState(0);
  const [sessionMaxRms, setSessionMaxRms] = useState(-90);
  const [sessionMaxPeak, setSessionMaxPeak] = useState(-90);
  const [sessionMaxSource, setSessionMaxSource] = useState(0);
  
  const [weighting, setWeighting] = useState<WeightingMode>('Z'); 
  const [speed, setSpeed] = useState<ResponseSpeed>('FAST');
  const [offset, setOffset] = useState(105);
  const [distance, setDistance] = useState(1);
  const [model, setModel] = useState<PropagationModel>('POINT');
  const [digitalTrim, setDigitalTrim] = useState(0);
  const [aes17, setAes17] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const audioEngineRef = useRef<AudioEngine>(new AudioEngine());

  useEffect(() => {
    if (isActive) {
      audioEngineRef.current.updateSettings({ weighting, speed, offset, distance, model, digitalTrim, aes17 });
    }
  }, [weighting, speed, offset, distance, model, digitalTrim, aes17, isActive]);

  const handleToggle = async () => {
    if (isActive) {
      audioEngineRef.current.stop();
      setIsActive(false);
    } else {
      try {
        await audioEngineRef.current.start(
          { weighting, speed, offset, distance, model, digitalTrim, aes17 },
          (data) => {
            setAudioData(data);
            
            // CRITICAL: Strict Peak Hold logic
            setGlobalSplPeak(prev => Math.max(prev, data.spl));
            setSessionMaxRms(prev => Math.max(prev, data.rms));
            setSessionMaxPeak(prev => Math.max(prev, data.peak));
            setSessionMaxSource(prev => Math.max(prev, data.sourceSpl));
          }
        );
        setIsActive(true);
      } catch (err) {
        alert("Audio error: Verify microphone permissions.");
      }
    }
  };

  const resetAllPeaks = () => {
    audioEngineRef.current.resetLeq();
    setAudioData(prev => ({ ...prev, leq: 0 }));
    setGlobalSplPeak(0);
    setSessionMaxRms(-90);
    setSessionMaxPeak(-90);
    setSessionMaxSource(0);
  };

  const resetDigitalPeaks = () => {
    setSessionMaxRms(-90);
    setSessionMaxPeak(-90);
  };

  const resetSourcePeak = () => setSessionMaxSource(0);
  const resetSplPeak = () => setGlobalSplPeak(0);

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans selection:bg-cyan-500/30">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Navigation Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass border-r border-white/5 transform transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <Logo />
          <nav className="mt-12 space-y-2 flex-grow">
            <NavItem icon={<BarChart3 size={20} />} label="Live Sound Engine" active={currentView === 'analyzer'} onClick={() => { setCurrentView('analyzer'); setIsSidebarOpen(false); }} />
            <NavItem icon={<Settings size={20} />} label="System Calibration" active={currentView === 'calibration'} onClick={() => { setCurrentView('calibration'); setIsSidebarOpen(false); }} />
          </nav>

          <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black block">Weighting Curve</label>
              <div className="grid grid-cols-3 gap-2">
                {['Z', 'A', 'C'].map(m => (
                  <button key={m} onClick={() => setWeighting(m as WeightingMode)} className={`text-xs py-2 rounded-lg border font-bold transition-all ${weighting === m ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-slate-500 hover:bg-white/5'}`}>{m}</button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={resetAllPeaks}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <RotateCcw size={14} /> Reset All Peaks
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 p-6 md:p-10 max-w-7xl mx-auto w-full pb-32 lg:pb-10">
        <header className="flex items-center justify-between mb-10 lg:hidden">
          <Logo />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-cyan-400 transition-transform active:scale-90"><Menu size={24} /></button>
        </header>

        {currentView === 'analyzer' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              <Card title="Signal Monitoring" subtitle={`Reference: ${weighting}-Weighted`} className="lg:col-span-8">
                <div className="flex flex-col items-center justify-center py-4 space-y-10">
                  <div className="w-full flex justify-center scale-90 md:scale-100">
                    <MeterDisplay value={audioData.spl} label={`SPL (${weighting})`} unit="dB" />
                  </div>
                  <div className="w-full max-w-xl px-4">
                    <NumericalMonitor 
                      rms={audioData.rms} 
                      peak={audioData.peak} 
                      maxRms={sessionMaxRms}
                      maxPeak={sessionMaxPeak}
                      onReset={resetDigitalPeaks}
                    />
                  </div>
                </div>
              </Card>

              <Card title="FOH Summary" subtitle="Acoustic Metrics" className="lg:col-span-4">
                <div className="flex flex-col space-y-4">
                   <div className="bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 right-4 flex flex-col items-end">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest opacity-60">Session Max</span>
                            <button onClick={resetSourcePeak} className="p-1 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500/50 hover:text-cyan-500">
                               <RotateCcw size={12} />
                            </button>
                         </div>
                         <span className="text-3xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            {sessionMaxSource.toFixed(1)} <span className="text-xs text-cyan-500">dB</span>
                         </span>
                      </div>
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Source Estimation</p>
                      <div className="text-5xl font-black text-white tabular-nums">{audioData.sourceSpl.toFixed(1)} <span className="text-sm font-bold text-cyan-500">dB</span></div>
                      <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">@{distance}m distance compensation</p>
                   </div>

                   <MetricBox 
                    icon={<TrendingUp size={16} className="text-purple-400" />}
                    label="Leq (Time Avg)" value={audioData.leq} unit="dB" 
                    onReset={() => { audioEngineRef.current.resetLeq(); setAudioData(p => ({...p, leq:0})); }} showReset 
                   />
                   <MetricBox 
                    icon={<Zap size={16} className="text-cyan-400" />}
                    label="SPL Peak Hold" value={globalSplPeak} unit="dB" 
                    color="text-cyan-400" 
                    onReset={resetSplPeak} showReset
                   />
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'calibration' && (
          <div className="animate-fade-in max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Digital Input Alignment" subtitle="Loopback Gain Correction" icon={<Link2 />}>
              <div className="space-y-8 py-4">
                <div className="text-center">
                  <div className={`text-6xl font-black ${digitalTrim !== 0 ? 'text-cyan-400' : 'text-white'}`}>
                    {digitalTrim > 0 ? '+' : ''}{digitalTrim.toFixed(1)} <span className="text-lg text-slate-500">dB</span>
                  </div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-2 italic">"Adjust until Peak matches DAW 0.0dB"</p>
                </div>
                <input 
                  type="range" min="-20" max="20" step="0.1" value={digitalTrim} 
                  onChange={(e) => setDigitalTrim(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10"
                />
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AES-17 Standard (+3dB RMS)</span>
                  <button 
                    onClick={() => setAes17(!aes17)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${aes17 ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                  >
                    {aes17 ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Acoustic Offset" subtitle="Physical Sens Calibration" icon={<Mic2 />}>
              <div className="space-y-8 py-4 text-center">
                <div className="text-6xl font-black text-white">{offset} <span className="text-lg text-slate-500">dB</span></div>
                <input 
                  type="range" min="80" max="130" value={offset} 
                  onChange={(e) => setOffset(parseInt(e.target.value))} 
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-white/10"
                />
              </div>
            </Card>

            <Card title="Distance & Propagation" subtitle="FOH to Source Geometry" className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-4">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance</p>
                    <p className="text-3xl font-black text-white">{distance}m</p>
                  </div>
                  <input type="range" min="1" max="100" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none accent-cyan-500" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setModel('POINT')} className={`flex-1 p-4 rounded-2xl border transition-all ${model === 'POINT' ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                    <p className="font-bold text-xs uppercase">Point Source</p>
                    <p className="text-[9px] opacity-60">Spherical (-6dB)</p>
                  </button>
                  <button onClick={() => setModel('LINE')} className={`flex-1 p-4 rounded-2xl border transition-all ${model === 'LINE' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                    <p className="font-bold text-xs uppercase">Line Array</p>
                    <p className="text-[9px] opacity-60">Cylindrical (-3dB)</p>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Improved UX: Bottom Control Dock */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-40 px-6 pb-6 pt-10 pointer-events-none">
          {/* Subtle gradient to separate from content */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
          
          <div className="relative max-w-4xl mx-auto flex items-center justify-center pointer-events-auto">
             <div className={`p-1.5 rounded-[2rem] border border-white/10 transition-all duration-700 glass shadow-2xl ${isActive ? 'shadow-cyan-500/20' : ''}`}>
               <button 
                onClick={handleToggle} 
                className={`flex items-center gap-4 px-10 py-5 rounded-[1.75rem] font-black tracking-[0.2em] uppercase text-black transition-all duration-500 active:scale-95 min-w-[240px] justify-center ${isActive ? 'bg-white text-black' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.3)]'}`}
               >
                 {isActive ? (
                   <><div className="bg-red-500 w-2 h-2 rounded-full animate-pulse mr-2" /> <Square size={20} fill="currentColor" /> Stop Engine</>
                 ) : (
                   <><Play size={20} fill="currentColor" /> Start Engine</>
                 )}
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricBox: React.FC<{ label: string, value: number, unit: string, icon?: React.ReactNode, color?: string, showReset?: boolean, onReset?: () => void }> = ({ label, value, unit, icon, color = "text-white", showReset, onReset }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col group relative">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      {showReset && (
        <button onClick={onReset} className="text-slate-600 hover:text-white transition-colors p-1">
          <RotateCcw size={14}/>
        </button>
      )}
    </div>
    <div className={`text-3xl font-black tabular-nums ${color}`}>{value.toFixed(1)} <span className="text-xs text-slate-500 uppercase">{unit}</span></div>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group ${active ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`${active ? 'text-cyan-400' : ''}`}>{icon}</div>
    <span className="text-sm font-bold tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1.5 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>}
  </div>
);

export default App;
