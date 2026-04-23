import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to initiate secure entry.");
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
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-20 rounded-3xl bg-mat-noir text-white flex items-center justify-center gap-6 hover:bg-mat-gold transition-all active:scale-95 shadow-2xl group"
                >
                   <img src="https://www.google.com/favicon.ico" className="w-6 h-6 grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 transition-all" alt="Google" />
                   <span className="text-[14px] font-black uppercase tracking-[0.2em]">{loading ? 'Accessing...' : 'Enter with Google'}</span>
                </button>

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
                   Powered by Supabase Sovereign Identity. Your data remains encrypted within the sanctuary.
                </p>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
