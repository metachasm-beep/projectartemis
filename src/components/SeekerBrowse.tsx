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
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import { MessagingService } from '@/lib/messaging';
import { SanctuaryService } from '@/services/sanctuary';
import { SkeletonCard } from './ui/SkeletonCard';

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  bio: string;
  avatar_url: string;
  is_verified: boolean;
  rank_boost_count: number;
  location?: string;
  interests?: string[];
  role: string;
}

export const SeekerBrowse: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  
  const loader = useRef(null);
  const LIMIT = 12;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'man')
        .eq('is_active', true)
        .order('is_verified', { ascending: false })
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

  const handleSave = async (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await SanctuaryService.saveToShortlist(user.id, targetId);
    setShortlisted(prev => new Set([...prev, targetId]));
    alert("Soul Bookmarked in the Sanctuary.");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {profiles.map((profile, idx) => (
          <motion.div
            key={profile.user_id + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedProfile(profile)}
            className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-mat-wine/5 border border-mat-rose/5 cursor-pointer hover:border-mat-gold/30 transition-all duration-500 shadow-md hover:shadow-mat-premium"
          >
            <div className="absolute inset-0">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                alt={profile.full_name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/90 via-mat-wine/20 to-transparent opacity-80" />
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
               <button onClick={(e) => handleSave(e, profile.user_id)} className={cn("p-3 rounded-full backdrop-blur-md border border-white/20 transition-all", shortlisted.has(profile.user_id) ? "bg-mat-gold/80 text-black border-mat-gold" : "bg-black/40 text-white hover:bg-mat-wine")}>
                  <Bookmark size={16} fill={shortlisted.has(profile.user_id) ? "black" : "none"} />
               </button>
            </div>

            {/* Trust Hierarchy Labels */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
               {profile.is_verified && <Badge variant="gold" className="w-fit text-[8px] font-black tracking-widest"><ShieldCheck size={10} className="mr-1" /> VERIFIED</Badge>}
               <Badge variant="outline" className="w-fit bg-black/40 border-mat-gold/20 text-mat-gold text-[8px] font-black tracking-widest">RANK {profile.rank_boost_count}</Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
               <h3 className="text-3xl mat-text-display-pro text-mat-cream leading-tight italic">{profile.full_name.split(' ')[0]}</h3>
               <div className="flex items-center gap-4 text-mat-cream/40 text-[9px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Users size={12} /> {profile.age || 'Seeker'}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {profile.location || 'Sanctuary'}</span>
               </div>
            </div>
          </motion.div>
        ))}
        {loading && [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>

      <div ref={loader} className="py-20 flex flex-col items-center justify-center gap-4">
        {!hasMore && profiles.length > 0 && (
           <div className="p-12 rounded-[2.5rem] border border-mat-rose/10 bg-mat-wine/5 text-center max-w-sm mx-auto italic text-mat-wine/40">
              <p className="mat-text-label-pro opacity-40">The horizon of the sanctuary is reached.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProfile && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-mat-wine/95 backdrop-blur-2xl" />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-6xl h-full md:h-[85vh] bg-mat-cream rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-mat-rose border border-mat-rose/20">
                 <button onClick={() => setSelectedProfile(null)} className="absolute top-8 right-8 z-[110] p-4 rounded-full bg-mat-wine text-mat-cream shadow-lg hover:scale-105 transition-transform"><X size={24} /></button>
                 
                 {/* Portrait Side */}
                 <div className="w-full md:w-[45%] h-[40vh] md:h-full relative overflow-hidden">
                    <img src={selectedProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} alt="" className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-mat-cream to-transparent" />
                 </div>

                 {/* Information Archive */}
                 <div className="flex-1 p-12 md:p-24 overflow-y-auto custom-scrollbar space-y-16">
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <Badge variant="gold" className="text-[10px] font-black uppercase tracking-widest">{selectedProfile.is_verified ? "Sealed Truth" : "Aspirant"}</Badge>
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-mat-wine/10 text-mat-wine">Aura Level {selectedProfile.rank_boost_count}</Badge>
                       </div>
                       <h2 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic">{selectedProfile.full_name}</h2>
                       <p className="text-mat-slate/40 text-[10px] uppercase tracking-[0.4em] font-black">Identified in {selectedProfile.location || 'India'}</p>
                    </div>

                    <div className="space-y-8">
                       <h4 className="mat-text-label-pro text-mat-rose/40">The Narrative</h4>
                       <p className="text-2xl text-mat-wine/80 leading-relaxed italic font-medium">"{selectedProfile.bio || "The soul has not yet woven their story into the archive, but their presence radiates clear intention."}"</p>
                    </div>

                    <div className="pt-12 flex flex-col sm:flex-row gap-6">
                       <Button onClick={async () => {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) return;
                          
                          const res = await turso.execute("SELECT role, is_verified FROM profiles WHERE user_id = ?", [user.id]);
                          const me = res.rows[0];
                          if (me?.role !== 'woman') { alert("Sanctuary Gate: Connection flows from her sovereign choice."); return; }
                          
                          try {
                             await MessagingService.createMatch(user.id, selectedProfile.user_id);
                             alert("Connection Established. The Sanctuary is Open.");
                             setSelectedProfile(null);
                          } catch (e) { alert("Resonance already exists between these souls."); }
                       }} className="h-20 flex-1 rounded-[2rem] bg-mat-wine text-mat-cream hover:bg-mat-wine-soft font-black uppercase tracking-widest text-[11px] shadow-mat-premium">
                          <Heart className="mr-3" size={20} fill="currentColor" /> Initiate Resonance
                       </Button>
                       <Button onClick={(e) => handleSave(e as any, selectedProfile.user_id)} variant="outline" className="h-20 flex-1 rounded-[2rem] border-mat-rose/20 text-mat-wine hover:bg-mat-rose/5 font-black uppercase tracking-widest text-[11px]">
                          <Bookmark className="mr-3" size={20} /> Intentional Shortlist
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
