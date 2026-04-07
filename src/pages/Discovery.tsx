import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from '@/components/animations/CircularGallery';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';
import { Button } from '@heroui/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { 
  MessageSquarePlus, 
  ShieldAlert, 
  UserX, 
  EyeOff, 
  Lock,
  TrendingUp,
  MapPin,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Discovery: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Memoize Gallery Items to prevent re-instantiation of WebGL App and blinking
  const GALLERY_ITEMS = useMemo(() => 
    DUMMY_ASPIRANTS.map(m => ({ 
      image: m.img, 
      text: m.name.toUpperCase() 
    })), []);

  const handleSelect = (index: number) => {
    setSelectedProfile(DUMMY_ASPIRANTS[index % DUMMY_ASPIRANTS.length]);
  };

  const handleAction = (type: string, profile: any) => {
     if (type === 'ping' && !profile.is_verified) {
        alert("Sovereign resonance requires identity verification. Please seal your identity in the Sanctuary.");
        return;
     }

     // Action confirmed
  };

  return (
    <div className="relative w-full h-screen bg-mat-obsidian overflow-hidden">
      
      {/* 🔮 3D DISCOVERY LAYER */}
      <div className="absolute inset-0 z-0">
        <CircularGallery 
          items={GALLERY_ITEMS} 
          bend={3} 
          textColor="#D4AF37" 
          onSelect={handleSelect}
        />
      </div>

      {/* 🏛️ UI OVERLAY: TOP HUD */}
      <div className="absolute top-10 left-10 z-20 pointer-events-none">
         <motion.div 
           initial={{ x: -20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="space-y-1"
         >
            <h2 className="mat-text-impact text-mat-gold text-2xl tracking-tighter uppercase italic">The Array</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Navigating {DUMMY_ASPIRANTS.length} Active Aspirants</p>
         </motion.div>
      </div>

      {/* 🎯 PROFILE FOCUS MODAL */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="absolute inset-0 bg-mat-obsidian/80 backdrop-blur-2xl"
            />
            
            <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center justify-center">
               
               {/* 🃏 The Trump Card */}
               <div className="flex-shrink-0">
                  <TrumpCard 
                    profile={selectedProfile} 
                    onClose={() => setSelectedProfile(null)}
                    onAction={(type) => handleAction(type, selectedProfile)}
                  />
               </div>

               {/* 📜 Detailed Intelligence (Expanded Stats) */}
               <motion.div 
                 initial={{ x: 50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 50, opacity: 0 }}
                 className="hidden lg:flex flex-col w-[400px] h-[640px] bg-mat-wine/10 border border-mat-gold/20 rounded-[2.5rem] p-10 backdrop-blur-md justify-between"
               >
                  <div className="space-y-8">
                     <div>
                        <h3 className="text-mat-gold font-black uppercase tracking-widest text-[10px] mb-2 opacity-50">Intelligence Dossier</h3>
                        <p className="text-mat-cream text-lg font-light leading-relaxed">
                           "{selectedProfile.bio}"
                        </p>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <div className="flex items-center gap-3 text-white/40">
                              <TrendingUp size={16} />
                              <span className="text-[10px] uppercase font-black tracking-widest">Sovereign Tier</span>
                           </div>
                           <span className="text-mat-gold font-bold italic">{selectedProfile.tier}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <div className="flex items-center gap-3 text-white/40">
                              <Trophy size={16} />
                              <span className="text-[10px] uppercase font-black tracking-widest">Vocation</span>
                           </div>
                           <span className="text-mat-cream/80 font-medium">{selectedProfile.vocation}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <div className="flex items-center gap-3 text-white/40">
                              <MapPin size={16} />
                              <span className="text-[10px] uppercase font-black tracking-widest">Stature</span>
                           </div>
                           <span className="text-mat-cream/80 font-medium">{selectedProfile.height_str}</span>
                        </div>
                     </div>
                  </div>

                  {/* ⚡ DIRECT RESONANCE MATRIX (Symmetrical refined buttons) */}
                  <div className="space-y-6">
                     <div className="flex justify-between items-center bg-mat-obsidian/50 p-6 rounded-3xl border border-white/5">
                        <div className="flex gap-4">
                           <Tooltip>
                              <TooltipTrigger>
                                 <Button 
                                   isIconOnly
                                   onPress={() => handleAction('report', selectedProfile)}
                                   className="w-12 h-12 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-mat-wine transition-all shadow-lg"
                                 >
                                    <ShieldAlert size={20} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">Seal Presence (Report)</TooltipContent>
                           </Tooltip>
                           
                           <Tooltip>
                              <TooltipTrigger>
                                 <Button 
                                   isIconOnly
                                   onPress={() => handleAction('block', selectedProfile)}
                                   className="w-12 h-12 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-mat-wine transition-all shadow-lg"
                                 >
                                    <UserX size={20} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">Purge Signal (Block)</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger>
                                 <Button 
                                   isIconOnly
                                   onPress={() => handleAction('never', selectedProfile)}
                                   className="w-12 h-12 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-lg"
                                 >
                                    <EyeOff size={18} />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">Filter From View</TooltipContent>
                           </Tooltip>
                        </div>

                        <Button 
                          onPress={() => handleAction('ping', selectedProfile)}
                          isIconOnly
                          className={cn(
                            "w-12 h-12 rounded-full shadow-2xl transition-all flex items-center justify-center p-0",
                            selectedProfile.is_verified ? "bg-mat-gold text-mat-obsidian" : "bg-white/10 text-white/20"
                          )}
                        >
                           {selectedProfile.is_verified ? <MessageSquarePlus size={24} /> : <Lock size={20} />}
                        </Button>
                     </div>
                     <p className="text-[8px] uppercase tracking-[0.3em] text-center font-black text-white/20 italic">Sovereign Engagement Matrix v3.1</p>
                  </div>
               </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌊 AMBIENT ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-mat-obsidian to-transparent opacity-80" />
         <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-mat-obsidian to-transparent opacity-80" />
      </div>

    </div>
  );
};

export default Discovery;
