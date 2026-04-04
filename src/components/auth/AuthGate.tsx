import React from 'react';
import Landing from '@/pages/Landing';
import { Onboarding } from '@/components/Onboarding';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { MatriarchProfile } from '@/types';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { session, profile, loading, fetchingProfile, setProfile, refreshProfile } = useAuth();

  /**
   * 🏛️ The Portal Entrance: A Synchronous Handshake.
   * Immediately updates the local identity to ensure no flickering back to onboarding.
   */
  const handleOnboardingComplete = (newProfile: MatriarchProfile) => {
    setProfile(newProfile);
  };

  // 🏛️ The Great Barrier: Distinguishing between silence and absence.
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
        <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <Heart className="w-16 h-16 text-mat-wine" strokeWidth={1} />
        </motion.div>
        <div className="mt-12 space-y-4 text-center">
           <p className="text-[11px] font-black uppercase tracking-[1em] text-mat-wine/40 animate-pulse">Consulting the Archive</p>
           <div className="h-px w-24 bg-mat-wine/10 mx-auto" />
        </div>
      </div>
    );
  }

  // 🛡️ Phase 1: Absence of Session — The Landing Portal
  if (!session) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
          <Landing />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 🛡️ Phase 2: Identity Incomplete — The Ritual of Refinement
  // We only gate if the profile is explicitly NOT 'COMPLETED'.
  // If fetchingProfile is true and we HAVE no local profile, we wait.
  // BUT if we HAVE a profile (optimistic or cached), we let it through.
  if (fetchingProfile && !profile) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
              <Sparkles className="w-10 h-10 text-mat-gold animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-wine/20 italic">Synchronizing Identity</span>
           </motion.div>
        </div>
      );
  }

  const isIncomplete = !profile || profile.onboarding_status !== 'COMPLETED';

  if (isIncomplete) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
          <Onboarding 
            userId={session.user.id} 
            metadata={session.user.user_metadata} 
            onComplete={handleOnboardingComplete} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 🛡️ Phase 3: Identity Realized — The Sanctuary Entrance
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, filter: 'blur(0px)' }} 
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};
