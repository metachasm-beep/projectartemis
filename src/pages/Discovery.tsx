import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Crown, 
  Shield, 
  Lock,
  Bookmark
} from 'lucide-react';

import { DiscoveryCard } from '@/components/DiscoveryCard';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { Clock, Eye, TrendingUp } from 'lucide-react';

// Standard components from react-bits
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import SoftAurora from "@/components/ui/react-bits/SoftAurora";

export const Discovery: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'woman' | 'man' | null>(null);
  const [points, setPoints] = useState(0);
  const [filters, setFilters] = useState({ min_rank: 0, verified_only: false });
  const [isFilterUnlocked, setIsFilterUnlocked] = useState(false);

  useEffect(() => {
    const initDiscovery = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);

        // Fetch user role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        const userRole = userData?.role;
        setRole(userRole);

        if (userRole === 'woman') {
          // Fetch points/status
          const statusRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`);
          const statusData = await statusRes.json();
          setPoints(statusData.points || 0);

          const response = await fetch(
            `${import.meta.env.VITE_API_URL || ''}/api/v1/discovery/potential-matches?user_id=${user.id}${filters.min_rank ? `&min_rank=${filters.min_rank}` : ''}${filters.verified_only ? '&verified_only=true' : ''}`
          );
          const data = await response.json();
          setProfiles(data || []);
        } else {
          // Petitioners don't load profiles
          setProfiles([]);
        }
      } catch (err) {
        console.error("Discovery error", err);
      } finally {
        setLoading(false);
      }
    };
    initDiscovery();
  }, []);

  const handleAction = async (action: 'match' | 'skip' | 'save') => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile && user) {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/discovery/select?woman_id=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ man_id: currentProfile.user_id, action })
            });
        } catch (err) {
            console.error("Selection error", err);
        }
    }
    
    setDirection(action === 'match' ? 1 : -1);
    
    // Smooth transition to next
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (profiles.length || 1));
    }, 10);
  };

  const unlockFilter = async (type: 'session' | 'day') => {
    const cost = type === 'day' ? 50 : 10;
    if (points < cost) {
      alert("Insufficient points for this selection filter.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/discovery/unlock-filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, unlock_type: type })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPoints(data.new_points);
        setIsFilterUnlocked(true);
        alert(`Advanced Filters Unlocked (${type})`);
      }
    } catch (err) {
      console.error("Unlock failed", err);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center mat-shell px-8">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-8 p-1 rounded-full bg-gradient-to-tr from-matriarch-violet to-matriarch-gold"
      >
        <div className="bg-matriarch-bg rounded-full p-6">
          <Crown className="w-12 h-12 text-matriarch-gold" strokeWidth={1} />
        </div>
      </motion.div>
      <DecryptedText 
        text="Scanning Matriarch Database..." 
        animateOn="view" 
        className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-[0.8em]"
      />
    </div>
  );

  if (role === 'man') {
    return (
      <div className="h-screen flex flex-col mat-shell overflow-hidden relative mat-noise-overlay">
        {/* Matriarch Background Aura */}
        <div className="fixed inset-0 -z-50 opacity-10 pointer-events-none">
          <SoftAurora speed={0.05} brightness={0.5} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
        </div>

        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-matriarch-bg/40 backdrop-blur-xl">
          <div className="mat-container flex h-20 items-center justify-between">
            <MatriarchLogo />
            <Badge variant="gold" className="font-mono">PETITIONER ACTIVE</Badge>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative mat-stagger-fade-in">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-mat-gold/5 blur-[120px] -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full mat-panel-premium mat-glass-premium mat-float-hover p-12 rounded-[3rem] border-none shadow-mat-premium space-y-10"
          >
            <div className="mx-auto w-24 h-24 rounded-3xl bg-mat-gold/10 flex items-center justify-center border border-mat-gold/20 shadow-xl shadow-mat-gold/5">
              <Clock className="w-10 h-10 text-mat-gold" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-display font-black text-white italic tracking-tight uppercase">Matriarch Queue Active</h2>
              <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Your profile is visible to the Matriarchs</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="mat-panel mat-glass-premium bg-white/[0.03] p-6 rounded-2xl border-white/5">
                <Eye className="w-4 h-4 text-mat-gold mb-3 mx-auto" />
                <div className="text-xl font-display font-black text-white">42</div>
                <div className="text-[8px] font-black text-matriarch-textFaint uppercase tracking-widest mt-1">Profile Scans</div>
              </div>
              <div className="mat-panel mat-glass-premium bg-white/[0.03] p-6 rounded-2xl border-white/5">
                <TrendingUp className="w-4 h-4 text-matriarch-violet mb-3 mx-auto" />
                <div className="text-xl font-display font-black text-white">Top 8%</div>
                <div className="text-[8px] font-black text-matriarch-textFaint uppercase tracking-widest mt-1">Rank Standing</div>
              </div>
              <div className="mat-panel mat-glass-premium bg-white/[0.03] p-6 rounded-2xl border-white/5">
                <Shield className="w-4 h-4 text-green-500 mb-3 mx-auto" />
                <div className="text-xl font-display font-black text-white">Active</div>
                <div className="text-[8px] font-black text-matriarch-textFaint uppercase tracking-widest mt-1">Protocol Sync</div>
              </div>
            </div>

            <div className="bg-matriarch-violet/10 p-8 rounded-3xl border border-matriarch-violet/20 flex gap-6 items-center text-left">
              <div className="w-12 h-12 rounded-xl bg-matriarch-violet flex items-center justify-center shrink-0">
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Observation Protocol</h4>
                <p className="text-[11px] text-matriarch-textSoft italic font-medium leading-normal">
                  Petitioners do not initiate connection. connection begins when a Matriarch selects your designation. Ensure your profile intelligence is at maximum fidelity.
                </p>
              </div>
            </div>

            <Button className="w-full h-16 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-transform hover:scale-[0.98]">
              Enhance Profile Rank
            </Button>
          </motion.div>
        </main>

        <div className="fixed bottom-0 w-full py-6 text-center pointer-events-none opacity-[0.05]">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-white">CONNECTION BEGINS WITH HER CHOICE — Matriarch 1.0</span>
        </div>
      </div>
    );
  }

  const profile = profiles[currentIndex];

  if (!profile && role === 'woman') {
    return (
      <div className="h-screen flex flex-col items-center justify-center mat-shell px-12 text-center mat-noise-overlay">
        {/* Matriarch Background Aura */}
        <div className="fixed inset-0 -z-50 opacity-10 pointer-events-none">
          <SoftAurora speed={0.05} brightness={0.5} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-matriarch-violet/10 blur-[150px] -z-10" />
        <Crown className="w-20 h-20 text-mat-gold mb-8 opacity-20" strokeWidth={1} />
        <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase mb-4">The Matriarch Queue is Empty</h2>
        <p className="text-matriarch-textSoft max-w-sm font-medium tracking-wide">
          All currently high-ranking Petitioners have been scanned. Check back soon for the next elite selection batch.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col mat-shell overflow-hidden mat-noise-overlay relative">
      {/* Matriarch Background Aura */}
      <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
        <SoftAurora speed={0.1} brightness={0.8} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
      </div>

      {/* Matriarch Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-matriarch-bg/40 backdrop-blur-xl">
        <div className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          <div className="flex items-center gap-6">
           <div className="flex gap-4 items-center">
              <div className="text-right hidden sm:block">
                 <div className="text-[8px] font-black text-matriarch-gold tracking-widest uppercase mb-1">Selection Power</div>
                 <div className="text-xs font-black text-white">{points} PTS</div>
              </div>
              <Badge variant="gold" className="hidden sm:flex">ELITE DISCOVERY</Badge>
              <div className="flex gap-2">
                <div className="w-8 h-1 bg-matriarch-violetBright rounded-full" />
                <div className="w-8 h-1 bg-white/10 rounded-full" />
                <div className="w-8 h-1 bg-white/10 rounded-full" />
             </div>
           </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative pt-20 pb-32 px-8 mat-stagger-fade-in">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-matriarch-violet/5 blur-[120px] -z-10" />
        
        <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-12 items-center">
           {/* Controls Left - Hidden on Mobile */}
           <div className="hidden lg:flex flex-col gap-6 col-span-1 h-full justify-center">
               <div className="mat-panel mat-glass-premium p-6 space-y-4 border-none bg-white/[0.02] relative overflow-hidden group">
                  <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest">Selection Filters</div>
                  {!isFilterUnlocked ? (
                    <div className="space-y-4">
                       <Button variant="ghost" size="sm" onClick={() => unlockFilter('session')} className="w-full text-[8px] h-10 border border-white/5 bg-white/5 hover:bg-matriarch-violet/20 font-black">
                         UNLOCK SESSION (10)
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => unlockFilter('day')} className="w-full text-[8px] h-10 border border-white/5 bg-white/5 hover:bg-matriarch-gold/20 font-black">
                         UNLOCK DAY (50)
                       </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <button 
                         onClick={() => setFilters(f => ({ ...f, verified_only: !f.verified_only }))}
                         className={`w-full p-2 text-[8px] font-black rounded border ${filters.verified_only ? `"bg-emerald-500/20 border-emerald-500 text-emerald-500"` : `"bg-white/5 border-white/5 text-white/40"`}`}
                       >
                         VERIFIED ONLY
                       </button>
                       <button 
                         onClick={() => setFilters(f => ({ ...f, min_rank: f.min_rank === 90 ? 0 : 90 }))}
                         className={`w-full p-2 text-[8px] font-black rounded border ${filters.min_rank === 90 ? `"bg-mat-gold/20 border-mat-gold text-mat-gold"` : `"bg-white/5 border-white/5 text-white/40"`}`}
                       >
                         ELITE QUEUE (90+)
                       </button>
                    </div>
                  )}
               </div>
              <Button variant="secondary" onClick={() => handleAction('skip')} className="h-16 w-full rounded-2xl group border-white/5 hover:border-matriarch-red/20 mat-glass-premium mat-float-hover">
                 <X className="w-6 h-6 text-matriarch-textSoft group-hover:text-matriarch-red transition-colors" />
              </Button>
           </div>

           {/* Central Card */}
           <div className="col-span-3 perspective-1000">
             <AnimatePresence mode="wait">
                <motion.div
                  key={profile?.user_id || 'empty'}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 50, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <div className="mat-panel-premium mat-glass-premium p-3 rounded-[2.5rem] border-none shadow-mat-premium group relative">
                     <DiscoveryCard 
                        imageSrc={profile?.avatar_url || profile?.image_url}
                        altText={profile?.full_name}
                        containerHeight="600px"
                        scaleOnHover={1.02}
                        showTooltip={false}
                        overlayContent={
                          <div className="p-10 h-full flex flex-col justify-end bg-gradient-to-t from-matriarch-bg via-matriarch-bg/60 to-transparent">
                             <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-end">
                                   <div>
                                      <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="gold">
                                          <DecryptedText text={`RANK ${Math.round(profile?.rank_score || 0)}`} animateOn="view" speed={100} sequential />
                                        </Badge>
                                        {profile?.trust_score !== undefined && profile.trust_score > 85 && (
                                          <span className="text-[10px] font-black px-2 py-0.5 rounded-sm bg-emerald-500 text-white uppercase tracking-tighter flex items-center gap-1 shadow-sm animate-pulse-slow">
                                            <Shield className="w-2.5 h-2.5 fill-current" />
                                            AI Verified
                                          </span>
                                        )}
                                      </div>
                                      <h2 className="text-5xl font-display font-black tracking-tighter text-white leading-none">
                                        {profile?.full_name}, {profile?.age}
                                      </h2>
                                   </div>
                                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                                      <Shield className="w-6 h-6 text-matriarch-violetBright" />
                                   </div>
                                </div>
                                
                                <div className="mat-panel mat-glass-premium bg-white/[0.05] p-6 border-white/10 italic text-matriarch-textSoft leading-relaxed font-medium">
                                  <DecryptedText 
                                    text={`"${profile?.bio}"`} 
                                    animateOn="view" 
                                    speed={30} 
                                    maxIterations={5}
                                    className="leading-relaxed"
                                  />
                                </div>

                                <div className="flex gap-3 overflow-hidden">
                                   {['Tech', 'Innovation', 'Fitness'].map(tag => (
                                     <Badge key={tag} variant="outline" className="border-white/10 text-white/40">{tag}</Badge>
                                   ))}
                                </div>
                             </div>
                          </div>
                        }
                     />
                  </div>
                </motion.div>
             </AnimatePresence>
           </div>

           {/* Controls Right - Hidden on Mobile */}
           <div className="hidden lg:flex flex-col gap-6 col-span-1 h-full justify-center">
              <Button variant="gold" onClick={() => handleAction('match')} className="h-24 w-full rounded-2xl group shadow-mat-gold mat-float-hover">
                 <Heart className="w-8 h-8 group-hover:scale-125 transition-transform" fill="currentColor" />
              </Button>
              <Button variant="secondary" onClick={() => handleAction('save')} className="h-16 w-full rounded-2xl group border-white/5 mat-glass-premium mat-float-hover">
                 <Bookmark className="w-6 h-6 text-matriarch-textSoft group-hover:text-matriarch-gold transition-colors" />
              </Button>
              <div className="mat-panel mat-glass-premium p-6 space-y-2 border-none bg-white/[0.02] text-center">
                 <Lock className="w-4 h-4 text-white/20 mx-auto" />
                 <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Encrypted</div>
              </div>
           </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden fixed bottom-12 left-0 right-0 flex justify-center gap-8 px-8 z-40">
           <Button variant="secondary" size="lg" onClick={() => handleAction('skip')} className="w-20 h-20 rounded-full border-white/5 bg-matriarch-surface backdrop-blur-xl mat-glass-premium">
             <X className="w-8 h-8 text-matriarch-red/60" />
           </Button>
           <Button variant="gold" size="lg" onClick={() => handleAction('match')} className="w-24 h-24 rounded-full shadow-mat-gold scale-110">
             <Heart className="w-10 h-10" fill="currentColor" />
           </Button>
           <Button variant="secondary" size="lg" onClick={() => handleAction('save')} className="w-20 h-20 rounded-full border-white/5 bg-matriarch-surface backdrop-blur-xl mat-glass-premium">
             <Bookmark className="w-7 h-7 text-matriarch-gold/60" />
           </Button>
        </div>
      </main>

      {/* Decorative Text */}
      <div className="fixed bottom-0 w-full py-6 text-center pointer-events-none opacity-[0.05]">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-white">
            <DecryptedText 
              text="Matriarch Selection Protocol Active — Archive 024.9" 
              animateOn="view" 
              speed={150} 
              sequential
            />
          </span>
      </div>
    </div>
  );
};

export default Discovery;
