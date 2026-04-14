import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Crown,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  UserCheck as UserCheckIcon,
  Eye,
  Camera,
  Compass,
  Sparkles,
  Settings
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { turso } from '@/lib/turso';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import type { MatriarchProfile } from '@/types';
import TrumpCard from '@/components/discovery/TrumpCard';
import CircularGallery from '@/components/animations/CircularGallery';
import { sanitizeBio } from '@/utils/trumpData';
import { SEO_COPY } from '@/content/copy';
import { SanctuaryService } from '@/services/sanctuary';

interface MenDashboardProps {
  profile: MatriarchProfile;
  status: any;
  handleLogout?: () => void;
  onOpenSettings: () => void;
  refreshProfile: () => Promise<void>;
  setIsEditing?: (val: boolean) => void;
  onNavigateToStore?: () => void;
  metrics?: { impression: number; visit: number; save: number };
}

// ─── LORE & MAPPING ───
const VOCATION_ARCHETYPES: Record<string, { label: string; icon: string; description: string }> = {
  'Architect': { label: 'The Architect', icon: '📐', description: 'Designer of sanctuary foundations.' },
  'Strategist': { label: 'The Strategist', icon: '♟️', description: 'Master of resonance patterns.' },
  'Aspirant': { label: 'The Aspirant', icon: '✨', description: 'One who seeks the sanctuary' },
  'Imperial': { label: 'The Imperial', icon: '🏛️', description: 'High-standing resident.' },
  // Default fallback logic in the component
};

// ─── AURA CALIBRATION COMPONENT ───
const AuraMeter: React.FC<{ integrity: number }> = ({ integrity }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (integrity / 100) * circumference;
  
  const auraColor = integrity > 80 ? 'var(--color-mat-rose-gold)' : 
                    integrity > 50 ? 'var(--color-mat-gold)' : 
                    '#444';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center group/aura" style={{ '--aura-color': auraColor } as any}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <motion.circle 
          cx="64" cy="64" r={radius} fill="transparent" 
          stroke={auraColor} strokeWidth="4" strokeLinecap="round"
          className="aura-meter-ring"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className={cn(
        "absolute inset-4 rounded-full flex flex-col items-center justify-center transition-all duration-700",
        integrity > 70 ? "aura-glow-rose" : "aura-glow-gold"
      )}>
        <span className="text-2xl font-black text-white leading-none italic">{integrity}%</span>
        <span className="text-[7px] uppercase tracking-widest text-white/40 mt-1">Aura Level</span>
      </div>
    </div>
  );
};

export const MenDashboard: React.FC<MenDashboardProps> = ({ 
  profile,
  status,
  refreshProfile,
  setIsEditing,
  onOpenSettings,
  onNavigateToStore,
  metrics: externalMetrics
}) => {
  const [absRank, setAbsRank] = useState<number | null>(null);
  const [cityRank, setCityRank] = useState<number | null>(null);
  const [_totalMen, _setTotalMen] = useState<number>(0);
  const [isBumping, setIsBumping] = useState(false);
  const [gazeProfiles, setGazeProfiles] = useState<any[]>([]);
  const [activeGazeIndex, setActiveGazeIndex] = useState(0);

  // ─── MAT-BLOOM VARIANTS ───
  const bloomVariants = {
    initial: { scale: 0.95, opacity: 0, filter: 'blur(20px)' },
    animate: { scale: 1, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const calculateIntegrity = () => {
     let score = 0;
     if (profile.full_name) score += 10;
     if (profile.bio && profile.bio.length > 50) score += 20;
     if (profile.city) score += 10;
     if (profile.is_verified) score += 30;
     if ((profile.photos?.length || 0) > 0) score += 20;
     if (profile.occupation) score += 10;
     return Math.min(100, score);
  };

  const fetchGaze = useCallback(async () => {
    try {
      const result = await turso.execute(`
        SELECT full_name, photos, city, date_of_birth 
        FROM profiles 
        WHERE role = 'woman'
        AND photos IS NOT NULL
        AND photos != '[]'
        ORDER BY RANDOM()
        LIMIT 200
      `, []);

      const mapped = result.rows.map((r, i) => {
        const age = r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth as string).getFullYear() : 25;
        let photo = '';
        if (typeof r.photos === 'string' && r.photos.startsWith('[')) {
          try {
            const parsed = JSON.parse(r.photos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              photo = parsed[0];
            }
          } catch(e) {}
        }

        return {
          image: photo,
          text: (r.full_name || 'Sanctuary Identity').toString().split(' ')[0],
          subText: `${age} • ${r.city || 'Undisclosed'}`,
          originalName: r.full_name || 'Sanctuary Identity',
          age,
          city: r.city
        };
      });

      // Only show profiles that actually have a valid photo URL
      const withImages = mapped.filter(p => p.image && p.image.startsWith('http'));
      setGazeProfiles(withImages);
    } catch (err) {
      console.error("Gaze sync failed:", err);
    }
  }, []);

  const fetchRank = useCallback(async () => {
    if (!profile?.user_id) return;
    try {
      const totalResult = await turso.execute("SELECT COUNT(*) as total FROM profiles WHERE role = 'man'", []);
      _setTotalMen(Number(totalResult.rows[0].total) || 1);
      setAbsRank(profile.absolute_rank || 0);

      if (profile.city) {
        const cityResult = await turso.execute(`
          SELECT COUNT(*) + 1 as rank 
          FROM profiles 
          WHERE role = 'man' 
          AND city = ? 
          AND absolute_rank > ?
        `, [profile.city, profile.absolute_rank || 0]);
        setCityRank(Number(cityResult.rows[0].rank) || 1);
      }
    } catch (err) {
      console.error("Rank ritual failure:", err);
    }
  }, [profile]);

  useEffect(() => {
    fetchGaze();
    fetchRank();
  }, [fetchGaze, fetchRank]);

  /**
   * 📉 Dossier Calibration Protocol:
   * Syncs profile integrity to the backend to award rank points.
   */
  const handleSyncIntegrity = async () => {
    setIsBumping(true);
    try {
      const integrity = calculateIntegrity();
      await SanctuaryService.syncIntegrityBonus(profile.user_id, integrity);
      await refreshProfile();
      await fetchRank();
    } catch (err) {
      console.error("Integrity Calibration Failure:", err);
    } finally {
      setIsBumping(false);
    }
  };

  const handleBumpRank = async (percent: number) => {
    const cost = percent * 10; // 1% = 10 Tokens (e.g. 10% = 100 Tokens)
    if ((profile?.tokens || 0) < cost) return;
    setIsBumping(true);
    try {
      // 1. Deduct Tokens
      await turso.execute(
        "UPDATE profiles SET tokens = tokens - ?, updated_at = ? WHERE user_id = ?",
        [cost, new Date().toISOString(), profile.user_id]
      );
      
      // 2. Perform the Jump
      await SanctuaryService.purchaseJump(profile.user_id, percent);
      
      // 3. Final Re-ranking to ensure exclusivity
      await SanctuaryService.recalculateGlobalRanks();
      
      await refreshProfile();
      await fetchRank();
    } catch (err) {
      console.error("Bump error:", err);
    } finally {
      setIsBumping(false);
    }
  };

  // 👑 Sanctuary Designated Tier: Based on official population brackets
  const currentLevel = SanctuaryService.getTierFromRank(absRank || profile.absolute_rank || 9999, _totalMen || 1);

  // ─── LUXURY REVEAL ORCHESTRATION ───
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll({
    container: scrollContainerRef
  });
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Butter-Smooth Scroll Intertia
  const smoothScrollY = useSpring(scrollY, { 
    stiffness: 70, 
    damping: 35, 
    mass: 1.2,
    restDelta: 0.001 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30
  });

  // 2. ADAPTIVE CROSS-REVEAL LOGIC (Evenly parallaxed over 5 folds)
  // Fold 1-2 Focus: Pool -> Starts fading at Fold 3 (0.4)
  const bgAOpacity = useTransform(smoothProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const bgAScale = useTransform(smoothProgress, [0, 1], [1.02, 1.8]);
  
  // Fold 4-5 Focus: Rose -> Starts appearing at Fold 3 (0.4), full by Fold 4 (0.6)
  const bgBOpacity = useTransform(smoothProgress, [0.3, 0.6, 1], [0, 1, 1]);
  const bgBScale = useTransform(smoothProgress, [0.4, 1], [0.8, 1.0]);

  // Shared Dramatic Tilt & Lens Sequence: Total crystalline clarity at Fold 5 (1.0)
  const bgRotateX = useTransform(smoothProgress, [0, 1], [0, 15]);
  const bgLensFilter = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [
    `blur(0px) brightness(1) saturate(1.1)`,
    `blur(12px) brightness(0.6) saturate(0.8)`,
    `blur(8px) brightness(0.9) saturate(0.95)`,
    `blur(0px) brightness(1) saturate(1.1)`
  ]);

  // 1. Mask-Reveal Heading Variants
  const maskReveal = {
    initial: { y: "100%", opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 2.2, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.8
      } 
    }
  };

  // 2. Staggered Bento Variants
  const containerStagger = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 1.2
      }
    }
  };

  const cardSpring = {
    initial: { y: 60, opacity: 0, filter: 'blur(10px)' },
    animate: { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15,
        mass: 1.2
      } 
    }
  };

  // 3. Immersive Hero Aperture (Scale-In + Breathe) - Screen Width Initial (1.0x)
  const bloomHero = {
    initial: { 
      scale: 1, 
      opacity: 0, 
      filter: 'blur(30px)',
      clipPath: 'circle(0% at 50% 50%)'
    },
    animate: { 
      scale: 1,
      opacity: 0.9, 
      filter: 'blur(0px)', 
      clipPath: 'circle(100% at 50% 50%)',
      transition: { 
        duration: 2.5, 
        ease: [0.16, 1, 0.3, 1],
        clipPath: { duration: 1.8, ease: "circOut" }
      } 
    }
  };

  // 4. Hover-Parallax Logic (Hardware Accelerated)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 });

  function handleParallax(event: React.MouseEvent | React.TouchEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    x.set(clientX - centerX);
    y.set(centerY - centerY);
  }

  function resetParallax() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div 
      ref={scrollContainerRef}
      initial="initial"
      animate="animate"
      className="relative isolate min-h-screen bg-mat-obsidian snap-y snap-mandatory overflow-y-auto overflow-x-hidden h-screen"
    >

      {/* ─── IMMERSIVE DUAL-FOLD BACKGROUND ─── */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
        
        {/* FOLD 1: THE SURREAL POOL (Screen Width Start) */}
        <motion.div
           style={{ 
             scale: bgAScale, 
             opacity: bgAOpacity,
             rotateX: bgRotateX,
             filter: bgLensFilter,
             transformGpu: "true", 
             willChange: "transform, opacity, filter",
             transformStyle: "preserve-3d" 
           }}
           variants={bloomHero}
           className="absolute inset-0"
        >
          <img 
            src="https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776086316/sanctuary_surreal_v1.jpg"
            alt=""
            className="w-full h-full object-cover grayscale-[0.05] brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(5,5,5,0.7)_60%,rgba(5,5,5,0.95)_100%)]" />
        </motion.div>

        {/* FOLD 2: THE ROSE SANCTUARY (Manifest on Scroll) */}
        <motion.div
           style={{ 
             scale: bgBScale, 
             opacity: bgBOpacity,
             rotateX: bgRotateX,
             filter: bgLensFilter,
             transformGpu: "true", 
             willChange: "transform, opacity, filter",
             transformStyle: "preserve-3d" 
           }}
           className="absolute inset-0"
        >
          <img 
            src="https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776087223/sanctuary_rose_v1.jpg"
            alt=""
            className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(5,5,5,0.7)_60%,rgba(5,5,5,0.95)_100%)]" />
        </motion.div>

        {/* Obsidian Floor Melt (Universal) */}
        <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10 w-full">
        
        {/* ─── FOLD ONE/TWO: HEROIC SOVEREIGNTY ─── */}
        {isMobile ? (
          <>
            {/* Mobile Fold 1: The Trump Card */}
            <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col pt-12 snap-start relative">
              <header className="overflow-hidden mb-6">
                <motion.h1 
                  variants={maskReveal}
                  className="mat-text-fluid-huge text-white/90 text-center px-4"
                >
                  Standing & Identity Resonance
                </motion.h1>
                <motion.p
                  variants={maskReveal}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold/60 text-center mt-2"
                >
                  Matriarch Selection Protocol // Standing Verified
                </motion.p>
              </header>
              <div className="flex-1 flex flex-col justify-center items-center px-4">
                 <motion.div 
                    variants={cardSpring}
                    className="w-full flex justify-center scale-90"
                 >
                    <TrumpCard 
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
                        rank_tier: currentLevel.id
                      }}
                    />
                 </motion.div>
              </div>
            </section>

            {/* Mobile Fold 2: Infinite Gaze */}
            <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col snap-start relative pointer-events-none">
                <div className="flex-1 relative overflow-hidden bg-mat-ivory/5">
                   <div className="absolute inset-0 scale-125">
                      {gazeProfiles.length > 0 && (
                        <CircularGallery 
                          items={gazeProfiles}
                          bend={0}
                          scrollSpeed={0.5}
                          autoScroll={true}
                          autoScrollSpeed={0.05}
                          onCenterUpdate={setActiveGazeIndex}
                        />
                      )}
                   </div>
                   <div className="absolute inset-x-0 bottom-12 flex justify-center z-[100]">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={activeGazeIndex}
                          initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                          exit={{ y: -10, opacity: 0 }}
                          className="mat-glass-deep px-8 py-4 rounded-[2rem] border-mat-gold/30 flex flex-col items-center gap-0.5"
                        >
                          <span className="text-2xl font-bold text-mat-wine italic tracking-tighter uppercase leading-none">
                            {(gazeProfiles[activeGazeIndex]?.originalName || 'Sanctuary')?.toString().split(' ')[0]}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-mat-gold">
                            {gazeProfiles[activeGazeIndex]?.age || 25} • {gazeProfiles[activeGazeIndex]?.city || 'Undisclosed'}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-mat-obsidian to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-mat-obsidian to-transparent pointer-events-none" />
                </div>
            </section>
          </>
        ) : (
          <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col pt-16 md:pt-40 snap-start relative">
            <header className="overflow-hidden mb-8 md:mb-16">
              <motion.h1 
                variants={maskReveal}
                className="mat-text-fluid-huge text-white/90 text-center"
              >
                Identity Resonance
              </motion.h1>
              <motion.p 
                variants={maskReveal}
                className="text-[11px] font-black uppercase tracking-[1em] text-mat-gold/40 text-center mt-4"
              >
                Standing Protocol // Sanctuary Admission
              </motion.p>
            </header>
            
            <motion.div 
              variants={containerStagger}
              className="flex-1 flex flex-col xl:flex-row gap-6 md:gap-16 items-center overflow-hidden"
            >
              <motion.div 
                variants={cardSpring}
                className="w-full xl:w-[45%] flex flex-col justify-center items-center scale-[0.85] md:scale-100"
              >
                 <motion.div 
                    onMouseMove={handleParallax}
                    onMouseLeave={resetParallax}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformGpu: "true" }}
                    className="w-full max-w-[420px] md:max-w-[500px] relative group cursor-crosshair"
                 >
                    <div className="absolute -inset-24 bg-mat-gold/10 rounded-[4rem] blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <TrumpCard 
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
                        rank_tier: currentLevel.id
                      }}
                    />
                 </motion.div>
              </motion.div>

              <motion.div 
                variants={cardSpring}
                className="w-full xl:w-[55%] relative rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-mat-gold/10 bg-mat-ivory/5 mat-glass shadow-inner pointer-events-none select-none h-[40vh] md:h-full flex-1"
              >
                  <div className="absolute inset-x-0 top-0 h-24 md:h-48 z-10 pointer-events-none bg-gradient-to-b from-mat-obsidian via-mat-obsidian/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-24 md:h-48 z-10 pointer-events-none bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent" />
                  
                  {gazeProfiles.length > 0 && (
                    <div className="relative w-full h-full scale-110">
                      <CircularGallery 
                        items={gazeProfiles}
                        bend={0}
                        scrollSpeed={0.5}
                        autoScroll={true}
                        autoScrollSpeed={0.05}
                        onCenterUpdate={setActiveGazeIndex}
                      />
                      
                      <div className="absolute inset-x-0 bottom-24 flex justify-center z-[100]">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={activeGazeIndex}
                            initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: -10, opacity: 0 }}
                            className="mat-glass-deep px-12 py-6 rounded-[2.5rem] border-mat-gold/30 flex flex-col items-center gap-1"
                          >
                            <span className="text-3xl font-bold text-mat-wine italic tracking-tighter uppercase leading-none">
                              {(gazeProfiles[activeGazeIndex]?.originalName || 'Sanctuary')?.toString().split(' ')[0]}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-mat-gold opacity-100">
                              {gazeProfiles[activeGazeIndex]?.age || 25} • {gazeProfiles[activeGazeIndex]?.city || 'Undisclosed'}
                            </span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
              </motion.div>
            </motion.div>
          </section>
        )}
      
        {/* ─── FOLD THREE/FOUR/FIVE: THE LOGIC OF STANDING ─── */}
        {isMobile ? (
          <>
            {/* Mobile Fold 3: Integrity Dial */}
            <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-center px-4 snap-start relative">
               <motion.div 
                 variants={cardSpring}
                 className="mat-glass-deep p-6 rounded-[2.5rem] border border-mat-rose/10 flex flex-col"
               >
                  <div className="flex justify-between items-center mb-6">
                     <div className="space-y-1">
                        <h3 className="mat-text-fluid-huge text-mat-wine">Integrity Dial.</h3>
                        <p className="text-[10px] uppercase tracking-widest text-mat-slate/40">Calibration Metrics</p>
                     </div>
                     <Activity className="text-mat-rose/30 w-6 h-6" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                       { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                       { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                       { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                       { label: 'Activity', val: 85, icon: TrendingUp }
                     ].map((m, i) => (
                       <div key={i} className="space-y-2 p-3 bg-mat-ivory/40 rounded-[1.5rem] border border-mat-rose/5 shadow-sm">
                          <div className="flex justify-between items-center">
                             <m.icon size={10} className="text-mat-rose" />
                             <span className="text-sm font-bold text-mat-wine italic">{m.val}%</span>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[7px] font-black uppercase tracking-widest text-mat-slate/40">{m.label}</p>
                             <div className="h-0.5 bg-mat-rose/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-mat-wine/40" />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setIsEditing?.(true)} className="flex-1 py-3 border border-mat-wine/30 text-mat-wine rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit dossier</button>
                    <button onClick={handleSyncIntegrity} className="flex-1 py-3 bg-mat-wine text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Sync</button>
                  </div>
               </motion.div>
            </section>

            {/* Mobile Fold 4: Rank Ritual */}
            <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-center px-4 snap-start relative">
               <motion.div 
                 variants={cardSpring}
                 className="mat-glass-deep p-8 rounded-[2.5rem] bg-mat-obsidian text-mat-cream overflow-hidden relative"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/30 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-6">
                     <div className="space-y-1">
                        <h4 className="mat-text-fluid-huge text-mat-cream italic">Augment Aura.</h4>
                        <p className="text-mat-cream/40 text-[9px] font-bold uppercase tracking-widest">Ascend the sanctuary ladder.</p>
                     </div>
                     <div className="py-4">
                        <p className="text-[10px] text-mat-cream/40 uppercase tracking-widest">Tokens</p>
                        <p className="text-5xl font-black text-mat-gold italic tracking-tighter">₹{profile.tokens || 0}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => handleBumpRank(10)}
                         disabled={isBumping || (profile?.tokens || 0) < 100}
                         className="flex-1 py-4 bg-mat-gold text-mat-wine rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-mat-gold-glow flex flex-col items-center gap-1"
                       >
                          <span>Leap 10%</span>
                          <span className="opacity-60 text-[7px]">100 Tokens</span>
                       </button>
                       <button 
                         onClick={() => handleBumpRank(25)}
                         disabled={isBumping || (profile?.tokens || 0) < 250}
                         className="flex-1 py-4 bg-mat-wine text-white rounded-xl font-bold uppercase tracking-widest text-[9px] border border-mat-gold/30 flex flex-col items-center gap-1"
                       >
                          <span>Surge 25%</span>
                          <span className="opacity-60 text-[7px]">250 Tokens</span>
                       </button>
                     </div>
                  </div>
               </motion.div>
            </section>

            {/* Mobile Fold 5: Identity Summary */}
            <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-center px-4 snap-start relative">
               <motion.div 
                 variants={cardSpring}
                 className="mat-glass-deep p-8 rounded-[2.5rem] bg-mat-ivory/40 border border-mat-gold/10"
               >
                  <div className="flex flex-col gap-6">
                     <div className="w-12 h-12 rounded-xl bg-mat-wine/5 flex items-center justify-center border border-mat-wine/10">
                        <Crown className="text-mat-wine w-6 h-6" />
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] text-mat-slate/40 uppercase tracking-widest">Aura Rank</span>
                        <p className="text-3xl font-bold italic text-mat-wine">{currentLevel.name}</p>
                     </div>
                     <Badge className="w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-mat-wine text-white">
                        {profile.is_verified ? 'Sovereign Verified' : 'Awaiting Audit'}
                     </Badge>
                     <div className="pt-6 border-t border-mat-rose/5">
                        <p className="text-[9px] text-mat-slate/40 uppercase tracking-tighter italic">Absolute Standing: <span className="text-mat-wine font-bold">#{absRank || profile.absolute_rank || '---'}</span> of {_totalMen}</p>
                     </div>
                  </div>
               </motion.div>
            </section>
          </>
        ) : (
          <section className="h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-center py-6 md:py-12 snap-start">
              <motion.div 
                variants={containerStagger}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 min-h-[60vh]"
              >
                {/* Bento Cell 1: Aura Calibration & Gaze Index */}
                <motion.div 
                  variants={cardSpring}
                  className="md:col-span-1 lg:col-span-1 mat-glass-deep p-8 rounded-[3.5rem] border border-mat-gold/10 flex flex-col items-center justify-between text-center relative overflow-hidden group"
                >
                   <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-mat-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="space-y-6 w-full">
                      <div className="flex flex-col items-center">
                         <AuraMeter integrity={calculateIntegrity()} />
                         <p className="mat-text-editorial-caps text-[8px] mt-4">Profile Resonance</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-mat-gold/5">
                         <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                            <Eye className="w-3 h-3 text-mat-gold/60 mb-2" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-mat-gold/40">Gaze Index</span>
                            <div className="relative mt-1">
                               <span className={cn("text-lg font-black italic", (absRank || 100) > 50 ? "blur-[4px] opacity-40" : "text-white")}>
                                 +{externalMetrics?.visit || 0}
                               </span>
                               {(absRank || 100) > 50 && (
                                 <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-mat-gold/60 tracking-tighter">Decryption Reqd</span>
                               )}
                            </div>
                         </div>
                         <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                            <Compass className="w-3 h-3 text-mat-rose/60 mb-2" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-mat-rose/40">Local League</span>
                            <span className="text-lg font-black italic text-white mt-1">#{cityRank || '--'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="w-full pt-6">
                      <p className="text-[9px] uppercase font-black tracking-[0.2em] text-mat-gold/40">Sector Standing: {profile.city || 'Undisclosed'}</p>
                   </div>
                </motion.div>

                {/* Bento Cell 2: Integrity Dial & Calibration */}
                <motion.div 
                  variants={cardSpring}
                  className="md:col-span-2 lg:col-span-2 mat-glass-deep p-8 md:p-14 rounded-[3.5rem] border border-mat-rose/10 flex flex-col justify-between group hover:border-mat-rose/30 transition-all duration-700"
                >
                   <div className="space-y-8">
                      <div className="flex justify-between items-center">
                         <div className="space-y-2">
                            <h3 className="mat-text-fluid-huge text-4xl text-mat-wine leading-none">Integrity Dial.</h3>
                            <p className="mat-text-label-pro opacity-40">Profile calibration metrics</p>
                         </div>
                         <Activity className="text-mat-rose/30 w-10 h-10 group-hover:rotate-12 transition-transform" />
                      </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                       {[
                         { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                         { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                         { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                         { label: 'Activity', val: 85, icon: TrendingUp }
                       ].map((m, i) => (
                         <div key={i} className="space-y-2 md:space-y-4 p-3 md:p-5 bg-mat-ivory/40 rounded-[1.5rem] md:rounded-[2rem] border border-mat-rose/5 group/stat hover:bg-white transition-all shadow-sm">
                            <div className="flex justify-between items-center">
                               <m.icon size={12} className="text-mat-rose group-hover/stat:scale-110 transition-transform" />
                               <span className="text-sm md:text-lg font-bold text-mat-wine italic">{m.val}%</span>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-mat-slate/40">{m.label}</p>
                               <div className="h-0.5 md:h-1 bg-mat-rose/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-mat-wine/40" />
                               </div>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
                 <div className="flex gap-3 mt-6 md:mt-8">
                   <button 
                     onClick={() => setIsEditing?.(true)}
                     className="flex-1 py-3 md:py-5 border border-mat-wine/30 text-mat-wine rounded-xl md:rounded-2xl mat-text-label-pro flex items-center justify-center gap-2 hover:bg-mat-wine/5 transition-all text-[10px] md:text-[11px] font-bold"
                   >
                      Edit Dossier <Camera size={12} />
                   </button>
                   <button 
                     onClick={handleSyncIntegrity}
                     disabled={isBumping}
                     className="flex-1 py-3 md:py-5 bg-mat-wine text-white rounded-xl md:rounded-2xl mat-text-label-pro flex items-center justify-center gap-2 hover:bg-mat-wine-soft transition-all shadow-mat-premium disabled:opacity-50 text-[10px] md:text-[11px] font-bold"
                   >
                      {isBumping ? "Syncing..." : "Recalibrate"} <ArrowUpRight size={12} />
                   </button>
                 </div>
              </motion.div>

              {/* Bento Cell 2: Rank Ritual */}
              <motion.div 
                variants={cardSpring}
                className="md:col-span-1 lg:col-span-1 mat-glass-deep p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-mat-obsidian text-mat-cream overflow-hidden relative group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/30 via-transparent to-transparent pointer-events-none" />
                 <div className="relative z-10 space-y-4 md:space-y-8 flex flex-col justify-between h-full">
                    <div className="space-y-1 md:space-y-2">
                       <h4 className="text-xl md:text-3xl font-bold italic leading-none">Augment <br />Aura.</h4>
                       <p className="text-mat-cream/40 text-[7px] md:text-[9px] font-bold uppercase tracking-widest leading-relaxed">Spend tokens to <br />ascend the ladder.</p>
                    </div>
                    
                    <div className="space-y-1 py-2 md:py-6">
                       <p className="mat-text-label-pro text-mat-cream/40 text-[8px] md:text-xs">Tokens</p>
                       <p className="text-3xl md:text-5xl font-black text-mat-gold italic tracking-tighter shadow-mat-gold-glow">₹{profile.tokens || 0}</p>
                    </div>

                    <div className="space-y-2 md:space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleBumpRank(10)}
                          disabled={isBumping || (profile?.tokens || 0) < 100}
                          className="w-full py-3 md:py-4 bg-mat-gold text-mat-wine rounded-xl md:rounded-2xl mat-text-label-pro flex flex-col items-center justify-center gap-1 hover:scale-[1.02] active:scale-95 transition-all shadow-mat-gold-glow disabled:opacity-20 text-[9px] md:text-[10px] font-bold"
                        >
                           <span>Leap 10%</span>
                           <span className="opacity-60 text-[7px] md:text-[8px]">100 Tokens</span>
                        </button>
                        <button 
                          onClick={() => handleBumpRank(25)}
                          disabled={isBumping || (profile?.tokens || 0) < 250}
                          className="w-full py-3 md:py-4 bg-mat-wine text-white rounded-xl md:rounded-2xl mat-text-label-pro flex flex-col items-center justify-center gap-1 hover:scale-[1.02] active:scale-95 transition-all border border-mat-gold/30 disabled:opacity-20 text-[9px] md:text-[10px] font-bold"
                        >
                           <span>Surge 25%</span>
                           <span className="opacity-60 text-[7px] md:text-[8px]">250 Tokens</span>
                        </button>
                      </div>
                      
                      {(profile?.tokens || 0) < 100 && onNavigateToStore && (
                        <button
                          onClick={onNavigateToStore}
                          className="w-full py-4 border border-mat-gold/30 text-mat-gold rounded-2xl mat-text-label-pro flex items-center justify-center gap-3 hover:bg-mat-gold/10 transition-all text-[9px] tracking-widest"
                        >
                          <Zap size={12} /> Top Up Aura
                        </button>
                      )}
                    </div>
                 </div>
              </motion.div>

              {/* Bento Cell 3: Identity Summary */}
              <motion.div 
                variants={cardSpring}
                className="md:col-span-3 lg:col-span-1 mat-glass-deep p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-mat-ivory/40 flex flex-col justify-between border border-mat-gold/10"
              >
                 <div className="space-y-4 md:space-y-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-mat-wine/5 flex items-center justify-center border border-mat-wine/10">
                       <Crown className="text-mat-wine w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                       <span className="mat-text-label-pro opacity-40 text-[8px] md:text-xs">Aura Rank</span>
                       <p className={`text-xl md:text-3xl font-bold italic ${currentLevel.color === 'mat-gold-foil' ? 'text-mat-gold shadow-sm' : 'text-mat-wine'}`}>{currentLevel.name}</p>
                    </div>
                    <div className="space-y-2 pt-2 md:pt-4">
                       <span className="mat-text-label-pro color-mat-wine text-[8px] md:text-xs">Verification</span>
                       <Badge className={`w-fit px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest ${profile.is_verified ? 'bg-mat-wine text-white' : 'bg-mat-rose/20 text-mat-rose'}`}>
                          {profile.is_verified ? 'Sovereign Verified' : 'Awaiting Audit'}
                       </Badge>
                    </div>
                 </div>
                 <div className="pt-4 md:pt-8 border-t border-mat-rose/5">
                    <p className="text-[8px] md:text-[10px] text-mat-slate/40 leading-relaxed italic uppercase tracking-tighter">Absolute Standing: <span className="text-mat-wine font-bold">#{absRank || profile.absolute_rank || '---'}</span> of {_totalMen}</p>
                 </div>
              </motion.div>
            </motion.div>
          </section>
        )}
      </div>
    </motion.div>
  );
};
