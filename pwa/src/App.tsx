import React, { useState, useEffect } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import AdminDashboard from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, User, Bell, LogOut, Crown } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else {
        setHasProfile(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('[PROTOCOL] Sending readiness handshake...');
      window.postMessage('MATRIARCH_PROTOCOL_READY', '*');
    }
  }, [loading]);

  const checkProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      setHasProfile(!!data);
    } catch (err) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0A0B' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Crown style={{ color: '#D4AF37', width: '64px', height: '64px' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-x-hidden font-inter">
      <Background baseColor={[0.1, 0.05, 0.2]} speed={0.12} amplitude={0.3} />
      
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <Landing />
          </motion.div>
        ) : !hasProfile ? (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Onboarding userId={session.user.id} onComplete={() => setHasProfile(true)} />
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
                    <div className="h-screen flex flex-col items-center justify-center text-center">
                       <User className="w-12 h-12 text-[#D4AF37] mb-8" />
                       <h2 className="text-4xl font-black text-[#F6F3EE] mb-12 uppercase font-sora italic">Matriarch Profile</h2>
                       <div className="surface-premium p-10 rounded-xl space-y-6">
                          <p className="text-[#A6A0B3]">Identity: Verified</p>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-12 pointer-events-none">
              <div className="max-w-md mx-auto surface-premium rounded-xl p-3 flex justify-between items-center pointer-events-auto shadow-premium">
                <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'dashboard' ? 'text-[#6E3FF3]' : 'text-[#A6A0B3]/40'}`}>
                  <LayoutDashboard size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Core</span>
                </button>
                <button onClick={() => setActiveTab('discovery')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'discovery' ? 'text-[#6E3FF3]' : 'text-[#A6A0B3]/40'}`}>
                  <Users size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Selection</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 flex flex-col items-center gap-2 ${activeTab === 'profile' ? 'text-[#6E3FF3]' : 'text-[#A6A0B3]/40'}`}>
                  <User size={20} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Matriarch</span>
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
