import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Heart,
  Plus,
  Bookmark,
  MapPin,
  X,
  Users
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonRail } from "@/components/ui/SkeletonCard";
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { cn } from '@/lib/utils';
import { MessagingService } from '@/lib/messaging';

// 💎 Premium RailCard: Augmented with Aura and Intentionality
const RailCard = ({ 
  profile, 
  onSelect, 
  isShortlisted,
  onToggleShortlist
}: { 
  profile: any, 
  onSelect: (p: any) => void,
  isShortlisted: boolean,
  onToggleShortlist: (id: string) => void
}) => {
  const photos = JSON.parse(profile.photos || '[]');
  const mainPhoto = photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`;

  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        "min-w-[320px] w-[320px] aspect-[4/5] rounded-[3rem] overflow-hidden relative cursor-pointer group shadow-mat-premium border-2 transition-all duration-500",
        profile.rank_boost_count >= 50 ? "border-mat-gold/30 shadow-mat-gold" : "border-mat-rose/10"
      )}
    >
       <div onClick={() => onSelect(profile)} className="absolute inset-0">
          <img 
             src={mainPhoto} 
             className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
       </div>
       
       <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
          {profile.is_verified && (
             <Badge variant="gold" className="w-fit scale-90 origin-left mat-bloom-entry">
                <ShieldCheck size={14} className="mr-1" /> SEALED
             </Badge>
          )}
          {profile.rank_boost_count >= 50 && (
             <Badge variant="outline" className="w-fit scale-90 origin-left border-mat-gold text-mat-gold bg-black/40 mat-bloom-entry">
                <Sparkles size={10} className="mr-1" /> IMPERIAL
             </Badge>
          )}
       </div>

       <div className="absolute top-8 right-8 z-20">
          <button 
             onClick={(e) => { e.stopPropagation(); onToggleShortlist(profile.user_id); }}
             className={cn(
               "p-4 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-90",
               isShortlisted ? "bg-mat-gold text-mat-wine border-mat-gold" : "bg-black/40 text-mat-cream hover:bg-mat-wine"
             )}
          >
             <Bookmark size={18} fill={isShortlisted ? "currentColor" : "none"} />
          </button>
       </div>

       <div className="absolute bottom-10 left-10 right-10 space-y-3 pointer-events-none">
          <h4 className="text-4xl font-bold text-mat-cream italic leading-none truncate group-hover:translate-x-2 transition-transform duration-500">
             {profile.full_name.split(' ')[0]}
          </h4>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <MapPin size={12} className="text-mat-rose" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{profile.city || 'Sanctuary'}</p>
             </div>
             <Zap size={16} className={cn(profile.rank_boost_count >= 20 ? "text-mat-gold animate-pulse" : "text-white/20")} />
          </div>
       </div>
       
       {/* Visual Aura Shimmer Layer */}
       {profile.rank_boost_count >= 50 && (
          <div className="absolute inset-0 pointer-events-none border-4 border-mat-gold/20 rounded-[3rem] animate-pulse" />
       )}
    </motion.div>
  );
};

const ResonanceRail = ({ 
  title, 
  type, 
  onSelect,
  womanId,
  city,
  shortlistedIds,
  onToggleShortlist
}: { 
  title: string, 
  type: string, 
  onSelect: (p: any) => void,
  womanId: string,
  city?: string,
  shortlistedIds: Set<string>,
  onToggleShortlist: (id: string) => void
}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const feed = await SanctuaryService.getRailFeed(womanId, type as any, city);
    setProfiles(feed || []);
    setLoading(false);
  }, [womanId, type, city]);

  useEffect(() => { fetch(); }, [fetch]);

  // Re-fetch only if the shortlist rail needs updating
  useEffect(() => {
     if (type === 'shortlist') fetch();
  }, [shortlistedIds, type, fetch]);

  if (loading) return <div className="space-y-10"><h3 className="mat-text-label-pro opacity-20 px-4">{title}</h3><SkeletonRail /></div>;
  if (profiles.length === 0) return null;

  return (
    <div className="space-y-10">
       <div className="flex justify-between items-end px-6">
          <h3 className="mat-text-label-pro text-mat-wine/60">{title}</h3>
          <span className="text-[9px] font-black uppercase tracking-widest text-mat-rose italic border-b border-mat-rose/20 pb-1 cursor-pointer hover:text-mat-wine transition-colors">Observe All</span>
       </div>
       <div className="flex gap-8 overflow-x-auto pb-12 px-6 custom-scrollbar mask-horizontal">
          {profiles.map((p, i) => (
            <RailCard 
              key={p.user_id + i} 
              profile={p} 
              onSelect={onSelect} 
              isShortlisted={shortlistedIds.has(p.user_id)}
              onToggleShortlist={onToggleShortlist}
            />
          ))}
       </div>
    </div>
  );
};

export const Discovery: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  // Init shortlist state
  const refreshShortlist = useCallback(async () => {
    if (profile?.user_id && profile.role === 'woman') {
       const feed = await SanctuaryService.getRailFeed(profile.user_id, 'shortlist');
       setShortlistedIds(new Set(feed.map(p => (p as any).user_id)));
    }
  }, [profile?.user_id, profile?.role]);

  useEffect(() => {
    refreshShortlist();
    window.addEventListener('MATRIARCH_SHORTLIST_UPDATED', refreshShortlist);
    return () => window.removeEventListener('MATRIARCH_SHORTLIST_UPDATED', refreshShortlist);
  }, [refreshShortlist]);

  const toggleShortlist = async (id: string) => {
    if (!profile?.user_id) return;
    if (shortlistedIds.has(id)) {
       await SanctuaryService.unshortlist(profile.user_id, id);
       setShortlistedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else {
       await SanctuaryService.saveToShortlist(profile.user_id, id);
       setShortlistedIds(prev => new Set([...prev, id]));
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Sparkles className="animate-spin text-mat-rose" /></div>;

  if (profile?.role === 'man') {
    return (
      <div className="py-24 space-y-12">
        <div className="text-center space-y-4">
           <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 text-mat-gold text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Temporal Signal</Badge>
           <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic">Awaiting <br /><span className="text-mat-rose/20">The Gaze.</span></h1>
        </div>
        <div className="mat-glass-deep p-16 rounded-[4rem] border-mat-rose/10 text-center space-y-8 max-w-2xl mx-auto">
           <div className="w-20 h-20 bg-mat-wine text-mat-cream rounded-full mx-auto flex items-center justify-center shadow-mat-premium"><Sparkles size={32} /></div>
           <p className="text-lg italic text-mat-wine font-medium leading-relaxed">"Your resonance is pulse-frequency in the sanctuary. Connection flows from her sovereign choice."</p>
           <div className="h-1 bg-mat-fog rounded-full overflow-hidden w-2/3 mx-auto"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-full bg-mat-gold" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-40 py-12 md:py-24 max-w-[100vw] overflow-hidden">
       {/* ─── Resonance Rails (Curated) ─── */}
       <div className="space-y-24">
          <div className="space-y-6 px-6">
             <Badge variant="outline" className="px-6 py-2 border-mat-rose/20 text-mat-wine text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Sanctuary Curation</Badge>
             <h1 className="text-7xl md:text-9xl mat-text-display-pro text-mat-wine italic leading-tight">Curated <br /><span className="text-mat-rose/20">Resonances.</span></h1>
             <p className="mat-text-label-pro opacity-40 ml-2">High-integrity profiles filtered by presence and merit.</p>
          </div>
          
          <div className="space-y-20">
             {shortlistedIds.size > 0 && (
                <ResonanceRail 
                   title="My Sanctuary (Intentional)" 
                   type="shortlist" 
                   womanId={profile?.user_id || ''} 
                   shortlistedIds={shortlistedIds}
                   onToggleShortlist={toggleShortlist}
                   onSelect={setSelectedProfile} 
                />
             )}
             <ResonanceRail 
                title="Imperial Aura (Top Ranked)" 
                type="imperial" 
                womanId={profile?.user_id || ''} 
                shortlistedIds={shortlistedIds}
                onToggleShortlist={toggleShortlist}
                onSelect={setSelectedProfile} 
             />
             <ResonanceRail 
                title="Nearby Seekers" 
                type="nearby" 
                city={profile?.city} 
                womanId={profile?.user_id || ''} 
                shortlistedIds={shortlistedIds}
                onToggleShortlist={toggleShortlist}
                onSelect={setSelectedProfile} 
             />
             <ResonanceRail 
                title="Seal of Truth (Verified)" 
                type="truth" 
                womanId={profile?.user_id || ''} 
                shortlistedIds={shortlistedIds}
                onToggleShortlist={toggleShortlist}
                onSelect={setSelectedProfile} 
             />
             <ResonanceRail 
                title="Rising Seekers" 
                type="rising" 
                womanId={profile?.user_id || ''} 
                shortlistedIds={shortlistedIds}
                onToggleShortlist={toggleShortlist}
                onSelect={setSelectedProfile} 
             />
          </div>
       </div>

       {/* ─── Infinite Resonance ─── */}
       <div className="space-y-20">
          <div className="flex items-center gap-10 px-6">
             <h2 className="text-5xl mat-text-display-pro text-mat-wine">Infinite <span className="text-mat-rose/30">Sanctuary</span></h2>
             <div className="h-px flex-1 bg-mat-rose/10" />
          </div>
          <SeekerBrowse />
       </div>

       {/* Detail Modal Overlay (Shared Logic) */}
       <AnimatePresence>
          {selectedProfile && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-mat-wine/95 backdrop-blur-2xl" />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-6xl h-full md:h-[85vh] bg-mat-cream rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-mat-rose border border-mat-rose/20">
                   <button onClick={() => setSelectedProfile(null)} className="absolute top-8 right-8 z-[110] p-4 rounded-full bg-mat-wine text-mat-cream shadow-lg hover:scale-105 transition-transform"><X size={24} /></button>
                   
                   <div className="w-full md:w-[45%] h-[40vh] md:h-full relative overflow-hidden">
                      <img src={JSON.parse(selectedProfile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-110" />
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-mat-cream to-transparent" />
                   </div>

                   <div className="flex-1 p-12 md:p-24 overflow-y-auto custom-scrollbar space-y-16">
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <Badge variant="gold" className="text-[10px] font-black uppercase tracking-widest">{selectedProfile.is_verified ? "Sealed Truth" : "Aspirant"}</Badge>
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-mat-wine/10 text-mat-wine">Aura Level {selectedProfile.rank_boost_count}</Badge>
                         </div>
                         <h2 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-tight">{selectedProfile.full_name}</h2>
                         <p className="text-mat-slate/40 text-[10px] uppercase tracking-[0.4em] font-black">Identified in {selectedProfile.city || 'India'}</p>
                      </div>

                      <div className="space-y-8">
                         <h4 className="mat-text-label-pro text-mat-rose/40">The Narrative</h4>
                         <p className="text-2xl text-mat-wine/80 leading-relaxed italic font-medium">"{selectedProfile.bio || "The soul has not yet woven their story into the archive, but their presence radiates clear intention."}"</p>
                      </div>

                      <div className="pt-12 flex flex-col sm:flex-row gap-6">
                         <Button onClick={async () => {
                            if (!profile?.user_id) return;
                            try {
                               await MessagingService.createMatch(profile.user_id, selectedProfile.user_id);
                               alert("Connection Established. The Sanctuary is Open.");
                               setSelectedProfile(null);
                            } catch (e) { alert("Resonance already exists between these souls."); }
                         }} className="h-24 flex-1 rounded-[2rem] bg-mat-wine text-mat-cream hover:bg-mat-wine-soft font-black uppercase tracking-widest text-[11px] shadow-mat-premium">
                            <Heart className="mr-3" size={20} fill="currentColor" /> Initiate Resonance
                         </Button>
                         <Button onClick={() => toggleShortlist(selectedProfile.user_id)} variant="outline" className="h-24 flex-1 rounded-[2rem] border-mat-rose/20 text-mat-wine hover:bg-mat-rose/5 font-black uppercase tracking-widest text-[11px]">
                            {shortlistedIds.has(selectedProfile.user_id) ? "Shortlisted" : "Intentional Shortlist"}
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

export default Discovery;
