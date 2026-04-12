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

interface MenDashboardProps {
  profile: MatriarchProfile;
  status: any;
  handleLogout?: () => void;
  refreshProfile: () => Promise<void>;
  setIsEditing?: (val: boolean) => void;
  metrics?: { impression: number; visit: number; save: number };
}

const RANK_LADDER = [
  { id: 'aspirant', name: 'Aspirant', min: 0, color: 'mat-slate' },
  { id: 'vanguard', name: 'Vanguard', min: 500, color: 'mat-rose' },
  { id: 'noble', name: 'Noble', min: 1500, color: 'mat-wine' },
  { id: 'paragon', name: 'Paragon', min: 3500, color: 'mat-wine-soft' },
  { id: 'ascendant', name: 'Ascendant', min: 7500, color: 'mat-gold' },
  { id: 'choice', name: 'The Choice', min: 15000, color: 'mat-gold-foil' }
];

export const MenDashboard: React.FC<MenDashboardProps> = ({ 
  profile,
  status,
  refreshProfile,
  setIsEditing,
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
        ORDER BY created_at DESC 
        LIMIT 100
      `, []);

      const mapped = result.rows.map(r => {
        const age = r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth as string).getFullYear() : 25;
        const photos = JSON.parse(r.photos as string)?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.full_name}`;
        return {
          image: photos,
          text: r.full_name?.toString().split(' ')[0] || 'Sanctuary Identity',
          subText: `${age} • ${r.city || 'Undisclosed'}`,
          originalName: r.full_name,
          age,
          city: r.city
        };
      });

      setGazeProfiles(mapped);
    } catch (err) {
      console.error("Gaze sync failed:", err);
    }
  }, []);

  const fetchRank = useCallback(async () => {
    if (!profile?.user_id) return;
    try {
      const totalResult = await turso.execute("SELECT COUNT(*) as total FROM profiles WHERE role = 'man'", []);
      _setTotalMen(Number(totalResult.rows[0].total) || 0);
      setAbsRank(profile.absolute_rank || 0);
    } catch (err) {
      console.error("Rank ritual failure:", err);
    }
  }, [profile]);

  useEffect(() => {
    fetchGaze();
    fetchRank();
  }, [fetchGaze, fetchRank]);

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

  const currentLevel = RANK_LADDER.find(r => r.id === status?.rank_tier?.toLowerCase()) || RANK_LADDER[0];
  const nextLevel = RANK_LADDER[RANK_LADDER.indexOf(currentLevel) + 1] || currentLevel;
  const progressToNext = ((profile?.rank_score || 0) - currentLevel.min) / (nextLevel.min - currentLevel.min) * 100;

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={bloomVariants}
      className="space-y-20 pb-40 pt-12 max-w-7xl mx-auto px-6"
    >
      <h1 className="sr-only">Matriarch Dossier: Personal Standing & Identity Resonance</h1>
      
      {/* ─── PHASE HEADER: IDENTITY IDENTITY STATUS ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-mat-rose/10">
        <div className="space-y-6 max-w-2xl">
           <Badge variant="outline" className="mat-text-label-pro px-6 py-2 border-mat-rose/20 rounded-full">Personal Dossier 0.1</Badge>
           <div className="space-y-2">
              <h2 className="text-7xl md:text-9xl mat-text-display-pro leading-none">Your <br /><span className="text-mat-rose/30">Standing.</span></h2>
              <p className="text-mat-slate/60 text-lg italic pl-2">The Sanctuary Registry tracks every breath of your influence.</p>
           </div>
        </div>

        <div className="flex flex-col gap-px w-full md:w-auto mat-glass-deep rounded-[2.5rem] overflow-hidden">
           <div className="px-12 py-8 bg-mat-ivory/40 flex justify-between items-center gap-16">
              <div className="space-y-1">
                 <span className="mat-text-label-pro opacity-40">Aura Rank</span>
                 <p className="text-2xl font-bold text-mat-wine italic">{currentLevel.name}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-mat-wine/5 flex items-center justify-center border border-mat-wine/10">
                 <Crown className="text-mat-wine w-6 h-6" />
              </div>
           </div>
           <div className="px-12 py-6 bg-mat-wine/5 flex justify-between items-center">
              <span className="mat-text-label-pro color-mat-wine">Verification Path</span>
              <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${profile.is_verified ? 'bg-mat-wine text-white' : 'bg-mat-rose/20 text-mat-rose'}`}>
                 {profile.is_verified ? 'Sovereign Verified' : 'Awaiting Audit'}
              </Badge>
           </div>
        </div>
      </div>

      {!profile?.is_verified && (
        <motion.div 
          whileHover={{ y: -4 }}
          className="mat-glass-deep p-16 rounded-[4rem] border-dashed border-mat-wine/20 shadow-mat-premium"
        >
           <VerificationPrompt userId={profile?.user_id} role="man" onVerified={() => refreshProfile()} />
        </motion.div>
      )}

      {/* SINGULAR HERO ANCHOR: THE TRUMP CARD (UPSCALE) */}
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-[420px] md:max-w-[480px] hover:scale-[1.02] transition-all duration-1000 ease-out cursor-pointer group relative">
            <div className="absolute -inset-8 bg-mat-gold/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <TrumpCard 
              profile={{
                id: profile.user_id,
                user_id: profile.user_id,
                name: profile.full_name,
                age: profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 25,
                city: profile.city || 'Undisclosed',
                img: (profile.photos && profile.photos[0]) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`,
                status: status?.rank_tier || 'Aspirant',
                bio: profile.bio || "Identity narrative not established.",
                height_str: profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "5'10\"",
                vocation: profile.occupation || 'Aspirant',
                tier: status?.rank_tier || 'Aspirant',
                is_verified: profile.is_verified,
                absolute_rank: absRank,
                rank_tier: status?.rank_tier
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-12">
           <div className="mat-glass-deep p-12 rounded-[3.5rem] border border-mat-rose/10 flex flex-col justify-between h-[480px]">
              <div className="space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-bold italic text-mat-wine">Integrity Dial.</h3>
                       <p className="mat-text-label-pro">Profile Calibration Metrics</p>
                    </div>
                    <Activity className="text-mat-rose/40 w-8 h-8" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-4">
                    {[
                      { label: 'Narrative', val: calculateIntegrity(), icon: Sparkles },
                      { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera },
                      { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon },
                      { label: 'Activity', val: 85, icon: TrendingUp }
                    ].map((m, i) => (
                      <div key={i} className="space-y-4 p-6 bg-mat-ivory/40 rounded-3xl border border-mat-rose/5 group hover:bg-white transition-all shadow-sm">
                         <div className="flex justify-between items-center">
                            <m.icon size={16} className="text-mat-rose" />
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

              <button 
                onClick={() => setIsEditing?.(true)}
                className="w-full py-5 bg-mat-wine text-white rounded-2xl mat-text-label-pro flex items-center justify-center gap-4 hover:bg-mat-wine-soft transition-all shadow-mat-premium"
              >
                 Recalibrate Dossier <Camera size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* ─── THE INFINITE GAZE: LIQUID FEED ─── */}
      <div className="space-y-16 py-32 border-y border-mat-gold/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-6">
           <div className="flex items-center gap-10">
              <div className="w-20 h-20 mat-glass-deep rounded-[2rem] flex items-center justify-center text-mat-wine border border-mat-rose/20 shadow-mat-rose/10">
                 <Compass size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-6xl font-bold italic text-mat-wine leading-none">The Gaze.</h3>
                 <p className="mat-text-label-pro tracking-[0.8em]">Sovereign Discovery Flow</p>
              </div>
           </div>
           <Badge className="bg-mat-gold/5 text-mat-gold-deep border-mat-gold/20 px-12 py-5 rounded-full mat-text-label-pro backdrop-blur-md">Tier 1 Awareness Stream</Badge>
        </div>
        
        <div className="h-[700px] w-full relative rounded-[6rem] overflow-hidden border border-mat-gold/10 bg-mat-ivory/10 shadow-inner group/gallery">
            <div className="absolute inset-x-0 top-0 h-48 z-10 pointer-events-none bg-gradient-to-b from-mat-cream to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none bg-gradient-to-t from-mat-cream to-transparent" />
            
            {gazeProfiles.length > 0 && (
              <div className="relative w-full h-full">
                <CircularGallery 
                  items={gazeProfiles}
                  bend={0}
                  scrollSpeed={1.0}
                  autoScroll={true}
                  autoScrollSpeed={0.1}
                  onCenterUpdate={setActiveGazeIndex}
                />
                
                <div className="absolute inset-x-0 bottom-40 flex justify-center pointer-events-none z-[100]">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeGazeIndex}
                      initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -10, opacity: 0 }}
                      className="mat-glass-deep px-16 py-8 rounded-[2.5rem] border-mat-gold/30 shadow-[0_0_120px_rgba(123,45,66,0.15)] flex flex-col items-center gap-2"
                    >
                      <span className="text-5xl font-bold text-mat-wine italic tracking-tighter uppercase">
                        {gazeProfiles[activeGazeIndex]?.originalName.split(' ')[0]}
                      </span>
                      <span className="mat-text-label-pro text-mat-gold opacity-100">
                        {gazeProfiles[activeGazeIndex]?.age} • {gazeProfiles[activeGazeIndex]?.city}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ─── STATUS AUGMENTATION: THE LEDGER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 mat-glass-deep p-16 rounded-[4rem] border border-mat-gold/10 shadow-mat-premium">
            <div className="flex justify-between items-start mb-16">
               <div className="space-y-4">
                  <h3 className="text-5xl font-bold italic text-mat-wine leading-none">Registry standing.</h3>
                  <p className="mat-text-label-pro">Your Position in the Sanctuary Order</p>
               </div>
               <div className="text-right">
                  <span className="text-7xl font-bold text-mat-wine italic tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                    {Math.round(profile.rank_score || 0).toLocaleString()}
                  </span>
                  <p className="mat-text-label-pro opacity-40">Total Aura Influence</p>
               </div>
            </div>

            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="flex justify-between items-end px-2">
                     <div className="space-y-1">
                        <span className="mat-text-label-pro">Current Tier: <span className="text-mat-wine font-bold">{currentLevel.name}</span></span>
                     </div>
                     <span className="mat-text-label-pro opacity-40">Next: {nextLevel.name}</span>
                  </div>
                  <div className="h-4 bg-mat-rose/5 rounded-full p-1 overflow-hidden border border-mat-rose/10">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progressToNext}%` }} 
                        className={`h-full rounded-full bg-gradient-to-r from-mat-wine to-mat-rose shadow-lg`} 
                     />
                  </div>
                  <p className="text-center mat-text-label-pro italic opacity-30">
                    {(nextLevel.min - (profile.rank_score || 0)).toLocaleString()} points until {nextLevel.name} ascension
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-mat-rose/10">
                  {RANK_LADDER.map((l, i) => (
                    <div key={i} className={`flex flex-col items-center gap-3 transition-all duration-500 ${status?.rank_tier?.toLowerCase() === l.id ? 'opacity-100 scale-110' : 'opacity-20 grayscale'}`}>
                       <div className={`w-3 h-3 rounded-full ${l.color === 'mat-gold-foil' ? 'bg-mat-gold' : `bg-${l.color}`} shadow-lg`} />
                       <span className="text-[8px] font-black uppercase tracking-widest text-center">{l.name}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 mat-glass-deep bg-mat-obsidian text-mat-cream p-12 rounded-[4rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-8">
               <Zap className={`${isBumping ? 'animate-pulse text-mat-gold' : 'text-mat-cream/20'}`} size={48} strokeWidth={1} />
            </div>

            <div className="relative z-10 space-y-8">
               <div className="space-y-2">
                  <h4 className="text-3xl font-bold italic leading-none">Augment <br />Aura.</h4>
                  <p className="text-mat-cream/40 text-[9px] font-bold uppercase tracking-widest italic">Sacrifice tokens to bypass the timeline.</p>
               </div>
               
               <div className="py-10 border-y border-white/5 space-y-2">
                  <p className="mat-text-label-pro text-mat-cream/40">Available Tokens</p>
                  <p className="text-6xl font-black text-mat-gold italic tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>₹{profile.tokens || 0}</p>
               </div>
            </div>

            <div className="relative z-10 space-y-6 pt-12">
               <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-mat-gold">
                     <span>Instant Resonance</span>
                     <span>+500 Pts</span>
                  </div>
                  <p className="text-[8px] text-mat-cream/30 italic">Ritual Cost: 49 Tokens</p>
               </div>

               <button 
                 onClick={handleBumpRank}
                 disabled={isBumping || (profile?.tokens || 0) < 49}
                 className="w-full py-6 bg-mat-gold text-mat-wine rounded-2xl mat-text-label-pro flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-mat-gold-glow disabled:opacity-20"
               >
                  {isBumping ? "Sychronizing..." : "Execute Augmentation"} <Sparkles size={14} className="fill-current" />
               </button>
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
