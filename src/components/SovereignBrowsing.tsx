import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { MessagingService } from '@/lib/messaging';
import { SkeletonCard } from './ui/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from './ui/card';
import SafetyActions from './common/SafetyActions';

/**
 * 🍷 SOVEREIGN BROWSING: The Minimalist Discovery Ritual
 * An infinite scroll experience designed for the Seeker's sovereign gaze.
 * Sorted by Rank: Lowest to Highest (The Root Ascent).
 */

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  photos: string;
  is_verified: boolean;
  rank_boost_count: number;
  bio?: string;
}

export const SovereignBrowsing: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const { profile: myProfile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [matchingStatus, setMatchingStatus] = useState<Record<string, 'idle' | 'matching' | 'success'>>({});
  const [engagementProfile, setEngagementProfile] = useState<Profile | null>(null);
  
  const loader = useRef(null);
  const LIMIT = 12;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const targetRole = myProfile?.role === 'woman' ? 'man' : 'woman';
      
      // 💎 The Root Ascent: Sorting from Lowest Rank to Highest
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, age, photos, is_verified, rank_boost_count, bio')
        .eq('role', targetRole)
        .eq('onboarding_status', 'COMPLETED')
        .order('rank_boost_count', { ascending: true }) // Lowest to Highest
        .range(offset, offset + LIMIT - 1);

      if (error) throw error;
      if (data) {
        setProfiles(prev => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      }
    } catch (err) {
      console.error("Sovereign fetch error:", err);
      setHasMore(false); // Stop observer loop on error
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleMatch = async (targetId: string) => {
    if (!myProfile?.user_id || matchingStatus[targetId] === 'success') return;
    
    setMatchingStatus(prev => ({ ...prev, [targetId]: 'matching' }));
    try {
       await MessagingService.createMatch(myProfile.user_id, targetId);
       setMatchingStatus(prev => ({ ...prev, [targetId]: 'success' }));
    } catch (e) {
       console.error("Match error:", e);
       setMatchingStatus(prev => ({ ...prev, [targetId]: 'idle' }));
    }
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setOffset(prev => prev + LIMIT);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { root: null, rootMargin: "200px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="relative min-h-[100vh] bg-mat-cream overflow-x-hidden">
      {/* ─── Control Header (Notch Safe) ─── */}
      <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 md:gap-6 px-6 md:px-10 py-3 md:py-5 bg-mat-wine/90 backdrop-blur-2xl rounded-full shadow-2xl border border-mat-rose/20 w-[90%] md:w-auto justify-between md:justify-start">
         <div className="flex items-center gap-2 md:gap-3">
            <Sparkles size={14} className="text-mat-gold animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-mat-cream">Sovereign Portal</span>
         </div>
         <div className="w-px h-4 bg-mat-cream/10" />
         <Button onClick={onStop} variant="ghost" className="h-8 px-3 md:px-4 text-mat-rose hover:text-mat-cream hover:bg-mat-rose/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest gap-2">
            <X size={12} /> <span className="hidden xs:inline">Stop Browsing</span><span className="xs:hidden">Stop</span>
         </Button>
      </div>

      <main className="container mx-auto px-6 pt-32 md:pt-48 pb-32">
         {/* ─── Minimalist Discovery Grid ─── */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-14">
            {profiles.map((profile, idx) => {
              const photos = JSON.parse(profile.photos || '[]');
              const status = matchingStatus[profile.user_id] || 'idle';
              
              let stats = null;
              try {
                if (profile.bio) {
                  const bioObj = typeof profile.bio === 'string' ? JSON.parse(profile.bio) : profile.bio;
                  stats = bioObj.trump_stats;
                }
              } catch(e) {}
              
              if (!stats) {
                stats = {
                  charisma: Math.floor(Math.random() * 40) + 60, 
                  stamina: Math.floor(Math.random() * 40) + 60, 
                  intellect: Math.floor(Math.random() * 40) + 60, 
                  vibe: Math.floor(Math.random() * 40) + 60, 
                  social: Math.floor(Math.random() * 40) + 60,
                  hometown: 'Unknown Origin', 
                  weight_class: 'Cruiserweight', 
                  signature_move: 'The Silent Observer'
                };
              }
              
              return (
               <motion.div
                 key={profile.user_id + idx}
                 initial={{ opacity: 0, y: 40 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: (idx % 4) * 0.05 }}
                 className="group cursor-pointer select-none"
                 onClick={() => setEngagementProfile(profile)}
                 whileTap={{ scale: 0.98 }}
               >
                 <Card 
                  className={`
                    relative aspect-[3/5] md:aspect-[3/4.8] rounded-2xl overflow-hidden bg-[#111] transition-all duration-700
                    border-[6px] border-[#222] shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
                    hover:border-mat-gold/80 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]
                    before:absolute before:pointer-events-none before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-[200%] hover:before:animate-[shimmer_2s_infinite] before:z-40
                  `}
                 >
                   <CardContent className="p-0 h-full">
                     {/* TRUMP CARD HEADER */}
                     <div className="absolute top-0 left-0 w-full z-30 pt-4 pb-12 px-4 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-start">
                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-mat-cream drop-shadow-[0_4px_4px_rgba(0,0,0,1)] leading-none font-['Impact'] italic" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>
                          {profile.full_name.split(' ')[0]}
                        </h3>
                        {profile.is_verified && (
                          <div className="p-1.5 bg-mat-gold rounded shadow-mat-gold/50 flex-shrink-0 animate-pulse">
                             <Sparkles size={14} className="text-[#111]" />
                          </div>
                        )}
                     </div>

                     <div className="absolute inset-0 pb-32">
                       <img 
                         src={photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                         alt=""
                         className="w-full h-full object-cover saturate-[1.3] contrast-[1.2] brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-1000"
                       />
                     </div>

                     {/* TRUMP STATS BOX */}
                     <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/85 backdrop-blur-md border-t-2 border-mat-gold/20 flex flex-col p-4 pt-5">
                        {/* FLAVOR TEXT */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-[9px] uppercase tracking-widest text-mat-cream/60">
                           <div className="col-span-2 flex items-center gap-2"><span className="text-mat-gold font-bold">Origin:</span> {stats.hometown}</div>
                           <div className="col-span-2 flex items-center gap-2"><span className="text-mat-gold font-bold">Class:</span> <span className="italic">{stats.weight_class}</span></div>
                           <div className="col-span-2 flex items-center gap-2 leading-tight border-l-2 border-mat-gold/50 pl-2 mt-1"><span className="text-mat-rose font-bold">Move:</span> {stats.signature_move}</div>
                        </div>

                        {/* QUANTITATIVE STATS */}
                        <div className="space-y-2.5">
                          {[
                            { key: 'charisma', icon: '✨', val: stats.charisma, color: 'bg-mat-gold' },
                            { key: 'stamina', icon: '🔋', val: stats.stamina, color: 'bg-mat-rose' },
                            { key: 'intellect', icon: '🧠', val: stats.intellect, color: 'bg-blue-500' },
                            { key: 'vibe', icon: '🔥', val: stats.vibe, color: 'bg-purple-500' },
                            { key: 'social', icon: '🍻', val: stats.social, color: 'bg-green-500' },
                          ].map(s => (
                             <div key={s.key} className="flex items-center gap-2">
                                <span className="w-5 text-center text-[10px]">{s.icon}</span>
                                <div className="flex-1 h-3 bg-white/10 rounded-sm overflow-hidden flex relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5">
                                   <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.val}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} className={`h-full ${s.color} bg-opacity-90`} />
                                </div>
                                <span className="w-6 text-right text-[10px] font-black font-['Impact'] italic tracking-wider text-mat-cream">{s.val}</span>
                             </div>
                          ))}
                        </div>
                     </div>


                     {/* 💎 Resonance Action Overlay */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div 
                          initial={false} 
                          animate={{ scale: status === 'matching' ? 1.2 : 0, opacity: status === 'matching' ? 1 : 0 }}
                          className="p-8 rounded-full bg-mat-gold/20 backdrop-blur-3xl text-mat-gold"
                        >
                           <Sparkles size={48} className="animate-spin" />
                        </motion.div>
                        
                        <AnimatePresence>
                          {status === 'success' && (
                             <motion.div 
                               initial={{ scale: 0, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               className="p-8 rounded-full bg-mat-rose backdrop-blur-3xl text-mat-cream shadow-mat-premium"
                             >
                                <Heart size={48} fill="currentColor" />
                             </motion.div>
                          )}
                        </AnimatePresence>
                     </div>


                   </CardContent>
                 </Card>
               </motion.div>
              );
            })}
            {loading && [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
         </div>

         {/* ─── The Infinite Horizon ─── */}
         <div ref={loader} className="py-48 flex flex-col items-center justify-center">
            {hasMore ? (
               <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-mat-wine/20 flex flex-col items-center gap-6">
                  <ChevronDown size={32} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.6em]">The Root Ascent Continues</p>
               </motion.div>
            ) : (
               <div className="p-20 border border-mat-rose/5 bg-mat-wine/5 rounded-[4rem] text-center italic text-mat-wine/20">
                  <p className="mat-text-label-pro opacity-40">The registry of seekers rests. Focus on current resonances.</p>
               </div>
            )}
         </div>
      </main>

      {/* ─── TACTICAL ENGAGEMENT MODAL ─── */}
      <AnimatePresence>
        {engagementProfile && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-4"
             onClick={() => setEngagementProfile(null)}
          >
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-sm bg-[#111] border border-mat-gold/30 rounded-t-3xl md:rounded-3xl p-6 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.15)] pb-10 md:pb-6"
             >
                <div className="text-center space-y-2">
                   <h3 className="text-2xl font-black italic uppercase tracking-widest text-mat-cream font-['Impact']">Engage Asset</h3>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Target Protocol: {engagementProfile.full_name}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                   <Button 
                      onClick={() => {
                         handleMatch(engagementProfile.user_id);
                         setEngagementProfile(null);
                      }}
                      className="w-full h-14 bg-mat-gold text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-mat-gold/50 transition-all border-none"
                   >
                      Initiate Contact
                   </Button>
                   
                   <Button 
                      onClick={() => {
                         setProfiles(prev => prev.filter(p => p.user_id !== engagementProfile.user_id));
                         setEngagementProfile(null);
                      }}
                      variant="ghost"
                      className="w-full h-14 bg-white/5 text-white/60 rounded-xl font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-white/10 hover:text-white border border-white/5"
                   >
                      Dismiss / Skip
                   </Button>

                   <div className="w-full h-px bg-white/5 my-2" />

                   <SafetyActions 
                      variant="full"
                      className="w-full flex justify-center !text-[9px]"
                      userId={engagementProfile.user_id}
                      userName={engagementProfile.full_name}
                      onActionComplete={(action) => {
                         if (action === 'block') {
                            setProfiles(prev => prev.filter(p => p.user_id !== engagementProfile.user_id));
                         }
                         setEngagementProfile(null);
                      }}
                   />
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
