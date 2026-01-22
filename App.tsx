
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Square, BarChart3, Menu, Activity, AlertTriangle, RotateCcw, SlidersHorizontal, Mic2, TrendingUp, Zap, Ruler, Speaker, Link2, Plus, Minus, Info, Power } from 'lucide-react';
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

  const adjustTrim = (val: number) => {
    setDigitalTrim(prev => {
      const next = parseFloat((prev + val).toFixed(1));
      return Math.min(Math.max(next, -20), 20);
    });
  };

  const adjustOffset = (val: number) => {
    setOffset(prev => {
      const next = prev + val;
      return Math.min(Math.max(next, 80), 140);
    });
  };

  const adjustDistance = (val: number) => {
    setDistance(prev => Math.max(1, prev + val));
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans selection:bg-cyan-500/30">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
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
                  <button key={m} onClick={() => setWeighting(m as WeightingMode)} className={`text-xs py-4 rounded-lg border font-bold transition-all ${weighting === m ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-slate-500 hover:bg-white/5'}`}>{m}</button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={resetAllPeaks}
              className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw size={18} /> Reset All Peaks
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-grow lg:ml-72 p-4 md:p-10 max-w-7xl mx-auto w-full pb-36 lg:pb-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-8 lg:hidden">
          <Logo />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-cyan-400 transition-transform active:scale-90 shadow-xl"><Menu size={24} /></button>
        </header>

        {currentView === 'analyzer' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-10">
              <Card title="Signal Monitoring" subtitle={`Reference: ${weighting}-Weighted`} className="lg:col-span-8">
                <div className="flex flex-col items-center justify-center py-2 md:py-4 space-y-6 md:space-y-10">
                  <div className="w-full flex justify-center scale-90 md:scale-100">
                    <MeterDisplay value={audioData.spl} label={`SPL (${weighting})`} unit="dB" />
                  </div>
                  <div className="w-full max-w-xl">
                    <NumericalMonitor 
                      rms={audioData.rms} 
                      peak={audioData.peak} 
                      maxRms={sessionMaxRms}
                      maxPeak={sessionMaxPeak}
                      onReset={resetDigitalPeaks}
                    />
                  </div>
                  {audioData.clipped && (
                    <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 animate-pulse">
                      <AlertTriangle size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Hardware Clipping Detected</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card title="Acoustic Summary" subtitle="Calculated Metrics" className="lg:col-span-4">
                <div className="flex flex-col space-y-4">
                   <div className="bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex flex-col">
                           <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Source Estimation</p>
                           <div className="text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                             {audioData.sourceSpl.toFixed(1)} <span className="text-sm font-bold text-cyan-500">dB</span>
                           </div>
                         </div>
                         <button onClick={resetSourcePeak} className="p-4 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl transition-colors text-cyan-500 shadow-lg active:scale-90">
                            <RotateCcw size={22} />
                         </button>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-4 border-t border-cyan-500/10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Peak Session Max:</span>
                        <span className="text-sm font-black text-cyan-400 tabular-nums">{sessionMaxSource.toFixed(1)} dB</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">@{distance}m distance compensation</p>
                   </div>

                   <MetricBox 
                    icon={<TrendingUp size={18} className="text-purple-400" />}
                    label="Leq (Integrated)" value={audioData.leq} unit="dB" 
                    onReset={() => { audioEngineRef.current.resetLeq(); setAudioData(p => ({...p, leq:0})); }} showReset 
                   />
                   <MetricBox 
                    icon={<Zap size={18} className="text-cyan-400" />}
                    label="SPL Peak Hold" value={globalSplPeak} unit="dB" 
                    color="text-cyan-400" 
                    onReset={resetSplPeak} showReset
                   />
                   
                   <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                     <Info size={16} className="text-slate-500" />
                     <p className="text-[9px] text-slate-500 uppercase font-bold leading-tight">Mics build-in often filter below 40Hz and above 16kHz.</p>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'calibration' && (
          <div className="animate-fade-in max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Digital Trim" subtitle="Input Alignment (0.1dB Steps)" icon={<Link2 />}>
              <div className="space-y-8 py-4">
                <div className="flex flex-col items-center">
                  <div className={`text-6xl font-black mb-6 ${digitalTrim !== 0 ? 'text-cyan-400' : 'text-white'} tabular-nums`}>
                    {digitalTrim > 0 ? '+' : ''}{digitalTrim.toFixed(1)} <span className="text-lg text-slate-600">dB</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                      onClick={() => adjustTrim(-0.1)} 
                      className="flex items-center justify-center gap-2 py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 text-cyan-400 shadow-xl"
                    >
                      <Minus size={24} /> <span className="font-black">-0.1</span>
                    </button>
                    <button 
                      onClick={() => adjustTrim(0.1)} 
                      className="flex items-center justify-center gap-2 py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 text-cyan-400 shadow-xl"
                    >
                      <Plus size={24} /> <span className="font-black">+0.1</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setAes17(!aes17)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl text-xs font-black uppercase transition-all active:scale-95 shadow-xl ${aes17 ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                  >
                    <span>AES-17 Correction (+3dB)</span>
                    <span className={aes17 ? 'bg-black/20 px-3 py-1 rounded-lg' : ''}>{aes17 ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Sens Offset" subtitle="Physical Calibration (1dB Steps)" icon={<Mic2 />}>
              <div className="space-y-8 py-4">
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-black text-white mb-6 tabular-nums">
                    {offset} <span className="text-lg text-slate-600">dB</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                      onClick={() => adjustOffset(-1)} 
                      className="flex items-center justify-center gap-2 py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 text-purple-400 shadow-xl"
                    >
                      <Minus size={24} /> <span className="font-black">-1.0</span>
                    </button>
                    <button 
                      onClick={() => adjustOffset(1)} 
                      className="flex items-center justify-center gap-2 py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 text-purple-400 shadow-xl"
                    >
                      <Plus size={24} /> <span className="font-black">+1.0</span>
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 text-center uppercase font-bold tracking-widest px-4">Match this value with a professional SPL meter for real-world accuracy.</p>
              </div>
            </Card>

            <Card title="Propagation Geometry" subtitle="Distance Compensation" className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Distance to Source</p>
                     <p className="text-5xl font-black text-white mb-6 tabular-nums">{distance}m</p>
                     
                     <div className="grid grid-cols-2 gap-4 w-full">
                        <button 
                          onClick={() => adjustDistance(-1)} 
                          className="flex items-center justify-center py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 shadow-xl"
                        >
                          <Minus size={24} />
                        </button>
                        <button 
                          onClick={() => adjustDistance(1)} 
                          className="flex items-center justify-center py-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 shadow-xl"
                        >
                          <Plus size={24} />
                        </button>
                     </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-4">
                  <button onClick={() => setModel('POINT')} className={`p-6 rounded-2xl border transition-all active:scale-95 text-left shadow-xl ${model === 'POINT' ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                    <p className="font-black text-xs uppercase tracking-wider mb-1">Point Source (Point)</p>
                    <p className="text-[9px] opacity-60 font-bold uppercase">Spherical Decay (-6dB/double dist)</p>
                  </button>
                  <button onClick={() => setModel('LINE')} className={`p-6 rounded-2xl border transition-all active:scale-95 text-left shadow-xl ${model === 'LINE' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                    <p className="font-black text-xs uppercase tracking-wider mb-1">Line Array (Line)</p>
                    <p className="text-[9px] opacity-60 font-bold uppercase">Cylindrical Decay (-3dB/double dist)</p>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Bar - PROFESSIONAL HARDWARE STYLE */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-40 px-4 md:px-6 pb-6 pt-4 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
          
          <div className="relative max-w-[220px] md:max-w-md mx-auto flex items-center justify-center pointer-events-auto">
             <div className={`w-full p-1 rounded-2xl md:p-1.5 border transition-all duration-700 glass shadow-2xl ${isActive ? 'border-cyan-500/40 shadow-cyan-500/20' : 'border-white/5'}`}>
               <button 
                onClick={handleToggle} 
                className={`w-full flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-6 rounded-[0.9rem] font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.97] justify-center group overflow-hidden relative ${isActive ? 'bg-zinc-900 text-white' : 'bg-[#0a0a0a] text-white border border-white/10 hover:border-cyan-500/50'}`}
               >
                 {/* LED Indicator */}
                 <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse' : 'bg-zinc-800'}`}></div>
                 
                 <span className="text-[11px] md:text-sm relative z-10 flex items-center gap-2">
                   {isActive ? (
                     <><Square size={14} className="md:w-4 md:h-4 text-cyan-400" fill="currentColor" /> Stop Engine</>
                   ) : (
                     <><Play size={14} className="md:w-4 md:h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" fill="currentColor" /> Start Engine</>
                   )}
                 </span>

                 {/* Subtle Light Reflection Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-50"></div>
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricBox: React.FC<{ label: string, value: number, unit: string, icon?: React.ReactNode, color?: string, showReset?: boolean, onReset?: () => void }> = ({ label, value, unit, icon, color = "text-white", showReset, onReset }) => (
  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col group relative shadow-md">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      {showReset && (
        <button onClick={onReset} className="text-slate-600 hover:text-white transition-all p-4 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-90 shadow-lg border border-white/5">
          <RotateCcw size={22}/>
        </button>
      )}
    </div>
    <div className={`text-4xl font-black tabular-nums ${color}`}>{value.toFixed(1)} <span className="text-sm text-slate-600 uppercase font-bold">{unit}</span></div>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl transition-all cursor-pointer group ${active ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`${active ? 'text-cyan-400' : ''}`}>{icon}</div>
    <span className="text-base font-bold tracking-tight">{label}</span>
    {active && <div className="ml-auto w-2.5 h-10 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>}
  </div>
);

export default App;
