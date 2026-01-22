
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LiveSync Pro - Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 md:p-10">
          <div className="max-w-md w-full text-center space-y-8 p-8 md:p-12 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
            
            <div className="flex justify-center">
              <div className="p-8 bg-red-500/10 rounded-full text-red-500 animate-pulse border border-red-500/20">
                <AlertTriangle size={48} />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">System Malfunction</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                An unexpected error occurred in the signal processing chain. The audio engine has been suspended for safety.
              </p>
            </div>
            
            <Button 
              variant="danger" 
              fullWidth 
              size="lg"
              onClick={() => window.location.reload()} 
              icon={<RefreshCcw size={18} />}
            >
              Re-initialize Suite
            </Button>
            
            <p className="text-[10px] text-slate-700 uppercase font-black tracking-widest pt-4">Error Reference: DSP_CHAIN_CRASH</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
