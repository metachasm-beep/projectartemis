import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Target,
  Crown,
  TrendingUp,
  Fingerprint,
  ArrowUpRight,
  LogOut,
  Check
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { cn } from "@/lib/utils";
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { supabase } from '@/lib/supabase';

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
  status, 
  handleLogout
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
      // We rank by: 1. is_verified (true first), 2. rank_boost_count (desc), 3. created_at (asc)
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
    // Simulated token purchase
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

      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={handleLogout} className="text-mat-gold/40 hover:text-mat-gold">
                <LogOut className="w-5 h-5" />
             </Button>
             <Badge variant="outline" className="hidden sm:flex py-1.5 border-mat-gold/30 text-mat-gold">
                <Fingerprint className="w-3 h-3 mr-2" />
                <DecryptedText 
                  text="A HEART DISCOVERED" 
                  animateOn="view" 
                  speed={80} 
                  className="tracking-widest" 
                  sequential
                />
             </Badge>
          </div>
        </div>
      </header>

      <main className="mat-container pt-12 space-y-12">
        {!profile?.is_verified && (
          <VerificationPrompt 
            userId={profile?.user_id} 
            role="man" 
            onVerified={() => window.location.reload()} 
          />
        )}
        {/* Presence Header */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4 border-b border-white/5 mat-stagger-fade-in">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-mat-gold/60 uppercase tracking-[0.4em]">Your Journey / The Spotlight</span>
              <h1 className="mat-heading-md">
                <DecryptedText 
                  text="Your Charisma" 
                  animateOn="view" 
                  speed={120} 
                  className="inline-block" 
                  sequential
                /> <span className="text-mat-gold italic">& Connections</span>
              </h1>
           </div>
           <div className="flex gap-4">
              <div className="flex flex-col items-end justify-center px-6 py-2 bg-white/5 rounded-2xl border border-white/10 group relative cursor-help">
                 <span className="text-[8px] font-black text-mat-gold/60 uppercase tracking-widest">Token Balance</span>
                 <span className="text-xl font-mono text-white">₹{profile?.tokens || 0}</span>
                 
                 {/* Divine Blessings Info */}
                 <div className="absolute top-full mt-4 right-0 w-56 p-5 bg-[#0F0F10] border border-mat-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap size={12} className="text-mat-gold" />
                       <span className="text-[10px] font-black text-mat-gold uppercase tracking-widest">Divine Blessings</span>
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
              <Button variant="gold" className="gap-2 shadow-mat-gold h-12 px-8" onClick={handleBuyTokens}>
                <Zap className="w-4 h-4" />
                Get Tokens
              </Button>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mat-stagger-fade-in">
           {/* Rank Ladder Visualization */}
           <Card className="lg:col-span-4 mat-panel-premium bg-black/40 border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Path to Her Heart</h3>
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
           <Card className="lg:col-span-8 mat-panel-premium bg-black/40 border-none relative overflow-hidden group rounded-[2.5rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-mat-gold/5 via-transparent to-transparent pointer-events-none" />
              
              <CardHeader className="p-12 pb-0">
                 <div className="flex justify-between items-start">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black text-mat-gold leading-none uppercase tracking-[0.5em]">Your Place in Her World</span>
                       <h2 className="text-8xl font-display font-black text-white tracking-tighter leading-none">
                          #{absRank || '--'}
                       </h2>
                    </div>
                    <div className="text-right space-y-2">
                       <Badge variant="outline" className="border-mat-gold/30 text-mat-gold py-1.5 text-[9px] uppercase tracking-widest">
                          Among {totalMen} Waiting Hearts
                       </Badge>
                       <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Score: {Math.round(status?.rank_score || 0)}</p>
                    </div>
                 </div>
              </CardHeader>
              
              <CardContent className="p-12 space-y-12">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
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
                           <h4 className="text-xs font-black text-mat-gold uppercase tracking-widest">Steps to Shine Brighter</h4>
                           <TrendingUp className="w-4 h-4 text-mat-gold" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className={cn("w-4 h-4 rounded-full border border-white/20 flex items-center justify-center", profile?.is_verified && "bg-mat-gold border-none")}>
                                 {profile?.is_verified && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              <span>Verify Identity (Aadhaar Seal)</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center" />
                              <span>Refer a Friend (+500 Tokens)</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                              <div className={cn("w-4 h-4 rounded-full border border-white/20 flex items-center justify-center", (profile?.rank_boost_count > 0) && "bg-mat-gold border-none")}>
                                 {(profile?.rank_boost_count > 0) && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              <span>Gentle Nudges (Steps: {profile?.rank_boost_count || 0})</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-4 p-8 rounded-3xl bg-mat-gold/[0.02] border border-mat-gold/10">
                        <div className="flex justify-between items-center">
                           <h4 className="text-xs font-black text-mat-gold uppercase tracking-widest">Step into the Spotlight</h4>
                           <Zap className="w-4 h-4 text-mat-gold" />
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">Spend 49 tokens to override joining time disadvantage and scale the ladder instantly.</p>
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
                      <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">{item.label}</span>
                      <h4 className="text-lg font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className={cn("text-[10px] font-black tracking-widest pt-2", item.color)}>{item.val}</p>
                   </div>
                   {item.label === 'HEARTS' && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                         <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-2">Referral Code</p>
                         <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                            <span className="text-xs font-mono text-mat-gold">{profile?.referral_code || '---'}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] text-mat-gold/60 p-1"
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
      </main>

      {/* Industrial Footer */}
      <div className="fixed bottom-0 w-full py-6 text-center pointer-events-none opacity-[0.03]">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-white">MATRIARCH // A GARDEN OF SACRED CONNECTIONS // STANDING SECURED</span>
      </div>
    </div>
  );
};
