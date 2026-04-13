import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from '@/components/animations/CircularGallery';
import { turso } from '@/lib/turso';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { SEO_COPY } from '@/content/copy';

export const Discovery: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [aspirants, setAspirants] = useState<any[]>([]);
  const [activeGazeIndex, setActiveGazeIndex] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const { profile, refreshProfile } = useAuth();
  
  const isUnverifiedWoman = profile?.role === 'woman' && !profile?.is_verified;

  useEffect(() => {
    const fetchAspirants = async () => {
      if (!profile?.role) return;

      try {
        const targetRole = profile.role === 'woman' ? 'man' : 'woman';
        
        let query = `
          SELECT user_id, full_name, photos, city, date_of_birth, bio, is_verified, height, occupation, religion 
          FROM profiles 
          WHERE role = ?
        `;

        if (targetRole === 'woman') {
          query += " AND rank_tier = 'Aspirant'";
        }

        query += `
          AND full_name NOT LIKE '%Paul%' 
          ORDER BY created_at DESC 
          LIMIT 200
        `;

        const result = await turso.execute(query, [targetRole]);

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
  }, [profile?.role]);

  // Memoize Gallery Items
  const GALLERY_ITEMS = useMemo(() => 
    aspirants.map(m => ({ 
      image: m.img, 
      text: (m.name || 'Sanctuary Identity').toString().toUpperCase() 
    })), [aspirants]);

  const handleSelect = useCallback((index: number) => {
    if (aspirants.length > 0) {
      setSelectedProfile(aspirants[index % aspirants.length]);
    }
  }, [aspirants]);

  const handleAction = useCallback((type: string, targetProfile: any) => {
     if (type === 'ping') {
        if (isUnverifiedWoman) {
           setShowVerificationModal(true);
           return;
        }
        if (!targetProfile.is_verified) {
           alert("Sovereign resonance requires identity verification. Please seal your identity in the Sanctuary.");
           return;
        }
     }
  }, [isUnverifiedWoman]);

  return (
    <div className="relative w-full h-screen bg-mat-obsidian overflow-hidden">
      <h1 className="sr-only">{SEO_COPY.discovery.title}</h1>
      
      {/* 🔮 BROWSE MODE BANNER FOR UNVERIFIED WOMEN */}
      <AnimatePresence>
         {isUnverifiedWoman && !showVerificationModal && (
            <motion.div 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="absolute top-0 left-0 right-0 z-[110] bg-mat-wine/95 backdrop-blur-xl border-b border-mat-gold/30 px-6 py-3 flex items-center justify-between shadow-2xl"
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-mat-gold/10 border border-mat-gold/30 flex items-center justify-center">
                     <ShieldAlert className="text-mat-gold w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-mat-gold uppercase tracking-[0.2em]">{SEO_COPY.discovery.banner.title}</span>
                     <p className="text-[9px] text-white/60 uppercase tracking-widest leading-none mt-1">{SEO_COPY.discovery.banner.desc}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setShowVerificationModal(true)}
                 className="px-6 py-2 bg-mat-gold text-mat-obsidian text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all flex items-center gap-2"
               >
                  Secure Identity <ArrowRight size={12} />
               </button>
            </motion.div>
         )}
      </AnimatePresence>

      {/* 🔮 HERO SECTION: 3D ARRAY or VERIFICATION INTERFACE */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {!showVerificationModal ? (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 0.8 }}
              className="h-full w-full"
            >
              <CircularGallery 
                items={GALLERY_ITEMS} 
                bend={0} 
                scrollSpeed={0.6}
                scrollEase={0.2}
                textColor="#D4AF37" 
                onSelect={handleSelect}
                onCenterUpdate={setActiveGazeIndex}
              />
              
              {/* 2.4.4 HYBRID DISCOVERY OVERLAY */}
              {aspirants.length > 0 && (
                <div className="absolute inset-x-0 bottom-32 flex justify-center pointer-events-none z-[100]">
                  <motion.div 
                    key={activeGazeIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/90 px-12 py-6 rounded-3xl border border-mat-gold/50 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col items-center gap-1.5"
                  >
                    <span className="text-4xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap drop-shadow-2xl">
                      {aspirants[activeGazeIndex]?.name || 'Sanctuary Identity'}
                    </span>
                    <span className="text-[12px] font-black text-mat-gold uppercase tracking-[0.5em] opacity-100">
                      Age {aspirants[activeGazeIndex]?.age || '??'} • {aspirants[activeGazeIndex]?.city || 'Verified'}
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full w-full flex items-center justify-center bg-black/40 backdrop-blur-3xl z-[120]"
            >
               <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-mat-gold/30 bg-[#0A0A0B] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative mt-16">
                  <button 
                    onClick={() => setShowVerificationModal(false)}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2 z-30 uppercase text-[9px] font-black tracking-widest"
                  >
                    Abort Protocol
                  </button>
                  <AadhaarVerification userId={profile?.user_id || ''} onVerified={async () => {
                     await refreshProfile();
                     setShowVerificationModal(false);
                  }} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🏛️ UI OVERLAY: HUD */}
      {!showVerificationModal && (
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
      )}

      {/* 🎯 CONSOLIDATED PROFILE FOCUS (Single Card Focal Point) */}
      <AnimatePresence>
        {selectedProfile && !showVerificationModal && (
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
