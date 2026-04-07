import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from '@/components/animations/CircularGallery';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';
import { TrumpCard } from '@/components/discovery/TrumpCard';

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
     // Action logic here
  };

  return (
    <div className="relative w-full h-screen bg-mat-obsidian overflow-hidden">
      
      {/* 🔮 3D DISCOVERY ARRAY */}
      <div className="absolute inset-0 z-0">
        <CircularGallery 
          items={GALLERY_ITEMS} 
          bend={0} 
          scrollSpeed={0.2}
          textColor="#D4AF37" 
          onSelect={handleSelect}
        />
      </div>

      {/* 🏛️ UI OVERLAY: HUD */}
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

      {/* 🎯 CONSOLIDATED PROFILE FOCUS (Single Card Focal Point) */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="absolute inset-0 bg-mat-obsidian/90 backdrop-blur-3xl"
            />
            
            <motion.div 
              layoutId={`card-${selectedProfile.id}`}
              className="relative z-10 w-full max-w-[420px] flex justify-center items-center"
            >
               <TrumpCard 
                 profile={selectedProfile} 
                 onClose={() => setSelectedProfile(null)}
                 onAction={(type) => handleAction(type, selectedProfile)}
               />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌊 AMBIENT ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-mat-obsidian to-transparent opacity-90" />
         <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-mat-obsidian to-transparent opacity-90" />
      </div>

    </div>
  );
};

export default Discovery;
