import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Fingerprint, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Scan,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { api } from '@/services/api';
import { diditService } from '@/services/DiditService';
import { cn } from '@/lib/utils';

type VerificationStep = 'START' | 'ID_VERIFICATION' | 'LIVENESS' | 'SUCCESS';

interface PlanStep {
  id: string;
  label: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  detail: string;
}

interface AadhaarVerificationProps {
  userId: string;
  isVerified?: boolean;
  onVerified: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, isVerified, onVerified }) => {
  const [step, setStep] = useState<VerificationStep>('START');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanStep[]>([]);
  
  // 🛡️ Global message listener for iframe feedback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'DIDIT_COMPLETE') {
        if (event.data.status === 'Approved') {
          await finalizeRegistry('Approved');
        } else {
          await finalizeRegistry(event.data.status || 'Declined');
          setError(event.data.message || 'Identity Handshake Failed.');
          setStep('START');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch live implementation plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/agentic/verification/plan`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setPlan(data.steps);
      } catch (err) {
        console.error("Failed to fetch verification plan:", err);
      }
    };
    if (step !== 'START' && step !== 'SUCCESS') fetchPlan();
  }, [step]);

  const finalizeRegistry = async (statusVal: string = 'Approved') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.finalizeVerification(statusVal);
      if (statusVal === 'Approved') {
        if (res.success) {
          setStep('SUCCESS');
          // User will proceed via the "Enter the Sanctuary" button
        } else {
          throw new Error(res.message || "Identity Sealing Failed.");
        }
      } else {
        // If not approved, let the error state show
      }
    } catch (err: any) {
      console.error("VERIFICATION_FINALIZATION_ERROR:", err);
      setError(err.message || 'Sealing Failure.');
    } finally {
      setLoading(false);
    }
  };

  // ─── ALREADY VERIFIED: Short-circuit to a badge ─────────────────────────
  if (isVerified) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 md:p-12 bg-black/40 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] border border-green-500/20 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-24 h-24 rounded-full border-4 border-green-400/60 bg-green-500/10 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.15)]">
            <ShieldCheck size={48} className="text-green-400" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-green-400">Identity Sealed</span>
          <h3 className="text-3xl font-display font-black italic text-white tracking-tighter uppercase">You Are Verified</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed">Your biometric identity is permanently encoded into the Sanctuary.</p>
        </div>
      </div>
    );
  }

  const progressSteps = [
    { id: 'ID_VERIFICATION', label: 'Identity', icon: Scan },
    { id: 'LIVENESS', label: 'Biometrics', icon: Fingerprint },
    { id: 'SUCCESS', label: 'Verified', icon: ShieldCheck },
  ];

  const getStepIndex = (s: VerificationStep) => {
    const map: Record<VerificationStep, number> = {
      'START': -1,
      'ID_VERIFICATION': 0,
      'LIVENESS': 0,
      'SUCCESS': 2
    };
    return map[s];
  };

  // ─── FULL-SCREEN IFRAME MODE (iOS Safe) ────────────────────────────────────
  // During active verification, render the iframe full-screen to avoid any
  // container clipping issues on iOS Safari (where overflow-hidden on ancestor
  // elements clips fixed-height flex children unpredictably).
  if (step === 'ID_VERIFICATION' || step === 'LIVENESS') {
    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-black"
        style={{ height: '100dvh' }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/5 shrink-0">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-mat-gold uppercase tracking-[0.5em]">Phase 01-02</span>
            <span className="text-sm font-display font-black text-white italic uppercase leading-none">ID & Biometrics</span>
          </div>
          <button
            onClick={() => setStep('START')}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-mat-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black text-mat-gold uppercase tracking-widest">Sealing Identity...</span>
          </div>
        )}

        {/* Error Banner */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mx-4 mt-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-4 shrink-0"
            >
              <ShieldAlert className="text-red-500 shrink-0" size={18} />
              <p className="text-[10px] text-red-100 font-bold uppercase tracking-wide leading-tight flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-white/30 hover:text-white text-[8px] font-black uppercase tracking-widest shrink-0">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Iframe — takes all remaining height */}
        <iframe
          src={diditService.getVerificationUrl()}
          allow="camera *; microphone *; display-capture *;"
          className="flex-1 w-full border-none"
          style={{ display: 'block', minHeight: 0 }}
          title="Didit Verification Flow"
        />

        {/* Footer */}
        <div className="px-4 py-2 bg-black/80 border-t border-white/5 shrink-0">
          <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.2em]">
            Secured by Didit · Aadhaar + Face Liveness
          </p>
        </div>
      </div>
    );
  }

  // ─── STANDARD CARD MODE (START & SUCCESS) ─────────────────────────────────
  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-12 space-y-8 md:space-y-12 bg-black/40 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
      {/* 🔮 Verification Progress Rail */}
      <div className="flex justify-between items-center px-4 relative z-10">
        {progressSteps.map((s, i) => {
          const isActive = getStepIndex(step) >= i;
          const isCurrent = (s.id === 'ID_VERIFICATION' && (step === 'ID_VERIFICATION' || step === 'LIVENESS')) || step === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 relative border",
                  isActive ? "bg-mat-gold/20 border-mat-gold text-mat-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "bg-white/5 border-white/5 text-white/10",
                  isCurrent && "ring-4 ring-mat-gold/10"
                )}>
                  <s.icon strokeWidth={1.5} size={20} />
                  {isActive && !isCurrent && (
                    <div className="absolute -top-1 -right-1 bg-mat-gold text-black rounded-full p-0.5">
                      <CheckCircle size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] transition-colors",
                  isActive ? "text-mat-gold" : "text-white/10"
                )}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px mt-6 mx-2 bg-white/5">
                  <div 
                    className="h-full bg-mat-gold transition-all duration-1000" 
                    style={{ width: isActive && getStepIndex(step) > i ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'START' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="start" className="text-center space-y-8 py-10 relative z-10">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-mat-gold/20 blur-3xl rounded-full" />
               <ShieldCheck size={80} className="text-mat-gold relative z-10" strokeWidth={1} />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl font-display font-black text-white italic tracking-tight uppercase">Identity Verification</h2>
               <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-medium">
                 Start the secure identity check. Verified by Didit's encrypted system. No bots, only real users.
               </p>
            </div>
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <ShieldAlert className="text-red-400 shrink-0" size={16} />
                <p className="text-[10px] text-red-200 font-bold text-left leading-tight">{error}</p>
              </div>
            )}
            <Button 
               onClick={() => setStep('ID_VERIFICATION')}
               className="w-full h-18 bg-mat-gold text-mat-obsidian hover:bg-white font-black uppercase tracking-[0.4em] text-[12px] rounded-3xl group shadow-[0_20px_40px_rgba(212,175,55,0.15)] mt-4"
            >
               Start Verification <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="success" className="text-center space-y-8 py-16 relative z-10">
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: 'spring', damping: 15 }}
               className="relative inline-block"
             >
                <div className="absolute inset-0 bg-green-500/20 blur-[80px] rounded-full" />
                <div className="w-32 h-32 rounded-full border-4 border-green-400 flex items-center justify-center relative z-10">
                  <CheckCircle2 size={64} className="text-green-400" strokeWidth={3} />
                </div>
             </motion.div>
             <div className="space-y-4">
                <h2 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase">Identity Verified</h2>
                <p className="text-[12px] text-green-400 font-black uppercase tracking-[0.6em] animate-pulse">Welcome to the community</p>
             </div>
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
             >
               <Button
                 onClick={onVerified}
                 className="w-full h-16 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-[0.4em] text-[12px] rounded-3xl group shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all"
               >
                 Enter the Sanctuary <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
               </Button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏛️ SYSTEM ADVISORY */}
      <div className="flex justify-between items-center opacity-20 pt-4 border-t border-white/5 relative z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">System Version v2.6.0</span>
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Verification Check</span>
      </div>
    </div>
  );
};
