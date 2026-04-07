import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin,
  X,
  Lock,
  MessageSquarePlus,
  ShieldAlert,
  UserX,
  EyeOff
} from 'lucide-react';

import CircularGallery from '@/components/animations/CircularGallery';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { cn } from '@/lib/utils';
import { MessagingService } from '@/lib/messaging';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const Discovery: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [engagementTarget, setEngagementTarget] = useState<any | null>(null);

  const GALLERY_ITEMS = DUMMY_ASPIRANTS.map(m => ({ image: m.img, text: m.name }));

  const handleAction = async (action: 'ping' | 'report' | 'block' | 'never_show', target: any) => {
    if (!profile?.user_id) return;

    // Identity Gating for Active Engagement
    if (!profile.is_verified && action === 'ping') {
       alert("SEAL YOUR TRUTH: Identity synchronization is required to initiate resonance. Browsing is currently observation-only.");
       return;
    }

    try {
      switch (action) {
        case 'ping':
          await MessagingService.createMatch(profile.user_id, target.user_id);
          alert(`Resonance Established with ${target.name || target.full_name}. Opening Portal...`);
          break;
        case 'report':
          const reason = prompt("State the nature of the violation:");
          if (reason) {
            await SanctuaryService.reportUser(profile.user_id, target.user_id, reason);
            alert("Report sealed. The Architect will review this signal.");
          }
          break;
        case 'block':
          if (confirm(`Block resonance with ${target.name || target.full_name} permanently?`)) {
            await SanctuaryService.blockUser(profile.user_id, target.user_id);
            alert("Sovereign boundary established.");
          }
          break;
        case 'never_show':
          await SanctuaryService.setNeverShow(profile.user_id, target.user_id);
          alert("Aspirant filtered from future discovery cycles.");
          break;
      }
      setSelectedProfile(null);
      setEngagementTarget(null);
    } catch (e: any) {
      alert(e.message || "Action failed.");
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
      <div className="fixed inset-0 bg-black z-0 overflow-hidden flex flex-col">
          {/* Sovereign Header */}
          <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
                <div className="w-12 h-12 bg-mat-gold rounded-full flex items-center justify-center shadow-mat-gold">
                    <Sparkles size={20} className="text-black" />
                </div>
                <div>
                   <h2 className="text-mat-cream font-black italic tracking-tighter text-2xl uppercase">The Array</h2>
                   <p className="text-[9px] text-mat-gold font-black uppercase tracking-[0.4em]">Sovereign Discovery Active</p>
                </div>
            </div>
            <div className="text-right hidden md:block">
               <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] italic">"The gaze defines the sanctuary."</p>
            </div>
          </div>
          
          {/* 3D Infinity Stream */}
          <div className="absolute inset-0 z-0">
            <CircularGallery 
              items={GALLERY_ITEMS}
              bend={0}
              borderRadius={0.23}
              font='900 40px "Roboto Condensed"'
              scrollSpeed={1.5}
              scrollEase={0.08}
              onSelect={(idx) => {
                 const aspirant = DUMMY_ASPIRANTS[idx];
                 setEngagementTarget({
                    ...aspirant,
                    user_id: `dummy-${idx}`,
                    photos: JSON.stringify([aspirant.img]),
                    full_name: aspirant.name
                 });
              }}
            />
          </div>

          {/* Interactive Modal Layer */}
          <AnimatePresence>
            {engagementTarget && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-3xl p-6"
                  onClick={() => setEngagementTarget(null)}
              >
                  <div onClick={(e) => e.stopPropagation()} className="relative transform-gpu scale-95 lg:scale-100">
                    <TrumpCard 
                        profile={{
                          name: engagementTarget.name,
                          age: engagementTarget.age,
                          city: engagementTarget.city,
                          img: engagementTarget.img,
                          status: engagementTarget.status,
                          bio: engagementTarget.bio,
                          is_verified: engagementTarget.is_verified,
                          user_id: engagementTarget.user_id
                        }}
                        onClose={() => setEngagementTarget(null)}
                        onAction={(action) => handleAction(action as any, engagementTarget)}
                      />
                  </div>
              </motion.div>
            )}

            {selectedProfile && (
               <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-mat-wine/98 backdrop-blur-2xl" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="relative w-full max-w-5xl h-fit max-h-[90vh] bg-mat-cream rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-mat-premium border border-mat-rose/10"
                  >
                     {/* Close Button - Neat & Symmetrical */}
                     <button 
                       onClick={() => setSelectedProfile(null)} 
                       className="absolute top-6 right-6 z-[120] p-3 rounded-full bg-white/40 backdrop-blur-sm text-mat-wine hover:bg-mat-wine hover:text-mat-cream hover:scale-105 active:scale-95 transition-all shadow-sm border border-mat-wine/5"
                     >
                        <X size={18} strokeWidth={3} />
                     </button>
                     
                     <div className="w-full md:w-[45%] h-[30vh] md:h-auto relative overflow-hidden bg-mat-wine/5">
                        <img src={JSON.parse(selectedProfile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-mat-cream via-transparent to-transparent" />
                     </div>

                     <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar flex flex-col justify-center gap-10">
                        <div className="space-y-6">
                           <div className="flex items-center gap-4">
                              {selectedProfile.is_verified && <Badge variant="gold">Sealed Truth</Badge>}
                              <Badge variant="outline" className="opacity-50">Discovery Archive</Badge>
                           </div>
                           <h2 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">{selectedProfile.full_name}</h2>
                           <div className="flex items-center gap-6 text-mat-slate/40 text-[11px] font-black uppercase tracking-[0.4em] italic">
                              <span>Age {selectedProfile.age}</span>
                              <Separator orientation="vertical" className="h-4 bg-mat-rose/20" />
                              <span className="flex items-center gap-2"><MapPin size={14} /> {selectedProfile.city}</span>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <p className="text-2xl text-mat-wine/90 leading-tight italic font-medium">"{selectedProfile.bio || "The presence is established, awaiting resonance."}"</p>
                        </div>

                        {/* ENGAGEMENT MATRIX: Symmetrical Icon-Only Buttons */}
                        <div className="flex items-center justify-between gap-6 pt-6 w-full max-w-sm">
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button 
                                   onClick={() => handleAction('ping', selectedProfile)}
                                   className={cn(
                                     "w-20 h-20 rounded-[2rem] bg-mat-wine text-mat-cream shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center",
                                     !profile?.is_verified && "opacity-50 grayscale"
                                   )}
                                 >
                                    {profile?.is_verified ? <MessageSquarePlus size={32} /> : <Lock size={32} />}
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-mat-wine text-mat-cream text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full mb-3">Ping Resonance</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button onClick={() => handleAction('block', selectedProfile)} variant="outline" className="w-16 h-16 rounded-2xl border-mat-rose/20 text-mat-wine/40 hover:text-white hover:bg-mat-wine transition-all flex items-center justify-center p-0">
                                    <UserX size={24} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-mat-wine text-mat-cream text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full mb-3">Sovereign Block</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button onClick={() => handleAction('report', selectedProfile)} variant="outline" className="w-16 h-16 rounded-2xl border-mat-rose/20 text-mat-wine/40 hover:text-white hover:bg-mat-wine transition-all flex items-center justify-center p-0">
                                    <ShieldAlert size={24} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-mat-wine text-mat-cream text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full mb-3">Signal Report</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button onClick={() => handleAction('never_show', selectedProfile)} variant="ghost" className="w-16 h-16 text-mat-wine/20 hover:text-mat-wine hover:bg-transparent transition-all flex items-center justify-center p-0">
                                    <EyeOff size={24} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-mat-wine text-mat-cream text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full mb-3">Filter Horizon</TooltipContent>
                           </Tooltip>
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
