import React, { useState, useEffect } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { AadhaarVerification } from './components/AadhaarVerification';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, User, LogOut, Crown } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <Crown style={{ color: '#D4AF37', width: '64px', height: '64px' }} />
        </motion.div>
        <p className="mt-8 text-[10px] text-matriarch-gold/40 font-black uppercase tracking-[0.8em]">Initializing Protocol...</p>
      </div>
    );
  }

  // Safety Fallback for "Black Screen" scenarios
  if (session && !profile && !loading) {
     console.log("MATRIARCH: Entering Onboarding Layer");
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-x-hidden font-inter">
      <Background baseColor={[0.1, 0.05, 0.2]} speed={0.12} amplitude={0.3} />
      
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
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="pb-32">
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex justify-between items-center pointer-events-none">
              <div className="surface-raised px-6 py-3 rounded-xl pointer-events-auto flex items-center gap-3">
                <Crown size={14} className="text-[#D4AF37]" strokeWidth={2} />
                <span className="text-[#F6F3EE] font-black tracking-[0.4em] text-[10px] uppercase font-sora italic">Matriarch</span>
              </div>
              <div className="flex gap-4 pointer-events-auto">
                 <button onClick={handleLogout} className="w-12 h-12 rounded-xl surface-raised flex items-center justify-center border-none text-red-400/40 hover:text-red-500 transition-all group">
                    <LogOut size={20} />
                 </button>
              </div>
            </header>

            <main className="relative z-10 px-8 pt-24">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'discovery' && <Discovery />}
                  {activeTab === 'profile' && (
                    <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                       <User className="w-12 h-12 text-[#D4AF37] mb-8" />
                       <h2 className="text-4xl font-black text-[#F6F3EE] mb-12 uppercase font-sora italic">{profile.display_name}</h2>
                       <div className="surface-premium p-10 rounded-3xl border border-white/5 space-y-4">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Sync Status</p>
                          <p className="text-2xl font-display font-black text-white italic">AADHAAR SECURED</p>
                          <div className="h-1 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                             <div className="h-full w-full bg-emerald-500" />
                          </div>
                          <p className="text-[10px] text-matriarch-textSoft font-medium uppercase tracking-widest pt-4">Role: {profile.role}</p>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-12 pointer-events-none">
              <div className="max-w-md mx-auto surface-premium rounded-[2rem] p-3 border border-white/5 flex justify-between items-center pointer-events-auto shadow-premium backdrop-blur-2xl">
                <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'dashboard' ? 'text-mat-gold' : 'text-white/20'}`}>
                  <LayoutDashboard size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Core</span>
                </button>
                <button onClick={() => setActiveTab('discovery')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'discovery' ? 'text-mat-gold' : 'text-white/20'}`}>
                  <Users size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Selection</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'profile' ? 'text-mat-gold' : 'text-white/20'}`}>
                  <User size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Identity</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
