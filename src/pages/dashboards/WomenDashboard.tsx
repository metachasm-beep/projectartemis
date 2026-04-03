import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Crown,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import SoftAurora from "@/components/ui/react-bits/SoftAurora";
import CountUp from "@/components/ui/react-bits/CountUp";

import { FAQ } from '@/components/FAQ';

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleBoost: () => void;
}

export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleBoost 
}) => {
  const tierColor = status?.rank_tier === 'elite' ? 'text-matriarch-gold' : status?.rank_tier === 'high' ? 'text-matriarch-violetBright' : 'text-matriarch-textSoft';

  return (
    <div className="mat-shell pb-32 mat-noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
        <SoftAurora 
          speed={0.1} 
          brightness={0.8} 
          color1="#6E3FF3" 
          color2="#24152E" 
          enableMouseInteraction={false}
        />
      </div>

      <main className="mat-container pt-12 space-y-12">
        {!profile?.is_verified && (
          <VerificationPrompt 
            userId={profile?.user_id} 
            role="woman" 
            onVerified={() => window.location.reload()} 
          />
        )}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-8 pb-6 border-b border-white/5 mat-stagger-fade-in font-display">
           <div className="space-y-2">
              <span className="mat-text-label-pro">Your Journey / The Inner Sanctuary</span>
              <h1 className="mat-text-display-pro text-white leading-none">
                <DecryptedText 
                  text="The" 
                  animateOn="view" 
                  speed={120} 
                  className="inline-block" 
                  sequential
                /> <br className="lg:hidden" /> <span className="mat-text-gradient-gold ring-mat-gold/20">Inner Sanctuary</span>
                 <div className="group relative cursor-help ml-2 inline-block">
                    <Badge variant="gold" className="text-[7px] lg:text-[8px] px-2 py-0.5 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 h-fit">
                       <Zap size={8} /> Blessings
                    </Badge>
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 left-0 w-48 p-4 bg-[#0F0F10] border border-mat-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left">
                     <p className="mat-text-label-pro text-mat-gold mb-3 flex items-center gap-2 not-italic">
                        <Zap size={10} /> Divine Rewards
                     </p>
                     <div className="space-y-1.5 font-sans">
                        <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                           <span className="text-white/40">Daily Entry</span>
                           <span className="text-mat-gold">+10</span>
                        </div>
                        <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                           <span className="text-white/40">7 Day Streak</span>
                           <span className="text-mat-gold">+100</span>
                        </div>
                        <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                           <span className="text-white/40">30 Day Streak</span>
                           <span className="text-mat-gold">+1000</span>
                        </div>
                     </div>
                   </div>
                 </div>
              </h1>
           </div>
           <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button variant="secondary" className="flex-1 lg:flex-none h-14 lg:h-12 gap-2 transition-transform hover:scale-95 font-black uppercase text-[10px] tracking-widest px-6">
                <TrendingUp className="w-4 h-4" />
                History
              </Button>
              <Button variant="gold" className="flex-1 lg:flex-none gap-2 shadow-mat-gold h-14 lg:h-12 px-6 lg:px-8 font-black uppercase text-[10px] tracking-widest shrink-0" onClick={handleBoost} disabled={status?.points < 100}>
                <Zap className="w-4 h-4" />
                {status?.points >= 100 ? ( <span className="whitespace-nowrap">Boost Visibility</span> ) : ( <span className="whitespace-nowrap">Need 100 Pts</span> )}
              </Button>
           </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mat-stagger-fade-in">
           <Card className="md:col-span-2 mat-glass-premium mat-float-hover border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                <Trophy size={200} />
              </div>
              <CardHeader className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                   <div>
                      <CardTitle className="mb-4">
                        <span className="mat-text-label-pro">Your Divine Grace</span>
                      </CardTitle>
                      <div className="flex items-center gap-4">
                         <h2 className="text-5xl lg:text-7xl mat-text-display-pro text-white leading-tight">
                           {status?.rank_tier === 'matriarch' ? "THE QUEEN'S GRACE" : (status?.rank_tier?.toUpperCase() || 'SOUL')}
                         </h2>
                         <Crown className={cn("w-8 h-8 lg:w-12 lg:h-12 animate-pulse", tierColor)} strokeWidth={1} />
                      </div>
                   </div>
                   <div className="lg:text-right">
                      <div className="mat-text-label-pro text-mat-gold mb-2">
                        {status?.rank_tier === 'matriarch' ? 'Inner Light' : 'Grace Level'}
                      </div>
                      <div className="text-5xl mat-text-display-pro text-white mat-text-glow-gold leading-none">
                        <CountUp to={Math.round(status?.rank_score || 0)} duration={2.5} />
                      </div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="mt-8 space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between mat-text-label-pro text-matriarch-textSoft">
                       <span>{status?.rank_tier === 'matriarch' ? 'Heart Harmony' : 'Heartfelt Connection'}</span>
                       <span className="text-matriarch-gold">
                         <CountUp to={99.4} duration={3} />%
                       </span>
                    </div>
                    <Progress value={99} className="h-2 bg-white/5" />
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <Badge variant="violet" className="font-black tracking-widest text-[9px] px-3 py-1 uppercase">{status?.rank_tier === 'matriarch' ? 'Arch-Matriarch' : 'Top 0.1% Globally'}</Badge>
                    <Badge variant="violet" className="font-black tracking-widest text-[9px] px-3 py-1 uppercase">Premium Verified</Badge>
                    <Badge variant="violet" className="font-black tracking-widest text-[9px] px-3 py-1 uppercase">Matriarch Story</Badge>
                 </div>
              </CardContent>
           </Card>

           <Card className="mat-panel mat-glass-premium mat-float-hover border-none flex flex-col justify-between p-6">
              <CardHeader className="p-0">
                <CardTitle className="mb-6">
                   <span className="mat-text-label-pro">True Reflection</span>
                </CardTitle>
                <div className="flex justify-center">
                   <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                         <circle 
                           className="text-white/5" 
                           strokeWidth="8" 
                           stroke="currentColor" 
                           fill="transparent" 
                           r="40" cx="50" cy="50" 
                         />
                         <circle 
                           className="text-matriarch-violetBright" 
                           strokeWidth="8" 
                           strokeDasharray="251.2" 
                           strokeDashoffset={251.2 * (1 - ((status?.profile_completeness_pct || 0) / 100))} 
                           strokeLinecap="round" 
                           stroke="currentColor" 
                           fill="transparent" 
                           r="40" cx="50" cy="50" 
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-3xl mat-text-display-pro text-white not-italic">
                           <CountUp to={status?.profile_completeness_pct || 0} duration={3} />%
                         </span>
                      </div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="text-center p-0 mt-8">
                 <p className="text-[10px] font-black tracking-widest uppercase text-matriarch-textSoft mb-6 opacity-60">Complete your story to find your kindred spirit.</p>
                 <Button variant="secondary" size="sm" className="w-full transition-transform hover:scale-[0.98] font-black uppercase tracking-widest text-[10px] h-12">Edit Profile</Button>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mat-stagger-fade-in text-display text-white">
           {[
              { label: 'TRUTH', title: 'Aadhaar Seal', val: profile?.is_verified ? 'VERIFIED' : 'PENDING', icon: ShieldCheck, color: 'text-matriarch-violetBright' },
              { label: 'LIGHT', title: 'Inner Glow', val: status?.rank_tier === 'matriarch' ? 'RADIANT' : 'GATHERING', icon: Zap, color: 'text-matriarch-plum' },
              { label: 'WHISPERS', title:  status?.rank_tier === 'matriarch' ? 'Heartbeats' : 'Secret Whispers', val: '0', icon: Heart, color: 'text-matriarch-gold' },
              { label: 'ENERGY', title: 'Gentle Energy', val: 'STABLE', icon: Activity, color: 'text-white' },
           ].map((item, i) => (
             <Card key={i} className="mat-panel mat-glass-premium mat-float-hover border-none group cursor-pointer hover:bg-white/[0.06] transition-all bg-white/[0.02]">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-6">
                      <item.icon className={cn("w-6 h-6", item.color)} strokeWidth={1.5} />
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <span className="mat-text-label-pro">{item.label}</span>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className={cn("text-[10px] font-black tracking-widest pt-2 mat-text-shimmer-subtle", item.color)}>{item.val}</p>
                   </div>
                   {item.label === 'TRUTH' && (
                       <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="mat-text-label-pro mb-3">Referral Code</p>
                          <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 font-sans">
                             <span className="text-xs font-mono text-matriarch-violetBright">{profile?.referral_code || '---'}</span>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="h-6 text-[8px] text-matriarch-violetBright/60 p-1 font-black uppercase tracking-widest"
                               onClick={(e: React.MouseEvent) => {
                                 e.stopPropagation();
                                 navigator.clipboard.writeText(`https://matriarch.vercel.app/onboarding?ref=${profile?.user_id}`);
                                 alert("Referral Link Copied!");
                               }}
                             >COPY</Button>
                          </div>
                       </div>
                   )}
                </CardContent>
             </Card>
           ))}
        </div>

        <FAQ />

        <div className="py-20 text-center opacity-[0.03] pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-white">MATRIARCH // WHERE EVERY STORY BEGINS WITH HER CHOICE</span>
        </div>
      </main>

      {profile?.is_verified && !profile?.is_active && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="mat-container">
            <div className="bg-matriarch-violetBright/10 border border-matriarch-violetBright/20 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-matriarch-violetBright text-white flex items-center justify-center animate-pulse">
                   <Zap size={20} />
                </div>
                <div>
                  <p className="mat-text-label-pro text-matriarch-violetBright">Awaiting Activation</p>
                  <p className="text-[9px] text-white/60 uppercase font-medium">The Sanctuary is synchronizing your truth. This usually takes just a few moments.</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => window.location.reload()} className="text-[9px] font-black uppercase tracking-widest text-matriarch-violetBright hover:bg-matriarch-violetBright/10">Sync</Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
