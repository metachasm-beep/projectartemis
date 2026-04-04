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

  if (loading || (session && !profile && fetchingProfile)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Heart className="w-12 h-12 text-mat-wine" strokeWidth={1.5} />
        </motion.div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.8em] text-mat-wine animate-pulse">Consulting Archive...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Landing />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (profile?.onboarding_status !== 'COMPLETED') {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Onboarding 
            userId={session.user.id} 
            metadata={session.user.user_metadata} 
            onComplete={refreshProfile} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return <>{children}</>;
};
