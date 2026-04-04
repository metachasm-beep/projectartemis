import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Heart,
  Bookmark,
  MapPin,
  X,
  Info
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonRail } from "@/components/ui/SkeletonCard";
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { cn } from '@/lib/utils';
import { MessagingService } from '@/lib/messaging';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// 💎 Premium RailCard
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
        "min-w-[340px] w-[340px] aspect-[4/5.5] rounded-[3.5rem] overflow-hidden relative cursor-pointer group shadow-mat-premium border-2 transition-all duration-500",
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
             <Badge variant="gold" className="w-fit scale-90 origin-left">
                <ShieldCheck size={14} className="mr-1" /> SEALED
             </Badge>
          )}
       </div>

       <div className="absolute top-8 right-8 z-20 group-hover:opacity-100 opacity-0 transition-opacity duration-500 flex flex-col gap-4">
          <Tooltip>
             <TooltipTrigger asChild>
                <button 
                   onClick={(e) => { e.stopPropagation(); onToggleShortlist(profile.user_id); }}
                   className={cn(
                     "p-5 rounded-full backdrop-blur-3xl border border-white/10 transition-all active:scale-95 shadow-22xl",
                     isShortlisted ? "bg-mat-gold text-mat-wine" : "bg-black/60 text-mat-cream hover:bg-mat-wine"
                   )}
                >
                   <Bookmark size={20} fill={isShortlisted ? "currentColor" : "none"} />
                </button>
             </TooltipTrigger>
             <TooltipContent side="left" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                {isShortlisted ? "Shortlisted" : "Save to Archive"}
             </TooltipContent>
          </Tooltip>
       </div>

       <div className="absolute bottom-10 left-10 right-10 space-y-4 pointer-events-none">
          <h4 className="text-5xl font-bold text-mat-cream italic leading-none truncate group-hover:translate-x-2 transition-transform duration-500">
             {profile.full_name.split(' ')[0]}
          </h4>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <MapPin size={14} className="text-mat-rose" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">{profile.city || 'Sanctuary'}</p>
             </div>
             <Zap size={18} className={cn(profile.rank_boost_count >= 20 ? "text-mat-gold animate-pulse" : "text-white/20")} />
          </div>
       </div>
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
    
    if (feed && feed.length > 0) {
       feed.forEach((p: any) => {
          SanctuaryService.trackSignal(p.user_id, 'impression', womanId);
       });
    }
  }, [womanId, type, city]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
     if (type === 'shortlist') fetch();
  }, [shortlistedIds, type, fetch]);

  if (loading) return <div className="space-y-10"><h3 className="mat-text-label-pro opacity-20 px-4">{title}</h3><SkeletonRail /></div>;
  if (profiles.length === 0) return null;

  return (
    <div className="space-y-12">
       <div className="flex justify-between items-end px-6 max-w-7xl mx-auto">
          <div className="space-y-2">
             <h3 className="mat-text-label-pro text-mat-wine/60">{title}</h3>
             <div className="h-0.5 w-12 bg-mat-gold/30 rounded-full" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-mat-rose italic cursor-pointer hover:text-mat-wine transition-colors">Observe All</span>
       </div>
       <div className="flex gap-10 overflow-x-auto pb-16 px-6 custom-scrollbar mask-horizontal">
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

  const refreshShortlist = useCallback(async () => {
    if (profile?.user_id && profile.role === 'woman') {
       const feed = await SanctuaryService.getRailFeed(profile.user_id, 'shortlist');
       setShortlistedIds(new Set((feed || []).map(p => (p as any).user_id)));
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

  const handleSelectProfile = (p: any) => {
     setSelectedProfile(p);
     if (profile?.user_id) {
        SanctuaryService.trackSignal(p.user_id, 'visit', profile.user_id);
     }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-mat-cream"><Sparkles className="animate-spin text-mat-rose" /></div>;

  if (profile?.role === 'man') {
    return (
      <div className="py-24 space-y-16 mat-container">
        <div className="text-center space-y-6">
           <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 text-mat-gold text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Temporal Signal</Badge>
           <h1 className="text-8xl md:text-[10rem] mat-text-display-pro text-mat-wine italic leading-tight">Awaiting <br /><span className="text-mat-rose/10">The Gaze.</span></h1>
        </div>
        <div className="mat-glass-deep p-16 rounded-[4rem] border-mat-rose/10 text-center space-y-10 max-w-2xl mx-auto shadow-mat-premium">
           <div className="w-24 h-24 bg-mat-wine text-mat-cream rounded-full mx-auto flex items-center justify-center shadow-xl"><Sparkles size={36} /></div>
           <p className="text-2xl italic text-mat-wine font-medium leading-relaxed">"Your resonance is pulse-frequency in the sanctuary. Connection flows from her sovereign choice."</p>
           <Separator className="bg-mat-rose/10 w-1/2 mx-auto" />
           <div className="h-1.5 bg-mat-fog/30 rounded-full overflow-hidden w-2/3 mx-auto"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} className="h-full w-full bg-mat-gold" /></div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-40 py-12 md:py-24 max-w-[100vw] overflow-hidden">
         {/* ─── Resonance Rails (Curated) ─── */}
         <div className="space-y-32">
            <div className="space-y-10 px-6 max-w-7xl mx-auto">
               <div className="flex items-center gap-6">
                  <Badge variant="outline" className="px-6 py-2 border-mat-rose/20 text-mat-wine text-[10px] uppercase tracking-[0.4em] rounded-full font-black">Sanctuary Curation</Badge>
                  <Separator className="flex-1 bg-mat-rose/10" />
               </div>
               <h1 className="text-8xl md:text-[11rem] mat-text-display-pro text-mat-wine italic leading-none">Curated <br /><span className="text-mat-rose/20">Resonances.</span></h1>
            </div>
            
            <div className="space-y-32">
               {shortlistedIds.size > 0 && (
                  <ResonanceRail 
                     title="My Sanctuary (Intentional)" 
                     type="shortlist" 
                     womanId={profile?.user_id || ''} 
                     shortlistedIds={shortlistedIds}
                     onToggleShortlist={toggleShortlist}
                     onSelect={handleSelectProfile} 
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
                  title="Adjacent Seekers (Nearby)" 
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
         <div className="space-y-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-10">
                  <h2 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine">Infinite <span className="text-mat-rose/30 leading-none">Sanctuary.</span></h2>
                  <Separator className="flex-1 bg-mat-rose/10" />
               </div>
               <p className="mat-text-label-pro opacity-40 italic ml-2">Total Archive Observation</p>
            </div>
            <SeekerBrowse />
         </div>

         {/* Detail Modal Overlay (Shared Logic) */}
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
                        <div className="space-y-12">
                           <div className="flex items-center gap-6">
                              {selectedProfile.is_verified && <Badge variant="gold">Sealed Truth</Badge>}
                              <Badge variant="outline">Station Archive</Badge>
                           </div>
                           <h2 className="text-8xl md:text-[11rem] mat-text-display-pro text-mat-wine italic leading-[0.8]">{selectedProfile.full_name}</h2>
                           <div className="flex items-center gap-8 text-mat-slate/40 text-[13px] font-black uppercase tracking-[0.6em] italic">
                              <span className="flex items-center gap-3">Age {selectedProfile.age}</span>
                              <Separator orientation="vertical" className="h-6 bg-mat-rose/20" />
                              <span className="flex items-center gap-3"><MapPin size={18} className="text-mat-rose/40" /> {selectedProfile.city || 'India'}</span>
                           </div>
                        </div>

                        <div className="space-y-16">
                           <div className="p-14 md:p-20 rounded-[4rem] bg-mat-wine/5 border border-mat-rose/5 relative shadow-sm">
                              <p className="text-4xl md:text-6xl text-mat-wine/90 leading-tight italic font-medium">"{selectedProfile.bio || "The narrative remains unwoven, but their presence radiates clear intention."}"</p>
                           </div>
                        </div>

                        <div className="pt-20 flex flex-col sm:flex-row gap-10">
                           <Button onClick={async () => {
                              if (!profile?.user_id) return;
                              try {
                                 await MessagingService.createMatch(profile.user_id, selectedProfile.user_id);
                                 alert("Resonance Established. Opening Portal...");
                                 setSelectedProfile(null);
                              } catch (e) { alert("Resonance already exists."); }
                           }} size="xl" className="flex-1 shadow-mat-rose">
                              <Heart className="mr-6" size={28} fill="currentColor" /> Initiate Resonance
                           </Button>
                           <Button onClick={() => toggleShortlist(selectedProfile.user_id)} variant="outline" size="xl" className="flex-1">
                              {shortlistedIds.has(selectedProfile.user_id) ? "Shortlisted" : "Intentional Save"}
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

export default Discovery;
