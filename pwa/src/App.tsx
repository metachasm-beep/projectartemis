import React, { useState } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, User, Bell, LogOut, Crown } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useEffect } from 'react';

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Auth listener
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

  const checkProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) setHasProfile(true);
      else setHasProfile(false);
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
      <div className="h-screen w-full flex items-center justify-center bg-matriarch-bg">
        <Background 
          baseColor={[0.1, 0.05, 0.2]} 
          speed={0.12}
          amplitude={0.3}
        />
        <div className="z-10 flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl border-b-2 border-mat-gold flex items-center justify-center"
          >
            <Crown className="text-mat-gold w-8 h-8" />
          </motion.div>
          <div className="text-[10px] font-black text-mat-gold/40 uppercase tracking-[0.8em] animate-pulse">Syncing Protocols</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-x-hidden font-inter selection:bg-[#6E3FF3]/30 selection:text-[#D4AF37]">
      <Background 
        baseColor={[0.1, 0.05, 0.2]} 
        speed={0.12}
        amplitude={0.3}
      />
      
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(30px)' }}
            transition={{ duration: 0.8 }}
          >
            <Landing />
          </motion.div>
        ) : !hasProfile ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Onboarding userId={session.user.id} onComplete={() => setHasProfile(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="pb-32"
          >
            {/* Same Nav and Main content as before... */}
            {/* Nav Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex justify-between items-center pointer-events-none">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="surface-raised px-6 py-3 rounded-xl border-none pointer-events-auto shadow-premium flex items-center gap-3"
              >
                <Crown size={14} className="text-[#D4AF37]" strokeWidth={2} />
                <span className="text-[#F6F3EE] font-black tracking-[0.4em] text-[10px] uppercase font-sora italic">Matriarch</span>
              </motion.div>
              
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex gap-4 pointer-events-auto"
              >
                 <button className="w-12 h-12 rounded-xl surface-raised flex items-center justify-center border-none hover:bg-white/[0.05] transition-all shadow-premium group">
                    <Bell size={20} className="text-[#A6A0B3] group-hover:text-[#6E3FF3] transition-colors" strokeWidth={1.5} />
                 </button>
                 <button 
                  onClick={handleLogout}
                  className="w-12 h-12 rounded-xl surface-raised flex items-center justify-center border-none text-red-400/40 hover:text-red-500 hover:bg-red-500/5 transition-all shadow-premium group"
                 >
                    <LogOut size={20} strokeWidth={1.5} />
                 </button>
              </motion.div>
            </header>

            <main className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'discovery' && <Discovery />}
                  {activeTab === 'profile' && (
                    <div className="h-screen flex flex-col items-center justify-center px-12 pt-24 text-center">
                       <div className="mb-8 rounded-2xl bg-[#D4AF37]/10 p-4 border border-[#D4AF37]/20 shadow-glow">
                          <User className="w-12 h-12 text-[#D4AF37]" strokeWidth={1.5} />
                       </div>
                       <h2 className="text-4xl font-black text-[#F6F3EE] mb-2 tracking-tighter uppercase font-sora italic">Sovereign Profile</h2>
                       <div className="text-[10px] tracking-[0.6em] font-black text-[#6E3FF3] uppercase mb-12">Authenticated Identity</div>
                       
                       <div className="w-full max-w-sm surface-premium p-10 rounded-xl space-y-6 shadow-premium border-none relative overflow-hidden group">
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                          <div className="flex justify-between items-center text-[10px] tracking-[0.3em] font-black uppercase text-[#A6A0B3]">
                             <span>Protocol ID</span>
                             <span className="text-[#F6F3EE]">SOV_MALE_721</span>
                          </div>
                          <div className="h-px bg-white/5" />
                          <div className="flex justify-between items-center text-[10px] tracking-[0.3em] font-black uppercase text-[#A6A0B3]">
                             <span>Access Tier</span>
                             <span className="text-[#D4AF37]">ELITE_PROTO_X</span>
                          </div>
                          <div className="h-px bg-white/5" />
                          <div className="flex justify-between items-center text-[10px] tracking-[0.3em] font-black uppercase text-[#A6A0B3]">
                             <span>Verification</span>
                             <span className="text-[#6E3FF3]">AADHAAR_SECURE</span>
                          </div>
                       </div>
                    </div>
                  )}
                  {activeTab === 'notifications' && (
                    <div className="h-screen flex flex-col items-center justify-center px-12 pt-24 text-center">
                       <div className="mb-6 rounded-2xl bg-[#6E3FF3]/10 p-4 border border-[#6E3FF3]/20">
                         <Bell className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
                       </div>
                       <h2 className="text-sm font-black text-white/20 mb-2 uppercase tracking-[0.8em]">Secure Inbox Clean</h2>
                       <div className="text-[8px] font-black text-white/5 uppercase tracking-[0.4em]">Zero Unread Transmissions</div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Bottom Global Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-12 pointer-events-none">
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-md mx-auto surface-premium rounded-xl p-3 flex justify-between items-center border-none pointer-events-auto shadow-premium"
              >
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-500 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#6E3FF3]/10 text-[#6E3FF3]' : 'text-[#A6A0B3]/40 hover:text-[#A6A0B3]'}`}
                >
                  <LayoutDashboard size={20} strokeWidth={activeTab === 'dashboard' ? 2.5 : 1.5} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Core</span>
                </button>
                <button 
                  onClick={() => setActiveTab('discovery')}
                  className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-500 rounded-lg ${activeTab === 'discovery' ? 'bg-[#6E3FF3]/10 text-[#6E3FF3]' : 'text-[#A6A0B3]/40 hover:text-[#A6A0B3]'}`}
                >
                  <Users size={20} strokeWidth={activeTab === 'discovery' ? 2.5 : 1.5} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Selection</span>
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-500 rounded-lg ${activeTab === 'notifications' ? 'bg-[#6E3FF3]/10 text-[#6E3FF3]' : 'text-[#A6A0B3]/40 hover:text-[#A6A0B3]'}`}
                >
                  <Bell size={20} strokeWidth={activeTab === 'notifications' ? 2.5 : 1.5} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Inbox</span>
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-500 rounded-lg ${activeTab === 'profile' ? 'bg-[#6E3FF3]/10 text-[#6E3FF3]' : 'text-[#A6A0B3]/40 hover:text-[#A6A0B3]'}`}
                >
                  <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} />
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase">Sovereign</span>
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
