import React, { Component, ReactNode, Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

interface Props {
  scene: string;
  className?: string;
}

interface State {
  hasError: boolean;
}

// 🛡️ Local Error Boundary to prevent Spline network/runtime errors from crashing the app
class SplineErrorBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("Spline Runtime Interrupted:", error);
  }

  render() {
    if (this.state.hasError) {
      return <MatriarchHeartFallback />;
    }
    return this.props.children;
  }
}

// 🌹 Premium CSS/SVG Fallback Heart
const MatriarchHeartFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#030303]">
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      <svg
        className="w-32 h-32 text-rose-500 drop-shadow-[0_0_30px_rgba(225,29,72,0.4)]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full scale-150" />
    </motion.div>
  </div>
);

const SafeSpline: React.FC<Props> = ({ scene, className }) => {
  return (
    <SplineErrorBoundary>
      <Suspense fallback={<div className="w-full h-full bg-[#030303] animate-pulse" />}>
        <Spline 
          scene={scene} 
          className={className}
          onLoad={() => {
            // Ensure the system handshake happens even in Spline context
            window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
          }}
          onError={() => {
             // Force fallback on error if Spline's internal handler doesn't throw
             window.dispatchEvent(new ErrorEvent('error', { error: new Error('Spline Load Failure') }));
          }}
        />
      </Suspense>
    </SplineErrorBoundary>
  );
};

export default SafeSpline;
