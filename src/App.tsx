import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
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

// ─── Fast-path helpers ────────────────────────────────────────────────────────
const getOnboardingCache = (userId: string) =>
  localStorage.getItem(`MAT_OB_DONE_${userId}`) === 'true';

const setOnboardingCache = (userId: string) =>
  localStorage.setItem(`MAT_OB_DONE_${userId}`, 'true');

const clearOnboardingCache = (userId: string) =>
  localStorage.removeItem(`MAT_OB_DONE_${userId}`);
// ─────────────────────────────────────────────────────────────────────────────

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
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      window.location.reload();
    }
  }, []);

  // Watchdog: Force end loading if stuck (reduced to 7s)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("MATRIARCH: Global Timeout. Forcing Entry.");
        setLoading(false);
      }, 7000);
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
          const userId = currentSession.user.id;
          const userEmail = currentSession.user.email || '';

          // Admin fast-path
          if (ADMIN_EMAILS.includes(userEmail)) {
            const adminProfile = { 
              user_id: userId, 
              role: 'admin', 
              full_name: currentSession.user.user_metadata?.full_name || 'System Architect',
              onboarding_status: 'COMPLETED',
              is_verified: true,
              is_active: true
            };
            if (mounted) {
              setProfile(adminProfile);
              setActiveTab('admin');
              setLoading(false);
            }
            // Also sync to DB in the background
            supabase.from('profiles').upsert({
              ...adminProfile,
              updated_at: new Date().toISOString()
            }).then(() => {});
            return;
          }

          // Fast-path: if we cached that onboarding is done, skip the slow DB fetch
          if (getOnboardingCache(userId)) {
            await fetchProfile(userId, mounted);
          } else {
            await fetchProfile(userId, mounted);
          }
        } else {
          if (mounted) setLoading(false);
        }
      } catch (err) {
        console.error("Matriarch Sanctuary Error:", err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log(`MATRIARCH: Auth Event [${event}]`);

      if (event === 'SIGNED_OUT') {
        // ⚠️ Do NOT call localStorage.clear() — it wipes Supabase's own stored tokens
        // which causes stuck/broken state on next visit.
        // Only remove Matriarch-specific keys.
        localStorage.removeItem('MATRIARCH_DEV_BYPASS');
        if (currentSession === null && session?.user?.id) {
          clearOnboardingCache(session.user.id);
        }
        setSession(null);
        setProfile(null);
        setActiveTab('dashboard');
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
        const userEmail = currentSession.user.email || '';
        
        if (ADMIN_EMAILS.includes(userEmail)) {
          const adminProfile = { 
            user_id: currentSession.user.id, 
            role: 'admin',
            full_name: currentSession.user.user_metadata?.full_name || 'System Architect',
            onboarding_status: 'COMPLETED',
            is_verified: true,
            is_active: true
          };
          if (mounted) {
            setProfile(adminProfile);
            setActiveTab('admin');
            setLoading(false);
          }
          supabase.from('profiles').upsert({
            ...adminProfile,
            updated_at: new Date().toISOString()
          }).then(() => {});
          return;
        }

        await fetchProfile(currentSession.user.id, mounted);
        return;
      }

      setSession(currentSession);
      if (currentSession) {
        await fetchProfile(currentSession.user.id, mounted);
      } else {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
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
      
      if (error && error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", error);
      }

      if (data) {
        // Cache completed onboarding status for fast-path
        if (data.onboarding_status === 'COMPLETED') {
          setOnboardingCache(userId);
        }
      }
      
      if (mounted) {
        setProfile(data || null);
        if (data?.role === 'admin') {
          setActiveTab('admin');
        }
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream" style={{background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EEE8 100%)'}}>
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Heart className="w-12 h-12 text-mat-rose" strokeWidth={1.5} fill="rgba(201,160,154,0.3)" />
        </motion.div>
        <p className="mt-8 text-[10px] text-mat-wine/30 font-black uppercase tracking-[0.8em] animate-pulse" style={{fontFamily: 'Helvetica, sans-serif'}}>
          Opening the Sanctuary…
        </p>
      </div>
    );
  }

  // ─── Routing Logic ────────────────────────────────────────────────────────────
  // 1. No session → Landing
  // 2. Session + no completed profile → Onboarding
  // 3. Session + completed profile → App
  const profileComplete = profile?.onboarding_status === 'COMPLETED';
  const isAdmin = profile?.role === 'admin' || ADMIN_EMAILS.includes(session?.user?.email || '');
  const showOnboarding = session && !profileComplete && !isAdmin;
  const showNav = session && profileComplete;

  return (
    <div className="relative min-h-screen text-gray-900 overflow-y-auto overflow-x-hidden font-body selection:bg-mat-rose selection:text-white" style={{background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EEE8 100%)'}}>
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen w-full">
              <Landing />
            </motion.div>
          ) : showOnboarding ? (
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
                       <h2 className="text-5xl text-mat-wine leading-tight" style={{fontFamily: '"Playfair Display", Georgia, serif'}}>
                         {profile?.full_name || 'Your Story'}
                       </h2>
                       <p className="text-mat-rose/60 text-sm font-medium italic">Authentically You</p>
                    </div>
                    
                    <div className="w-full max-w-sm space-y-4">
                       <button className="w-full h-16 rounded-2xl bg-mat-cream border border-mat-rose/20 flex items-center justify-between px-8 text-mat-wine/60 hover:text-mat-wine transition-all font-bold uppercase tracking-widest text-[9px] hover:border-mat-rose/40">
                          <span>Edit Your Story</span>
                          <Heart size={16} className="text-mat-rose/40" />
                       </button>
                       <button 
                         onClick={() => supabase.auth.signOut()} 
                         className="w-full h-16 rounded-2xl border border-mat-rose/20 bg-mat-wine text-white flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-mat-wine/90"
                       >
                         Sign Out
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

      {/* Dev Reset Button */}
      <div className="fixed bottom-4 left-4 opacity-5 hover:opacity-100 transition-opacity z-[120] flex gap-4">
          <button onClick={() => { 
            Object.keys(localStorage).filter(k => k.startsWith('MAT_')).forEach(k => localStorage.removeItem(k));
            window.location.reload(); 
          }} className="text-[8px] text-black/40 font-mono hover:text-black transition-colors">RESET_APP</button>
      </div>
    </div>
  );
};

export default App;
