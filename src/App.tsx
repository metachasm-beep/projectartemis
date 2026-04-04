import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';
import { turso, tursoHelpers } from './lib/turso';

// Navigation Components
import { MatriarchNav } from './components/navigation/MatriarchNav';
import { MatriarchHeader } from './components/navigation/MatriarchHeader';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EditProfile } from './components/EditProfile';
import { Tooltip } from './components/ui/tooltip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'discovery' | 'profile' | 'notifications' | 'admin';

const ADMIN_EMAILS = ['metachasm@gmail.com', 'testeradmin@gmail.com'];

export interface MatriarchProfile {
  user_id: string;
  full_name: string;
  role: 'man' | 'woman' | 'admin';
  date_of_birth?: string;
  bio?: string;
  city?: string;
  intent?: string;
  occupation?: string;
  education?: string;
  height?: number;
  religion?: string;
  marital_status?: string;
  mother_tongue?: string;
  hobbies?: string[];
  diet?: string;
  smoking?: boolean;
  drinking?: boolean;
  photos?: string[];
  profile_strength?: number;
  onboarding_status?: 'STARTED' | 'COMPLETED';
  is_verified?: boolean;
  is_active?: boolean;
  rank_score?: number;
  tokens?: number;
  created_at?: string;
  updated_at?: string;
}

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
  const [profileFetching, setProfileFetching] = useState(false); // true while DB fetch is in-flight
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Watchdog: Force end loading if stuck (increased to 10s for resilience)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("MATRIARCH: Global Timeout reached (~10s). Forcing Sanctuary Entry.");
        setLoading(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // 🔐 Session Persistence Logic
      const isSessionOnly = localStorage.getItem('MAT_SESSION_ONLY') === 'true';
      const isTabActive = sessionStorage.getItem('MAT_TAB_SESSION') === 'true';
      
      // Only sign out if we were definitively in a tab session that is now lost
      // and NOT during an active OAuth redirect.
      const isOAuthRedirect = window.location.hash.includes('access_token') || 
                             window.location.search.includes('code=');

      if (isSessionOnly && !isTabActive && !isOAuthRedirect) {
        console.log("MATRIARCH: Persistent Session Restricted. Purging stale credentials.");
        localStorage.removeItem('MAT_SESSION_ONLY');
        await supabase.auth.signOut();
        if (mounted) setLoading(false);
        return;
      }

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
          setProfile(mockProfile as MatriarchProfile);
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
              setProfile(adminProfile as MatriarchProfile);
              setActiveTab('admin');
              setLoading(false);
            }
            
            // Sync Admin Profile to Turso
            turso.execute({
              sql: `INSERT INTO profiles (user_id, role, full_name, onboarding_status, is_verified, is_active, updated_at) 
                    VALUES (?, ?, ?, ?, 1, 1, ?)
                    ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at`,
              args: [userId, adminProfile.role, adminProfile.full_name, 'COMPLETED', new Date().toISOString()]
            }).catch(e => console.error("Turso Admin Sync Error:", e));
            return;
          }

          setProfileFetching(true);
          await fetchProfile(userId, mounted);
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
            setProfile(adminProfile as MatriarchProfile);
            setActiveTab('admin');
            setLoading(false);
          }
          
          // Sync Admin Profile to Turso
          turso.execute(
            `INSERT INTO profiles (user_id, role, full_name, onboarding_status, is_verified, is_active, updated_at) 
             VALUES (?, ?, ?, ?, 1, 1, ?)
             ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at`,
            [currentSession.user.id, adminProfile.role, adminProfile.full_name, 'COMPLETED', new Date().toISOString()]
          ).catch(e => console.error("Turso Admin Sync Error:", e));
          return;
        }

        setProfileFetching(true);
        await fetchProfile(currentSession.user.id, mounted);
        return;
      }

      setSession(currentSession);
      if (currentSession) {
        setProfileFetching(true);
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
      const result = await turso.execute({
        sql: "SELECT * FROM profiles WHERE user_id = ?",
        args: [userId]
      });
      
      const rawProfile = result.rows[0];
      let data: MatriarchProfile | null = null;

      if (rawProfile) {
        // Map raw database row to profile object with deserialization
        data = {
          ...(rawProfile as any),
          photos: tursoHelpers.deserialize(rawProfile.photos as string) || [],
          hobbies: tursoHelpers.deserialize(rawProfile.hobbies as string) || [],
          is_verified: !!rawProfile.is_verified,
          is_active: !!rawProfile.is_active,
          smoking: !!rawProfile.smoking,
          drinking: !!rawProfile.drinking
        };
      }

      if (data?.onboarding_status === 'COMPLETED') {
        setOnboardingCache(userId);
      }
      
      if (mounted) {
        setProfile(data);
        if (data?.role === 'admin') setActiveTab('admin');
        setProfileFetching(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Matriarch Profile Fetch Catch (Turso):", err);
      if (mounted) {
        setProfile(null);
        setProfileFetching(false);
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
      <div className="h-screen w-screen flex flex-col items-center justify-center" style={{background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EEE8 100%)'}}>
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-12 h-12" style={{color:'#7B2D42'}} strokeWidth={1.5} fill="rgba(201,160,154,0.3)" />
        </motion.div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.8em] animate-pulse" style={{color:'#7B2D42', fontFamily: 'Helvetica, sans-serif'}}>
          Opening the Sanctuary…
        </p>
      </div>
    );
  }

  // ─── Routing Logic ─────────────────────────────────────────────────────────
  // profileComplete: DB says COMPLETED OR localStorage cache says so (guards against fetch failure)
  const cacheHit = session?.user?.id ? getOnboardingCache(session.user.id) : false;
  const profileComplete = profile?.onboarding_status === 'COMPLETED' || cacheHit;
  const isAdmin = profile?.role === 'admin' || ADMIN_EMAILS.includes(session?.user?.email || '');

  // While profile is still fetching from DB, show landing page (not onboarding)
  // This prevents the "flash to onboarding" on page load for returning users
  const showLanding  = !session || profileFetching;
  const showOnboarding = session && !profileFetching && !profileComplete && !isAdmin;
  const showNav = session && profileComplete && !profileFetching;

  return (
    <div className="relative min-h-screen text-gray-900 overflow-y-auto overflow-x-hidden font-body selection:bg-mat-rose selection:text-white" style={{background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EEE8 100%)'}}>
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {showLanding ? (
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
                  <div className="min-h-[80vh] w-full max-w-4xl mx-auto px-4">
                     <AnimatePresence mode="wait">
                        {isEditing && profile ? (
                          <motion.div 
                            key="edit"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                          >
                             <EditProfile 
                                profile={profile} 
                                onUpdate={(updated) => {
                                   setProfile(updated);
                                   setIsEditing(false);
                                }}
                                onCancel={() => setIsEditing(false)}
                             />
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex flex-col items-center justify-center space-y-16 py-12"
                          >
                             {/* Profile Portrait */}
                             <div className="relative group">
                                <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-2 border-mat-rose/20 shadow-mat-premium rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                   {profile?.photos?.[0] ? (
                                     <img src={profile.photos[0]} alt="" className="w-full h-full object-cover grayscale sepia-[0.2] group-hover:sepia-0 transition-all duration-700" />
                                   ) : (
                                     <div className="w-full h-full bg-mat-cream flex items-center justify-center text-mat-rose/20">
                                        <Heart size={48} strokeWidth={1} />
                                     </div>
                                   )}
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-mat-wine text-mat-cream rounded-2xl flex items-center justify-center shadow-mat-premium">
                                   <Sparkles size={18} />
                                </div>
                             </div>

                             <div className="text-center space-y-6">
                                <h2 className="text-6xl text-mat-wine leading-none" style={{fontFamily: '"Playfair Display", serif'}}>
                                  {profile?.full_name || 'Your Story'}
                                </h2>
                                <p className="text-mat-rose/60 text-[10px] font-bold uppercase tracking-[0.5em] italic">The Chosen Identity</p>
                             </div>
                             
                             <div className="w-full max-w-sm space-y-4">
                                <Tooltip content="Refine your narrative, photos, and characteristics.">
                                   <button 
                                     onClick={() => setIsEditing(true)}
                                     className="w-full h-20 rounded-3xl bg-mat-cream border border-mat-rose/20 flex items-center justify-between px-10 text-mat-wine/60 hover:text-mat-wine transition-all font-bold uppercase tracking-[0.3em] text-[10px] hover:border-mat-rose/40 hover:shadow-mat-rose/5"
                                   >
                                      <span>Refine Story</span>
                                      <Zap size={16} className="text-mat-rose/40" />
                                   </button>
                                </Tooltip>

                                <Tooltip content="Purge local session and return to threshold.">
                                   <button 
                                     onClick={() => supabase.auth.signOut()} 
                                     className="w-full h-20 rounded-3xl bg-mat-wine text-mat-cream flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-mat-wine-soft shadow-mat-premium"
                                   >
                                      Dissolve Session
                                      <ArrowRight size={16} />
                                   </button>
                                </Tooltip>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
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
