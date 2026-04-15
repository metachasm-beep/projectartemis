import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuthContext } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function VerifyPage() {
  const { profile, loading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return null;

  if (!profile) {
    navigate('/signin');
    return null;
  }

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
          onVerified={() => {
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }}
        />
      </motion.div>
    </div>
  );
}
