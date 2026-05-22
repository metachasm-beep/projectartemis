import React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CircularGallery from '@/components/animations/CircularGallery';
import TrumpCard from '@/components/discovery/TrumpCard';
import { ArchetypeBadge } from '@/components/discovery/ArchetypeBadge';
import type { MatriarchProfile } from '@/types';

interface IdentityResonanceFoldProps {
  profile: MatriarchProfile;
  gazeProfiles: any[];
  activeGazeIndex: number;
  setActiveGazeIndex: (index: number) => void;
  setShowVerificationModal: (val: boolean) => void;
  currentLevel: { name: string; id: string; color?: string };
  absRank: number | null;
  location: any;
  isMobile: boolean;
}

export const IdentityResonanceFold: React.FC<IdentityResonanceFoldProps> = ({
  profile,
  gazeProfiles,
  activeGazeIndex,
  setActiveGazeIndex,
  setShowVerificationModal,
  currentLevel,
  absRank,
  location,
  isMobile
}) => {
  const maskReveal = {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 } }
  };

  const cardSpring = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 });

  function handleParallax(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    x.set(clientX - (rect.left + rect.width / 2));
    y.set(clientY - (rect.top + rect.height / 2));
  }

  if (isMobile) {
    return (
      <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 snap-start relative flex flex-col items-center justify-center overflow-hidden w-full bg-[#F5F2EB]">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          {gazeProfiles.length > 0 && (
              <CircularGallery 
                items={gazeProfiles} 
                bend={0} 
                scrollSpeed={1.2} 
                autoScroll 
                autoScrollSpeed={0.048} 
                onCenterUpdate={setActiveGazeIndex} 
              />
          )}
        </div>

        <motion.div variants={maskReveal} className="relative z-20 mb-6 flex justify-center">
          <ArchetypeBadge occupation={profile.occupation} size="sm" />
        </motion.div>

        <motion.div variants={cardSpring} className="relative z-20 flex justify-center">
          <div className="w-[170px]">
            <TrumpCard 
              isDashboard
              profile={{
                id: profile.user_id,
                user_id: profile.user_id,
                name: profile.full_name,
                age: profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 25,
                city: profile.city || 'Undisclosed',
                img: (profile.photos && profile.photos[0]) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`,
                status: currentLevel.name,
                bio: profile.bio || "Identity narrative not established.",
                height_str: profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "5'10\"",
                vocation: profile.occupation || 'Aspirant',
                tier: currentLevel.name,
                is_verified: profile.is_verified,
                absolute_rank: absRank,
                rank_tier: currentLevel.id,
                latitude: profile.latitude,
                longitude: profile.longitude
              }} 
              currentUserLocation={location}
              measurementUnit={profile.measurement_unit || 'km'}
            />
          </div>
        </motion.div>

        <div className="relative z-20 mt-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeGazeIndex} 
              initial={{ y: 10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -5, opacity: 0 }} 
              className="mat-glass-deep px-5 py-2 rounded-full border-mat-gold/20 flex flex-col items-center shadow-md backdrop-blur-2xl bg-white/40 border border-white/60"
            >
              <span className="text-sm font-bold text-mat-obsidian italic tracking-widest uppercase leading-none">
                {gazeProfiles[activeGazeIndex]?.text}
              </span>
              <span className="text-[6px] font-black uppercase tracking-[0.3em] text-mat-gold/80 mt-1">
                {gazeProfiles[activeGazeIndex]?.subText}
              </span>
            </motion.div>
          </AnimatePresence>
          
          {!profile.is_verified && (
            <button 
              onClick={() => setShowVerificationModal(true)}
              className="mt-6 mat-glass-deep px-8 py-3 rounded-full border border-mat-gold/20 text-[10px] text-mat-obsidian font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all bg-white/40 border-white/60"
            >
              Verify to unlock
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 pt-16 pb-4 snap-start flex flex-col items-center justify-center w-full bg-[#F5F2EB]">
      <header className="mb-6 text-center px-6">
        <motion.h1 
          variants={maskReveal} 
          className="text-5xl lg:text-6xl font-light text-mat-obsidian italic tracking-tighter"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Identity Resonance.
        </motion.h1>
        <motion.p variants={maskReveal} className="text-[10px] font-medium uppercase tracking-[1.2em] text-mat-gold/60 mt-3 ml-6">
          Sanctuary Selection Protocol
        </motion.p>
        <motion.div variants={maskReveal} className="mt-6 flex justify-center w-full">
           <ArchetypeBadge occupation={profile.occupation} size="lg" />
        </motion.div>
      </header>
      
      <div className="relative flex-1 w-full max-w-7xl flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 z-0 opacity-75 scale-110 pointer-events-none">
            {gazeProfiles.length > 0 && (
              <CircularGallery 
                items={gazeProfiles} 
                bend={-0.1}
                scrollSpeed={1.2} 
                autoScroll 
                autoScrollSpeed={0.048} 
                onCenterUpdate={setActiveGazeIndex} 
              />
            )}
         </div>

         <motion.div variants={cardSpring} className="relative z-20 w-full max-w-[420px] h-full flex flex-col items-center justify-center p-4">
            <motion.div 
              onMouseMove={handleParallax} 
              onMouseLeave={() => {x.set(0); y.set(0)}} 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
              className="w-full max-h-[60vh] xl:max-h-[65vh] origin-center"
            >
              <TrumpCard 
                isDashboard
                profile={{
                  id: profile.user_id,
                  user_id: profile.user_id,
                  name: profile.full_name,
                  age: profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 25,
                  city: profile.city || 'Undisclosed',
                  img: (profile.photos && profile.photos[0]) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`,
                  status: currentLevel.name,
                  bio: profile.bio || "Identity narrative not established.",
                  height_str: profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "5'10\"",
                  vocation: profile.occupation || 'Aspirant',
                  tier: currentLevel.name,
                  is_verified: profile.is_verified,
                  absolute_rank: absRank,
                  rank_tier: currentLevel.id,
                  latitude: profile.latitude,
                  longitude: profile.longitude
                }} 
                currentUserLocation={location}
                measurementUnit={profile.measurement_unit || 'km'}
              />
            </motion.div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                 <motion.div 
                    key={activeGazeIndex} 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="mat-glass-deep px-12 py-4 rounded-full border border-white/60 flex flex-col items-center shadow-2xl backdrop-blur-3xl bg-white/40"
                 >
                    <span className="text-3xl font-light text-mat-obsidian italic tracking-tighter uppercase leading-none">
                      {gazeProfiles[activeGazeIndex]?.originalName.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-gold/80 mt-2">
                      {gazeProfiles[activeGazeIndex]?.subText}
                    </span>
                 </motion.div>
              </AnimatePresence>
            </div>
         </motion.div>
      </div>
    </section>
  );
};
