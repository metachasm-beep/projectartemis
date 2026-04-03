import React, { useState, useEffect } from 'react';
import { LiquidChrome as Background } from './components/Background';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { AadhaarVerification } from './components/AadhaarVerification';
import { WomanDashboard } from './pages/WomanDashboard';
import { MenDashboard } from './pages/MenDashboard';
import { WomenDiscovery } from './pages/WomenDiscovery';
import { ProfileEditor } from './components/ProfileEditor';
import { Navigation } from './components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id, mounted);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id, mounted);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, mounted: boolean = true) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (mounted) {
        setProfile(data);
        if (data?.role === 'woman') setActiveTab('discovery');
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (mounted) setProfile(null);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      window.postMessage('MATRIARCH_PROTOCOL_READY', '*');
      console.log("MATRIARCH: Protocol Ready. Session:", !!session, "Profile:", !!profile);
    }
  }, [loading, session, profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Diagnostic Heartbeat
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && session) {
        console.warn("MATRIARCH: Auth initialization is taking longer than expected. Attempting protocol recovery...");
        setLoading(false); // Force break the loader
      }
    }, 6000); // 6 second fail-safe

    return () => clearTimeout(timeout);
  }, [loading, session]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <Crown style={{ color: '#D4AF37', width: '64px', height: '64px' }} />
        </motion.div>
        <p className="mt-8 text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.8em] animate-pulse">Initializing Protocol...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-y-auto overflow-x-hidden font-inter selection:bg-matriarch-violet/30">
      <Background baseColor={[0.1, 0.05, 0.2]} speed={0.12} amplitude={0.3} />
      
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <Landing />
            </motion.div>
          ) : !profile ? (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Onboarding userId={session.user.id} onComplete={() => fetchProfile(session.user.id)} />
            </motion.div>
          ) : !profile.is_verified ? (
            <motion.div key="aadhaar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <AadhaarVerification userId={session.user.id} onVerified={() => fetchProfile(session.user.id)} />
            </motion.div>
          ) : (
            <motion.div key="app" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="min-h-screen flex flex-col pb-24 md:pb-0">
                {activeTab === 'dashboard' && (profile.role === 'woman' ? <WomanDashboard profile={profile} /> : <MenDashboard profile={profile} />)}
                {activeTab === 'discovery' && <WomenDiscovery />}
                {activeTab === 'profile' && <ProfileEditor profile={profile} onUpdate={() => fetchProfile(session.user.id)} />}
              </div>
              <Navigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout}
                role={profile.role}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistence Diagnostic Layer */}
      {(!loading && !session) && (
        <div className="fixed bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity z-50">
           <button onClick={() => window.location.reload()} className="text-[8px] text-white/20 font-mono">REBOOT_PROTOCOL</button>
        </div>
      )}
    </div>
  );
};

export default App;
