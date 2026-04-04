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
}

export const SovereignBrowsing: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const { profile: myProfile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [matchingStatus, setMatchingStatus] = useState<Record<string, 'idle' | 'matching' | 'success'>>({});
  
  const loader = useRef(null);
  const LIMIT = 12;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      // 💎 The Root Ascent: Sorting from Lowest Rank to Highest
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, age, photos, is_verified, rank_boost_count')
        .eq('role', 'man')
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
      {/* ─── Control Header ─── */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-6 px-10 py-5 bg-mat-wine/90 backdrop-blur-2xl rounded-full shadow-2xl border border-mat-rose/20">
         <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-mat-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-cream">Sovereign Mode // Discovery Portal</span>
         </div>
         <div className="w-px h-4 bg-mat-cream/10" />
         <Button onClick={onStop} variant="ghost" className="h-8 px-4 text-mat-rose hover:text-mat-cream hover:bg-mat-rose/20 text-[9px] font-black uppercase tracking-widest gap-2">
            <X size={14} /> Stop Browsing
         </Button>
      </div>

      <main className="container mx-auto px-4 pt-48 pb-32">
         {/* ─── Minimalist Discovery Grid ─── */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-14">
            {profiles.map((profile, idx) => {
              const photos = JSON.parse(profile.photos || '[]');
              const status = matchingStatus[profile.user_id] || 'idle';
              
              return (
               <motion.div
                 key={profile.user_id + idx}
                 initial={{ opacity: 0, y: 40 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: (idx % 4) * 0.05 }}
                 className="group"
               >
                 <Card 
                  onClick={() => handleMatch(profile.user_id)} 
                  className="relative aspect-[3/4.5] rounded-[3.5rem] overflow-hidden border-none cursor-pointer shadow-mat-premium hover:shadow-mat-gold transition-all duration-700 bg-mat-wine/5"
                 >
                   <CardContent className="p-0 h-full">
                     <div className="absolute inset-0">
                       <img 
                         src={photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                         alt=""
                         className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/95 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                     </div>

                     {/* 💎 Minimalist Identity Marker */}
                     <div className="absolute bottom-0 left-0 right-0 p-12 space-y-3 pointer-events-none transition-transform duration-500 group-hover:translate-y-[-10px]">
                        <h3 className="text-5xl font-black mat-text-display-pro text-mat-cream/90 italic leading-none">{profile.full_name.split(' ')[0]}</h3>
                        <p className="text-mat-cream/40 text-[11px] font-black uppercase tracking-[0.4em] italic">Age {profile.age || 'Soul'}</p>
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

                     {profile.is_verified && (
                        <div className="absolute top-10 left-10 p-2 bg-mat-gold rounded-full shadow-mat-gold">
                           <Sparkles size={12} className="text-mat-wine" />
                        </div>
                     )}
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
    </div>
  );
};
