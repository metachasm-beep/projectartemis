import React, { useState } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import { Landing } from './pages/Landing';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, User, Bell, LogOut } from 'lucide-react';

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Simulate high-fidelity Google login
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="relative min-h-screen bg-graphite text-white overflow-x-hidden font-sans">
      <Background 
        baseColor={[0.29, 0, 0.51]} // Matriarch Plum
        speed={0.15}
        amplitude={0.25}
      />
      
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
          >
            <Landing onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-24"
          >
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
              <div className="glass px-5 py-2 rounded-full border-gold/30 pointer-events-auto shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <span className="text-gold font-black tracking-[0.3em] text-[10px] uppercase">Matriarch</span>
              </div>
              
              <div className="flex gap-3 pointer-events-auto">
                 <button className="w-10 h-10 rounded-full glass flex items-center justify-center border-gold/20 hover:border-gold/50 transition-colors">
                    <Bell size={18} className="text-gold" />
                 </button>
                 <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                 >
                    <LogOut size={18} />
                 </button>
              </div>
            </header>

            <main className="relative z-10 pt-16">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'discovery' && <Discovery />}
              {activeTab === 'profile' && (
                <div className="h-screen flex flex-col items-center justify-center px-12">
                  <div className="glass p-12 rounded-[40px] border-gold/20 text-center max-w-sm w-full shadow-2xl">
                    <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center mx-auto mb-6">
                      <User size={48} className="text-gold" />
                    </div>
                    <h2 className="text-2xl font-black text-gold mb-2 uppercase tracking-widest italic">Sovereign</h2>
                    <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold">Authenticated Profile</p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2">
                       <div className="flex justify-between text-[10px] tracking-widest text-white/60">
                          <span>UID:</span>
                          <span className="text-gold">MALE_DEMO_721</span>
                       </div>
                       <div className="flex justify-between text-[10px] tracking-widest text-white/60">
                          <span>TIER:</span>
                          <span className="text-gold">ELITE_CANDIDATE</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'notifications' && (
                <div className="h-screen flex flex-col items-center justify-center px-12">
                   <div className="glass p-12 rounded-[40px] border-gold/20 text-center max-w-sm w-full shadow-2xl">
                    <Bell size={48} className="mx-auto mb-4 text-gold/40" />
                    <h2 className="text-sm font-black text-white/20 mb-2 uppercase tracking-[0.5em]">No Alerts</h2>
                  </div>
                </div>
              )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
              <div className="max-w-md mx-auto glass rounded-[32px] p-2 flex justify-between items-center border-gold/20 pointer-events-auto shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-gold scale-110' : 'text-white/30 hover:text-white/60'}`}
                >
                  <LayoutDashboard size={20} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">Core</span>
                </button>
                <button 
                  onClick={() => setActiveTab('discovery')}
                  className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'discovery' ? 'text-gold scale-110' : 'text-white/30 hover:text-white/60'}`}
                >
                  <Users size={20} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">Select</span>
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'notifications' ? 'text-gold scale-110' : 'text-white/30 hover:text-white/60'}`}
                >
                  <Bell size={20} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">Alerts</span>
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'profile' ? 'text-gold scale-110' : 'text-white/30 hover:text-white/60'}`}
                >
                  <User size={20} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">Me</span>
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
