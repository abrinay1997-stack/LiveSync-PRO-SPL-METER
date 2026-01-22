
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Monitor, MessageSquareDot, LifeBuoy } from 'lucide-react';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import ActionControlBar from './components/ActionControlBar';
import AnalyzerView from './components/AnalyzerView';
import CalibrationView from './components/CalibrationView';
import { AudioEngine } from './services/AudioEngine';
import { useAudioSettings } from './hooks/useAudioSettings';
import { useSessionStats } from './hooks/useSessionStats';
import { AudioData } from './types';
import { triggerHaptic } from './utils/haptics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'analyzer' | 'calibration'>('analyzer');
  const [isActive, setIsActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { settings, setters, refreshDevices, getEngineSettings } = useAudioSettings();
  const { stats, updateStats, resetStats, resetDigital } = useSessionStats();
  
  const [audioData, setAudioData] = useState<AudioData>({
    rms: -60, peak: -60, spl: 0, sourceSpl: 0, leq: 0, distanceLoss: 0, clipped: false
  });

  const audioEngineRef = useRef<AudioEngine>(new AudioEngine());
  const lastClipRef = useRef(false);

  // WakeLock Logic: Prevent screen sleep while measuring
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isActive) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn("WakeLock request failed", err);
      }
    };

    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      audioEngineRef.current.updateSettings(getEngineSettings());
    }
  }, [getEngineSettings, isActive]);

  const handleToggle = async () => {
    triggerHaptic('medium');
    if (isActive) {
      audioEngineRef.current.stop();
      setIsActive(false);
    } else {
      try {
        await audioEngineRef.current.start(getEngineSettings(), (data) => {
          setAudioData(data);
          updateStats(data);
          
          // Haptic Feedback for Clipping
          if (data.clipped && !lastClipRef.current) {
            triggerHaptic('warning');
          }
          lastClipRef.current = data.clipped;
        });
        setIsActive(true);
      } catch (err) {
        alert("Audio error: Verify microphone permissions.");
      }
    }
  };

  const handleDeviceChange = (id: string) => {
    triggerHaptic('light');
    setters.setSelectedDeviceId(id);
    if (isActive) {
      audioEngineRef.current.stop();
      setIsActive(false);
      setTimeout(() => handleToggle(), 100); 
    }
  };

  const handleResetAll = () => {
    triggerHaptic('heavy');
    audioEngineRef.current.resetLeq();
    setAudioData(prev => ({ ...prev, leq: 0 }));
    resetStats();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans selection:bg-cyan-500/30">
      <Sidebar 
        currentView={currentView}
        setView={(v) => { triggerHaptic('light'); setCurrentView(v); }}
        weighting={settings.weighting}
        setWeighting={setters.setWeighting}
        onResetPeaks={handleResetAll}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-grow lg:ml-72 p-4 md:p-10 max-w-7xl mx-auto w-full pb-36 lg:pb-10 overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex items-center justify-between mb-8 lg:hidden">
          <Logo />
          <button 
            onClick={() => { triggerHaptic('light'); setIsSidebarOpen(true); }} 
            className="p-5 bg-white/5 border border-white/10 rounded-2xl text-cyan-400"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Desktop Header Links (Minimal Version) */}
        <div className="hidden lg:flex justify-end mb-8">
          <div className="flex items-center gap-3 p-1.5 px-3 bg-white/[0.03] border border-white/5 rounded-2xl">
            <a 
              href="https://livesyncpro.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors" 
              title="Aplicación"
            >
              <Monitor size={16} />
            </a>
            
            <div className="w-px h-3 bg-white/10" />
            
            <a 
              href="https://support.livesyncpro.com/#chat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors" 
              title="Chat Soporte"
            >
              <MessageSquareDot size={16} />
            </a>
            
            <div className="w-px h-3 bg-white/10" />
            
            <a 
              href="https://support.livesyncpro.com/#inicio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors" 
              title="Base Conocimiento"
            >
              <LifeBuoy size={16} />
            </a>
          </div>
        </div>

        {currentView === 'analyzer' ? (
          <AnalyzerView 
            audioData={audioData}
            weighting={settings.weighting}
            sessionMaxRms={stats.sessionMaxRms}
            sessionMaxPeak={stats.sessionMaxPeak}
            globalSplPeak={stats.globalSplPeak}
            sessionMaxSource={stats.sessionMaxSource}
            distance={settings.distance}
            onResetDigital={() => { triggerHaptic('light'); resetDigital(); }}
            onResetSource={() => { triggerHaptic('light'); }}
            onResetLeq={() => { 
              triggerHaptic('medium');
              audioEngineRef.current.resetLeq(); 
              setAudioData(p => ({...p, leq:0})); 
            }}
            onResetSplPeak={() => { triggerHaptic('light'); }}
          />
        ) : (
          <CalibrationView 
            digitalTrim={settings.digitalTrim}
            setDigitalTrim={setters.setDigitalTrim}
            aes17={settings.aes17}
            setAes17={setters.setAes17}
            offset={settings.offset}
            setOffset={setters.setOffset}
            distance={settings.distance}
            setDistance={setters.setDistance}
            model={settings.model}
            setModel={setters.setModel}
            devices={settings.devices}
            selectedDeviceId={settings.selectedDeviceId}
            onDeviceChange={handleDeviceChange}
            onRefreshDevices={() => { triggerHaptic('light'); refreshDevices(); }}
          />
        )}

        <ActionControlBar isActive={isActive} onToggle={handleToggle} />
      </main>
    </div>
  );
};

export default App;
