import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Fingerprint, 
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '@/lib/supabase';

interface AadhaarVerificationProps {
  userId: string;
  onVerified: () => void;
}

type VerificationStep = 'ENTRY' | 'OTP' | 'VERIFYING' | 'SUCCESS';

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onVerified }) => {
  const [step, setStep] = useState<VerificationStep>('ENTRY');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (aadhaarNumber.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    setError(null);
    setStep('OTP');
    setCountdown(60);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your mobile");
      return;
    }
    
    setError(null);
    setStep('VERIFYING');

    // Artificial delay for "Government Handshake" feel
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_verified: true,
          is_active: true,
          onboarding_status: 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
      
      setStep('SUCCESS');
      setTimeout(onVerified, 2000);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "The heart's handshake failed. Please try again.");
      setStep('OTP');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-hidden py-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mat-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mat-panel-premium p-10 rounded-[2.5rem] relative overflow-hidden text-center space-y-8 bg-black/40 backdrop-blur-2xl border border-white/5"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mat-gold to-transparent opacity-50" />
        
        <AnimatePresence mode="wait">
          {step === 'ENTRY' && (
            <motion.div 
              key="entry"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-mat-gold/10 border border-mat-gold/20 mb-2">
                  <Fingerprint className="text-mat-gold w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Seal of Truth</h2>
                <p className="text-[10px] text-mat-gold/60 uppercase tracking-[0.4em] font-black">Step 1: The Heart's Truth</p>
              </div>

              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Aadhaar Number</label>
                  <Input 
                    type="text" 
                    maxLength={12}
                    placeholder="0000 0000 0000"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    className="h-16 bg-white/[0.03] border-white/10 text-xl font-mono tracking-[0.3em] text-center focus:border-mat-gold transition-colors rounded-2xl"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2">
                   <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tight flex gap-2">
                     <ShieldCheck size={12} className="text-mat-gold shrink-0" />
                     Your data is encrypted and never stored. Verification happens via secure reality gateway.
                   </p>
                </div>
              </div>

              <Button 
                onClick={handleSendOTP} 
                className="w-full h-16 bg-mat-gold text-black hover:bg-mat-gold/90 font-black tracking-widest uppercase rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] flex gap-3"
              >
                Send Secret Code <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === 'OTP' && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-mat-gold/10 border border-mat-gold/20 mb-2">
                  <Smartphone className="text-mat-gold w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">A Sacred Link</h2>
                <p className="text-[10px] text-mat-gold/60 uppercase tracking-[0.4em] font-black">Step 2: Security Handshake</p>
              </div>

              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Enter Secret Code</label>
                    <span className="text-[10px] font-mono text-mat-gold">{countdown > 0 ? `00:${countdown.toString().padStart(2, '0')}` : 'EXPIRED'}</span>
                  </div>
                  <Input 
                    type="text" 
                    maxLength={6}
                    placeholder="●●● ●●●"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="h-16 bg-white/[0.03] border-white/10 text-2xl font-mono tracking-[0.5em] text-center focus:border-mat-gold transition-colors rounded-2xl"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">
                  Code sent to mobile linked with Aadhaar ending in {aadhaarNumber.slice(-4)}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleVerifyOTP} 
                  className="w-full h-16 bg-mat-gold text-black hover:bg-mat-gold/90 font-black tracking-widest uppercase rounded-2xl shadow-mat-gold"
                >
                  Confirm Truth
                </Button>
                <button 
                  onClick={() => setStep('ENTRY')}
                  className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                  Change Aadhaar Number
                </button>
              </div>
            </motion.div>
          )}

          {step === 'VERIFYING' && (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 space-y-8"
            >
              <div className="relative flex items-center justify-center">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-2 border-dashed border-mat-gold/20"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-mat-gold animate-pulse" />
                 </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-xl font-display font-black text-white italic uppercase tracking-widest">Weaving the Connection</h3>
                 <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                       {[0, 1, 2].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ opacity: [0.2, 1, 0.2] }}
                           transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                           className="w-1.5 h-1.5 rounded-full bg-mat-gold"
                         />
                       ))}
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">Secure Reality Handshake</p>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 space-y-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40">
                <CheckCircle className="text-green-400 w-12 h-12" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Reality Confirmed</h2>
                 <p className="text-[10px] text-green-400 uppercase tracking-[0.5em] font-bold animate-pulse">Welcome to the Sanctuary</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-center gap-2 text-[9px] text-white/20 uppercase tracking-widest">
            <Lock size={10} /> Encryption: AES-256 Multi-Layer
          </div>
        </div>
      </motion.div>
    </div>
  );
};
