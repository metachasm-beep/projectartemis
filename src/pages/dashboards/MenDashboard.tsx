import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Crown,
  Activity,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Clock,
  Heart,
  ChevronDown
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { turso, tursoHelpers } from '@/lib/turso';
import { motion } from 'framer-motion';

interface MenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
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
  status
}) => {
  const [absRank, setAbsRank] = React.useState<number | null>(null);
  const [totalMen, setTotalMen] = React.useState<number>(0);
  const [isBumping, setIsBumping] = React.useState(false);

  // Female Discovery (The Gaze) State
  const [females, setFemales] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [discoveryLoading, setDiscoveryLoading] = React.useState(false);

  const fetchFemales = React.useCallback(async (pageNum: number) => {
    setDiscoveryLoading(true);
    try {
      const result = await turso.execute(
        "SELECT * FROM profiles WHERE role = 'woman' LIMIT 10 OFFSET ?",
        [pageNum * 10]
      );
      
      const rows = result.rows.map(r => ({
        ...r,
        photos: tursoHelpers.deserialize(r.photos as string) || []
      }));

      if (rows.length < 10) setHasMore(false);
      setFemales(prev => pageNum === 0 ? rows : [...prev, ...rows]);
    } catch (err) {
      console.error("Gaze fetch error (Turso):", err);
    } finally {
      setDiscoveryLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFemales(0);
  }, [fetchFemales]);

  const loadMore = () => {
    if (!discoveryLoading && hasMore) {
      const nextP = page + 1;
      setPage(nextP);
      fetchFemales(nextP);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '--';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const fetchRank = React.useCallback(async () => {
    if (!profile) return;
    
    try {
      // 1. Get total men
      const totalResult = await turso.execute(
        "SELECT COUNT(*) as total FROM profiles WHERE role = 'man'",
        []
      );
      setTotalMen(Number(totalResult.rows[0].total) || 0);

      // 2. Calculate absolute rank based on verification, boost count, and creation date
      const rankResult = await turso.execute(
        `
          SELECT COUNT(*) as higher_ranked FROM profiles 
          WHERE role = 'man' AND (
            is_verified > ? OR 
            (is_verified = ? AND rank_boost_count > ?) OR 
            (is_verified = ? AND rank_boost_count = ? AND created_at < ?)
          )
        `,
        [
          profile.is_verified ? 1 : 0,
          profile.is_verified ? 1 : 0,
          profile.rank_boost_count || 0,
          profile.is_verified ? 1 : 0,
          profile.rank_boost_count || 0,
          profile.created_at
        ]
      );
      
      setAbsRank(Number(rankResult.rows[0].higher_ranked) + 1);
    } catch (err) {
      console.error("Rank calculation error (Turso):", err);
    }
  }, [profile]);

  React.useEffect(() => {
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
        "UPDATE profiles SET tokens = tokens - 49, rank_boost_count = rank_boost_count + 1, updated_at = ? WHERE user_id = ?",
        [new Date().toISOString(), profile.user_id]
      );

      window.location.reload();
    } catch (err) {
      console.error("Bump error (Turso):", err);
    } finally {
      setIsBumping(false);
    }
  };

  const currentLevel = RANK_LADDER.find(r => r.id === status?.rank_tier?.toLowerCase()) || RANK_LADDER[0];
  const nextLevel = RANK_LADDER[RANK_LADDER.indexOf(currentLevel) + 1] || currentLevel;
  const progressToNext = ((status?.rank_score || 0) - currentLevel.min) / (nextLevel.min - currentLevel.min) * 100;

  return (
    <div className="space-y-12 pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-mat-gold/20 text-mat-gold text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">Nobility // Standing</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Your <br /><span className="text-mat-rose/30">Presence.</span></h1>
        </div>
        
        <div className="flex gap-px bg-mat-gold/10 p-px w-full md:w-auto overflow-hidden rounded-[2rem] mat-glass border border-mat-gold/20">
           <div className="bg-mat-ivory/80 px-10 py-6 flex flex-col justify-center min-w-[160px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mat-slate/60">Merit Tokens</span>
              <span className="text-2xl font-bold text-mat-wine">₹{profile?.tokens || 0}</span>
           </div>
           <button 
             onClick={() => {
                const amount = window.prompt("Enter token amount to buy (₹1 = 1 Token):", "100");
                if (amount) window.location.reload(); 
             }}
             className="bg-mat-wine text-white px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-2 shadow-mat-gold/5"
           >
             Augment <Zap size={14} className="text-mat-gold" />
           </button>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[3.5rem] border-mat-rose/10 shadow-mat-rose/5">
           <VerificationPrompt 
              userId={profile?.user_id} 
              role="man" 
              onVerified={() => window.location.reload()} 
           />
        </div>
      )}

      {/* Bento Matrix */}
      <div className="bento-grid">
         {/* 1. Identity Module (Large) */}
         <div className="bento-span-8 bento-item mat-glass-deep group min-h-[450px]">
            <div className="flex flex-col md:flex-row h-full gap-12">
                <div className="relative shrink-0 w-full md:w-64 aspect-[3/4] md:h-full bg-mat-rose/5 rounded-[3.5rem] overflow-hidden border border-mat-rose/20">
                  {profile?.photos?.[0] ? (
                    <img 
                      src={profile.photos[0]} 
                      className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-1000 filter sepia-[0.3]" 
                      alt="Identity" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-mat-rose/20 bg-mat-rose/5">
                      <ShieldCheck className="w-12 h-12 mb-4 opacity-40" />
                      <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Awaiting <br />Portrait</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <ShieldCheck className="text-white w-6 h-6" />
                     </div>
                     <Badge className="bg-mat-gold text-mat-wine px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest">{profile?.rank_tier || 'Seeker'}</Badge>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-4">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-mat-rose">Gentleman Identification</span>
                        <h2 className="text-5xl font-bold text-mat-wine italic leading-none">
                           {profile?.full_name?.split(' ')[0]} <br />
                           <span className="opacity-20">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                     </div>
                     
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 bg-mat-rose/5 text-mat-wine text-[9px] font-bold uppercase tracking-widest rounded-xl italic">{profile?.city || 'Undisclosed'}</Badge>
                        <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 bg-mat-gold/5 text-mat-gold-deep text-[9px] font-bold uppercase tracking-widest rounded-xl italic">Verified Initiate</Badge>
                     </div>

                     <p className="text-[14px] text-mat-slate font-medium leading-relaxed italic border-l-2 border-mat-gold/30 pl-6">
                        "{profile?.bio || "No narrative established. Update your identity via the administrative hub."}"
                     </p>
                  </div>

                  <div className="pt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/50">
                     <div className="flex items-center gap-2">
                        <Clock size={12} className="text-mat-rose" />
                        Joined {new Date(profile?.created_at).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-2">
                        <Activity size={12} className="text-mat-rose" />
                        Last Synch: Today
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Rank Status (Small) */}
         <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream group h-full shadow-mat-premium">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-bold italic leading-none text-mat-cream">Standing <br /><span className="text-mat-gold/40 text-xl">Index.</span></h3>
                     <Crown className="text-mat-gold w-6 h-6" />
                  </div>
                  <p className="text-mat-cream/40 font-medium text-[9px] uppercase leading-relaxed italic">Your relative standing among all aspirants in the sanctuary.</p>
               </div>

               <div className="py-12 border-y border-white/5 space-y-8">
                  <div className="flex justify-between items-end">
                     <span className="text-7xl font-bold text-mat-cream tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>#{absRank || '--'}</span>
                     <div className="text-right">
                        <p className="text-[9px] font-bold uppercase text-mat-gold tracking-widest">Top {( (absRank || 0) / (totalMen || 1) * 100 ).toFixed(1)}%</p>
                        <p className="text-[12px] font-bold text-mat-cream/40 italic">Global Merit</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-mat-cream/40">
                        <span>Progress to {nextLevel.name}</span>
                        <span>{Math.round(progressToNext)}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${progressToNext}%` }} 
                           className="h-full bg-mat-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        />
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleBumpRank} 
                  disabled={isBumping || (profile?.tokens || 0) < 49}
                  className="w-full h-20 bg-mat-cream text-mat-wine font-bold uppercase tracking-[0.5em] text-[10px] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 shadow-sm"
               >
                  {isBumping ? "Processing..." : "Augment Rank"}
                  <ArrowUpRight size={16} />
               </button>
            </div>
         </div>

         {/* 3. Soul Matrix (Medium) */}
         <div className="bento-span-8 bento-item mat-glass p-12">
            <div className="space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold italic leading-none text-mat-wine">Soul Index.</h3>
                     <p className="text-mat-rose font-bold uppercase tracking-[0.4em] text-[9px]">Verified Resonance Metrics</p>
                  </div>
                  <TrendingUp className="text-mat-wine/10 w-8 h-8" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  {[
                    { label: 'Authenticity Node', val: 92, color: 'bg-mat-gold' },
                    { label: 'Presence Coefficient', val: 84, color: 'bg-mat-rose' },
                    { label: 'Dialog Standing', val: 88, color: 'bg-mat-wine' },
                    { label: 'Kindness Metric', val: 95, color: 'bg-mat-rose-deep' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/40 italic">{stat.label}</span>
                          <span className="text-xs font-bold text-mat-wine">{stat.val}%</span>
                       </div>
                       <div className="h-1 bg-mat-rose/10 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${stat.val}%` }} 
                             transition={{ delay: 0.5 + i * 0.1 }}
                             className={`h-full ${stat.color}`} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 4. Interaction Archives (Small) */}
         <div className="bento-span-4 bento-item mat-glass border-dashed border-mat-rose/30 group">
            <div className="flex flex-col h-full justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-14 h-14 mat-glass rounded-2xl flex items-center justify-center text-mat-rose group-hover:text-mat-wine transition-all shadow-sm">
                     <MessageSquare size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold italic leading-none text-mat-wine">Dialog <br /><span className="text-mat-rose/40 text-lg">Infrastructure.</span></h4>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Requests Sent', val: '14' },
                    { label: 'Accepted Matches', val: '4' },
                    { label: 'Profile Views', val: profile?.view_count || '284' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-mat-rose/10 text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-mat-slate/40">{item.label}</span>
                       <span className="text-mat-wine">{item.val}</span>
                    </div>
                  ))}
               </div>
               
               <div className="bg-mat-rose/5 rounded-2xl p-6 border border-mat-rose/10">
                  <p className="text-[9px] font-bold text-mat-slate/40 uppercase tracking-widest italic text-center leading-relaxed">
                     Engagement metrics are synchronized <br />every 24 temporal cycles.
                  </p>
               </div>
            </div>
         </div>

         {/* 5. Referral Covenant (Small) */}
         <div className="bento-span-4 bento-item mat-glass-deep p-12 group border border-mat-gold/20 shadow-mat-gold/5">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <Heart className="text-mat-rose/30 w-8 h-8 group-hover:text-mat-rose transition-colors" fill="currentColor" />
                  <h4 className="text-xl font-bold uppercase italic leading-none text-mat-wine">Covenant <br /><span className="text-mat-gold text-lg">Link.</span></h4>
                  <p className="text-mat-slate/60 font-medium text-[9px] uppercase leading-relaxed italic">Invite other seekers to augment your standing.</p>
               </div>
               
               <div className="mt-8 space-y-4">
                  <div className="bg-mat-ivory/50 border border-mat-gold/20 p-4 rounded-xl flex items-center justify-between">
                     <code className="text-[13px] font-bold text-mat-wine">{profile?.referral_code || 'MATRIARCH'}</code>
                     <button 
                       onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/onboarding?ref=${profile?.user_id}`);
                          alert("Covenant link archived.");
                       }}
                       className="text-[9px] font-bold uppercase tracking-widest text-mat-gold hover:text-mat-gold-deep transition-colors"
                     >Copy</button>
                  </div>
                  <p className="text-[8px] font-bold text-mat-slate/40 uppercase tracking-widest text-center">+500 Tokens per initiate</p>
               </div>
            </div>
         </div>

         {/* 6. Quick Discovery (Medium) - UPDATED TO INFINITE SCROLL */}
         <div className="bento-span-8 bento-item mat-glass p-0 overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-12 border-b border-mat-rose/10 bg-mat-ivory/50">
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold italic leading-none text-mat-wine">The Gaze.</h3>
                     <p className="text-mat-rose font-bold uppercase tracking-[0.4em] text-[9px]">Verified Female Initiates</p>
                  </div>
                  <Badge className="bg-mat-rose/10 text-mat-rose border-none px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest italic select-none">Observe Only</Badge>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-4 max-h-[500px]">
               {females.map((f, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/40 border border-mat-rose/5 select-none pointer-events-none group">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale sepia-[0.2] border border-mat-rose/10 transition-all group-hover:sepia-0 group-hover:grayscale-0">
                        {f.photos?.[0] ? (
                           <img src={f.photos[0]} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-mat-rose/5 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-mat-rose/20" />
                           </div>
                        )}
                     </div>
                     <div className="flex-1 truncate">
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-sm font-bold text-mat-wine italic truncate">{f.full_name}</span>
                           <span className="text-[10px] font-bold text-mat-rose/40">{calculateAge(f.date_of_birth)}Y</span>
                        </div>
                        <span className="block text-[10px] font-bold text-mat-slate/40 uppercase tracking-widest truncate">{f.occupation || 'Initiate Matriarch'}</span>
                     </div>
                     <div className="text-[9px] font-bold text-mat-gold uppercase tracking-[0.3em] opacity-40">Verified</div>
                  </div>
               ))}
               
               {hasMore && (
                  <button 
                    onClick={loadMore}
                    disabled={discoveryLoading}
                    className="w-full py-6 flex flex-col items-center justify-center gap-2 text-mat-rose/30 hover:text-mat-rose/60 transition-all group"
                  >
                     <span className="text-[9px] font-bold uppercase tracking-[0.4em]">{discoveryLoading ? 'Invoking...' : 'View More'}</span>
                     {!discoveryLoading && <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform" />}
                  </button>
               )}

               {!hasMore && females.length > 0 && (
                  <p className="text-center py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-rose/10 italic">The Gaze Complete // End of Record</p>
               )}
            </div>
         </div>
      </div>

      <div className="py-24 text-center border-t border-mat-rose/10">
         <p className="text-[11px] font-bold uppercase tracking-[1em] opacity-20 select-none text-mat-wine">
            Matriarch // Standing Absolute // Verified Presence
         </p>
      </div>
    </div>
  );
};
