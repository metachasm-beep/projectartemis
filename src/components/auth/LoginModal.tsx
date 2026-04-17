import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phone.startsWith('+') ? phone : `+91${phone}` });
      if (error) throw error;
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return setError('Please enter the verification code.');
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({ 
        phone: phone.startsWith('+') ? phone : `+91${phone}`, 
        token: otp, 
        type: 'sms' 
      });
      if (error) throw error;
      onClose();
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
        className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-mat-noir/60 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-mat-noir/5 text-mat-noir/40 hover:bg-mat-noir/10 hover:text-mat-noir transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="p-10 md:p-12">
             <div className="text-center mb-10">
                <div className="w-16 h-16 bg-mat-gold/10 text-mat-gold rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-display text-mat-noir mb-2">Sanctuary Access</h2>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-mat-noir/30">Select your authentication method</p>
             </div>

             <div className="space-y-6">
                <AnimatePresence mode="wait">
                   {step === 'CHOICE' && (
                     <motion.div 
                       key="choice"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       className="space-y-4"
                     >
                        <button 
                          onClick={handleGoogleLogin}
                          disabled={loading}
                          className="w-full h-16 rounded-2xl border border-mat-noir/5 bg-white flex items-center justify-center gap-4 hover:shadow-lg transition-all active:scale-95 group"
                        >
                           <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                           <span className="text-[12px] font-black uppercase tracking-widest text-mat-noir/70">Continue with Google</span>
                        </button>

                        <div className="relative flex items-center py-4">
                           <div className="flex-grow border-t border-mat-noir/5"></div>
                           <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-mat-noir/20">or</span>
                           <div className="flex-grow border-t border-mat-noir/5"></div>
                        </div>

                        <button 
                          onClick={() => setStep('PHONE')}
                          className="w-full h-16 rounded-2xl bg-mat-noir text-white flex items-center justify-center gap-4 hover:bg-mat-gold transition-all active:scale-95 shadow-xl"
                        >
                           <Phone size={18} />
                           <span className="text-[12px] font-black uppercase tracking-widest">Phone & OTP</span>
                        </button>
                     </motion.div>
                   )}

                   {step === 'PHONE' && (
                     <motion.div 
                       key="phone"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="space-y-6"
                     >
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-noir/40 ml-2">Phone Number</label>
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[14px] font-bold text-mat-noir/30">+91</span>
                              <Input 
                                type="tel"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-16 pl-16 rounded-2xl border-mat-noir/10 bg-mat-noir/[0.02] text-lg font-bold tracking-widest focus:border-mat-gold focus:ring-0"
                              />
                           </div>
                        </div>
                        <button 
                          onClick={handleSendOTP}
                          disabled={loading || !phone}
                          className="w-full h-16 rounded-2xl bg-mat-noir text-white flex items-center justify-center gap-3 hover:bg-mat-gold transition-all active:scale-95 disabled:opacity-30 shadow-xl group"
                        >
                           <span className="text-[12px] font-black uppercase tracking-widest">{loading ? 'Requesting...' : 'Request Access'}</span>
                           <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setStep('CHOICE')} className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-mat-noir/30 hover:text-mat-noir transition-colors">Go Back</button>
                     </motion.div>
                   )}

                   {step === 'OTP' && (
                     <motion.div 
                       key="otp"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="space-y-6"
                     >
                        <div className="space-y-2">
                           <div className="flex justify-between items-end px-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-noir/40">Verification Code</label>
                              <span className="text-[9px] font-bold text-mat-gold italic">Sent to +91 {phone.slice(-4)}</span>
                           </div>
                           <Input 
                             type="text"
                             maxLength={6}
                             placeholder="000000"
                             value={otp}
                             onChange={(e) => setOtp(e.target.value)}
                             className="h-16 rounded-2xl border-mat-noir/10 bg-mat-noir/[0.02] text-center text-3xl font-black tracking-[0.5em] focus:border-mat-gold focus:ring-0"
                           />
                        </div>
                        <button 
                          onClick={handleVerifyOTP}
                          disabled={loading || otp.length < 6}
                          className="w-full h-16 rounded-2xl bg-mat-gold text-white flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-mat-gold/20"
                        >
                           <Sparkles size={18} />
                           <span className="text-[12px] font-black uppercase tracking-widest">{loading ? 'Verifying...' : 'Unlock Sanctuary'}</span>
                        </button>
                        <div className="text-center">
                           <button onClick={() => setStep('PHONE')} className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-noir/30 hover:text-mat-noir transition-colors">Resend Code</button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-4"
                  >
                    {error}
                  </motion.p>
                )}
             </div>

             <div className="mt-12 text-center">
                <p className="text-[9px] text-mat-noir/20 max-w-[240px] mx-auto leading-relaxed italic">
                   By accessing the sanctuary, you acknowledge the community standards and data resonance protocols.
                </p>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
