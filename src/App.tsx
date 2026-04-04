import React, { useState, useEffect } from 'react';
import { LiquidChrome as Background } from './components/Background';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { supabase } from './lib/supabase';

// Navigation Components
import { MatriarchNav } from './components/navigation/MatriarchNav';
import { MatriarchHeader } from './components/navigation/MatriarchHeader';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications' | 'admin';

const ADMIN_EMAILS = ['metachasm@gmail.com', 'testeradmin@gmail.com'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Developer Bypass Logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev_auth') === 'secure_bypass') {
      console.log("MATRIARCH_DEV: Activating Sanctuary Bypass...");
      localStorage.setItem('MATRIARCH_DEV_BYPASS', 'ENABLED');
      // Remove the param from URL for cleanliness
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      window.location.reload();
    }
  }, []);

  // Watchdog: Force end loading if stuck
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("MATRIARCH: Global Timeout. Forcing Entry.");
        setLoading(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("MATRIARCH: Opening the Sanctuary doors...");
      
      // Check for Developer Bypass first
      const isBypassEnabled = localStorage.getItem('MATRIARCH_DEV_BYPASS') === 'ENABLED';
      if (isBypassEnabled) {
        console.log("MATRIARCH_DEV: Bypass Active. Setting tester session.");
        const mockSession = { 
          user: { 
            id: 'dev-tester-admin-001', 
            email: 'testeradmin@gmail.com',
            user_metadata: { full_name: 'Tester Admin' }
          } 
        };
        const mockProfile = {
          user_id: 'dev-tester-admin-001',
          role: 'admin',
          full_name: 'Tester Admin',
          onboarding_status: 'COMPLETED',
          is_verified: true,
          is_active: true
        };
        
        if (mounted) {
          setSession(mockSession);
          setProfile(mockProfile);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setSession(currentSession);
        if (currentSession) {
          if (ADMIN_EMAILS.includes(currentSession.user.email || '')) {
            setProfile({ 
              user_id: currentSession.user.id, 
              role: 'admin', 
              full_name: currentSession.user.user_metadata.full_name || 'System Architect',
              onboarding_status: 'COMPLETED',
              is_verified: true 
            });
            setActiveTab('admin');
          }
          await fetchProfile(currentSession.user.id, mounted);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Matriarch Sanctuary Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;
      
      // If bypass is active, ignore auth state changes unless logout
      if (localStorage.getItem('MATRIARCH_DEV_BYPASS') === 'ENABLED' && !currentSession) {
        localStorage.removeItem('MATRIARCH_DEV_BYPASS');
        window.location.reload();
        return;
      }

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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      let finalProfile = data;

      if (error && error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", error);
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const userEmail = currentSession?.user?.email;

      if (userEmail === 'metachasm@gmail.com' && (!data || data.role !== 'admin')) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .upsert({ 
            user_id: userId,
            role: 'admin',
            full_name: data?.full_name || 'System Architect',
            onboarding_status: 'COMPLETED',
            is_verified: true,
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (!updateError) finalProfile = updatedProfile;
      }
      
      if (mounted) {
        setProfile(finalProfile);
        if (finalProfile?.role === 'admin' || ADMIN_EMAILS.includes(userEmail || '')) {
           setActiveTab('admin');
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Profile fetch catch:", err);
      if (mounted) setProfile(null);
    }
  };

  useEffect(() => {
    if (!loading) {
      window.postMessage('MATRIARCH_SANCTUARY_READY', '*');
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

  const showNav = session && profile && profile.onboarding_status === 'COMPLETED';

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F6F3EE] overflow-y-auto overflow-x-hidden font-inter selection:bg-matriarch-violet/30">
      <Background {...backgroundProps} />
      
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full">
              <Landing />
            </motion.div>
          ) : (!profile && session?.user?.email !== 'metachasm@gmail.com') ? (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full relative">
              <Onboarding 
                userId={session.user.id} 
                metadata={session.user.user_metadata}
                onComplete={() => fetchProfile(session.user.id)} 
              />
            </motion.div>
          ) : (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full">
              {showNav && <MatriarchHeader />}
              
              <div className={cn("min-h-screen", showNav ? "pt-16 pb-32" : "")}>
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'discovery' && <Discovery />}
                {activeTab === 'admin' && profile?.role === 'admin' && (
                  <AdminDashboard handleLogout={() => supabase.auth.signOut()} />
                )}
                {activeTab === 'profile' && (
                  <div className="h-[80vh] flex flex-col items-center justify-center space-y-12 px-8">
                    <div className="text-center space-y-4">
                       <h2 className="text-5xl mat-text-display-pro text-white leading-tight lowercase">
                         {profile.full_name || 'Designation Pending'}
                       </h2>
                       <p className="mat-text-label-pro !text-mat-gold">Authentically You</p>
                    </div>
                    
                    <div className="w-full max-w-sm space-y-4">
                       <button className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between px-8 text-white/60 hover:text-white transition-all">
                          <span className="mat-text-label-pro !not-italic">Edit Sacred Story</span>
                          <Crown size={16} className="text-mat-gold" />
                       </button>
                       <button 
                         onClick={() => supabase.auth.signOut()} 
                         className="w-full h-16 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-red-500/10"
                       >
                         Sever Connection
                       </button>
                    </div>
                  </div>
                )}
              </div>
              
              {showNav && (
                <MatriarchNav 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  role={profile?.role} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-4 left-4 opacity-5 hover:opacity-100 transition-opacity z-[120] flex gap-4">
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[8px] text-white/40 font-mono hover:text-white transition-colors">RESET_APP</button>
      </div>
    </div>
  );
};

export default App;
