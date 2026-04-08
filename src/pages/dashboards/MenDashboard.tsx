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
  const [totalMen, setTotalMen] = useState<number>(0);
  const [isBumping, setIsBumping] = useState(false);
  const [gazeProfiles, setGazeProfiles] = useState<any[]>([]);

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
      const result = await turso.execute("SELECT full_name, photos, city FROM profiles WHERE role = 'woman' LIMIT 12");
      const mapped = result.rows.map(r => ({
        image: JSON.parse(r.photos as string)?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.full_name}`,
        text: `${r.full_name?.toString().split(' ')[0]} | ${r.city}`
      }));
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
      setTotalMen(Number(totalResult.rows[0].total) || 0);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-mat-gold/20 text-mat-gold text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">Sanctuary // Status</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none shrink-0 ">Your <br /><span className="text-mat-rose/30">Standing.</span></h1>
        </div>
        
        <div className="flex gap-px bg-mat-gold/10 p-px w-full md:w-auto overflow-hidden rounded-[2.5rem] mat-glass border border-mat-gold/20 shadow-mat-gold/5">
           <div className="bg-mat-ivory/80 px-10 py-6 flex flex-col justify-center min-w-[180px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mat-slate/60">Aura Balance</span>
              <span className="text-2xl font-bold text-mat-wine">₹{profile?.tokens || 0}</span>
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
             className="bg-mat-wine text-white px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-2"
           >
              Augment <Zap size={14} className="text-mat-gold" />
           </button>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[3.5rem] border-mat-rose/10 shadow-mat-rose/5">
           <VerificationPrompt userId={profile?.user_id} role="man" onVerified={() => refreshProfile()} />
        </div>
      )}

      {/* Hero Bento Grid - Refactored for Neatness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
         {/* Identity Module */}
         <div className="lg:col-span-8 mat-glass-deep rounded-[3.5rem] border border-mat-rose/10 shadow-mat-premium overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                {/* TrumpCard Focal Point - Explicit Grid Column */}
                <div className="md:col-span-5 lg:col-span-4 bg-mat-ivory/30 p-8 flex items-center justify-center border-r border-mat-rose/5">
                    <div className="w-full max-w-[320px]">
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
                    </div>
               </div>

                <div className="md:col-span-7 lg:col-span-8 p-10 flex flex-col justify-between">
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="h-px w-12 bg-mat-rose/30" />
                           <span className="text-[9px] font-black uppercase tracking-[0.6em] text-mat-rose italic">Advanced Intel</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <h2 className="text-4xl lg:text-5xl font-bold text-mat-wine italic leading-tight">
                             Collective Reputation <br />
                             <span className="opacity-30 italic font-light text-2xl lg:text-3xl">Dossier #MD-{profile?.user_id?.slice(0, 4)}</span>
                          </h2>
                          <button 
                            onClick={() => setIsEditing?.(true)}
                            className="shrink-0 w-14 h-14 rounded-2xl mat-glass border border-mat-rose/20 flex items-center justify-center text-mat-rose hover:bg-mat-rose hover:text-white transition-all shadow-mat-rose/10 group"
                          >
                             <Camera size={20} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-4">
                        <Badge variant="outline" className="px-6 py-2.5 border-mat-rose/20 bg-mat-rose/5 text-mat-wine text-[9px] font-black uppercase tracking-widest rounded-2xl italic">Legacy: {profile?.city || 'Undisclosed'}</Badge>
                        <Badge variant="outline" className="px-6 py-2.5 border-mat-gold/30 bg-mat-gold/5 text-mat-gold-deep text-[9px] font-black uppercase tracking-widest rounded-2xl italic">Social Proof: 100%</Badge>
                     </div>
                     <div className="space-y-6 pt-8 border-t border-mat-rose/10">
                        <p className="text-[15px] text-mat-slate font-medium leading-relaxed italic max-w-xl">
                           "{profile?.bio || "Identity narrative not established. Update your profile to improve standing."}"
                        </p>
                        <div className="grid grid-cols-2 gap-12 text-[11px] font-bold uppercase tracking-widest text-mat-wine/40">
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Core Occupation</p>
                              <p className="text-mat-wine text-sm">{profile?.occupation || 'Private'}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="opacity-40 text-[8px] tracking-[0.4em]">Spiritual Path</p>
                              <p className="text-mat-wine text-sm">{profile?.religion || 'Undisclosed'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="pt-12 flex flex-wrap items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/40 border-t border-mat-rose/5 mt-12">
                     <div className="flex items-center gap-3"><Clock size={14} className="text-mat-rose/60" /> Protocol Start: {new Date(profile?.created_at).toLocaleDateString()}</div>
                     <div className="flex items-center gap-3"><Activity size={14} className="text-mat-rose/60" /> Frequency: Stable</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Rank Status - Refactored for consistency */}
         <div className="lg:col-span-4 bg-mat-wine text-mat-cream rounded-[3.5rem] shadow-mat-premium p-10 flex flex-col justify-between group h-full">
               <div className="space-y-8">
                  <div className="flex justify-between items-start">
                     <h3 className="text-3xl font-bold italic leading-none text-mat-cream">Sanctuary <br /><span className="text-mat-gold/50 text-xl tracking-widest">Absolute.</span></h3>
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-mat-gold">
                        <Crown size={24} />
                     </div>
                  </div>
               </div>
               
               <div className="py-16 space-y-10">
                  <div className="flex justify-between items-end border-b border-white/10 pb-10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-mat-gold tracking-[0.4em]">Global Stand</p>
                        <span className="text-8xl font-black text-mat-cream tracking-tighter tabular-nums leading-none">#{absRank || '--'}</span>
                     </div>
                     <div className="text-right pb-2">
                        <p className="text-[14px] font-bold text-mat-cream/30 italic">of {totalMen.toLocaleString()}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-mat-cream/40">
                        <span>Ascension: {nextLevel.name}</span>
                        <span className="text-mat-gold">{Math.round(progressToNext)}%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} className="h-full bg-mat-gold rounded-full shadow-[0_0_25px_rgba(191,160,106,0.6)]" />
                     </div>
                  </div>
               </div>

               <button 
                onClick={handleBumpRank} 
                disabled={isBumping || (profile?.tokens || 0) < 49} 
                className="w-full h-20 bg-white text-mat-wine font-black uppercase tracking-[0.5em] text-[11px] rounded-[2rem] hover:bg-mat-cream transition-all flex items-center justify-center gap-4 group"
               >
                  {isBumping ? "Ritual in Progress..." : "Augment Stand"} 
                  <ArrowUpRight size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
               </button>
         </div>
      </div>

      {/* The Infinite Gaze Gallery - Expanded to Fix 'Blockage' */}
      <div className="space-y-10 py-20 border-y border-mat-gold/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 mat-glass-deep rounded-[1.5rem] flex items-center justify-center text-mat-wine border border-mat-rose/20 shadow-mat-rose/5">
                 <Eye size={24} />
              </div>
              <div>
                 <h3 className="text-4xl font-bold italic text-mat-wine leading-none tracking-tight">The Infinite Gaze.</h3>
                 <p className="text-[10px] font-black uppercase tracking-[0.6em] text-mat-rose mt-2">Live Sanctuary Presence Stream</p>
              </div>
           </div>
           <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-mat-gold/40 to-transparent mx-12" />
           <Badge className="bg-mat-gold/5 text-mat-gold-deep border-mat-gold/20 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.4em] backdrop-blur-sm">Ambient Intelligence Protocol</Badge>
        </div>
        
        {/* Gallery Container - SIGNIFICANTLY INCREASED HEIGHT and Better Nesting */}
        <div className="h-[550px] w-full relative rounded-[4rem] overflow-hidden border border-mat-gold/10 bg-mat-ivory/20 shadow-inner">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-mat-cream via-transparent to-mat-cream opacity-80" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-mat-cream/40 via-transparent to-mat-cream/40" />
            
            {gazeProfiles.length > 0 && (
              <CircularGallery 
                items={gazeProfiles}
                bend={0}
                scrollSpeed={0.4}
                scrollEase={0.05}
              />
            )}
            
            {/* Elegant Focal Mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-mat-gold/30 to-transparent" />
            </div>
        </div>

        <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-mat-gold/40 italic">Scroll horizontally to traverse the gaze</p>
        </div>
      </div>

      {/* Metrics Bento Grid - Organized and Clean */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
         {/* Identity Analysis */}
         <div className="lg:col-span-8 mat-glass-deep p-12 rounded-[3.5rem] border border-mat-rose/10 shadow-mat-premium">
            <div className="space-y-16">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <h3 className="text-4xl font-bold italic leading-none text-mat-wine">Integrity Multipliers.</h3>
                     <p className="text-mat-rose font-black uppercase tracking-[0.6em] text-[10px]">Live Profile Resonance strength Metrics</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-mat-rose/5 flex items-center justify-center text-mat-rose/30">
                    <TrendingUp size={32} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                  {[
                    { label: 'Narrative Density', val: calculateIntegrity(), color: 'bg-mat-gold', sub: 'Depth of bio & details' },
                    { label: 'Verified Status', val: profile.is_verified ? 100 : 0, color: 'bg-mat-wine', sub: 'Identity authentication' },
                    { label: 'Portrait Fidelity', val: (profile.photos?.length || 0) > 0 ? 100 : 0, color: 'bg-mat-rose', sub: 'Visual clarity & count' },
                    { label: 'Sovereign Compliance', val: 90, color: 'bg-mat-gold-deep', sub: 'Platform standard alignment' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-5">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-mat-wine italic">{stat.label}</span>
                            <p className="text-[9px] text-mat-slate/40 uppercase font-bold tracking-widest">{stat.sub}</p>
                          </div>
                          <span className="text-xl font-serif font-bold text-mat-wine">{stat.val}%</span>
                       </div>
                       <div className="h-1.5 bg-mat-rose/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color} rounded-full`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Archives Section */}
         <div className="lg:col-span-4 mat-glass-deep rounded-[3.5rem] border border-mat-rose/10 shadow-mat-premium p-10 flex flex-col justify-between group">
               <div className="space-y-8">
                  <div className="w-16 h-16 bg-mat-rose/5 rounded-3xl flex items-center justify-center text-mat-rose border border-mat-rose/10">
                     <UserCheckIcon size={28} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold italic leading-none text-mat-wine">Resonance <br /><span className="text-mat-rose/50 text-2xl tracking-widest">Archives.</span></h4>
                    <p className="text-[10px] text-mat-slate/40 font-bold uppercase tracking-widest mt-4 leading-relaxed">Systematic trace of observer interactions within the sanctuary.</p>
                  </div>
               </div>
               <div className="space-y-6 pt-10 border-t border-mat-rose/10">
                  {[
                    { label: 'Aura Balance', val: `₹${profile.tokens || 0}`, icon: Zap },
                    { label: 'Status Points', val: (profile.rank_score || 0).toLocaleString(), icon: Crown },
                    { label: 'Profile Exposure', val: (externalMetrics?.visit || profile.view_count || 0).toLocaleString(), icon: Eye }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-mat-rose/5 text-[11px] font-black uppercase tracking-[0.2em]">
                       <div className="flex items-center gap-3 text-mat-slate/40">
                          <item.icon size={14} className="text-mat-rose/40" />
                          <span>{item.label}</span>
                       </div>
                       <span className="text-mat-wine italic">{item.val}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-10 p-6 bg-mat-wine/[0.02] border border-mat-rose/5 rounded-[2rem] text-center">
                  <p className="text-[9px] font-black text-mat-slate/30 uppercase tracking-[0.5em] italic">Synchronized // Oracle</p>
               </div>
         </div>
      </div>
    </div>
  );
};
