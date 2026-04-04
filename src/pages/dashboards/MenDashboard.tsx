import React from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Target,
  Crown,
  TrendingUp,
  ArrowUpRight,
  Check
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { supabase } from '@/lib/supabase';
import { FAQ } from '@/components/FAQ';

interface MenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
}

const RANK_LADDER = [
  { id: 'aspirant', name: 'The Hopeful', min: 0, color: 'text-orange-700' },
  { id: 'vanguard', name: 'The Brave', min: 1000, color: 'text-slate-400' },
  { id: 'noble', name: 'The Gentleman', min: 2500, color: 'text-amber-500' },
  { id: 'paragon', name: 'The Ideal', min: 5000, color: 'text-cyan-400' },
  { id: 'ascendant', name: 'The Chosen', min: 10000, color: 'text-indigo-400' },
  { id: 'choice', name: 'The One', min: 25000, color: 'text-matriarch-gold' }
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
      // 1. Total men count
      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'man');
      setTotalMen(total || 0);

      // 2. Absolute rank logic
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
      window.location.reload(); // Refresh to update rank
    } catch (err) {
      console.error("Bump error:", err);
    } finally {
      setIsBumping(false);
    }
  };

  const handleBuyTokens = async () => {
    const amount = window.prompt("Enter token amount to buy (₹1 = 1 Token):", "100");
    if (!amount || isNaN(parseInt(amount))) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          tokens: (profile.tokens || 0) + parseInt(amount),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      window.location.reload();
    } catch (err) {
      console.error("Purchase error:", err);
    }
  };

  const currentLevel = RANK_LADDER.find(r => r.id === status?.rank_tier?.toLowerCase()) || RANK_LADDER[0];
  const nextLevel = RANK_LADDER[RANK_LADDER.indexOf(currentLevel) + 1] || currentLevel;
  const progressToNext = ((status?.rank_score || 0) - currentLevel.min) / (nextLevel.min - currentLevel.min) * 100;

  return (
    <div className="min-h-screen bg-white">
      <main className="mat-container pt-24 space-y-24">
        {!profile?.is_verified && (
          <div className="bg-black text-white p-12 border border-black mb-12">
             <VerificationPrompt 
               userId={profile?.user_id} 
               role="man" 
               onVerified={() => window.location.reload()} 
             />
          </div>
        )}

        {/* Presence Header */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-12 border-b border-black/10">
           <div className="space-y-6">
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-black/10 rounded-none">Protocol // Standing</Badge>
              <h1 className="text-6xl lg:text-8xl mat-text-display-pro text-black leading-[0.9] uppercase tracking-tighter">
                Your <br />
                <span className="text-black/20">Charisma.</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-px bg-black/5 border border-black/5 p-px w-full lg:w-auto">
              <div className="bg-white px-12 py-8 flex flex-col items-start min-w-[200px]">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-2">Tokens</span>
                 <span className="text-4xl mat-text-display-pro text-black">₹{profile?.tokens || 0}</span>
              </div>
              <button 
                className="bg-black text-white px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-neutral-800 transition-all h-full"
                onClick={handleBuyTokens}
              >
                Augment Standing
              </button>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-black/5 border border-black/5">
           {/* Rank Ladder Visualization */}
           <div className="lg:col-span-4 bg-white p-12 space-y-12">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Ladder Status</h3>
                 <Trophy className="w-5 h-5 text-black" strokeWidth={1} />
              </div>
              
              <div className="space-y-6">
                 {RANK_LADDER.map((rank, i) => {
                    const isCurrent = currentLevel.id === rank.id;
                    const isPast = RANK_LADDER.indexOf(currentLevel) >= i;
                    
                    return (
                      <div key={rank.id} className={cn(
                        "flex items-center gap-6 p-4 transition-all duration-500",
                        isCurrent ? "bg-black text-white" : "text-black/40"
                      )}>
                        <div className={cn(
                          "w-6 h-6 border flex items-center justify-center font-black text-[9px]",
                          isCurrent ? "border-white/20" : "border-black/10"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                           <div className="text-[10px] font-black uppercase tracking-widest">
                              {rank.name}
                           </div>
                        </div>
                        {isCurrent && <Crown className="w-4 h-4 text-white" strokeWidth={1} />}
                      </div>
                    );
                 })}
              </div>
           </div>

           {/* Presence Centerpiece */}
           <div className="lg:col-span-8 bg-white p-12 lg:p-24 space-y-24">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                 <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Standing Index</span>
                    <h2 className="text-8xl lg:text-[12rem] mat-text-display-pro text-black leading-none tracking-tighter">
                       #{absRank || '--'}
                    </h2>
                 </div>
                 <div className="lg:text-right space-y-4">
                    <Badge variant="outline" className="border-black/10 text-black px-4 py-1 text-[9px] uppercase tracking-widest rounded-none">
                       Among {totalMen} Aspirants
                    </Badge>
                    <p className="text-xl font-medium text-black/40">Score // {Math.round(status?.rank_score || 0)}</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-black/40">
                    <span>Evolution Progress</span>
                    <span className="text-black">{Math.round(progressToNext)}%</span>
                 </div>
                 <div className="h-4 bg-black/5 relative">
                    <div className="absolute inset-y-0 left-0 bg-black" style={{ width: `${progressToNext}%` }} />
                 </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
                  <div className="bg-white p-12 space-y-8">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Requirement Archive</h4>
                     </div>
                     <div className="space-y-6">
                        {[
                          { label: "Identity Seal", status: profile?.is_verified },
                          { label: "Social standing", status: false },
                          { label: "Referral integrity", status: false }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/60">
                             <div className={cn("w-4 h-4 border flex items-center justify-center", item.status ? "bg-black border-black text-white" : "border-black/10")}>
                                {item.status && <Check className="w-3 h-3" />}
                             </div>
                             <span>{item.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-black text-white p-12 space-y-8">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Instant Elevation</h4>
                        <Zap className="w-4 h-4 text-white" />
                     </div>
                     <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest font-black">Augment visibility for 49 tokens.</p>
                     <button 
                       onClick={handleBumpRank} 
                       disabled={isBumping || (profile?.tokens || 0) < 49}
                       className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-neutral-200 transition-all"
                     >
                        {isBumping ? "Processing..." : "Augment Rank"}
                     </button>
                  </div>
               </div>
           </div>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
            {[
              { label: 'TRUTH', title: 'Identity Seal', val: profile?.is_verified ? 'SECURED' : 'PENDING', icon: ShieldCheck },
              { label: 'ATTENTION', title: 'Admiration Index', val: `${profile?.view_count || 0}`, icon: Target },
              { label: 'DEVOTION', title: 'Hearts Reached', val: 'VIBRANT', icon: Zap },
              { label: 'RADIANCE', title: 'Standing Score', val: 'ELEVATED', icon: TrendingUp },
            ].map((item, i) => (
             <div key={i} className="bg-white p-12 space-y-12 group hover:bg-black/5 transition-all">
                <div className="flex justify-between items-start">
                   <item.icon className="w-6 h-6 text-black" strokeWidth={1} />
                   <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-black transition-colors" />
                </div>
                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">{item.label}</span>
                   <h4 className="text-xl font-bold text-black uppercase tracking-tight">{item.title}</h4>
                   <p className="text-[11px] font-black tracking-widest text-black/60 uppercase">{item.val}</p>
                </div>
                {item.label === 'DEVOTION' && (
                   <div className="pt-8 border-t border-black/5 space-y-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40">Referral Protocol</span>
                      <div className="flex items-center justify-between p-4 bg-black/5 border border-black/5">
                         <span className="text-xs font-mono font-bold text-black">{profile?.referral_code || '---'}</span>
                         <button 
                           className="text-[9px] font-black uppercase tracking-widest text-black hover:underline"
                           onClick={() => {
                             navigator.clipboard.writeText(`${window.location.origin}/onboarding?ref=${profile?.user_id}`);
                             alert("Protocol Link Archived.");
                           }}
                         >COPY</button>
                      </div>
                   </div>
                )}
             </div>
           ))}
        </div>

        <FAQ />

        {/* Swiss Footer */}
        <div className="py-40 text-center border-t border-black/5">
          <p className="text-[11px] font-black uppercase tracking-[1.5em] text-black/10">
            MATRIARCH // ABSOLUTE STANDING // SECURED
          </p>
        </div>
      </main>

      {profile?.is_verified && !profile?.is_active && (
        <div className="fixed bottom-12 left-12 right-12 z-[60] bg-black text-white p-8 border border-white/20">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center animate-pulse">
                   <Zap size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Profile Status</p>
                  <p className="text-[11px] font-black uppercase tracking-widest">Truth Sealed // Alignment Processing</p>
                </div>
              </div>
              <button onClick={() => window.location.reload()} className="text-[11px] font-black uppercase tracking-[0.4em] hover:underline">Synchronize</button>
            </div>
        </div>
      )}
    </div>
  );
};
