import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { auth as firebaseAuth } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  UserCredential
} from 'firebase/auth';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'CHOICE' | 'PHONE' | 'OTP'>('CHOICE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Initialize Recaptcha
  useEffect(() => {
    if (isOpen && !recaptchaVerifierRef.current && step === 'PHONE') {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
             console.log("RECAPTCHA_SOLVED: Identity verified as human.");
          }
        });
      } catch (err) {
        console.error("RECAPTCHA_INIT_ERROR:", err);
      }
    }
  }, [isOpen, step]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!phone) return setError('Please enter a valid phone number.');
    setLoading(true);
    setError(null);
    
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error("Recaptcha not initialized. Please refresh.");
      }
      
      const confirmationResult = await signInWithPhoneNumber(
        firebaseAuth, 
        formattedPhone, 
        recaptchaVerifierRef.current
      );
      
      confirmationResultRef.current = confirmationResult;
      setStep('OTP');
    } catch (err: any) {
      console.error("FIREBASE_AUTH_ERROR:", err);
      setError(err.message || 'Failed to send OTP via Firebase. Ensure your project is configured correctly.');
      // Reset recaptcha on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return setError('Please enter the verification code.');
    if (!confirmationResultRef.current) return setError('Session expired. Please request a new code.');
    
    setLoading(true);
    setError(null);
    
    try {
      const result: UserCredential = await confirmationResultRef.current.confirm(otp);
      console.log("FIREBASE_AUTH_SUCCESS: User authenticated.", result.user.uid);
      
      // 🏛️ Sanctuary Identity Bridge
      // Note: Since the app uses Supabase for database logic, we would ideally sync this 
      // Firebase User with a Supabase record here. For now, we signal success.
      
      onClose();
      // Optional: window.location.reload() or navigate if needed
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-mat-noir/80 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Recaptcha Anchor */}
          <div id="recaptcha-container"></div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full bg-mat-noir/10 text-mat-noir hover:bg-mat-noir/20 transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="p-10 md:p-14">
             <div className="text-center mb-12">
                <div className="w-20 h-20 bg-mat-gold/5 text-mat-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <ShieldCheck size={40} className="animate-pulse" />
                </div>
                <h2 className="text-4xl font-display text-mat-noir mb-3 italic">Sanctuary Gate</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-noir/20">Identity Verification Protocol</p>
             </div>

             <div className="space-y-8">
                <AnimatePresence mode="wait">
                   {step === 'CHOICE' && (
                     <motion.div 
                       key="choice"
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="space-y-4"
                     >
                        <button 
                          onClick={handleGoogleLogin}
                          disabled={loading}
                          className="w-full h-18 rounded-3xl border border-mat-noir/5 bg-white flex items-center justify-center gap-4 hover:shadow-xl transition-all active:scale-95 group"
                        >
                           <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                           <span className="text-[12px] font-black uppercase tracking-widest text-mat-noir/60">Continue with Google</span>
                        </button>

                        <div className="relative flex items-center py-6">
                           <div className="flex-grow border-t border-mat-noir/5"></div>
                           <span className="flex-shrink mx-6 text-[9px] font-black uppercase tracking-[0.4em] text-mat-noir/10">Or use Secure Identity</span>
                           <div className="flex-grow border-t border-mat-noir/5"></div>
                        </div>

                        <button 
                          onClick={() => setStep('PHONE')}
                          className="w-full h-18 rounded-3xl bg-mat-noir text-white flex items-center justify-center gap-4 hover:bg-mat-gold transition-all active:scale-95 shadow-2xl"
                        >
                           <Phone size={20} className="text-mat-gold" />
                           <span className="text-[12px] font-black uppercase tracking-widest">Firebase Phone Access</span>
                        </button>
                     </motion.div>
                   )}

                   {step === 'PHONE' && (
                     <motion.div 
                       key="phone"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="space-y-8"
                     >
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-noir/30 ml-3">Secure Phone Number</label>
                           <div className="relative">
                              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[16px] font-black text-mat-noir/20">+91</span>
                              <Input 
                                type="tel"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-18 pl-20 rounded-3xl border-mat-noir/10 bg-mat-noir/[0.01] text-xl font-bold tracking-[0.2em] focus:border-mat-gold focus:ring-0 shadow-inner"
                              />
                           </div>
                        </div>
                        <button 
                          onClick={handleSendOTP}
                          disabled={loading || !phone}
                          className="w-full h-18 rounded-3xl bg-mat-noir text-white flex items-center justify-center gap-4 hover:bg-mat-gold transition-all active:scale-95 disabled:opacity-20 shadow-2xl group"
                        >
                           <span className="text-[12px] font-black uppercase tracking-widest">{loading ? 'Initiating...' : 'Authorize Device'}</span>
                           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setStep('CHOICE')} className="w-full text-[9px] font-black uppercase tracking-[0.4em] text-mat-noir/20 hover:text-mat-noir transition-colors">Abort Access</button>
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
                        <div className="space-y-3">
                           <div className="flex justify-between items-end px-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-noir/30">Verification Code</label>
                              <span className="text-[9px] font-black text-mat-gold italic uppercase">Token active</span>
                           </div>
                           <Input 
                             type="text"
                             maxLength={6}
                             placeholder="000000"
                             value={otp}
                             onChange={(e) => setOtp(e.target.value)}
                             className="h-20 rounded-3xl border-mat-noir/10 bg-mat-noir/[0.01] text-center text-4xl font-black tracking-[0.5em] focus:border-mat-gold focus:ring-0 shadow-inner"
                           />
                        </div>
                        <button 
                          onClick={handleVerifyOTP}
                          disabled={loading || otp.length < 6}
                          className="w-full h-18 rounded-3xl bg-mat-gold text-white flex items-center justify-center gap-4 hover:brightness-110 transition-all active:scale-95 disabled:opacity-30 shadow-2xl shadow-mat-gold/20"
                        >
                           <Sparkles size={20} />
                           <span className="text-[12px] font-black uppercase tracking-widest">{loading ? 'Verifying...' : 'Complete Resonance'}</span>
                        </button>
                        <div className="text-center">
                           <button onClick={() => setStep('PHONE')} className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-noir/20 hover:text-mat-noir transition-colors underline decoration-mat-gold/20">Resend Verification Token</button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 mt-6"
                  >
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest leading-relaxed">
                      {error}
                    </p>
                  </motion.div>
                )}
             </div>

             <div className="mt-16 text-center">
                <p className="text-[9px] text-mat-noir/10 max-w-[280px] mx-auto leading-relaxed italic">
                   Powered by Firebase Secure Identity Protocol. Your data remains encrypted within the sanctuary.
                </p>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
