import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  X, 
  Bookmark,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MessagingService } from '@/lib/messaging';
import { SanctuaryService } from '@/services/sanctuary';
import { SkeletonCard } from './ui/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  bio: string;
  photos: string;
  is_verified: boolean;
  rank_boost_count: number;
  city?: string;
  role: string;
}

export const SeekerBrowse: React.FC = () => {
  const { profile: myProfile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  
  const loader = useRef(null);
  const LIMIT = 12;

  useEffect(() => {
    const init = async () => {
       if (myProfile?.user_id && myProfile.role === 'woman') {
          const feed = await SanctuaryService.getRailFeed(myProfile.user_id, 'shortlist');
          setShortlisted(new Set((feed || []).map(p => (p as any).user_id)));
       }
    };
    init();
  }, [myProfile?.user_id, myProfile?.role]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'man')
        .eq('onboarding_status', 'COMPLETED')
        .order('rank_boost_count', { ascending: false })
        .range(offset, offset + LIMIT - 1);

      if (error) throw error;
      if (data) {
        setProfiles(prev => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      }
    } catch (err) {
      console.error("Discovery error:", err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleToggleShortlist = async (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (!myProfile?.user_id) return;
    
    if (shortlisted.has(targetId)) {
       await SanctuaryService.unshortlist(myProfile.user_id, targetId);
       setShortlisted(prev => { const n = new Set(prev); n.delete(targetId); return n; });
    } else {
       await SanctuaryService.saveToShortlist(myProfile.user_id, targetId);
       setShortlisted(prev => new Set([...prev, targetId]));
       window.dispatchEvent(new CustomEvent('MATRIARCH_SHORTLIST_UPDATED'));
    }
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setOffset(prev => prev + LIMIT);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { root: null, rootMargin: "100px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <TooltipProvider>
      <div className="space-y-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 sm:gap-14">
          {profiles.map((profile, idx) => {
             const photos = JSON.parse(profile.photos || '[]');
             const isImperial = profile.rank_boost_count >= 50;
             
             return (
              <motion.div
                key={profile.user_id + idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 4) * 0.1 }}
                onClick={() => setSelectedProfile(profile)}
              >
                <Card className={cn(
                  "relative aspect-[3/4.5] rounded-[3.5rem] overflow-hidden border cursor-pointer group shadow-2xl hover:shadow-mat-premium transition-all duration-700",
                  isImperial ? "border-mat-gold/20" : "border-mat-rose/5"
                )}>
                  <CardContent className="p-0 h-full">
                    <div className="absolute inset-0">
                      <img 
                        src={photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                        alt={profile.full_name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/90 via-mat-wine/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-10 space-y-2 pointer-events-none">
                       <h3 className="text-5xl font-bold mat-text-display-pro text-mat-cream/90 italic leading-none">{profile.full_name.split(' ')[0]}</h3>
                       <div className="flex items-center gap-4 text-mat-cream/40 text-[11px] font-black uppercase tracking-widest italic">
                          <span>Age {profile.age || 'Soul'}</span>
                          {isImperial && <Badge variant="gold" className="px-2 py-0 border-none">Imperial</Badge>}
                       </div>
                    </div>

                    <div className="absolute top-8 right-8 z-20 group-hover:opacity-100 opacity-0 transition-opacity duration-500 flex flex-col gap-4">
                       <Tooltip>
                          <TooltipTrigger asChild>
                             <button 
                              onClick={(e) => handleToggleShortlist(e, profile.user_id)} 
                              className={cn(
                                "p-5 rounded-full backdrop-blur-3xl border border-white/10 transition-all active:scale-95 shadow-2xl",
                                shortlisted.has(profile.user_id) ? "bg-mat-gold text-mat-wine" : "bg-black/60 text-mat-cream hover:bg-white/10"
                              )}
                             >
                                <Bookmark size={20} fill={shortlisted.has(profile.user_id) ? "currentColor" : "none"} />
                             </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                             {shortlisted.has(profile.user_id) ? "Shortlisted" : "Save to Archive"}
                          </TooltipContent>
                       </Tooltip>

                       <Tooltip>
                          <TooltipTrigger asChild>
                             <div className="p-5 rounded-full bg-black/60 backdrop-blur-3xl border border-white/10 text-mat-cream">
                                <Info size={20} />
                             </div>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                             Deep Inspection
                          </TooltipContent>
                       </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
             );
          })}
          {loading && [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>

        <div ref={loader} className="py-32 flex flex-col items-center justify-center">
          {!hasMore && profiles.length > 0 && (
             <div className="p-16 rounded-[4rem] border border-mat-rose/5 bg-mat-wine/5 text-center max-w-sm mx-auto italic text-mat-wine/20 mat-bloom-entry">
                <p className="mat-text-label-pro opacity-40">The horizon rests. Focus on current resonances.</p>
             </div>
          )}
        </div>

        <AnimatePresence>
          {selectedProfile && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-mat-wine/98 backdrop-blur-3xl" />
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="relative w-full max-w-7xl h-[90vh] bg-mat-cream rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-mat-premium border border-mat-rose/10">
                   <button onClick={() => setSelectedProfile(null)} className="absolute top-12 right-12 z-[110] p-6 rounded-full bg-mat-wine text-mat-cream shadow-2xl hover:scale-110 active:scale-90 transition-all font-black"><X size={28} /></button>
                   
                   <div className="w-full md:w-[50%] h-[40vh] md:h-full relative overflow-hidden bg-mat-wine/5">
                      <img src={JSON.parse(selectedProfile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-105" />
                      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-mat-cream via-mat-cream/80 to-transparent" />
                   </div>

                   <div className="flex-1 p-14 md:p-32 overflow-y-auto custom-scrollbar space-y-24">
                      <div className="space-y-10">
                         <div className="flex items-center gap-6">
                            {selectedProfile.is_verified && <Badge variant="gold">Sealed Truth</Badge>}
                            <Badge variant="outline">Station Archive</Badge>
                         </div>
                         <h2 className="text-8xl md:text-[10rem] mat-text-display-pro text-mat-wine italic leading-[0.85]">{selectedProfile.full_name}</h2>
                         <div className="flex items-center gap-6 text-mat-slate/40 text-[12px] font-black uppercase tracking-[0.6em] italic">
                            <span>Age {selectedProfile.age}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-mat-rose/20" />
                            <span className="flex items-center gap-3"><MapPin size={16} className="text-mat-rose/40" /> {selectedProfile.city || 'India'}</span>
                         </div>
                      </div>

                      <div className="space-y-12">
                         <div className="p-12 md:p-16 rounded-[4rem] bg-mat-wine/5 border border-mat-rose/5 relative">
                            <p className="text-4xl md:text-5xl text-mat-wine/90 leading-tight italic font-medium">"{selectedProfile.bio || "The narrative remains unwoven, but their presence radiates clear intention."}"</p>
                         </div>
                      </div>

                      <div className="pt-20 flex flex-col sm:flex-row gap-10">
                         <Button onClick={async () => {
                            if (!myProfile?.user_id) return;
                            try {
                               await MessagingService.createMatch(myProfile.user_id, selectedProfile.user_id);
                               alert("Resonance Established. Opening Communication Portal...");
                               setSelectedProfile(null);
                            } catch (e) { alert("Resonance already exists between these souls."); }
                         }} size="xl" className="flex-1">
                            <Heart className="mr-6" size={28} fill="currentColor" /> Initiate Resonance
                         </Button>
                         <Button onClick={(e) => handleToggleShortlist(e as any, selectedProfile.user_id)} variant="outline" size="xl" className="flex-1">
                            {shortlisted.has(selectedProfile.user_id) ? "Shortlisted" : "Intentional Save"}
                         </Button>
                      </div>
                   </div>
                </motion.div>
             </div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};
