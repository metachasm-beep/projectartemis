import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SanctuaryErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Sanctuary Error Boundary caught an exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-mat-obsidian flex flex-col items-center justify-center p-6 text-center">
          <div className="mat-glass-deep p-8 rounded-[2.5rem] border border-mat-rose/20 max-w-md w-full flex flex-col items-center shadow-2xl backdrop-blur-3xl">
            <div className="p-4 bg-mat-rose/10 rounded-full text-mat-rose mb-6">
              <ShieldAlert size={36} />
            </div>
            <h2 className="text-2xl font-light text-mat-bone italic tracking-tight mb-2">Sanctuary Interrupted</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-6 uppercase tracking-widest">
              An unexpected disruption occurred within the view matrix. Our architectural sentinels have logged the event.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-mat-gold text-black rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Restore Resonance</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
