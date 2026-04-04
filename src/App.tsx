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

// Messaging Components
import { SanctuaryInbox } from './components/SanctuaryInbox';
import { MagicChat } from './components/MagicChat';
import { MessagingMatch } from './lib/messaging';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Tab = 'discovery' | 'profile' | 'messages';

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

const getOnboardingCache = (userId: string) =>
  localStorage.getItem(`MAT_OB_DONE_${userId}`) === 'true';

const setOnboardingCache = (userId: string) =>
  localStorage.setItem(`MAT_OB_DONE_${userId}`, 'true');

const getAuraTier = (count: number = 0) => {
  if (count >= 50) return { label: 'Imperial Resonance', color: 'text-mat-gold' };
  if (count >= 20) return { label: 'High Sovereign', color: 'text-mat-wine' };
  if (count >= 10) return { label: 'Verified Initiate', color: 'text-mat-rose' };
  return { label: 'Rising Seeker', color: 'text-mat-slate/60' };
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileFetching, setProfileFetching] = useState(false);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'discovery' | 'profile' | 'messages'>('discovery');
  
  // 📨 Messaging State
  const [selectedMatch, setSelectedMatch] = useState<(MessagingMatch & { otherUser: any }) | null>(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user && mounted) {
          setLoading(false);
          return;
        }
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          if (currentSession) await fetchProfile(currentSession.user.id, mounted, currentSession);
          else setLoading(false);
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
      } else if (currentSession) {
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
            <Onboarding userId={session.user.id} metadata={session.user.user_metadata} onComplete={() => fetchProfile(session.user.id)} />
          </motion.div>
        ) : (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-32 pb-16">
            <MatriarchToolbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => supabase.auth.signOut()} />
            <main className="container mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'discovery' && (
                  <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Discovery setActiveTab={setActiveTab} />
                  </motion.div>
                )}
                
                {activeTab === 'messages' && (
                  <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[70vh]">
                     {!selectedMatch ? (
                        <div className="space-y-12">
                           <div className="text-center space-y-4">
                              <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5 shadow-sm">Communication Sanctuary</Badge>
                              <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Resonant <br /><span className="text-mat-rose/20">Dialogues.</span></h1>
                           </div>
                           <SanctuaryInbox currentUserId={session.user.id} userRole={profile?.role as 'woman' | 'man'} onSelectMatch={(match) => setSelectedMatch(match)} />
                        </div>
                     ) : (
                        <MagicChat match={selectedMatch} currentUserId={session.user.id} userRole={profile?.role as 'woman' | 'man'} onBack={() => setSelectedMatch(null)} />
                     )}
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[80vh] w-full max-w-6xl mx-auto px-4">
                    <AnimatePresence mode="wait">
                      {isEditing && profile ? (
                        <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <EditProfile profile={profile} onUpdate={(updated) => { setProfile(updated); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
                        </motion.div>
                      ) : (
                        <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-20 pb-24">
                          {/* ─── Symmetrical Hero Header ─── */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-mat-rose/10 pb-20">
                             <div className="space-y-8 flex-1">
                                <div className="flex flex-wrap items-center gap-4">
                                   <Badge variant="outline" className="px-5 py-1.5 border-mat-rose/20 text-mat-rose text-[10px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5">Personal Sanctuary</Badge>
                                   <Badge variant="outline" className={cn("px-5 py-1.5 border-mat-gold/20 text-[10px] font-black uppercase tracking-[0.4em] rounded-full bg-mat-gold/5", getAuraTier(profile?.rank_boost_count).color)}>
                                      SANCTUARY RANK: {profile?.rank_boost_count || 0}
                                   </Badge>
                                    <Badge variant="gold" className="px-5 py-1.5 text-[10px] uppercase tracking-[0.4em] font-black">
                                      {getAuraTier(profile?.rank_boost_count).label}
                                   </Badge>
                                </div>
                                <h1 className="text-7xl md:text-[10rem] font-bold text-mat-wine italic leading-tight" style={{fontFamily: 'var(--font-display)'}}>
                                  {profile?.full_name?.split(' ')[0]} <br />
                                  <span className="text-mat-rose/10 -mt-8 block">{profile?.full_name?.split(' ').slice(1).join(' ') || 'Identifier'}</span>
                                </h1>
                             </div>
                             <Button onClick={() => setIsEditing(true)} className="h-20 px-12 bg-mat-wine text-mat-cream font-bold uppercase tracking-[0.4em] text-[12px] rounded-[2.5rem] hover:bg-mat-wine-soft shadow-mat-premium flex items-center gap-6 transition-all transform hover:scale-105 active:scale-95">
                                <Camera size={24} /> Refine Story
                             </Button>
                          </div>

                          {/* ─── Balanced 4-4-4 Symmetrical Grid ─── */}
                          <div className="bento-grid gap-10">
                            {/* Portrait [Span 4] */}
                            <div className="bento-span-4 bento-item mat-glass-deep p-0 overflow-hidden group h-[520px] shadow-mat-premium border-mat-rose/10">
                               {profile?.photos?.[0] ? (
                                 <img src={profile.photos[0]} alt="" className="w-full h-full object-cover grayscale sepia-[0.1] group-hover:sepia-0 group-hover:scale-105 transition-all duration-1000" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-mat-wine/5 text-mat-wine/10"><Heart size={100} strokeWidth={0.5} /></div>
                               )}
                               <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/40 to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
                               <div className="absolute bottom-10 left-10"><p className="text-[11px] font-black uppercase tracking-[0.5em] text-mat-cream/80 italic">Primary Aura</p></div>
                            </div>

                            {/* Standing/Verification [Span 4] */}
                            <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream p-12 flex flex-col justify-between h-[520px] shadow-mat-premium border-none relative overflow-hidden">
                               <div className="flex justify-between items-start z-10">
                                  <div className="w-14 h-14 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/5"><ShieldCheck className="text-mat-gold" size={28} /></div>
                                  <Badge variant={profile?.is_verified ? "gold" : "outline"} className="border-white/20 text-white px-5 py-2.5 uppercase tracking-widest font-black text-[10px] bg-white/5">{profile?.is_verified ? "Verification Sealed" : "Awaiting Seal"}</Badge>
                               </div>
                               <div className="z-10">
                                  <h3 className="text-4xl lg:text-5xl font-bold italic text-mat-cream leading-[1.1]">Covenant <br /><span className="text-mat-gold/60">Standing.</span></h3>
                                  <p className="text-white/40 text-[10px] mt-8 uppercase tracking-[0.3em] font-medium italic max-w-[18rem] leading-relaxed">Identity cross-referenced against the high-intention resonance archive.</p>
                               </div>
                               {!profile?.is_verified && (
                                   <Button onClick={handleVerify} className="w-full h-18 bg-mat-cream text-mat-wine font-black uppercase tracking-[0.5em] text-[11px] rounded-3xl hover:bg-white shadow-2xl transition-all z-10">Complete Protocol</Button>
                               )}
                               <div className="absolute -bottom-20 -right-20 opacity-[0.03] scale-[2] pointer-events-none">
                                  <ShieldCheck size={400} strokeWidth={0.5} />
                               </div>
                            </div>

                            {/* Aura Metrics [Span 4] - Unified Symmetrical End */}
                            <div className="bento-span-4 bento-item mat-glass border-mat-rose/10 flex flex-col justify-between h-[520px] p-12 shadow-sm relative overflow-hidden">
                               <div className="space-y-6">
                                  <Zap className="text-mat-rose" size={36} strokeWidth={1} />
                                  <h4 className="text-3xl font-bold italic text-mat-wine leading-none">Aura <br /><span className="text-mat-rose/30">Strength.</span></h4>
                               </div>
                               <div className="space-y-12">
                                  <div className="text-[10rem] font-bold text-mat-wine/10 italic leading-none tracking-tighter" style={{fontFamily:'var(--font-display)'}}>{profile?.rank_boost_count || 0}</div>
                                  <div className="space-y-4">
                                     <div className="h-2 w-full bg-mat-wine/5 rounded-full overflow-hidden">
                                        <motion.div initial={{width:0}} animate={{width:`${Math.min(((profile?.rank_boost_count || 0)+1)*10, 100)}%`}} className="h-full bg-mat-rose shadow-[0_0_20px_rgba(201,160,154,0.6)]" />
                                     </div>
                                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40 italic leading-relaxed text-center">Temporal Resonance Magnitude</p>
                                  </div>
                                </div>
                            </div>

                            {/* The Narrative [Full Span 12] */}
                            <div className="bento-span-12 bento-item mat-glass border-mat-rose/10 p-16 flex flex-col md:flex-row gap-20 items-center justify-between min-h-[400px] shadow-mat-premium">
                               <div className="space-y-10 flex-1">
                                  <div className="flex items-center gap-5"><Sparkles size={24} className="text-mat-rose" strokeWidth={1} /><span className="text-[12px] font-black uppercase tracking-[0.6em] text-mat-rose/60">The Narrative Sanctuary</span></div>
                                  <p className="text-3xl md:text-5xl lg:text-6xl text-mat-wine font-medium italic leading-[1.2] max-w-5xl">"{profile?.bio || 'The silence before resonance... Your story awaits its first gaze.'}"</p>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto">
                                  <div className="p-12 rounded-[3.5rem] bg-mat-wine/5 space-y-5 border border-mat-rose/10 hover:bg-mat-cream/80 transition-all group/stat min-w-[240px]">
                                     <p className="text-[11px] font-black text-mat-slate/40 uppercase tracking-[0.5em] group-hover/stat:text-mat-rose transition-colors">Occupation</p>
                                     <p className="text-xl font-bold text-mat-wine uppercase tracking-tight leading-none italic">{profile?.occupation || 'Seeker'}</p>
                                  </div>
                                  <div className="p-12 rounded-[3.5rem] bg-mat-wine/5 space-y-5 border border-mat-rose/10 hover:bg-mat-cream/80 transition-all group/stat min-w-[240px]">
                                     <p className="text-[11px] font-black text-mat-slate/40 uppercase tracking-[0.5em] group-hover/stat:text-mat-rose transition-colors">Sanctuary</p>
                                     <p className="text-xl font-bold text-mat-wine uppercase tracking-tight leading-none italic">{profile?.city || 'Unknown'}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center pt-24 border-t border-mat-rose/10 mt-20 pb-12">
                             <button onClick={() => supabase.auth.signOut()} className="px-20 h-20 rounded-[2.5rem] bg-mat-rose/5 text-mat-rose font-bold uppercase tracking-[0.8em] text-[11px] hover:bg-mat-rose/10 border border-mat-rose/10 transition-all opacity-40 hover:opacity-100 italic transform hover:scale-105 active:scale-95">Dissolve Threshold Session</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default App;
