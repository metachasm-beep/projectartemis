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
  Sparkles
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { turso } from '@/lib/turso';
import { motion, AnimatePresence } from 'framer-motion';
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
  refreshProfile: () => Promise<void>;
  setIsEditing?: (val: boolean) => void;
  onNavigateToStore?: () => void;
  metrics?: { impression: number; visit: number; save: number };
}

export const MenDashboard: React.FC<MenDashboardProps> = ({ 
  profile,
  status,
  refreshProfile,
  setIsEditing,
  onNavigateToStore,
  metrics: externalMetrics
}) => {
  const [absRank, setAbsRank] = useState<number | null>(null);
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

  const handleBumpRank = async () => {
    if ((profile?.tokens || 0) < 49) return;
    setIsBumping(true);
    try {
      await turso.execute(
        "UPDATE profiles SET tokens = tokens - 49, rank_score = rank_score + 500, updated_at = ? WHERE user_id = ?",
        [new Date().toISOString(), profile.user_id]
      );
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

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={bloomVariants}
      className="space-y-12 pb-40 pt-12 max-w-7xl mx-auto px-6"
    >
      <h1 className="sr-only">Matriarch Dossier: Personal Standing & Identity Resonance</h1>
      
      {/* ─── PHASE HERO: THE SOVEREIGN ANCHOR (TRUMP CARD + GAZE) ─── */}
      <div className="flex flex-col xl:flex-row gap-12 items-stretch min-h-[85vh]">
        {/* Left: Upscaled Hero Trump Card */}
        <div className="w-full xl:w-[45%] flex flex-col justify-center items-center">
           <div className="w-full max-w-[500px] hover:scale-[1.03] transition-all duration-1000 ease-out relative group">
              <div className="absolute -inset-12 bg-mat-gold/10 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
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
           </div>
        </div>

        {/* Right: The Gaze Infinite Scroll (Ambient Fold) */}
        <div className="w-full xl:w-[55%] relative rounded-[5rem] overflow-hidden border border-mat-gold/10 bg-mat-ivory/5 shadow-inner pointer-events-none group/gallery select-none">
            <div className="absolute inset-x-0 top-0 h-48 z-10 pointer-events-none bg-gradient-to-b from-mat-obsidian via-mat-obsidian/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent" />
            


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
        </div>
      </div>

      {/* ─── MAGIC BENTO: STANDING & CALIBRATION ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
        {/* Bento Cell 1: Personal Standing */}
        <div className="md:col-span-2 lg:col-span-2 mat-glass-deep p-12 rounded-[3.5rem] border border-mat-rose/10 flex flex-col justify-between group hover:border-mat-rose/30 transition-all duration-700">
           <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold italic text-mat-wine">Integrity Dial.</h3>
                    <p className="mat-text-label-pro">Profile calibration metrics</p>
                 </div>
                 <Activity className="text-mat-rose/40 w-8 h-8 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 {[
                   { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                   { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                   { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                   { label: 'Activity', val: 85, icon: TrendingUp }
                 ].map((m, i) => (
                   <div key={i} className="space-y-4 p-5 bg-mat-ivory/40 rounded-[2rem] border border-mat-rose/5 group/stat hover:bg-white transition-all shadow-sm">
                      <div className="flex justify-between items-center">
                         <m.icon size={14} className="text-mat-rose group-hover/stat:scale-110 transition-transform" />
                         <span className="text-lg font-bold text-mat-wine italic">{m.val}%</span>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-mat-slate/40">{m.label}</p>
                         <div className="h-1 bg-mat-rose/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-mat-wine/40" />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="flex gap-4 mt-8">
             <button 
               onClick={() => setIsEditing?.(true)}
               className="flex-1 py-5 border border-mat-wine/30 text-mat-wine rounded-2xl mat-text-label-pro flex items-center justify-center gap-4 hover:bg-mat-wine/5 transition-all"
             >
                Edit Dossier <Camera size={14} />
             </button>
             <button 
               onClick={handleSyncIntegrity}
               disabled={isBumping}
               className="flex-1 py-5 bg-mat-wine text-white rounded-2xl mat-text-label-pro flex items-center justify-center gap-4 hover:bg-mat-wine-soft transition-all shadow-mat-premium disabled:opacity-50"
             >
                {isBumping ? "Syncing..." : "Recalibrate"} <ArrowUpRight size={14} />
             </button>
           </div>
        </div>

        {/* Bento Cell 2: Rank Ritual */}
        <div className="md:col-span-1 lg:col-span-1 mat-glass-deep p-12 rounded-[3.5rem] bg-mat-obsidian text-mat-cream overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/30 via-transparent to-transparent pointer-events-none" />
           <div className="relative z-10 space-y-8 flex flex-col justify-between h-full">
              <div className="space-y-2">
                 <h4 className="text-3xl font-bold italic leading-none">Augment <br />Aura.</h4>
                 <p className="text-mat-cream/40 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Spend tokens to <br />ascend the ladder.</p>
              </div>
              
              <div className="space-y-1 py-6">
                 <p className="mat-text-label-pro text-mat-cream/40">Tokens</p>
                 <p className="text-5xl font-black text-mat-gold italic tracking-tighter shadow-mat-gold-glow">₹{profile.tokens || 0}</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleBumpRank}
                  disabled={isBumping || (profile?.tokens || 0) < 49}
                  className="w-full py-6 bg-mat-gold text-mat-wine rounded-2xl mat-text-label-pro flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-mat-gold-glow disabled:opacity-20"
                >
                   {isBumping ? "Syncing..." : "Augment"} <Sparkles size={14} className="fill-current" />
                </button>
                {(profile?.tokens || 0) < 49 && onNavigateToStore && (
                  <button
                    onClick={onNavigateToStore}
                    className="w-full py-4 border border-mat-gold/30 text-mat-gold rounded-2xl mat-text-label-pro flex items-center justify-center gap-3 hover:bg-mat-gold/10 transition-all text-[9px] tracking-widest"
                  >
                    <Zap size={12} /> Top Up Aura
                  </button>
                )}
              </div>
           </div>
        </div>

        {/* Bento Cell 3: Identity Summary */}
        <div className="md:col-span-3 lg:col-span-1 mat-glass-deep p-10 rounded-[3.5rem] bg-mat-ivory/40 flex flex-col justify-between border border-mat-gold/10">
           <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-mat-wine/5 flex items-center justify-center border border-mat-wine/10">
                 <Crown className="text-mat-wine w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <span className="mat-text-label-pro opacity-40">Aura Rank</span>
                 <p className={`text-3xl font-bold italic ${currentLevel.color === 'mat-gold-foil' ? 'text-mat-gold shadow-sm' : 'text-mat-wine'}`}>{currentLevel.name}</p>
              </div>
              <div className="space-y-2 pt-4">
                 <span className="mat-text-label-pro color-mat-wine">Verification</span>
                 <Badge className={`w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${profile.is_verified ? 'bg-mat-wine text-white' : 'bg-mat-rose/20 text-mat-rose'}`}>
                    {profile.is_verified ? 'Sovereign Verified' : 'Awaiting Audit'}
                 </Badge>
              </div>
           </div>
           <div className="pt-8 border-t border-mat-rose/5">
              <p className="text-[10px] text-mat-slate/40 leading-relaxed italic">Absolute Standing: <span className="text-mat-wine font-bold">#{absRank || profile.absolute_rank || '---'}</span> of {_totalMen}</p>
           </div>
        </div>
      </div>

      <div className="py-32 text-center">
         <p className="text-[12px] font-black uppercase tracking-[1.5em] opacity-10 select-none text-mat-wine pointer-events-none">
            Matriarch // Standing Is Power
         </p>
      </div>
    </motion.div>
  );
};
