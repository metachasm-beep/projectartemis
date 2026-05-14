import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuthContext } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
  const { profile, loading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return null;

  if (!profile) {
    navigate('/signin');
    return null;
  }

  // ─── ALREADY VERIFIED: Show badge, not the verification form ───
  if (profile.is_verified) {
    return (
      <div className="min-h-screen bg-mat-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10 flex flex-col items-center text-center space-y-10"
        >
          {/* Verified Badge */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.3 }}
              className="relative z-10 w-32 h-32 rounded-full border-4 border-green-400/60 bg-green-500/10 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.15)]"
            >
              <ShieldCheck size={64} className="text-green-400" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Status Text */}
          <div className="space-y-3">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[9px] font-black uppercase tracking-[0.5em] text-green-400"
            >
              Identity Sealed
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl md:text-5xl font-display font-black italic text-white tracking-tighter uppercase"
            >
              You Are Verified
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="text-[11px] text-white/40 uppercase tracking-[0.3em] leading-relaxed font-medium max-w-xs mx-auto"
            >
              Your biometric identity is permanently encoded into the Sanctuary. You have full access.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={() => navigate('/')}
            className="w-full h-16 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-[0.4em] text-[12px] rounded-3xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(34,197,94,0.15)] transition-all group"
          >
            Enter the Sanctuary
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── NOT YET VERIFIED: Show the verification form ───
  return (
    <div className="min-h-screen bg-mat-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mat-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <span className="text-[10px] text-mat-gold uppercase font-black tracking-[0.5em]">Centralized Vault</span>
          <h1 className="text-5xl md:text-6xl font-display font-black italic text-white tracking-tighter uppercase">
            Biometric Registry
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Your verification tithe has been validated. Complete the Didit identity protocol to permanently encode your trust level into the Sanctuary logic.
          </p>
        </div>

        <AadhaarVerification 
          userId={profile.user_id}
          onVerified={() => navigate('/')}
        />
      </motion.div>
    </div>
  );
}
