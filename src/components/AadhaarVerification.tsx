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
  Zap,
  Loader2
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
  onVerified: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onVerified }) => {
  const [step, setStep] = useState<VerificationStep>('START');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanStep[]>([]);
  
  // 🛡️ Global message listener for iframe feedback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'DIDIT_COMPLETE') {
        if (event.data.status === 'Approved') {
          await finalizeRegistry();
        } else {
          setError(event.data.message || 'Identity Handshake Failed.');
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

  const finalizeRegistry = async () => {
    setLoading(true);
    setError(null);
    try {
      // Finalize Identity in Sanctuary Registry after Biometric success
      const res = await api.finalizeVerification();
      if (res.success) {
        setStep('SUCCESS');
        setTimeout(onVerified, 3000);
      } else {
        throw new Error(res.message || "Identity Sealing Failed.");
      }
    } catch (err: any) {
      console.error("VERIFICATION_FINALIZATION_ERROR:", err);
      setError(err.message || 'Sealing Failure.');
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { id: 'ID_VERIFICATION', label: 'Identity', icon: Scan },
    { id: 'LIVENESS', label: 'Biometrics', icon: Fingerprint },
    { id: 'SUCCESS', label: 'Verified', icon: ShieldCheck },
  ];

  const getStepIndex = (s: VerificationStep) => {
    const map: Record<VerificationStep, number> = {
      'START': -1,
      'ID_VERIFICATION': 0,
      'LIVENESS': 0, // Didit handles both
      'SUCCESS': 2
    };
    return map[s];
  };

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
                 Start the secure identity check. Verified by Didit’s encrypted system. No bots, only real users.
               </p>
            </div>
            <Button 
               onClick={() => setStep('ID_VERIFICATION')}
               className="w-full h-18 bg-mat-gold text-mat-obsidian hover:bg-white font-black uppercase tracking-[0.4em] text-[12px] rounded-3xl group shadow-[0_20px_40px_rgba(212,175,55,0.15)] mt-4"
            >
               Start Verification <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        )}

        {(step === 'ID_VERIFICATION' || step === 'LIVENESS') && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="didit" className="space-y-8 text-center relative z-10 min-h-[500px] flex flex-col">
             <div className="space-y-2 mb-4">
                <span className="text-[9px] font-black text-mat-gold uppercase tracking-[0.5em]">Phase 01-02: Identity Check</span>
                <h3 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">ID & Biometrics</h3>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* 🛡️ Implementation Plan Sidebar */}
                <div className="w-full lg:w-48 flex flex-col gap-3 text-left">
                   <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-mat-gold" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Plan</span>
                   </div>
                   {plan.map((p, i) => (
                      <div key={i} className={cn(
                        "p-3 rounded-xl border transition-all duration-500",
                        p.status === 'ACTIVE' ? "bg-mat-gold/10 border-mat-gold/30" : 
                        p.status === 'COMPLETED' ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/5 opacity-40"
                      )}>
                         <div className="flex items-center justify-between mb-1">
                            <span className={cn("text-[8px] font-black uppercase", p.status === 'COMPLETED' ? "text-green-400" : "text-white/60")}>{p.label}</span>
                            {p.status === 'ACTIVE' && <Loader2 size={8} className="animate-spin text-mat-gold" />}
                            {p.status === 'COMPLETED' && <CheckCircle size={8} className="text-green-400" />}
                         </div>
                         <p className="text-[7px] text-white/30 font-medium leading-tight">{p.detail}</p>
                      </div>
                   ))}
                </div>

                {/* 🔮 Verification Iframe */}
                <div className="flex-1 min-h-[450px] lg:min-h-0 rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/20 shadow-2xl relative">
                    {loading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-mat-gold border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-black text-mat-gold uppercase tracking-widest">Sealing Identity...</span>
                      </div>
                    )}
                    <iframe 
                      src={diditService.getVerificationUrl()}
                      allow="camera *; microphone *; display-capture *;"
                      className="w-full h-full border-none"
                      title="Didit Verification Flow"
                    />
                </div>
             </div>
             
             <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-4">Our system uses Aadhaar checks and Face Liveness via Didit.</p>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} key="success" className="text-center space-y-8 py-20 relative z-10">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ ERROR HUD */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center gap-6 backdrop-blur-xl z-20"
          >
             <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
               <ShieldAlert className="text-red-500" size={24} />
             </div>
             <p className="text-[11px] text-red-100 font-bold uppercase tracking-widest leading-relaxed flex-1">{error}</p>
             <button onClick={() => setError(null)} className="text-white/20 hover:text-white uppercase text-[9px] font-black tracking-widest">Dismiss</button>
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
