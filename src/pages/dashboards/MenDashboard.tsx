import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Crown,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Target,
  Search,
  MessageSquare,
  Clock,
  Heart
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { supabase } from '@/lib/supabase';
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

  const fetchRank = React.useCallback(async () => {
    if (!profile) return;
    
    try {
      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'man');
      setTotalMen(total || 0);

      const { data: higherRanked } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('role', 'man')
        .or(`is_verified.gt.${profile.is_verified},and(is_verified.eq.${profile.is_verified},rank_boost_count.gt.${profile.rank_boost_count || 0}),and(is_verified.eq.${profile.is_verified},rank_boost_count.eq.${profile.rank_boost_count || 0},created_at.lt.${profile.created_at})`);
      
      setAbsRank((higherRanked?.length || 0) + 1);
    } catch (err) {
      console.error("Rank calculation error:", err);
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
      const { error } = await supabase
        .from('profiles')
        .update({ 
          tokens: profile.tokens - 49,
          rank_boost_count: (profile.rank_boost_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      window.location.reload();
    } catch (err) {
      console.error("Bump error:", err);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-black/5">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-black/10 text-black/40 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Protocol // Standing</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-black italic lowercase leading-none">Your <br /><span className="text-black/20">Presence.</span></h1>
        </div>
        
        <div className="flex gap-px bg-black/5 p-px w-full md:w-auto overflow-hidden rounded-[2rem] mat-glass border border-black/5">
           <div className="bg-white/80 px-10 py-6 flex flex-col justify-center min-w-[160px]">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Merit Tokens</span>
              <span className="text-2xl font-black text-black">₹{profile?.tokens || 0}</span>
           </div>
           <button 
             onClick={() => {
                const amount = window.prompt("Enter token amount to buy (₹1 = 1 Token):", "100");
                if (amount) window.location.reload(); 
             }}
             className="bg-black text-white px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
           >
             Augment <Zap size={14} className="text-mat-gold" />
           </button>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[3.5rem] border-red-500/10">
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
               <div className="relative shrink-0 w-full md:w-64 aspect-[3/4] md:h-full bg-black/5 rounded-[3.5rem] overflow-hidden border border-black/5">
                  <img 
                    src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                    alt="Identity" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <ShieldCheck className="text-white w-6 h-6" />
                     </div>
                     <Badge className="bg-mat-gold text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{profile?.rank_tier || 'Seeker'}</Badge>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-4">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">Citizen Identification</span>
                        <h2 className="text-5xl font-black text-black italic uppercase tracking-tighter leading-none">
                           {profile?.full_name?.split(' ')[0]} <br />
                           <span className="opacity-10">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                     </div>
                     
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="px-5 py-2 border-black/5 bg-black/5 text-black text-[9px] font-black uppercase tracking-widest rounded-xl italic">{profile?.city || 'Undisclosed'}</Badge>
                        <Badge variant="outline" className="px-5 py-2 border-black/5 bg-black/5 text-black text-[9px] font-black uppercase tracking-widest rounded-xl italic">Verified Initiate</Badge>
                     </div>

                     <p className="text-[12px] text-black/60 font-mono leading-relaxed uppercase max-w-sm border-l-2 border-black/5 pl-6 italic">
                        {profile?.bio || "No narrative established. Update your identity via the administrative hub."}
                     </p>
                  </div>

                  <div className="pt-8 flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-black/20">
                     <div className="flex items-center gap-2">
                        <Clock size={12} />
                        Joined {new Date(profile?.created_at).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-2">
                        <Activity size={12} />
                        Last Synch: Today
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Rank Status (Small) */}
         <div className="bento-span-4 bento-item bg-black text-white group h-full">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Standing <br /><span className="opacity-20 text-xl">Index.</span></h3>
                     <Crown className="text-mat-gold w-6 h-6" />
                  </div>
                  <p className="text-white/40 font-mono text-[9px] uppercase leading-relaxed italic">Your relative standing among all aspirants in the sanctuary.</p>
               </div>

               <div className="py-12 border-y border-white/5 space-y-8">
                  <div className="flex justify-between items-end">
                     <span className="text-7xl font-black text-white tracking-tighter">#{absRank || '--'}</span>
                     <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-mat-gold tracking-widest">Top {( (absRank || 0) / (totalMen || 1) * 100 ).toFixed(1)}%</p>
                        <p className="text-[12px] font-black text-white/40 italic">Global Merit</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
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
                  className="w-full h-20 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3"
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
                     <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Soul Index.</h3>
                     <p className="text-black/30 font-black uppercase tracking-[0.4em] text-[9px]">Verified Resonance Metrics</p>
                  </div>
                  <TrendingUp className="text-black/10 w-8 h-8" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  {[
                    { label: 'Authenticity Node', val: 92, color: 'bg-green-500' },
                    { label: 'Presence Coefficient', val: 84, color: 'bg-mat-gold' },
                    { label: 'Dialog Standing', val: 88, color: 'bg-matriarch-violet' },
                    { label: 'Kindness Metric', val: 95, color: 'bg-red-400' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">{stat.label}</span>
                          <span className="text-xs font-black text-black">{stat.val}%</span>
                       </div>
                       <div className="h-1 bg-black/5 rounded-full overflow-hidden">
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
         <div className="bento-span-4 bento-item mat-glass border-dashed border-black/10 group">
            <div className="flex flex-col h-full justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-14 h-14 mat-glass rounded-2xl flex items-center justify-center text-black/20 group-hover:text-black transition-all">
                     <MessageSquare size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-black italic uppercase tracking-tighter italic leading-none">Dialog <br /><span className="opacity-10 text-lg">Infrastructure.</span></h4>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Requests Sent', val: '14' },
                    { label: 'Accepted Matches', val: '4' },
                    { label: 'Profile Views', val: profile?.view_count || '284' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-black/5 text-[10px] font-black uppercase tracking-widest">
                       <span className="text-black/20">{item.label}</span>
                       <span className="text-black">{item.val}</span>
                    </div>
                  ))}
               </div>
               
               <div className="bg-black/5 rounded-2xl p-6 border border-black/5">
                  <p className="text-[9px] font-black text-black/40 uppercase tracking-widest italic text-center leading-relaxed">
                     Engagement metrics are synchronized <br />every 24 temporal cycles.
                  </p>
               </div>
            </div>
         </div>

         {/* 5. Referral Covenant (Small) */}
         <div className="bento-span-4 bento-item mat-glass-deep p-12 group">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <Heart className="text-red-500/20 w-8 h-8 group-hover:text-red-500 transition-colors" />
                  <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">Covenant <br />Link.</h4>
                  <p className="text-black/40 font-mono text-[9px] uppercase leading-relaxed">Invite other seekers to augment your standng.</p>
               </div>
               
               <div className="mt-8 space-y-4">
                  <div className="bg-white/50 border border-black/5 p-4 rounded-xl flex items-center justify-between">
                     <code className="text-[13px] font-black text-black">{profile?.referral_code || 'MATRIARCH'}</code>
                     <button 
                       onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/onboarding?ref=${profile?.user_id}`);
                          alert("Covenant link archived.");
                       }}
                       className="text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                     >Copy</button>
                  </div>
                  <p className="text-[8px] font-black text-black/20 uppercase tracking-widest text-center">+500 Tokens per initiate</p>
               </div>
            </div>
         </div>

         {/* 6. Quick Discovery (Medium) */}
         <div className="bento-span-8 bento-item mat-glass p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
               <div className="space-y-6">
                  <h4 className="text-3xl font-black italic uppercase italic tracking-tighter leading-none">Synchronize <br /><span className="opacity-10 text-2xl">Presence.</span></h4>
                  <p className="text-black/60 text-xs font-mono uppercase max-w-sm">Enter the discovery layer to broadcast your designation to verified matriarchs.</p>
               </div>
               <button 
                 className="h-20 px-12 bg-black text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] hover:bg-neutral-800 transition-all flex items-center gap-4 group"
               >
                  Open Discovery Layer <Target size={18} className="group-hover:scale-125 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      <div className="py-24 text-center border-t border-black/5">
         <p className="text-[11px] font-black uppercase tracking-[1em] opacity-5 select-none">
            Matriarch // Standing Absolute // Verified Presence
         </p>
      </div>
    </div>
  );
};
