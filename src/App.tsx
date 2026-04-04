import React, { useState, useEffect } from 'react';
import { Discovery } from './pages/Discovery';
import Landing from './pages/Landing';
import { Onboarding } from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Zap, ArrowRight, Camera, Clock, ShieldCheck, Globe, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from './lib/supabase';
import { turso, tursoHelpers } from './lib/turso';

// Navigation Components
import { MatriarchToolbar } from './components/navigation/MatriarchToolbar';
import { Button } from './components/ui/button';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EditProfile } from './components/EditProfile';
import { Tooltip } from './components/ui/tooltip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Tab = 'discovery' | 'profile' | 'messages';

// ─── Didit Protocol ────────────────────────────────────────────────────────
declare global {
  interface Window {
    didit?: any;
  }
}

const DIDIT_CLIENT_ID = import.meta.env.VITE_DIDIT_CLIENT_ID || 'didit_client_id_placeholder'; 

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
  rank_boost_count?: number;
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

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileFetching, setProfileFetching] = useState(false);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'discovery' | 'profile' | 'messages'>('discovery');

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (mounted) setLoading(false);
          return;
        }
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession) {
          await fetchProfile(currentSession.user.id, mounted, currentSession);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
        return;
      }
      if (currentSession) {
        setSession(currentSession);
        setProfileFetching(true);
        await fetchProfile(currentSession.user.id, mounted, currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, mounted: boolean = true, currentSession?: any) => {
    if (!userId) return;
    try {
      const result = await turso.execute({
        sql: "SELECT * FROM profiles WHERE user_id = ?",
        args: [userId]
      });
      const rawProfile = result.rows[0];
      let data: MatriarchProfile | null = null;

      if (rawProfile) {
        data = {
          ...(rawProfile as any),
          photos: tursoHelpers.deserialize(rawProfile.photos as string) || [],
          hobbies: tursoHelpers.deserialize(rawProfile.hobbies as string) || [],
          is_verified: !!rawProfile.is_verified,
          is_active: !!rawProfile.is_active,
          smoking: !!rawProfile.smoking,
          drinking: !!rawProfile.drinking
        };

        const metadata = currentSession?.user?.user_metadata || session?.user?.user_metadata;
        if (metadata && (!data.full_name || data.photos.length === 0)) {
          const updatedName = data.full_name || metadata.full_name || metadata.name;
          const avatar = metadata.avatar_url || metadata.picture;
          const updatedPhotos = data.photos.length > 0 ? data.photos : (avatar ? [avatar] : []);
          
          if (updatedName !== data.full_name || updatedPhotos.length !== data.photos.length) {
            turso.execute(
              "UPDATE profiles SET full_name = ?, photos = ?, updated_at = ? WHERE user_id = ?",
              [updatedName, tursoHelpers.serialize(updatedPhotos), new Date().toISOString(), userId]
            ).catch(e => console.error("Sync Error:", e));
            data.full_name = updatedName;
            data.photos = updatedPhotos;
          }
        }
      }
      if (data?.onboarding_status === 'COMPLETED') setOnboardingCache(userId);
      if (mounted) {
        setProfile(data);
        setProfileFetching(false);
        setLoading(false);
      }
    } catch (err) {
      if (mounted) {
        setProfileFetching(false);
        setLoading(false);
      }
    }
  };

  const handleVerify = async () => {
    if (!profile) return;
    if (window.didit) {
      window.didit.verify({
        clientId: DIDIT_CLIENT_ID,
        vendorData: profile.user_id,
        onSuccess: async (data: any) => {
          await turso.execute("UPDATE profiles SET is_verified = 1 WHERE user_id = ?", [profile.user_id]);
          fetchProfile(profile.user_id);
        },
        onError: (err: any) => console.error("Didit Error:", err)
      });
    } else {
      alert("Didit Protocol Mock Verification...");
      await turso.execute("UPDATE profiles SET is_verified = 1 WHERE user_id = ?", [profile.user_id]);
      fetchProfile(profile.user_id);
    }
  };

  useEffect(() => {
    if (!loading) {
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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-mat-cream">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Heart className="w-12 h-12 text-mat-wine" strokeWidth={1.5} />
        </motion.div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.8em] text-mat-wine animate-pulse">Opening Sanctuary...</p>
      </div>
    );
  }

  const cacheHit = session?.user?.id ? getOnboardingCache(session.user.id) : false;
  const profileComplete = profile?.onboarding_status === 'COMPLETED' || cacheHit;
  const showLanding = !session || profileFetching;
  const showOnboarding = session && !profileFetching && !profileComplete;

  return (
    <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
            <Landing />
          </motion.div>
        ) : showOnboarding ? (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
            <Onboarding 
              userId={session.user.id} 
              metadata={session.user.user_metadata}
              onComplete={() => fetchProfile(session.user.id)} 
            />
          </motion.div>
        ) : (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-32 pb-16">
            <MatriarchToolbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => supabase.auth.signOut()} />
            <main className="container mx-auto">
              {activeTab === 'discovery' && <Discovery setActiveTab={setActiveTab} />}
              {activeTab === 'messages' && (
                <div className="text-center py-40">
                  <h2 className="text-4xl text-mat-wine italic font-bold">Resonance Inbox</h2>
                  <p className="text-mat-slate/40 text-xs uppercase tracking-widest mt-4">Deep connections await your gaze.</p>
                </div>
              )}
              {activeTab === 'profile' && (
                <div className="min-h-[80vh] w-full max-w-6xl mx-auto px-4">
                  <AnimatePresence mode="wait">
                    {isEditing && profile ? (
                      <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <EditProfile profile={profile} onUpdate={(updated) => { setProfile(updated); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
                      </motion.div>
                    ) : (
                      <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12 pb-24">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-mat-rose/10 pb-12">
                           <div className="space-y-4">
                              <Badge variant="outline" className="px-4 py-1 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5">Personal Sanctuary</Badge>
                              <h2 className="text-6xl md:text-8xl font-bold text-mat-wine italic leading-none" style={{fontFamily: 'var(--font-display)'}}>
                                {profile?.full_name?.split(' ')[0]} <br />
                                <span className="text-mat-rose/10">{profile?.full_name?.split(' ').slice(1).join(' ') || 'Identifier'}</span>
                              </h2>
                           </div>
                           <Button onClick={() => setIsEditing(true)} className="h-16 px-8 bg-mat-wine text-mat-cream font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-mat-wine-soft shadow-mat-premium flex items-center gap-4">
                              <Camera size={18} /> Refine Story
                           </Button>
                        </div>
                        <div className="bento-grid">
                          <div className="bento-span-4 bento-item mat-glass-deep p-0 overflow-hidden group h-[400px]">
                             {profile?.photos?.[0] ? (
                               <img src={profile.photos[0]} alt="" className="w-full h-full object-cover grayscale sepia-[0.2] group-hover:sepia-0 group-hover:scale-105 transition-all duration-1000" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-mat-wine/5 text-mat-wine/10"><Heart size={80} strokeWidth={0.5} /></div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/60 to-transparent opacity-40 transition-opacity group-hover:opacity-20" />
                             <div className="absolute bottom-6 left-6"><p className="text-[9px] font-black uppercase tracking-widest text-mat-cream/60 italic">Primary Aura</p></div>
                          </div>
                          <div className="bento-span-5 bento-item bg-mat-wine text-mat-cream p-12 flex flex-col justify-between h-[400px]">
                             <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><ShieldCheck className="text-mat-gold" /></div>
                                <Badge variant={profile?.is_verified ? "gold" : "outline"} className="border-white/20 text-white">{profile?.is_verified ? "Verified" : "Initiate"}</Badge>
                             </div>
                             <div>
                                <h3 className="text-3xl font-bold italic text-mat-cream">Covenant <br /><span className="text-mat-gold/60">Standing.</span></h3>
                                <p className="text-white/40 text-[10px] mt-4 uppercase tracking-[0.2em] italic max-w-xs leading-relaxed">Cross-referenced against the high-intention vault for sanctuary security.</p>
                             </div>
                             {!profile?.is_verified && <Button onClick={handleVerify} className="w-full h-14 bg-mat-cream text-mat-wine font-black uppercase tracking-[0.4em] text-[9px] rounded-xl hover:bg-white shadow-sm transition-all active:scale-[0.98]">Complete Protocol</Button>}
                          </div>
                          <div className="bento-span-3 bento-item mat-glass border-mat-rose/10 flex flex-col justify-between h-[400px] p-10">
                             <div className="space-y-4">
                                <Zap className="text-mat-rose" size={24} />
                                <h4 className="text-xl font-bold italic text-mat-wine">Aura Strength.</h4>
                             </div>
                             <div className="space-y-6">
                                <div className="text-7xl font-bold text-mat-wine/20 italic" style={{fontFamily:'var(--font-display)'}}>{profile?.rank_boost_count || 0}</div>
                                <div className="h-1.5 w-full bg-mat-wine/5 rounded-full overflow-hidden">
                                   <motion.div initial={{width:0}} animate={{width:`${Math.min(((profile?.rank_boost_count || 0)+1)*10, 100)}%`}} className="h-full bg-mat-rose" />
                                </div>
                             </div>
                             <p className="text-[9px] font-bold uppercase tracking-widest text-mat-slate/40 italic leading-relaxed">Your resonance magnitude within the current temporal cycle.</p>
                          </div>
                          <div className="bento-span-12 bento-item mat-glass border-mat-rose/10 p-12 flex flex-col md:flex-row gap-12 items-center justify-between">
                             <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-3"><Sparkles size={16} className="text-mat-rose" /><span className="text-[10px] font-bold uppercase tracking-widest text-mat-rose/60">The Narrative</span></div>
                                <p className="text-2xl md:text-4xl text-mat-wine font-medium italic leading-snug">"{profile?.bio || 'A story yet to be written. The silence before resonance begins.'}"</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="p-8 rounded-3xl bg-mat-wine/5 space-y-2 border border-mat-rose/5">
                                   <p className="text-[9px] font-bold text-mat-slate/40 uppercase tracking-widest">Occupation</p>
                                   <p className="text-xs font-bold text-mat-wine uppercase tracking-tighter leading-none">{profile?.occupation || 'Seeker'}</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-mat-wine/5 space-y-2 border border-mat-rose/5">
                                   <p className="text-[9px] font-bold text-mat-slate/40 uppercase tracking-widest">Sanctuary</p>
                                   <p className="text-xs font-bold text-mat-wine uppercase tracking-tighter leading-none">{profile?.city || 'Unknown'}</p>
                                </div>
                             </div>
                          </div>
                        </div>
                        <div className="flex justify-center pt-12">
                           <button onClick={() => supabase.auth.signOut()} className="px-12 h-16 rounded-2xl bg-mat-rose/5 text-mat-rose font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-mat-rose/10 border border-mat-rose/10 transition-all opacity-40 hover:opacity-100">Dissolve Threshold Session</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
