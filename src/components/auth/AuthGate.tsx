import React from 'react';
import Landing from '@/pages/Landing';
import { Onboarding } from '@/components/Onboarding';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { session, profile, loading, fetchingProfile, refreshProfile } = useAuth();

  // 🏛️ The Great Barrier: Distinguishing between silence and absence.
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Heart className="w-12 h-12 text-mat-wine" strokeWidth={1.5} />
        </motion.div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.8em] text-mat-wine animate-pulse">Consulting Archive...</p>
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
  // If fetchingProfile is true, we wait briefly to avoid flickering back to Onboarding.
  if (fetchingProfile && !profile) {
     return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
           <Heart className="w-8 h-8 text-mat-wine animate-pulse" />
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
            onComplete={refreshProfile} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 🛡️ Phase 3: Identity Realized — The Sanctuary Entrance
  return <>{children}</>;
};
