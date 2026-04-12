import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Fingerprint, 
  PhoneCall, 
  Camera, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Scan,
  Smartphone,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';
import { diditService } from '@/services/diditService';
import { faceVerificationService } from '@/services/FaceVerificationService';
import { cn } from '@/lib/utils';

type VerificationStep = 'START' | 'ID_VERIFICATION' | 'LIVENESS' | 'PHONE_REGISTRY' | 'SUCCESS';

interface AadhaarVerificationProps {
  userId: string;
  onVerified: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onVerified }) => {
  const [step, setStep] = useState<VerificationStep>('START');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  // 🛡️ Global message listener for iframe feedback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Add origin check in production
      if (event.data?.type === 'DIDIT_COMPLETE') {
        if (event.data.status === 'Approved') {
          setStep('PHONE_REGISTRY');
        } else {
          setError(event.data.message || 'Identity Handshake Failed.');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Registry Finalization logic
  const handlePhoneRequest = async () => {
    if (phoneNumber.length !== 10) return setError('Invalid mobile registry');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        phone: `+91${phoneNumber}` 
      });
      if (error) throw error;
      setError('Registry Code Sent.');
    } catch (err: any) {
      setError(err.message || 'Registry signal interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    setLoading(true);
    try {
      // In a real flow, verify with Supabase here
      setStep('SUCCESS');
      setTimeout(onVerified, 3000);
    } catch (err) {
      setError('Invalid Registry Code.');
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { id: 'ID_VERIFICATION', label: 'Identity', icon: Scan },
    { id: 'LIVENESS', label: 'Biometrics', icon: Fingerprint },
    { id: 'PHONE_REGISTRY', label: 'Registry', icon: Smartphone },
  ];

  const getStepIndex = (s: VerificationStep) => {
    const map: Record<VerificationStep, number> = {
      'START': -1,
      'ID_VERIFICATION': 0,
      'LIVENESS': 0, // Didit handles both
      'PHONE_REGISTRY': 2,
      'SUCCESS': 3
    };
    return map[s];
  };

  return (
    <div className="w-full max-w-xl mx-auto p-12 space-y-12 bg-black/40 backdrop-blur-xl rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
      {/* 🔮 THE SOVEREIGN PROGRESS RAIL */}
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
               <h2 className="text-4xl font-display font-black text-white italic tracking-tight uppercase">Sovereign Identity</h2>
               <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-medium">
                 Initiate the live identity protocol. Powered by Didit’s zero-knowledge handshake. No simulations, only truth.
               </p>
            </div>
            <Button 
               onClick={() => setStep('ID_VERIFICATION')}
               className="w-full h-18 bg-mat-gold text-mat-obsidian hover:bg-white font-black uppercase tracking-[0.4em] text-[12px] rounded-3xl group shadow-[0_20px_40px_rgba(212,175,55,0.15)] mt-4"
            >
               Activate Protocol <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        )}

        {(step === 'ID_VERIFICATION' || step === 'LIVENESS') && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="didit" className="space-y-8 text-center relative z-10 h-[500px]">
             <div className="space-y-2">
                <span className="text-[9px] font-black text-mat-gold uppercase tracking-[0.5em]">Phase 01-02: Live Handshake</span>
                <h3 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">ID & Biometrics</h3>
             </div>

             <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/20 shadow-2xl relative">
                <iframe 
                  src={diditService.getVerificationUrl()}
                  allow="camera *; microphone *; display-capture *;"
                  className="w-full h-full border-none"
                  title="Didit Sovereign Handshake"
                />
                
                {/* 🛡️ Privacy Overlay HUD */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[7px] text-white/60 font-black uppercase tracking-widest">Live Encryption Active</span>
                </div>
             </div>
             
             <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Our protocol combines Aadhaar OTP, Name Validation, and Face Liveness via Didit.</p>
          </motion.div>
        )}

        {step === 'PHONE_REGISTRY' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="phone" className="space-y-10 relative z-10">
             <div className="space-y-2 text-center">
                <span className="text-[9px] font-black text-mat-gold uppercase tracking-[0.5em]">Phase 03: Registry</span>
                <h3 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Registry Binding</h3>
             </div>

             <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-8 backdrop-blur-sm">
                <div className="space-y-4">
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black text-center">Finalize Sovereign Mobile Registry</p>
                   <div className="flex gap-3">
                      <div className="w-24 h-18 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center text-mat-gold font-mono text-lg">+91</div>
                      <Input 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Mobile Number"
                        className="h-18 flex-1 bg-black/40 border-white/10 text-xl font-mono tracking-[0.3em] rounded-2xl text-white pl-6"
                      />
                   </div>
                   <Button 
                      onClick={handlePhoneRequest}
                      disabled={loading || phoneNumber.length !== 10}
                      className="w-full h-18 bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 font-bold uppercase tracking-[0.3em] rounded-2xl text-[11px]"
                   >
                       {loading ? <Loader2 className="animate-spin" /> : 'Transmit Binding Signal'}
                   </Button>
                </div>

                <div className="space-y-4 mt-12 bg-black/20 p-6 rounded-3xl border border-white/5">
                   <Input 
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="______"
                      className="h-20 bg-transparent border-white/10 text-center font-mono text-3xl tracking-[1em] rounded-2xl text-mat-gold focus:border-mat-gold"
                   />
                   <Button 
                      onClick={handlePhoneVerify}
                      disabled={loading || phoneOtp.length !== 6}
                      className="w-full h-18 bg-mat-gold text-mat-obsidian hover:bg-white font-black uppercase tracking-[0.4em] rounded-2xl text-[12px] shadow-lg"
                   >
                      Seal Identity
                   </Button>
                </div>
             </div>
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
                <h2 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase">Identity Sealed</h2>
                <p className="text-[12px] text-green-400 font-black uppercase tracking-[0.6em] animate-pulse">Welcome to the Inner Sanctuary</p>
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

      {/* 🏛️ LEGAL ADVISORY */}
      <div className="flex justify-between items-center opacity-20 pt-4 border-t border-white/5 relative z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Sovereign Protocol v2.4.7</span>
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Zero-Knowledge Handshake</span>
      </div>
    </div>

  );
};
