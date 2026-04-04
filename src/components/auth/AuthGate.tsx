import React from 'react';
import Landing from '@/pages/Landing';
import { Onboarding } from '@/components/Onboarding';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { MatriarchProfile } from '@/types';
import { useSessionPulse } from '@/hooks/useSessionPulse';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { session, profile, loading, fetchingProfile, setProfile } = useAuth();
  const [devProfile, setDevProfile] = React.useState<MatriarchProfile | null>(null);
  const [devLoading, setDevLoading] = React.useState(false);
  
  // 💓 Quantifying resonance through presence
  useSessionPulse(session?.user?.id);

  // 🛠️ Dev Admin Bypass: Check for ?devbypass=woman or ?devbypass=man
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get('devbypass');
    if (bypass === 'woman' || bypass === 'man') {
      setDevLoading(true);
      import('@/lib/turso').then(({ turso, tursoHelpers }) => {
        turso.execute({
          sql: "SELECT * FROM profiles WHERE role = ? AND onboarding_status = 'COMPLETED' LIMIT 1",
          args: [bypass === 'woman' ? 'woman' : 'man']
        }).then(result => {
          const raw = result.rows[0];
          if (raw) {
            setDevProfile({
              ...(raw as any),
              photos: tursoHelpers.deserialize(raw.photos as string) || [],
              hobbies: tursoHelpers.deserialize(raw.hobbies as string) || [],
              is_verified: !!raw.is_verified,
              rank_boost_count: Number(raw.rank_boost_count || 0),
              consecutive_days: Number(raw.consecutive_days || 0)
            });
          }
          setDevLoading(false);
        }).catch(() => setDevLoading(false));
      });
    }
  }, []);

  // 🛠️ If dev bypass is active, render the dashboard directly
  if (devProfile) {
    const DevDashboard = React.lazy(() => import('@/components/DashboardLayout'));
    return (
      <React.Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-mat-cream">
          <Sparkles className="w-10 h-10 text-mat-gold animate-spin" />
        </div>
      }>
        {/* Provide the dev profile to AuthContext */}
        <DevBypassProvider profile={devProfile}>
          <DevDashboard />
        </DevBypassProvider>
      </React.Suspense>
    );
  }

  if (devLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
        <Sparkles className="w-10 h-10 text-mat-gold animate-pulse" />
        <p className="mt-6 text-[9px] font-black uppercase tracking-[0.5em] text-mat-wine/30">Dev Bypass Loading</p>
      </div>
    );
  }

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

/**
 * 🛠️ Dev Bypass Auth Provider
 * Provides a fake auth context to the DashboardLayout when using dev bypass.
 */
const DevBypassProvider: React.FC<{ profile: MatriarchProfile; children: React.ReactNode }> = ({ profile, children }) => {
  // Override the useAuth hook data via a context wrapper
  const contextValue = {
    session: { user: { id: profile.user_id } },
    user: { id: profile.user_id },
    profile,
    loading: false,
    fetchingProfile: false,
    setProfile: () => {},
    refreshProfile: async () => {},
    signOut: async () => { window.location.href = window.location.origin; }
  };

  return (
    <AuthBypassContext.Provider value={contextValue}>
      {children}
    </AuthBypassContext.Provider>
  );
};

// Create an override context for dev bypass
const AuthBypassContext = React.createContext<any>(null);
export { AuthBypassContext };
