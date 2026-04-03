import React, { useState, useEffect } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { AadhaarVerification } from './components/AadhaarVerification';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showBypass, setShowBypass] = useState(false);

  // Profile Sync Watchdog
  useEffect(() => {
    if (session && !profile && !loading) {
      const timer = setTimeout(() => {
        console.warn("MATRIARCH: Profile fetch is taking too long. Enabling bypass.");
        setShowBypass(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowBypass(false);
    }
  }, [session, profile, loading]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("MATRIARCH: Opening the Sanctuary doors...");
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log("MATRIARCH: Initial Session found:", !!currentSession);
        setSession(currentSession);
        if (currentSession) {
          await fetchProfile(currentSession.user.id, mounted);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Matriarch Sanctuary Error:", err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("MATRIARCH: Auth State Change:", event, !!currentSession);
      if (!mounted) return;
      
      setSession(currentSession);
      if (currentSession) {
        await fetchProfile(currentSession.user.id, mounted);
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
    if (!userId) return;
    console.log("MATRIARCH: Fetching profile for:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", error);
      }
      
      if (mounted) {
        console.log("MATRIARCH: Profile State Set. Exists:", !!data);
        setProfile(data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Profile fetch catch:", err);
      if (mounted) {
        setProfile(null);
        setLoading(false);
      }
    }
  };

  // Handshake to index.html
  useEffect(() => {
    if (!loading) {
      console.log("MATRIARCH: Signaling Harmony to Shell.");
      window.postMessage('MATRIARCH_SANCTUARY_READY', '*');
      
      // Fallback: Manually hide any loader after a delay if the postMessage fails
      setTimeout(() => {
        const loader = document.getElementById('root-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.style.display = 'none', 800);
        }
      }, 500);
    }
  }, [loading]);

  const backgroundProps = React.useMemo(() => ({
    baseColor: [0.1, 0.05, 0.2] as [number, number, number],
    speed: 0.12,
    amplitude: 0.3
  }), []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <Crown style={{ color: '#D4AF37', width: '64px', height: '64px' }} />
        </motion.div>
        <p className="mt-8 text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.8em] animate-pulse">Preparing your space...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-y-auto overflow-x-hidden font-inter selection:bg-matriarch-violet/30">
      <Background {...backgroundProps} />
      
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full">
              <Landing />
            </motion.div>
          ) : (!profile || showBypass) ? (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full relative">
              <Onboarding userId={session.user.id} onComplete={() => fetchProfile(session.user.id)} />
              {showBypass && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">Connection Unstable / Profile Missing</p>
                  <button 
                    onClick={() => setProfile({ user_id: session.user.id, is_verified: false, role: 'man' })} 
                    className="px-8 py-4 bg-mat-gold text-black text-[10px] font-black uppercase tracking-widest shadow-mat-gold rounded-full hover:scale-105 transition-transform"
                  >
                    Enter the Sanctuary
                  </button>
                </div>
              )}
            </motion.div>
          ) : !profile.is_verified ? (
            <motion.div key="aadhaar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full">
              <AadhaarVerification userId={session.user.id} onVerified={() => fetchProfile(session.user.id)} />
            </motion.div>
          ) : (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full">
              <div className="min-h-screen pb-32">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'discovery' && <Discovery />}
                {activeTab === 'profile' && (
                  <div className="h-screen flex flex-col items-center justify-center space-y-8">
                    <div className="text-center">
                       <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase mb-2">{profile.display_name || 'Designation Pending'}</h2>
                       <p className="text-[10px] text-matriarch-gold font-black uppercase tracking-[0.4em]">Authentically You</p>
                    </div>
                    <button 
                      onClick={() => supabase.auth.signOut()} 
                      className="px-10 py-4 border border-red-500/30 text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-full"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              
              <nav className="fixed bottom-0 left-0 right-0 z-50 p-6 flex justify-center gap-4 bg-black/40 backdrop-blur-2xl border-t border-white/5 max-w-md mx-auto rounded-t-3xl sm:rounded-t-none sm:max-w-none">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setActiveTab('discovery')} 
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'discovery' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Discovery
                </button>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  You
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-4 left-4 opacity-5 hover:opacity-100 transition-opacity z-[100] flex gap-4">
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[8px] text-white/40 font-mono hover:text-white transition-colors">RESET_APP</button>
      </div>
    </div>
  );
};

export default App;
