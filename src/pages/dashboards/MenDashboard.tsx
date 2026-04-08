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
        AND full_name NOT LIKE '%Paul%' 
        AND full_name NOT LIKE '%Aspirant%'
        AND full_name NOT LIKE '%Seeker%'
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
    <div className="space-y-16 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-5 py-1.5 border-mat-gold/30 text-mat-gold text-[10px] font-black uppercase tracking-[0.5em] rounded-full bg-mat-gold/5">Sanctuary // Status</Badge>
          <h1 className="text-7xl md:text-9xl mat-text-display-pro text-mat-wine italic leading-none shrink-0 ">Your <br /><span className="text-mat-rose/30">Standing.</span></h1>
        </div>
        
        <div className="flex flex-col gap-6 w-full md:w-auto">
            <div className="flex gap-px bg-mat-gold/10 p-px w-full overflow-hidden rounded-[2.5rem] mat-glass border border-mat-gold/20 shadow-mat-gold/5">
                <div className="bg-mat-ivory/80 px-10 py-6 flex flex-col justify-center min-w-[180px]">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mat-slate/60">Aura Balance</span>
                    <span className="text-3xl font-black text-mat-wine">₹{profile?.tokens || 0}</span>
                </div>
                <button 
                  onClick={() => {
                      const amount = window.prompt("Enter token amount to augment (₹1 = 1 Token):", "500");
                      if (amount) {
                          turso.execute({
                              sql: "UPDATE profiles SET tokens = tokens + ? WHERE user_id = ?",
                              args: [Number(amount), profile.user_id]
                          }).then(() => refreshProfile());
                      }
                  }}
                  className="bg-mat-wine text-white px-10 py-6 text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-3 group"
                >
                    Augment <Zap size={16} className="text-mat-gold group-hover:scale-125 transition-transform" />
                </button>
            </div>
            
            {/* Prominent Rank Display for Mobile/Small screens header integration (Optional, but good for UX) */}
            <div className="flex items-center justify-between px-8 py-4 bg-mat-rose/5 rounded-3xl border border-mat-rose/10 md:hidden">
                <span className="text-[10px] font-black uppercase tracking-widest text-mat-rose">Global Standing</span>
                <span className="text-2xl font-black text-mat-wine">#{absRank || '--'}</span>
            </div>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[4rem] border-mat-rose/10 shadow-mat-rose/5">
           <VerificationPrompt userId={profile?.user_id} role="man" onVerified={() => refreshProfile()} />
        </div>
      )}

      {/* Hero Bento Grid - UPSIZED AND INTEGRATED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Identity Module - FULL WIDTH */}
         <div className="lg:col-span-12 mat-glass-deep rounded-[4rem] border border-mat-rose/10 shadow-mat-premium overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                {/* TrumpCard Focal Point - UPSIZED */}
                <div className="lg:col-span-5 bg-mat-ivory/40 p-10 lg:p-16 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-mat-rose/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-mat-gold/5 to-transparent pointer-events-none" />
                    <div className="w-full max-w-[420px] transform hover:scale-[1.02] transition-transform duration-700">
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
                          is_verified: profile.is_verified
                        }}
                      />
                      
                      {/* Integrated Rank Number Overlay for Mobile Impact */}
                      <div className="absolute top-12 left-12 lg:hidden">
                         <div className="bg-mat-wine text-mat-cream px-6 py-3 rounded-2xl shadow-mat-premium border border-mat-gold/30 flex flex-col items-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-mat-gold/60">Rank</span>
                            <span className="text-2xl font-black">#{absRank || '--'}</span>
                         </div>
                      </div>
                    </div>
               </div>

                <div className="lg:col-span-7 p-10 lg:p-16 flex flex-col justify-between space-y-12">
                  <div className="space-y-16">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                               <div className="h-px w-16 bg-mat-rose/30" />
                               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-mat-rose italic">Advanced Identity Dossier</span>
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-bold text-mat-wine italic leading-none tracking-tight">
                               #{absRank || '--'} <br className="hidden lg:block" />
                               <span className="opacity-20 italic font-light text-3xl lg:text-4xl">MD-{profile?.user_id?.slice(0, 6)}</span>
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsEditing?.(true)}
                                className="w-16 h-16 rounded-3xl mat-glass border border-mat-rose/20 flex items-center justify-center text-mat-rose hover:bg-mat-rose hover:text-white transition-all shadow-mat-rose/10 group order-2 md:order-1"
                            >
                                <Camera size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button 
                                onClick={handleBumpRank}
                                disabled={isBumping || (profile?.tokens || 0) < 49}
                                className="px-10 h-16 bg-mat-wine text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-3xl hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-4 group shadow-mat-premium order-1 md:order-2 flex-1 md:flex-none"
                            >
                                {isBumping ? "Ritual..." : "Augment Standing"} 
                                <ArrowUpRight size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                     </div>

                     {/* Integrated Ascension Bar */}
                     <div className="p-8 bg-mat-rose/5 rounded-[2.5rem] border border-mat-rose/10 space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-mat-wine/40 tracking-[0.4em]">Path to Ascension</p>
                                <h3 className="text-xl font-bold italic text-mat-wine">{currentLevel.name} → <span className="text-mat-gold font-black">{nextLevel.name}</span></h3>
                            </div>
                            <span className="text-3xl font-serif italic text-mat-gold">{Math.round(progressToNext)}%</span>
                        </div>
                        <div className="h-2.5 bg-mat-cream rounded-full overflow-hidden p-0.5 border border-mat-rose/10">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} className="h-full bg-mat-gold rounded-full shadow-[0_0_20px_rgba(191,160,106,0.4)]" />
                        </div>
                     </div>

                     <div className="space-y-8 pt-4">
                        <div className="flex flex-wrap gap-4">
                           <Badge variant="outline" className="px-8 py-3 border-mat-rose/20 bg-mat-rose/5 text-mat-wine text-[10px] font-black uppercase tracking-widest rounded-2xl italic">Legacy: {profile?.city || 'Undisclosed'}</Badge>
                           <Badge variant="outline" className="px-8 py-3 border-mat-gold/30 bg-mat-gold/5 text-mat-gold-deep text-[10px] font-black uppercase tracking-widest rounded-2xl italic">Social Proof: 100%</Badge>
                           <Badge variant="outline" className="px-8 py-3 bg-mat-wine text-mat-cream border-none text-[10px] font-black uppercase tracking-widest rounded-2xl italic">{status?.rank_tier || 'Aspirant'}</Badge>
                        </div>
                        
                        <p className="text-[18px] text-mat-slate font-medium leading-relaxed italic max-w-2xl border-l-4 border-mat-gold/20 pl-8">
                           "{profile?.bio || "Identity narrative not established. Update your profile to improve standing."}"
                        </p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-[11px] font-bold uppercase tracking-widest text-mat-wine/40">
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Core Occupation</p>
                              <p className="text-mat-wine text-base">{profile?.occupation || 'Private'}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Spiritual Path</p>
                              <p className="text-mat-wine text-base">{profile?.religion || 'Undisclosed'}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Height</p>
                              <p className="text-mat-wine text-base">{profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "5'10\""}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Collective Age</p>
                              <p className="text-mat-wine text-base">{profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 25} Cycles</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="pt-12 flex flex-wrap items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/30 border-t border-mat-rose/10 mt-16">
                     <div className="flex items-center gap-4"><Clock size={16} className="text-mat-rose/40" /> Protocol Entry: {new Date(profile?.created_at).toLocaleDateString()}</div>
                     <div className="flex items-center gap-4"><Activity size={16} className="text-mat-rose/40" /> Resonance: Stable</div>
                     <div className="flex items-center gap-4 ml-auto text-mat-gold"><Crown size={18} /> Sanctuary Verified Identity</div>
                  </div>
               </div>
            </div>
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
                  scrollSpeed={0.4}
                  scrollEase={0.05}
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

      {/* Metrics Bento Grid - Organized and Clean */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Identity Analysis */}
         <div className="lg:col-span-8 mat-glass-deep p-16 rounded-[4rem] border border-mat-rose/10 shadow-mat-premium">
            <div className="space-y-20">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <h3 className="text-5xl font-bold italic leading-none text-mat-wine">Integrity Multipliers.</h3>
                     <p className="text-mat-rose font-black uppercase tracking-[0.6em] text-[11px]">Live Profile Resonance strength Metrics</p>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-mat-rose/5 flex items-center justify-center text-mat-rose/20">
                    <TrendingUp size={40} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
                  {[
                    { label: 'Narrative Density', val: calculateIntegrity(), color: 'bg-mat-gold', sub: 'Depth of bio & details' },
                    { label: 'Verified Status', val: profile.is_verified ? 100 : 0, color: 'bg-mat-wine', sub: 'Identity authentication' },
                    { label: 'Portrait Fidelity', val: (profile.photos?.length || 0) > 0 ? 100 : 0, color: 'bg-mat-rose', sub: 'Visual clarity & count' },
                    { label: 'Sovereign Compliance', val: 90, color: 'bg-mat-gold-deep', sub: 'Platform standard alignment' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-mat-wine italic">{stat.label}</span>
                            <p className="text-[10px] text-mat-slate/40 uppercase font-bold tracking-[0.3em]">{stat.sub}</p>
                          </div>
                          <span className="text-2xl font-serif font-bold text-mat-wine">{stat.val}%</span>
                       </div>
                       <div className="h-2 bg-mat-rose/5 rounded-full overflow-hidden p-0.5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color} rounded-full`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Archives Section */}
         <div className="lg:col-span-4 mat-glass-deep rounded-[4rem] border border-mat-rose/10 shadow-mat-premium p-12 flex flex-col justify-between group">
               <div className="space-y-10">
                  <div className="w-20 h-20 bg-mat-rose/5 rounded-[2.5rem] flex items-center justify-center text-mat-rose border border-mat-rose/10">
                     <UserCheckIcon size={32} />
                  </div>
                  <div>
                    <h4 className="text-4xl font-bold italic leading-none text-mat-wine">Resonance <br /><span className="text-mat-rose/50 text-3xl tracking-widest">Archives.</span></h4>
                    <p className="text-[11px] text-mat-slate/40 font-bold uppercase tracking-widest mt-6 leading-relaxed">Systematic trace of observer interactions within the sanctuary.</p>
                  </div>
               </div>
               <div className="space-y-8 pt-12 border-t border-mat-rose/10">
                  {[
                    { label: 'Aura Balance', val: `₹${profile.tokens || 0}`, icon: Zap },
                    { label: 'Status Points', val: (profile.rank_score || 0).toLocaleString(), icon: Crown },
                    { label: 'Profile Exposure', val: (externalMetrics?.visit || profile.view_count || 0).toLocaleString(), icon: Eye }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-5 border-b border-mat-rose/5 text-[12px] font-black uppercase tracking-[0.2em]">
                       <div className="flex items-center gap-4 text-mat-slate/40">
                          <item.icon size={16} className="text-mat-rose/40" />
                          <span>{item.label}</span>
                       </div>
                       <span className="text-mat-wine italic">{item.val}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-12 p-8 bg-mat-wine/[0.02] border border-mat-rose/5 rounded-[2.5rem] text-center">
                  <p className="text-[10px] font-black text-mat-slate/30 uppercase tracking-[0.5em] italic">Synchronized // Sovereign Oracle</p>
               </div>
         </div>
      </div>
    </div>
  );
};
