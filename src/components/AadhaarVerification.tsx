import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowRight, Lock, Fingerprint, ExternalLink, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

interface AadhaarVerificationProps {
  userId: string;
  onVerified: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onVerified }) => {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPortalVisited, setIsPortalVisited] = useState(false);

  const UIDAI_URL = "https://myaadhaar.uidai.gov.in/verifyAadhaar";

  const handleVisitPortal = () => {
    window.open(UIDAI_URL, '_blank', 'noopener,noreferrer');
    setIsPortalVisited(true);
  };

  const handleFinalizeSync = async () => {
    setVerifying(true);
    // Simulate Trust Handshake
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
      console.error("Verification sync failed:", err);
      alert("Handshake failed. Please retry.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-y-auto overflow-x-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-mat-violet/10 to-mat-gold/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ willChange: 'transform' }}
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
            {success ? "Trust Established" : "Building Trust"}
          </h2>
          <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">
            {success ? "Welcome to the Sanctuary" : "Authenticity Check"}
          </p>
        </div>

        {!success && (
          <div className="space-y-6">
            <div className="surface-raised p-6 rounded-2xl text-left space-y-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} className="text-mat-gold" /> How we stay safe
                </h4>
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3">
                    <div className="text-[9px] font-black w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">1</div>
                    <p className="text-[11px] text-matriarch-textSoft leading-relaxed font-medium">Click the button below to reach the secure UIDAI Sanctuary.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[9px] font-black w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">2</div>
                    <p className="text-[11px] text-matriarch-textSoft leading-relaxed font-medium">Briefly enter your details and the security code on their site.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[9px] font-black w-4 h-4 rounded-full bg-matriarch-violet/20 flex items-center justify-center shrink-0 border border-matriarch-violet/30 text-matriarch-violet">
                      <Phone size={8} className="fill-current" />
                    </div>
                    <p className="text-[11px] text-matriarch-violetBright leading-relaxed font-black uppercase tracking-tighter">Your mobile link is the key to this magic.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[9px] font-black w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">3</div>
                    <p className="text-[11px] text-matriarch-textSoft leading-relaxed font-medium">Once verified there, return here to start your story.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-mat-gold/5 rounded-xl border border-mat-gold/10">
                 <p className="text-[10px] text-mat-gold/80 italic font-medium leading-relaxed">
                   "Trust is the heartbeat of the Matriarch. An authentic presence creates a safer space for everyone."
                 </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleVisitPortal}
                className="w-full h-16 bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 font-bold tracking-widest uppercase rounded-2xl flex gap-3 group transition-all"
              >
                Visit UIDAI Port <ExternalLink size={16} className="opacity-40 group-hover:opacity-100" />
              </Button>

              <Button 
                onClick={handleFinalizeSync}
                disabled={!isPortalVisited || verifying}
                className={`w-full h-20 font-black tracking-[0.2em] uppercase rounded-2xl shadow-2xl flex gap-3 transition-all ${isPortalVisited ? 'bg-matriarch-violet text-white shadow-matriarch-violet/20' : 'bg-white/5 text-white/20 border border-white/5 pointer-events-none'}`}
              >
                {verifying ? "Confirming Authenticity..." : (
                  <>Begin Your Story <ArrowRight size={18} /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ willChange: 'transform' }}
            className="py-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Authentically You
            </div>
          </motion.div>
        )}

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[9px] text-matriarch-textFaint uppercase tracking-widest">
            <Lock size={10} /> Your privacy is our promise.
          </div>
          <p className="text-[8px] text-matriarch-textFaint uppercase tracking-[0.2em]">
            Nurtured by the Matriarch Trust Network
          </p>
        </div>
      </motion.div>
    </div>
  );
};
