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
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-mat-gold/20 text-mat-gold text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">Sanctuary // Status</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Your <br /><span className="text-mat-rose/30">Standing.</span></h1>
        </div>
        
        <div className="flex gap-px bg-mat-gold/10 p-px w-full md:w-auto overflow-hidden rounded-[2rem] mat-glass border border-mat-gold/20">
           <div className="bg-mat-ivory/80 px-10 py-6 flex flex-col justify-center min-w-[160px]">
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

      {/* Hero Bento Grid */}
      <div className="bento-grid">
         {/* Identity Module */}
         <div className="bento-span-8 bento-item mat-glass-deep group min-h-[550px] overflow-visible">
            <div className="flex flex-col md:flex-row h-full gap-8 p-8 relative">
                {/* TrumpCard Focal Point */}
                <div className="shrink-0 w-full md:w-[320px] scale-90 md:scale-100 origin-top">
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

                <div className="flex-1 flex flex-col justify-between py-6">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="h-px flex-1 bg-mat-rose/20" />
                           <span className="text-[9px] font-black uppercase tracking-[0.6em] text-mat-rose italic">Advanced Intel</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <h2 className="text-4xl font-bold text-mat-wine italic leading-none truncate">
                             Collective Reputation <br />
                             <span className="opacity-40 italic font-light text-2xl">Dossier #MD-{profile?.user_id?.slice(0, 4)}</span>
                          </h2>
                          <button 
                            onClick={() => setIsEditing?.(true)}
                            className="w-12 h-12 rounded-full mat-glass border border-mat-rose/20 flex items-center justify-center text-mat-rose hover:bg-mat-rose hover:text-white transition-all shadow-mat-rose/10 group"
                          >
                             <Camera size={18} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 bg-mat-rose/5 text-mat-wine text-[9px] font-bold uppercase tracking-widest rounded-xl italic">Legacy: {profile?.city || 'Undisclosed'}</Badge>
                        <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 bg-mat-gold/5 text-mat-gold-deep text-[9px] font-bold uppercase tracking-widest rounded-xl italic">Social Proof: 100%</Badge>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-mat-rose/10">
                        <p className="text-[14px] text-mat-slate font-medium leading-relaxed italic">
                           {profile?.bio || "Identity narrative not established. Update your profile to improve standing."}
                        </p>
                        <div className="grid grid-cols-2 gap-8 text-[11px] font-bold uppercase tracking-widest text-mat-wine/40">
                           <div className="space-y-1">
                              <p className="opacity-50 text-[8px]">Core Occpuation</p>
                              <p className="text-mat-wine">{profile?.occupation || 'Private'}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="opacity-50 text-[8px]">Spiritual Path</p>
                              <p className="text-mat-wine">{profile?.religion || 'Undisclosed'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="pt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/50">
                     <div className="flex items-center gap-2"><Clock size={12} className="text-mat-rose" /> Protocol Start: {new Date(profile?.created_at).toLocaleDateString()}</div>
                     <div className="flex items-center gap-2"><Activity size={12} className="text-mat-rose" /> Frequency: Stable</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Rank Status */}
         <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream group h-full shadow-mat-premium">
            <div className="flex flex-col h-full justify-between p-8">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-bold italic leading-none text-mat-cream">Sanctuary <br /><span className="text-mat-gold/40 text-xl">Absolute.</span></h3>
                     <Crown className="text-mat-gold w-6 h-6" />
                  </div>
               </div>
               <div className="py-12 border-y border-white/5 space-y-8">
                  <div className="flex justify-between items-end">
                     <span className="text-7xl font-bold text-mat-cream tracking-tighter">#{absRank || '--'}</span>
                     <div className="text-right">
                        <p className="text-[9px] font-bold uppercase text-mat-gold tracking-widest">Global Stand</p>
                        <p className="text-[12px] font-bold text-mat-cream/40 italic">of {totalMen.toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-mat-cream/40">
                        <span>Ascension to {nextLevel.name}</span>
                        <span>{Math.round(progressToNext)}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} className="h-full bg-mat-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
                     </div>
                  </div>
               </div>
               <button onClick={handleBumpRank} disabled={isBumping || (profile?.tokens || 0) < 49} className="w-full h-20 bg-mat-cream text-mat-wine font-bold uppercase tracking-[0.5em] text-[10px] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3">
                  {isBumping ? "Ritual..." : "Augment Stand"} <ArrowUpRight size={16} />
               </button>
            </div>
         </div>
      </div>

      {/* The Infinite Gaze Gallery */}
      <div className="space-y-8 py-12">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 mat-glass rounded-2xl flex items-center justify-center text-mat-wine">
                 <Eye size={20} />
              </div>
              <div>
                 <h3 className="text-xl font-bold italic text-mat-wine leading-none">The Infinite Gaze.</h3>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-rose/60 mt-1">Live Sanctuary Stream</p>
              </div>
           </div>
           <div className="h-px flex-1 bg-mat-gold/20 mx-12 hidden md:block" />
           <Badge className="bg-mat-gold/10 text-mat-gold border-mat-gold/20 px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest">Ambient Mode Active</Badge>
        </div>
        
        <div className="h-72 w-full relative rounded-[3rem] overflow-hidden border border-mat-gold/20 mat-glass pointer-events-none">
            {gazeProfiles.length > 0 && (
              <CircularGallery 
                items={gazeProfiles}
                bend={0}
                scrollSpeed={0.5}
                scrollEase={0.05}
              />
            )}
            <div className="absolute inset-0 bg-mat-obsidian/10 pointer-events-none backdrop-sepia-[0.2]" />
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="bento-grid">
         {/* Identity Analysis */}
         <div className="bento-span-8 bento-item mat-glass p-12">
            <div className="space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold italic leading-none text-mat-wine">Integrity Multipliers.</h3>
                     <p className="text-mat-rose font-bold uppercase tracking-[0.4em] text-[9px]">Live Profile Strength Metrics</p>
                  </div>
                  <TrendingUp className="text-mat-wine/10 w-8 h-8" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  {[
                    { label: 'Narrative Density', val: calculateIntegrity(), color: 'bg-mat-gold' },
                    { label: 'Verified Status', val: profile.is_verified ? 100 : 0, color: 'bg-mat-rose' },
                    { label: 'Portrait Fidelity', val: (profile.photos?.length || 0) > 0 ? 100 : 0, color: 'bg-mat-wine' },
                    { label: 'Sovereign Compliance', val: 90, color: 'bg-mat-rose-deep' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/40 italic">{stat.label}</span>
                          <span className="text-xs font-bold text-mat-wine">{stat.val}%</span>
                       </div>
                       <div className="h-1 bg-mat-rose/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color}`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Archives Section */}
         <div className="bento-span-4 bento-item mat-glass group h-full">
            <div className="flex flex-col h-full justify-between gap-12 p-8">
               <div className="space-y-6">
                  <div className="w-14 h-14 mat-glass rounded-2xl flex items-center justify-center text-mat-rose group-hover:text-mat-wine transition-all">
                     <UserCheckIcon size={24} />
                  </div>
                  <h4 className="text-xl font-bold italic leading-none text-mat-wine">Resonance <br /><span className="text-mat-rose/40 text-lg">Archives.</span></h4>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Aura Balance', val: profile.tokens || 0 },
                    { label: 'Status Points', val: profile.rank_score || 0 },
                    { label: 'Profile Exposure', val: (externalMetrics?.visit || profile.view_count || 0) }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-mat-rose/10 text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-mat-slate/40 whitespace-nowrap">{item.label}</span>
                       <span className="text-mat-wine font-black">{item.val}</span>
                    </div>
                  ))}
               </div>
               <div className="bg-mat-rose/5 rounded-2xl p-6 border border-mat-rose/10">
                  <p className="text-[9px] font-bold text-mat-slate/40 uppercase tracking-widest italic text-center leading-relaxed">Synchronized with Oracle Backend</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
