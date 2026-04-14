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
  Settings,
  ArrowRight
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
import { cn } from "@/lib/utils";

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

      const mapped = result.rows.map((r) => {
        const age = r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth as string).getFullYear() : 25;
        let photo = '';
        if (typeof r.photos === 'string' && r.photos.startsWith('[')) {
          try {
            const parsed = JSON.parse(r.photos);
            if (Array.isArray(parsed) && parsed.length > 0) photo = parsed[0];
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
      setGazeProfiles(mapped.filter(p => p.image && p.image.startsWith('http')));
    } catch (err) { console.error("Gaze sync failed:", err); }
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
    } catch (err) { console.error("Rank ritual failure:", err); }
  }, [profile]);

  useEffect(() => {
    fetchGaze();
    fetchRank();
  }, [fetchGaze, fetchRank]);

  const handleSyncIntegrity = async () => {
    setIsBumping(true);
    try {
      const integrity = calculateIntegrity();
      await SanctuaryService.syncIntegrityBonus(profile.user_id, integrity);
      await refreshProfile();
      await fetchRank();
    } catch (err) { console.error("Integrity Calibration Failure:", err); }
    finally { setIsBumping(false); }
  };

  const handleBumpRank = async (percent: number) => {
    const cost = percent * 10;
    if ((profile?.tokens || 0) < cost) return;
    setIsBumping(true);
    try {
      await turso.execute("UPDATE profiles SET tokens = tokens - ? WHERE user_id = ?", [cost, profile.user_id]);
      await SanctuaryService.purchaseJump(profile.user_id, percent);
      await SanctuaryService.recalculateGlobalRanks();
      await refreshProfile();
      await fetchRank();
    } catch (err) { console.error("Bump error:", err); }
    finally { setIsBumping(false); }
  };

  const currentLevel = SanctuaryService.getTierFromRank(absRank || profile.absolute_rank || 9999, _totalMen || 1);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgAOpacity = useTransform(smoothProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const bgAScale = useTransform(smoothProgress, [0, 1], [1.02, 1.8]);
  const bgBOpacity = useTransform(smoothProgress, [0.3, 0.6, 1], [0, 1, 1]);
  const bgBScale = useTransform(smoothProgress, [0.4, 1], [0.8, 1.0]);
  
  const bgLensFilter = useTransform(smoothProgress, [0, 1], [
    `blur(0px) brightness(1)`,
    `blur(0px) brightness(1)`
  ]);

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

  function handleParallax(event: any) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    x.set(clientX - (rect.left + rect.width / 2));
    y.set(clientY - (rect.top + rect.height / 2));
  }

  return (
    <motion.div 
      ref={scrollContainerRef}
      initial="initial"
      animate="animate"
      className="relative isolate min-h-screen bg-mat-obsidian snap-y snap-mandatory overflow-y-auto overflow-x-hidden h-screen no-scrollbar"
    >
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <motion.div style={{ scale: bgAScale, opacity: bgAOpacity, filter: bgLensFilter }} className="absolute inset-0">
          <img src="https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776086316/sanctuary_surreal_v1.jpg" className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-obsidian/40 to-mat-obsidian" />
        </motion.div>
        <motion.div style={{ scale: bgBScale, opacity: bgBOpacity, filter: bgLensFilter }} className="absolute inset-0">
          <img src="https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776087223/sanctuary_rose_v1.jpg" className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-obsidian/40 to-mat-obsidian" />
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10 w-full">
        
        {/* ─── FOLD ONE: IDENTITY & GAZE ─── */}
        {isMobile ? (
          <section className="h-[100dvh] min-h-[100dvh] pt-12 snap-start flex flex-col">
            <header className="overflow-hidden mb-4 text-center">
              <motion.h1 variants={maskReveal} className="mat-text-fluid-huge text-white/90">Identity Resonance</motion.h1>
              <motion.p variants={maskReveal} className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold/60 mt-1">Standing Protocol // Verified Admission</motion.p>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden">
               <motion.div variants={cardSpring} className="w-full flex justify-center scale-[0.75] -mt-10">
                  <TrumpCard profile={{
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
                  }} />
               </motion.div>

               <div className="flex-1 relative overflow-hidden -mt-12 scale-110">
                  <div className="absolute inset-0 scale-125">
                     {gazeProfiles.length > 0 && <CircularGallery items={gazeProfiles} bend={0} scrollSpeed={0.5} autoScroll autoScrollSpeed={0.05} onCenterUpdate={setActiveGazeIndex} />}
                  </div>
                  <div className="absolute inset-x-0 bottom-8 flex justify-center z-[100]">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeGazeIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="mat-glass-deep px-6 py-2.5 rounded-[1.5rem] border-mat-gold/30 flex flex-col items-center">
                        <span className="text-xl font-bold text-mat-wine italic tracking-tighter uppercase leading-none">{gazeProfiles[activeGazeIndex]?.text}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-mat-gold">{gazeProfiles[activeGazeIndex]?.subText}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
               </div>
            </div>
          </section>
        ) : (
          <section className="h-[100dvh] min-h-[100dvh] pt-32 snap-start flex flex-col">
            <header className="mb-12 text-center">
              <motion.h1 variants={maskReveal} className="mat-text-fluid-huge text-white/90">Identity Resonance</motion.h1>
              <motion.p variants={maskReveal} className="text-[11px] font-black uppercase tracking-[1em] text-mat-gold/40 mt-4">Matriarch Selection protocol</motion.p>
            </header>
            <div className="flex-1 flex flex-col lg:flex-row gap-16 items-center">
              <motion.div variants={cardSpring} className="w-full lg:w-1/2 flex justify-center">
                 <motion.div onMouseMove={handleParallax} onMouseLeave={() => {x.set(0); y.set(0)}} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full max-w-[450px]">
                    <TrumpCard profile={{
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
                    }} />
                 </motion.div>
              </motion.div>
              <motion.div variants={cardSpring} className="w-full lg:w-1/2 h-[60vh] relative rounded-[4rem] overflow-hidden mat-glass border border-white/10">
                 {gazeProfiles.length > 0 && <CircularGallery items={gazeProfiles} bend={0} scrollSpeed={0.5} autoScroll autoScrollSpeed={0.05} onCenterUpdate={setActiveGazeIndex} />}
                 <div className="absolute inset-x-0 bottom-12 flex justify-center">
                    <AnimatePresence mode="wait">
                       <motion.div key={activeGazeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mat-glass-deep px-10 py-5 rounded-[2.5rem] border-mat-gold/30 flex flex-col items-center">
                          <span className="text-3xl font-bold text-mat-wine italic tracking-tighter uppercase">{gazeProfiles[activeGazeIndex]?.originalName.split(' ')[0]}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">{gazeProfiles[activeGazeIndex]?.subText}</span>
                       </motion.div>
                    </AnimatePresence>
                 </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ─── FOLD TWO: SANCTUARY INTELLIGENCE ─── */}
        {isMobile ? (
          <section className="h-[100dvh] min-h-[100dvh] px-4 snap-start flex flex-col justify-center">
             <motion.div variants={cardSpring} className="mat-glass-deep p-6 rounded-[2.5rem] border border-mat-rose/10 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="flex flex-col items-center mb-6">
                   <AuraMeter integrity={calculateIntegrity()} />
                   <div className="text-center mt-3">
                      <p className="text-2xl font-bold italic text-mat-wine leading-none">{currentLevel.name}</p>
                      <p className="text-[8px] uppercase tracking-widest text-mat-slate/40 mt-1">Sanctuary Standing Rank</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="bg-mat-ivory/40 p-3 rounded-2xl border border-mat-gold/5 flex flex-col items-center">
                      <span className="text-[7px] font-black uppercase text-mat-gold/40">Gaze Index</span>
                      <span className={cn("text-xl font-black italic", (absRank || 100) > 50 ? "blur-[3px] opacity-40" : "text-mat-wine")}>+{externalMetrics?.visit || 0}</span>
                   </div>
                   <div className="bg-mat-ivory/40 p-3 rounded-2xl border border-mat-gold/5 flex flex-col items-center">
                      <span className="text-[7px] font-black uppercase text-mat-gold/40">Local League</span>
                      <span className="text-xl font-black italic text-mat-wine">#{cityRank || '--'}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-6 border-b border-mat-gold/10">
                   {[
                     { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                     { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                     { label: 'Verify', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                     { label: 'Activity', val: 85, icon: TrendingUp }
                   ].map((m, i) => (
                     <div key={i} className="p-2 bg-white/40 rounded-xl border border-mat-rose/5">
                        <div className="flex justify-between items-center text-[7px] font-bold uppercase text-mat-wine/40">
                           <span>{m.label}</span>
                           <span>{m.val}%</span>
                        </div>
                        <div className="h-0.5 bg-mat-rose/5 rounded-full mt-1"><motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-mat-wine/40" /></div>
                     </div>
                   ))}
                </div>

                <div className="pt-6 space-y-4">
                   <div className="flex gap-2">
                      <button onClick={() => setIsEditing?.(true)} className="flex-1 py-3.5 border border-mat-wine/30 text-mat-wine rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit Dossier</button>
                      <button onClick={handleSyncIntegrity} className="flex-1 py-3.5 bg-mat-wine text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Sync Status</button>
                   </div>
                   <p className="text-[8px] text-center text-mat-slate/40 uppercase tracking-tighter italic">Absolute Standing: <span className="text-mat-wine font-bold">#{absRank || '--'}</span> of {_totalMen}</p>
                </div>
             </motion.div>
          </section>
        ) : (
          <section className="h-[100dvh] min-h-[100dvh] py-20 snap-start flex flex-col justify-center">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={cardSpring} className="mat-glass-deep p-10 rounded-[3.5rem] border border-mat-gold/10 flex flex-col items-center justify-between text-center">
                   <div className="w-full">
                      <AuraMeter integrity={calculateIntegrity()} />
                      <div className="mt-8 space-y-2">
                        <p className="text-4xl font-black italic text-mat-wine">{currentLevel.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-mat-slate/40">Sanctuary Standing</p>
                      </div>
                   </div>
                   <div className="w-full pt-10 border-t border-mat-gold/10 grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[9px] uppercase font-black text-mat-gold/40">Gaze Index</p>
                         <p className={cn("text-2xl font-black italic", (absRank || 100) > 50 ? "blur-[4px] opacity-40" : "text-mat-wine")}>+{externalMetrics?.visit || 0}</p>
                      </div>
                      <div>
                         <p className="text-[9px] uppercase font-black text-mat-gold/40">City Rank</p>
                         <p className="text-2xl font-black italic text-mat-wine">#{cityRank || '--'}</p>
                      </div>
                   </div>
                </motion.div>

                <motion.div variants={cardSpring} className="col-span-1 md:col-span-2 mat-glass-deep p-12 rounded-[3.5rem] border border-mat-rose/10 flex flex-col justify-between">
                   <div className="space-y-10">
                      <div className="flex justify-between items-center">
                         <div>
                            <h3 className="mat-text-fluid-huge text-mat-wine">Integrity Dial.</h3>
                            <p className="text-[12px] uppercase tracking-widest text-mat-slate/40 mt-2">Core Calibration Metrics</p>
                         </div>
                         <Activity className="text-mat-rose/20 w-12 h-12" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         {[
                           { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                           { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                           { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                           { label: 'Activity', val: 85, icon: TrendingUp }
                         ].map((m, i) => (
                           <div key={i} className="p-6 bg-mat-ivory/30 rounded-[2rem] border border-mat-rose/5 group hover:bg-white transition-all">
                              <div className="flex justify-between items-center mb-4">
                                 <m.icon size={16} className="text-mat-rose" />
                                 <span className="text-xl font-bold text-mat-wine italic">{m.val}%</span>
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/40">{m.label}</p>
                              <div className="h-1 bg-mat-rose/5 rounded-full mt-2 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-mat-wine" /></div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-4 mt-10">
                      <button onClick={() => setIsEditing?.(true)} className="flex-1 py-5 border border-mat-wine/30 text-mat-wine rounded-2xl font-bold uppercase tracking-widest hover:bg-mat-wine/5 transition-all">Edit dossier</button>
                      <button onClick={handleSyncIntegrity} className="flex-1 py-5 bg-mat-wine text-white rounded-2xl font-bold uppercase tracking-widest shadow-mat-premium hover:opacity-90 transition-all">Recalibrate standing</button>
                   </div>
                </motion.div>
             </div>
          </section>
        )}

      </div>
    </motion.div>
  );
};
