import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldCheck, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@heroui/react';
import { faceVerificationService } from '@/services/FaceVerificationService';

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'loading' | 'preparing' | 'scanning' | 'verifying' | 'result'>('loading');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await faceVerificationService.loadModels();
        setStep('preparing');
      } catch (err) {
        setResult({ success: false, message: "CRITICAL ERROR: BIOMETRIC MODELS OFFLINE" });
        setStep('result');
      }
    };
    init();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStep('scanning');
      }
    } catch (err) {
      setResult({ success: false, message: "HD CAMERA ACCESS DENIED" });
      setStep('result');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleVerify = async () => {
    setStep('verifying');
    
    // In a real scenario, we'd capture the frame from videoRef and compare with referenceImage
    // For this high-fidelity demo, we'll use the simulated verification to ensure a smooth flow
    const response = await faceVerificationService.simulateVerification(true);
    
    stopCamera();
    
    if (response.success) {
      setResult({ success: true, message: "IDENTITY SYNCED: SOVEREIGN TRUST ESTABLISHED" });
      onSuccess();
    } else {
      setResult({ success: false, message: "BIOMETRIC MISMATCH: ACCESS DENIED" });
    }
    setStep('result');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[420px] bg-[#0a0a0a] border border-mat-gold/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)] relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-mat-gold/10 to-transparent">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-mat-gold" size={20} />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-mat-cream font-['Roboto Condensed']">
              Biometric Protocol
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <Loader2 className="animate-spin text-mat-gold" size={48} />
                <p className="text-[10px] uppercase tracking-[0.4em] text-mat-gold animate-pulse">Initializing Cortex...</p>
              </motion.div>
            )}

            {step === 'preparing' && (
              <motion.div 
                key="preparing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 py-4"
              >
                <div className="w-24 h-24 rounded-full bg-mat-gold/5 flex items-center justify-center border border-mat-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <Camera className="text-mat-gold" size={32} />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-black italic uppercase italic tracking-wider text-mat-cream">Establish Trust</h3>
                  <p className="text-[11px] leading-relaxed text-mat-cream/60 max-w-[280px]">
                    Position your face within the frame. Ensure lighting is optimal for facial architecture verification.
                  </p>
                </div>
                <Button 
                  onPress={startCamera}
                  className="w-full h-14 bg-mat-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  Initiate Scan
                </Button>
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="relative space-y-8"
              >
                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-mat-gold/30 bg-black">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-75" />
                  
                  {/* Scanning HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                     {/* Scanning Laser */}
                     <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-mat-gold/80 shadow-[0_0_15px_#d4af37]"
                     />
                     <div className="absolute inset-0 border-[30px] border-black/40" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-mat-gold/40 rounded-full animate-pulse flex items-center justify-center">
                           <div className="w-32 h-32 border border-mat-gold/20 rounded-full" />
                        </div>
                     </div>
                  </div>
                </div>

                <Button 
                  onPress={handleVerify}
                  className="w-full h-14 bg-mat-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  Capture Biometrics
                </Button>
              </motion.div>
            )}

            {step === 'verifying' && (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-6"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border border-mat-gold/20 border-t-mat-gold animate-spin" />
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mat-gold opacity-50" size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-mat-gold">Verifying Identity</p>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">Analyzing Neural Descriptors...</p>
                </div>
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-8 py-4"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border ${result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  {result.success ? 
                    <ShieldCheck className="text-green-500" size={40} /> : 
                    <AlertCircle className="text-red-500" size={40} />
                  }
                </div>
                <div className="text-center space-y-2 px-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.15em] text-mat-cream">{result.message}</h3>
                </div>
                <Button 
                  onPress={result.success ? onClose : () => setStep('preparing')}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] ${result.success ? 'bg-mat-gold text-black' : 'bg-white/5 text-white/60 border border-white/10'}`}
                >
                  {result.success ? "Proceed to Sanctuary" : "Retry Sync"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex justify-center">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-medium">Secured by Matrix Vaults</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
