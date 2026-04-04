import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Users, 
  ChevronRight,
  X,
  MessageCircle,
  Sparkles,
  Info,
  Bookmark
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MessagingService } from '@/lib/messaging';
import { SanctuaryService } from '@/services/sanctuary';
import { SkeletonCard } from './ui/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

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

  // Sync shortlist state on mount
  useEffect(() => {
    const init = async () => {
       if (myProfile?.user_id && myProfile.role === 'woman') {
          const feed = await SanctuaryService.getRailFeed(myProfile.user_id, 'shortlist');
          setShortlisted(new Set(feed.map(p => (p as any).user_id)));
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
       // 📣 Dispatch global event so Discovery Rails can update
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
    const option = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {profiles.map((profile, idx) => {
           const photos = JSON.parse(profile.photos || '[]');
           const isImperial = profile.rank_boost_count >= 50;
           
           return (
            <motion.div
              key={profile.user_id + idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedProfile(profile)}
              className={cn(
                "group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-mat-wine/5 border-2 cursor-pointer transition-all duration-500 shadow-md hover:shadow-mat-premium",
                isImperial ? "border-mat-gold/30" : "border-mat-rose/5 hover:border-mat-rose/20"
              )}
            >
              <div className="absolute inset-0">
                <img 
                  src={photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/95 via-mat-wine/20 to-transparent opacity-80" />
              </div>

              {/* Quick Actions Overlay */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
                 <button 
                  onClick={(e) => handleToggleShortlist(e, profile.user_id)} 
                  className={cn(
                    "p-4 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-90 shadow-lg",
                    shortlisted.has(profile.user_id) ? "bg-mat-gold text-mat-wine border-mat-gold" : "bg-black/40 text-mat-cream hover:bg-mat-wine"
                  )}
                 >
                    <Bookmark size={18} fill={shortlisted.has(profile.user_id) ? "currentColor" : "none"} />
                 </button>
              </div>

              {/* Trust Hierarchy Labels */}
              <div className="absolute top-8 left-8 flex flex-col gap-2 z-10 pointer-events-none">
                 {profile.is_verified && <Badge variant="gold" className="w-fit text-[9px] font-black tracking-widest px-3 py-1 scale-95 origin-left shadow-sm"><ShieldCheck size={12} className="mr-1" /> VERIFIED</Badge>}
                 {isImperial && <Badge variant="outline" className="w-fit bg-black/60 border-mat-gold/40 text-mat-gold text-[9px] font-black tracking-widest px-3 py-1 scale-95 origin-left shadow-sm"><Sparkles size={10} className="mr-1" /> IMPERIAL</Badge>}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 pointer-events-none">
                 <h3 className="text-4xl mat-text-display-pro text-mat-cream leading-tight italic truncate transition-transform group-hover:translate-x-2">{profile.full_name.split(' ')[0]}</h3>
                 <div className="flex items-center gap-4 text-mat-cream/40 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-mat-rose" /> {profile.city || 'Sanctuary'}</span>
                    <span className="flex items-center gap-1.5"><Zap size={14} className={profile.rank_boost_count > 10 ? "text-mat-gold" : ""} /> {profile.rank_boost_count} AURA</span>
                 </div>
              </div>
            </motion.div>
          );
        })}
        {loading && [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>

      <div ref={loader} className="py-24 flex flex-col items-center justify-center gap-4">
        {!hasMore && profiles.length > 0 && (
           <div className="p-16 rounded-[3rem] border border-mat-rose/10 bg-mat-wine/5 text-center max-w-sm mx-auto italic text-mat-wine/40 mat-bloom-entry">
              <p className="mat-text-label-pro opacity-40">The horizon of the sanctuary is reached.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProfile && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-mat-wine/95 backdrop-blur-3xl" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-6xl h-full md:h-[85vh] bg-mat-cream rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row shadow-mat-premium border border-mat-rose/20">
                 <button onClick={() => setSelectedProfile(null)} className="absolute top-10 right-10 z-[110] p-5 rounded-full bg-mat-wine text-mat-cream shadow-mat-premium hover:scale-110 active:scale-95 transition-all"><X size={24} /></button>
                 
                 {/* Portrait Side */}
                 <div className="w-full md:w-[45%] h-[40vh] md:h-full relative overflow-hidden bg-mat-wine/10">
                    <img src={JSON.parse(selectedProfile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-mat-cream via-transparent to-transparent" />
                 </div>

                 {/* Information Archive */}
                 <div className="flex-1 p-12 md:p-24 overflow-y-auto custom-scrollbar space-y-20">
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <Badge variant="gold" className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5">{selectedProfile.is_verified ? "Sealed Truth" : "Aspirant"}</Badge>
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 border-mat-wine/20 text-mat-wine">Aura Rank {selectedProfile.rank_boost_count}</Badge>
                       </div>
                       <h2 className="text-7xl md:text-9xl mat-text-display-pro text-mat-wine italic leading-[0.9]">{selectedProfile.full_name}</h2>
                       <p className="text-mat-slate/40 text-[11px] uppercase tracking-[0.5em] font-black flex items-center gap-3"><MapPin size={14} className="text-mat-rose" /> Identified in {selectedProfile.city || 'India'}</p>
                    </div>

                    <div className="space-y-10">
                       <h4 className="mat-text-label-pro text-mat-rose/30">The Narrative Archive</h4>
                       <p className="text-3xl md:text-4xl text-mat-wine/80 leading-[1.2] italic font-medium max-w-2xl">"{selectedProfile.bio || "The soul has not yet woven their story into the archive, but their presence radiates clear intention."}"</p>
                    </div>

                    <div className="pt-16 flex flex-col sm:flex-row gap-8">
                       <Button onClick={async () => {
                          if (!myProfile?.user_id) return;
                          try {
                             await MessagingService.createMatch(myProfile.user_id, selectedProfile.user_id);
                             alert("Resonance Established. Opening Portal...");
                             setSelectedProfile(null);
                          } catch (e) { alert("Resonance already exists between these souls."); }
                       }} className="h-28 flex-1 rounded-[2.5rem] bg-mat-wine text-mat-cream hover:bg-mat-wine-soft font-black uppercase tracking-[0.3em] text-[12px] shadow-mat-rose active:scale-[0.98] transition-all">
                          <Heart className="mr-4" size={24} fill="currentColor" /> Initiate Resonance
                       </Button>
                       <Button onClick={(e) => handleToggleShortlist(e as any, selectedProfile.user_id)} variant="outline" className="h-28 flex-1 rounded-[2.5rem] border-mat-rose/20 text-mat-wine hover:bg-mat-rose/10 font-black uppercase tracking-[0.3em] text-[12px] transition-all">
                          {shortlisted.has(selectedProfile.user_id) ? "Shortlisted" : "Intentional Shortlist"}
                       </Button>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
