import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from '@/components/animations/CircularGallery';
import { turso } from '@/lib/turso';
import { TrumpCard } from '@/components/discovery/TrumpCard';

export const Discovery: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [aspirants, setAspirants] = useState<any[]>([]);

  useEffect(() => {
    const fetchAspirants = async () => {
      try {
        const result = await turso.execute("SELECT user_id, full_name, photos, city, date_of_birth, bio, is_verified, height, occupation, religion FROM profiles WHERE role = 'woman' ORDER BY created_at DESC LIMIT 200");
        const mapped = result.rows.map(r => ({
          id: r.user_id,
          user_id: r.user_id,
          name: r.full_name,
          age: r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth as string).getFullYear() : 25,
          city: r.city || 'Undisclosed',
          img: JSON.parse(r.photos as string)?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.full_name}`,
          bio: r.bio || "Identity narrative not established.",
          is_verified: r.is_verified,
          height: r.height,
          occupation: r.occupation,
          religion: r.religion
        }));
        setAspirants(mapped);
      } catch (err) {
        console.error("Discovery synchronization failed:", err);
      }
    };
    fetchAspirants();
  }, []);

  // Memoize Gallery Items to prevent re-instantiation of WebGL App and blinking
  const GALLERY_ITEMS = useMemo(() => 
    aspirants.map(m => ({ 
      image: m.img, 
      text: m.name.toUpperCase() 
    })), [aspirants]);

  const handleSelect = (index: number) => {
    if (aspirants.length > 0) {
      setSelectedProfile(aspirants[index % aspirants.length]);
    }
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
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Navigating {aspirants.length} Active Sanctuary Identities</p>
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
