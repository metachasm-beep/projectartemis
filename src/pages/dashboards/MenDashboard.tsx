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
  Camera
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { turso } from '@/lib/turso';
import { motion } from 'framer-motion';
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
  { id: 'aspirant', name: 'The Hopeful', min: 0 },
  { id: 'vanguard', name: 'The Brave', min: 1000 },
  { id: 'noble', name: 'The Gentleman', min: 2500 },
  { id: 'paragon', name: 'The Ideal', min: 5000 },
  { id: 'ascendant', name: 'The Chosen', min: 10000 },
  { id: 'choice', name: 'The One', min: 25000 }
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

  // ─── LIVE IDENTITY METRICS ───
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
      // 2.4.2 Rectification: Hard-Filtering Seekers and Ensuring Live Assets
      const result = await turso.execute(`
        SELECT full_name, photos, city, date_of_birth 
        FROM profiles 
        WHERE role = 'woman' 
        AND rank_tier = 'Aspirant'
        AND full_name NOT LIKE '%Paul%' 
        ORDER BY created_at DESC 
        LIMIT 200
      `, []);

      const mapped = result.rows.map(r => {
        const age = r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth as string).getFullYear() : 25;
        const photos = JSON.parse(r.photos as string)?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.full_name}`;
        return {
          image: photos,
          text: r.full_name?.toString().split(' ')[0] || 'Sanctuary Identity',
          subText: `${age} • ${r.city || 'Undisclosed'}`,
          originalName: r.full_name,
          age: age,
          city: r.city
        };
      });

      setGazeProfiles(mapped);
    } catch (err) {
      console.error("Gaze sync failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchGaze();
  }, [fetchGaze]);

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
    fetchRank();
  }, [fetchRank]);

  const handleBumpRank = async () => {
    if ((profile?.tokens || 0) < 49) {
      alert("Insufficient Tokens. Each bump costs 49 tokens.");
      return;
    }
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
    <div className="space-y-16 pb-32 pt-8">
      <h1 className="sr-only">Matriarch Dossier: Personal Standing & Identity Resonance</h1>
      {/* Dynamic Hero Integration: Trump Card Visual Anchor */}
      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[4rem] border-mat-rose/10 shadow-mat-rose/5">
           <VerificationPrompt userId={profile?.user_id} role="man" onVerified={() => refreshProfile()} />
        </div>
      )}

      {/* SINGULAR HERO ANCHOR: THE TRUMP CARD */}
      <div className="flex justify-center w-full px-4">
        <div className="w-full max-w-[340px] md:max-w-[420px] transform group transition-all duration-700">
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

      {/* The Infinite Gaze Gallery - Expanded to Fix 'Blockage' */}
      <div className="space-y-12 py-24 border-y border-mat-gold/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 mat-glass-deep rounded-[1.75rem] flex items-center justify-center text-mat-wine border border-mat-rose/20 shadow-mat-rose/5">
                 <Eye size={28} />
              </div>
              <div>
                 <h3 className="text-5xl font-bold italic text-mat-wine leading-none tracking-tight">The Infinite Gaze.</h3>
                 <p className="text-[11px] font-black uppercase tracking-[0.6em] text-mat-rose mt-2">Live Sanctuary Presence Stream</p>
              </div>
           </div>
           <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-mat-gold/40 to-transparent mx-16" />
           <Badge className="bg-mat-gold/5 text-mat-gold-deep border-mat-gold/20 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-sm">Ambient Intelligence Protocol</Badge>
        </div>
        
        {/* Gallery Container - Expanded Height */}
        <div className="h-[600px] w-full relative rounded-[5rem] overflow-hidden border border-mat-gold/10 bg-mat-ivory/20 shadow-inner group/gallery">
            <div className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none bg-gradient-to-b from-mat-cream to-transparent opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none bg-gradient-to-t from-mat-cream to-transparent opacity-100" />
            <div className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none bg-gradient-to-r from-mat-cream/60 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-40 z-10 pointer-events-none bg-gradient-to-l from-mat-cream/60 to-transparent" />
            
            {gazeProfiles.length > 0 && (
              <div className="relative w-full h-full">
                <CircularGallery 
                  items={gazeProfiles}
                  bend={0}
                  scrollSpeed={1.2}
                  scrollEase={0.2}
                  autoScroll={true}
                  autoScrollSpeed={0.15}
                  onCenterUpdate={setActiveGazeIndex}
                />
                
                {/* 2.4.4 HYBRID DOM OVERLAY: VIVID VISIBILITY REINFORCED */}
                <div className="absolute inset-x-0 bottom-32 flex justify-center pointer-events-none z-[100]">
                  <motion.div 
                    key={activeGazeIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/90 px-12 py-6 rounded-3xl border border-mat-gold/50 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col items-center gap-1.5"
                  >
                    <span className="text-4xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap drop-shadow-2xl">
                      {gazeProfiles[activeGazeIndex]?.originalName || 'Sanctuary Identity'}
                    </span>
                    <span className="text-[12px] font-black text-mat-gold uppercase tracking-[0.5em] opacity-100">
                      Age {gazeProfiles[activeGazeIndex]?.age || '??'} • {gazeProfiles[activeGazeIndex]?.city || 'Verified'}
                    </span>
                  </motion.div>
                </div>
              </div>
            )}
            
            {/* Elegant Focal Mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-mat-gold/40 to-transparent blur-[1px]" />
                <div className="absolute w-[600px] h-[600px] rounded-full border border-mat-gold/5 opacity-50 scale-150 animate-pulse" />
            </div>
        </div>

        <div className="text-center group/hint">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-mat-gold/30 italic group-hover/hint:text-mat-gold/60 transition-colors duration-500">Scroll horizontally to traverse the gaze</p>
        </div>
      </div>

      {/* HIGH-DENSITY BENTO METRICS: COMPACT & ELEGANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Identity Multipliers */}
         <div className="mat-glass-deep p-10 rounded-[3rem] border border-mat-gold/10 shadow-mat-premium hover:border-mat-gold/30 transition-all">
            <div className="flex justify-between items-start mb-10">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black italic text-mat-wine tracking-tighter">Integrity Multipliers</h3>
                  <p className="text-mat-rose font-black uppercase tracking-[0.4em] text-[8px]">Profile Resonance Metrics</p>
               </div>
               <TrendingUp size={24} className="text-mat-gold/40" />
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: 'Narrative', val: calculateIntegrity(), color: 'bg-mat-gold' },
                 { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, color: 'bg-mat-rose' },
                 { label: 'Social', val: 90, color: 'bg-mat-gold-deep' },
                 { label: 'Verified', val: profile.is_verified ? 100 : 0, color: 'bg-mat-wine' }
               ].map((stat, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-[7px] font-black uppercase text-mat-wine/40">{stat.label}</span>
                       <span className="text-xs font-black text-mat-wine">{stat.val}%</span>
                    </div>
                    <div className="h-1 bg-mat-rose/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color} rounded-full`} />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 flex justify-center">
               <button 
                 onClick={() => setIsEditing?.(true)}
                 className="px-6 py-2 bg-mat-wine/10 text-mat-wine border border-mat-wine/20 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-mat-wine hover:text-white transition-all flex items-center gap-2"
               >
                  <Camera size={12} /> Edit Identity dossier
               </button>
            </div>
         </div>

         {/* Resonance Archives */}
         <div className="mat-glass-deep p-10 rounded-[3rem] border border-mat-gold/10 shadow-mat-premium hover:border-mat-gold/30 transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black italic text-mat-wine tracking-tighter">Resonance Archives</h3>
                  <p className="text-mat-rose font-black uppercase tracking-[0.4em] text-[8px]">Observer Interaction Trace</p>
               </div>
               <UserCheckIcon size={24} className="text-mat-rose/40" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Aura', val: `₹${profile.tokens || 0}`, icon: Zap },
                { label: 'Status', val: (profile.rank_score || 0).toLocaleString(), icon: Crown },
                { label: 'Views', val: (externalMetrics?.visit || profile.view_count || 0).toLocaleString(), icon: Eye }
              ].map((item, i) => (
                <div key={i} className="bg-mat-ivory/40 p-3 rounded-2xl border border-mat-rose/5 flex flex-col items-center justify-center text-center">
                   <item.icon size={14} className="text-mat-rose/40 mb-2" />
                   <span className="text-[6px] font-black uppercase text-mat-slate/40 tracking-widest">{item.label}</span>
                   <span className="text-sm font-black text-mat-wine italic">{item.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
                <button 
                  onClick={handleBumpRank}
                  disabled={isBumping || (profile?.tokens || 0) < 49}
                  className="w-full py-3 bg-mat-wine text-white rounded-2xl text-[8px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-mat-wine-soft disabled:opacity-50 transition-all shadow-mat-premium"
                >
                   {isBumping ? "Ritual..." : "Augment Standing"} <Zap size={10} className="text-mat-gold" />
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};
