import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Sparkles,
  ChevronDown,
  Crown,
  MapPin
} from 'lucide-react';
import { turso } from '@/lib/turso';
import { Button } from './ui/button';
import { MessagingService } from '@/lib/messaging';
import { SkeletonCard } from './ui/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from './ui/card';
import SafetyActions from './common/SafetyActions';
import { SanctuaryService } from '@/services/sanctuary';
import { useGeolocation } from '@/hooks/useGeolocation';

/**
 * 🍷 PREMIUM DISCOVERY: Minimalist Profile Browsing
 * An infinite scroll experience designed for a high-end discovery feel.
 * Sorted by Rank: Lowest to Highest.
 */

interface Profile {
  user_id: string;
  full_name: string;
  date_of_birth?: string;
  city?: string;
  photos: string;
  bio?: string;
  occupation?: string;
  height?: number;
  is_verified: boolean;
  absolute_rank?: number;
  rank_score?: number;
  latitude?: number | null;
  longitude?: number | null;
}

export const SovereignBrowsing: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const { profile: myProfile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [matchingStatus, setMatchingStatus] = useState<Record<string, 'idle' | 'matching' | 'success'>>({});
  const [engagementProfile, setEngagementProfile] = useState<Profile | null>(null);
  
  // 🛰️ Geolocation Resonance - Once per session
  const { location: myLocation } = useGeolocation(myProfile?.user_id);
  
  const loader = useRef(null);
  const LIMIT = 12;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const targetRole = myProfile?.role === 'woman' ? 'man' : 'woman';
      const res = await turso.execute({
        sql: `SELECT user_id, full_name, date_of_birth, city, photos, bio, occupation, height, is_verified, absolute_rank, rank_score, latitude, longitude
              FROM profiles
              WHERE role = ? AND onboarding_status = 'COMPLETED' AND (is_active IS NULL OR is_active = 1)
              ORDER BY COALESCE(absolute_rank, 9999) ASC
              LIMIT ? OFFSET ?`,
        args: [targetRole, LIMIT, offset]
      });

      const parsed = res.rows.map((r: any) => ({
        ...r,
        photos: typeof r.photos === 'string' ? r.photos : '[]',
        is_verified: !!r.is_verified
      }));

      setProfiles(prev => offset === 0 ? parsed : [...prev, ...parsed]);
      setHasMore(parsed.length === LIMIT);
    } catch (err) {
      console.error('Discovery fetch error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, myProfile?.role]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleMatch = async (targetId: string) => {
    if (!myProfile?.user_id || matchingStatus[targetId] === 'success') return;
    
    if (!myProfile?.is_verified) {
       alert("Identity unverified. Please seal your identity from your Dashboard to engage.");
       return;
    }
    
    const targetProfile = profiles.find(p => p.user_id === targetId);
    if (targetProfile && !targetProfile.is_verified) {
       alert("Sovereign resonance requires the target to have a sealed identity.");
       return;
    }

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
      {/* ─── Discovery Header ─── */}
      <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 md:gap-6 px-6 md:px-10 py-3 md:py-5 bg-mat-wine/90 backdrop-blur-2xl rounded-full shadow-2xl border border-mat-rose/20 w-[90%] md:w-auto justify-between md:justify-start">
         <div className="flex items-center gap-2 md:gap-3">
            <Sparkles size={14} className="text-mat-gold animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-mat-cream">Premium Browse</span>
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
              const photos = (() => { try { return JSON.parse(profile.photos || '[]'); } catch { return []; } })();
              const photo = photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`;
              const status = matchingStatus[profile.user_id] || 'idle';
              const age = profile.date_of_birth 
                ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() 
                : null;
              const tier = SanctuaryService.getTierFromRank(profile.absolute_rank ?? 9999, 1000);
              
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
                 <Card className="relative aspect-[3/5] md:aspect-[3/4.8] rounded-2xl overflow-hidden bg-[#111] transition-all duration-700 border-[6px] border-[#222] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-mat-gold/80 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                   <CardContent className="p-0 h-full">
                     {/* Header */}
                     <div className="absolute top-0 left-0 w-full z-30 pt-4 pb-12 px-4 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-mat-cream drop-shadow-[0_4px_4px_rgba(0,0,0,1)] leading-none font-['Impact'] italic">
                            {(profile.full_name || 'Member').split(' ')[0]}
                          </h3>
                          {age && <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{age}y</p>}
                        </div>
                        {profile.is_verified && (
                          <div className="p-1.5 bg-mat-gold rounded shadow-mat-gold/50 flex-shrink-0 animate-pulse">
                             <Sparkles size={14} className="text-[#111]" />
                          </div>
                        )}
                     </div>

                     {/* Photo */}
                     <div className="absolute inset-0 pb-28">
                       <img 
                         src={photo}
                         alt=""
                         referrerPolicy="no-referrer"
                         crossOrigin="anonymous"
                         className="w-full h-full object-cover saturate-[1.2] brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-1000"
                       />
                     </div>

                     {/* Status Footer */}
                     <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/85 backdrop-blur-md border-t border-mat-gold/20 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${tier.color === 'mat-gold-foil' ? 'text-mat-gold' : 'text-mat-rose'}`}>
                            {tier.name}
                          </span>
                          {profile.absolute_rank && (
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">#{profile.absolute_rank}</span>
                          )}
                        </div>
                        {profile.city && (
                          <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase tracking-widest truncate">
                            <MapPin size={9} /> {profile.city}
                            {profile.latitude && profile.longitude && myLocation && (
                              <span className="text-mat-gold font-black ml-1">
                                • {Math.round(SanctuaryService.calculateDistance(
                                    myLocation.latitude, 
                                    myLocation.longitude, 
                                    profile.latitude, 
                                    profile.longitude,
                                    myProfile?.measurement_unit || 'km'
                                  ))} {myProfile?.measurement_unit || 'km'} away
                              </span>
                            )}
                          </div>
                        )}
                        {profile.occupation && (
                          <p className="text-[9px] italic text-white/30 truncate">{profile.occupation}</p>
                        )}
                     </div>

                     {/* Match Overlay */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div 
                           initial={false} 
                           animate={{ scale: status === 'matching' ? 1.2 : 0, opacity: status === 'matching' ? 1 : 0 }}
                           className="p-8 rounded-full bg-mat-gold/20 backdrop-blur-xl text-mat-gold"
                        >
                           <Sparkles size={48} className="animate-spin" />
                        </motion.div>
                        
                        <AnimatePresence>
                           {status === 'success' && (
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-8 rounded-full bg-mat-rose backdrop-blur-xl text-mat-cream shadow-mat-premium"
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

         {/* ─── Infinite Discovery ─── */}
         <div ref={loader} className="py-48 flex flex-col items-center justify-center">
            {hasMore ? (
               <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-mat-wine/20 flex flex-col items-center gap-6">
                  <ChevronDown size={32} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.6em]">Loading more profiles</p>
               </motion.div>
            ) : (
               <div className="p-20 border border-mat-rose/5 bg-mat-wine/5 rounded-[4rem] text-center italic text-mat-wine/20">
                  <p className="mat-text-label-pro opacity-40">No more profiles available today. Focus on current connections.</p>
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
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="relative">
                     <img 
                       src={(() => { try { return JSON.parse(engagementProfile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${engagementProfile.user_id}`; } catch { return `https://api.dicebear.com/7.x/avataaars/svg?seed=${engagementProfile.user_id}`; } })()} 
                       alt="" 
                       referrerPolicy="no-referrer"
                       crossOrigin="anonymous"
                       className="w-20 h-20 rounded-full object-cover border-2 border-mat-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                     />
                     {engagementProfile.is_verified && (
                       <div className="absolute -bottom-1 -right-1 p-1 bg-mat-gold rounded-full text-black shadow-mat-gold/50">
                         <Sparkles size={10} />
                       </div>
                     )}
                   </div>
                   <div className="space-y-1">
                     <h3 className="text-2xl font-black italic uppercase tracking-widest text-mat-cream font-['Impact']">{engagementProfile.full_name}</h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                       {SanctuaryService.getTierFromRank(engagementProfile.absolute_rank ?? 9999, 1000).name}
                       {engagementProfile.city ? ` • ${engagementProfile.city}` : ''}
                     </p>
                   </div>
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
