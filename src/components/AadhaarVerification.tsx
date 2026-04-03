import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowRight, Lock, Fingerprint } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

interface AadhaarVerificationProps {
  userId: string;
  onVerified: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onVerified }) => {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    // Simulate Aadhaar Handshake
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: true,
          is_active: true,
          onboarding_status: 'COMPLETED'
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(onVerified, 1500);
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Aadhaar synchronization failed. Please retry.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A0A0B]">
      <div className="absolute inset-0 bg-gradient-to-br from-mat-violet/10 to-mat-gold/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mat-panel-premium p-10 rounded-[2.5rem] shadow-premium relative overflow-hidden text-center space-y-8"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mat-gold via-mat-violet to-mat-gold" />
        
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-mat-gold/10 border border-mat-gold/20 mb-4">
            {success ? (
              <CheckCircle className="text-green-400 w-10 h-10" />
            ) : (
              <Fingerprint className="text-mat-gold w-10 h-10" />
            )}
          </div>
          <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">
            {success ? "Identity Verified" : "Identity Protocol"}
          </h2>
          <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">
            {success ? "Welcome to the Matriarch" : "Aadhaar Synchronization Required"}
          </p>
        </div>

        <div className="surface-raised p-6 rounded-2xl text-left space-y-4">
          <div className="flex items-start gap-4">
            <Shield className="text-matriarch-violet w-5 h-5 shrink-0 mt-1" />
            <p className="text-[11px] text-matriarch-textSoft leading-relaxed">
              To maintain the integrity of our selection, all profiles must sync with Aadhaar. Your data is encrypted and never stored locally.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <Lock className="text-matriarch-violet w-5 h-5 shrink-0 mt-1" />
            <p className="text-[11px] text-matriarch-textSoft leading-relaxed">
              Profiles remain <span className="text-mat-gold font-bold">DORMANT</span> and invisible to others until verification is complete.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleVerify}
          disabled={verifying || success}
          className="w-full h-20 bg-white text-black hover:bg-neutral-200 font-black tracking-widest uppercase rounded-2xl shadow-2xl flex gap-3"
        >
          {verifying ? "Syncing..." : success ? "Verified" : (
            <>Verify Identity <ArrowRight size={18} /></>
          )}
        </Button>

        <p className="text-[9px] text-matriarch-textFaint uppercase tracking-widest">
          Secured by Matriarch Trust Network
        </p>
      </motion.div>
    </div>
  );
};
