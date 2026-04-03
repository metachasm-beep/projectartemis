import React from 'react';
import { motion } from 'framer-motion';
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { supabase } from '@/lib/supabase';
import { FAQ } from '@/components/FAQ';

interface MenDashboardProps {
  profile: any;
  status: any;
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
    <div className="mat-shell pb-32 mat-noise-overlay relative overflow-hidden bg-[#0F0F10]">
      {/* High-Grit Background Accents */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-mat-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-900/10 blur-[100px] rounded-full" />
      </div>

      <main className="mat-container pt-12 space-y-12">
        {!profile?.is_verified && (
          <VerificationPrompt 
            userId={profile?.user_id} 
            role="man" 
            onVerified={() => window.location.reload()} 
          />
        )}
        {/* Presence Header */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-8 pb-6 border-b border-white/5 mat-stagger-fade-in">
           <div className="space-y-2">
              <span className="mat-text-label-pro">Your Journey / The Spotlight</span>
              <h1 className="mat-text-display-pro text-white leading-none">
                <DecryptedText 
                  text="Your Charisma" 
                  animateOn="view" 
                  speed={120} 
                  className="inline-block" 
                  sequential
                /> <br className="lg:hidden" /> <span className="mat-text-gradient-gold ring-mat-gold/20">& Connections</span>
              </h1>
           </div>
           <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-end justify-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10 group relative cursor-help">
                 <span className="mat-text-label-pro mb-1">Tokens</span>
                 <span className="text-xl lg:text-2xl font-display font-black text-white italic tracking-tighter">₹{profile?.tokens || 0}</span>
                 
                 {/* Divine Blessings Info */}
                 <div className="absolute top-full mt-4 right-0 w-56 p-5 bg-[#0F0F10] border border-mat-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap size={12} className="text-mat-gold" />
                       <span className="mat-text-label-pro text-mat-gold">Divine Blessings</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">Daily Entry</span>
                          <span className="text-white">+10</span>
                       </div>
                       <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">7 Day Streak</span>
                          <span className="text-mat-gold">+100</span>
                       </div>
                       <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">30 Day Streak</span>
                          <span className="text-mat-gold">+1000</span>
                       </div>
                    </div>
                 </div>
              </div>
              <Button variant="gold" className="gap-2 shadow-mat-gold h-14 lg:h-12 px-6 lg:px-8 shrink-0" onClick={handleBuyTokens}>
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Get Tokens</span>
                <span className="sm:hidden">Buy</span>
              </Button>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mat-stagger-fade-in">
           {/* Rank Ladder Visualization */}
           <Card className="lg:col-span-4 mat-panel-premium bg-black/40 border-white/5 rounded-[2rem] p-6 lg:p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="mat-text-label-pro">Path to Her Heart</h3>
                 <Trophy className="w-4 h-4 text-mat-gold" />
              </div>
              
              <div className="space-y-4 relative">
                 <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-white/5" />
                 {RANK_LADDER.map((rank, i) => {
                    const isCurrent = currentLevel.id === rank.id;
                    const isPast = RANK_LADDER.indexOf(currentLevel) >= i;
                    
                    return (
                      <div key={rank.id} className={cn(
                        "flex items-center gap-4 relative transition-all duration-500",
                        isCurrent ? "scale-105 pl-2" : "opacity-40"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center z-10 bg-black",
                          isCurrent ? "border-mat-gold ring-4 ring-mat-gold/20" : isPast ? "border-mat-gold/40" : "border-white/10"
                        )}>
                          {isCurrent ? <Crown className="w-4 h-4 text-mat-gold" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                        </div>
                        <div className="flex-1">
                           <div className={cn("text-[10px] font-black uppercase tracking-widest", rank.color)}>
                              {rank.name}
                           </div>
                           {isCurrent && (
                             <div className="text-[9px] text-white/40 font-mono mt-1 uppercase">
                                Next Tier: {nextLevel.name} in {nextLevel.min - (status?.rank_score || 0)} pts
                             </div>
                           )}
                        </div>
                      </div>
                    );
                 })}
              </div>
           </Card>

           {/* Presence Centerpiece */}
           <Card className="lg:col-span-8 mat-panel-premium bg-black/40 border-none relative overflow-hidden group rounded-[2rem] lg:rounded-[2.5rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-mat-gold/5 via-transparent to-transparent pointer-events-none" />
              
              <CardHeader className="p-8 lg:p-12 pb-0">
                 <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="space-y-4">
                       <span className="mat-text-label-pro text-mat-gold">Your Place in Her World</span>
                       <h2 className="text-7xl lg:text-9xl mat-text-display-pro text-white leading-none">
                          #{absRank || '--'}
                       </h2>
                    </div>
                    <div className="lg:text-right space-y-2">
                       <Badge variant="outline" className="border-mat-gold/30 text-mat-gold py-1.5 text-[8px] lg:text-[9px] uppercase tracking-widest whitespace-nowrap">
                          Among {totalMen} Waiting Hearts
                       </Badge>
                       <p className="mat-text-label-pro opacity-30 mt-1">Score: {Math.round(status?.rank_score || 0)}</p>
                    </div>
                 </div>
              </CardHeader>
              
              <CardContent className="p-8 lg:p-12 space-y-12">
                 <div className="space-y-4">
                    <div className="flex justify-between mat-text-label-pro text-white/40">
                       <span>Becoming Your Best Self</span>
                       <span className="text-mat-gold">{Math.round(progressToNext)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressToNext}%` }}
                          className="h-full bg-mat-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                       />
                    </div>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div className="space-y-4 p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                        <div className="flex justify-between items-center">
                           <h4 className="mat-text-label-pro text-mat-gold">Steps to Shine Brighter</h4>
                           <TrendingUp className="w-4 h-4 text-mat-gold" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className={cn("w-4 h-4 rounded-full border border-white/20 flex items-center justify-center", profile?.is_verified && "bg-mat-gold border-none")}>
                                 {profile?.is_verified && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              <span className="uppercase tracking-widest text-[9px]">Verify Identity (Aadhaar Seal)</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center" />
                              <span className="uppercase tracking-widest text-[9px]">Refer a Friend (+500 Tokens)</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className={cn("w-4 h-4 rounded-full border border-white/20 flex items-center justify-center", (profile?.rank_boost_count > 0) && "bg-mat-gold border-none")}>
                                 {(profile?.rank_boost_count > 0) && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              <span className="uppercase tracking-widest text-[9px]">Gentle Nudges (Steps: {profile?.rank_boost_count || 0})</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-4 p-8 rounded-3xl bg-mat-gold/[0.02] border border-mat-gold/10">
                        <div className="flex justify-between items-center">
                           <h4 className="mat-text-label-pro text-mat-gold">Step into the Spotlight</h4>
                           <Zap className="w-4 h-4 text-mat-gold" />
                        </div>
                        <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-[0.2em] font-medium">Spend 49 tokens to override joining time disadvantage and scale the ladder instantly.</p>
                        <Button 
                          onClick={handleBumpRank} 
                          disabled={isBumping || (profile?.tokens || 0) < 49}
                          className="w-full h-12 bg-mat-gold text-black hover:bg-mat-gold/90 font-black tracking-widest uppercase rounded-xl shadow-mat-gold"
                        >
                           {isBumping ? "Bumping..." : "Shine Brighter for 49 Tokens"}
                        </Button>
                     </div>
                  </div>
              </CardContent>
           </Card>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mat-stagger-fade-in">
            {[
              { label: 'TRUTH', title: 'Aadhaar Seal', val: profile?.is_verified ? 'SECURED' : 'PENDING', icon: ShieldCheck, color: 'text-green-500' },
              { label: 'ADMIRATION', title: 'Who\'s Noticing You', val: `${profile?.view_count || 0}`, icon: Target, color: 'text-mat-gold' },
              { label: 'HEARTS', title: 'Hearts Reached', val: 'VIBRANT', icon: Zap, color: 'text-mat-gold' },
              { label: 'RADIANCE', title: 'Your Radiant Glow', val: 'ELEVATED', icon: TrendingUp, color: 'text-white' },
            ].map((item, i) => (
             <Card key={i} className="mat-panel mat-glass-premium border-none group cursor-pointer hover:bg-white/[0.06] transition-all rounded-[1.5rem] bg-white/[0.02]">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-6">
                      <item.icon className={cn("w-6 h-6", item.color)} strokeWidth={1} />
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <span className="mat-text-label-pro">{item.label}</span>
                      <h4 className="text-lg font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className={cn("text-[10px] font-black tracking-widest pt-2 mat-text-shimmer-subtle", item.color)}>{item.val}</p>
                   </div>
                   {item.label === 'HEARTS' && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                         <p className="mat-text-label-pro mb-3">Referral Code</p>
                         <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                            <span className="text-xs font-mono text-mat-gold">{profile?.referral_code || '---'}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] text-mat-gold/60 p-1 font-black tracking-widest"
                              onClick={() => {
                                navigator.clipboard.writeText(`https://matriarch.vercel.app/onboarding?ref=${profile?.user_id}`);
                                alert("Referral Link Copied!");
                              }}
                            >COPY LINK</Button>
                         </div>
                      </div>
                   )}
                </CardContent>
             </Card>
           ))}
        </div>

      <FAQ />

      {/* Industrial Footer */}
      <div className="py-20 text-center opacity-[0.03] pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[2em] text-white">MATRIARCH // A GARDEN OF SACRED CONNECTIONS // STANDING SECURED</span>
      </div>
    </main>

      {profile?.is_verified && !profile?.is_active && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="mat-container">
            <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center animate-pulse">
                   <Zap size={20} />
                </div>
                <div>
                  <p className="mat-text-label-pro text-amber-500">Profile Inactive</p>
                  <p className="text-[9px] text-white/60 uppercase font-medium">Your truth is sealed, but your presence is still being woven. This usually takes a few moments.</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => window.location.reload()} className="text-[9px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10">Synchronize</Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
