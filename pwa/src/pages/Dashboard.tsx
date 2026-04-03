import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Users, 
  Heart, 
  Crown,
  TrendingUp,
  Fingerprint,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { LogOut } from 'lucide-react';

// Standard components from react-bits
import ShinyText from "@/components/ui/react-bits/ShinyText";
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import CountUp from "@/components/ui/react-bits/CountUp";
import SoftAurora from "@/components/ui/react-bits/SoftAurora";

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [_user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);

        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`);
        const data = await response.json();
        if (data) {
          setStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center mat-shell">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-8 p-1 rounded-full bg-gradient-to-tr from-mat-gold to-mat-primary"
      >
        <div className="bg-matriarch-bg rounded-full p-6">
          <Crown className="w-12 h-12 text-matriarch-gold" strokeWidth={1} />
        </div>
      </motion.div>
      <ShinyText text="VERIFYING SOVEREIGN STANDING..." className="text-xs font-black tracking-[0.6em]" />
    </div>
  );

  const tierColor = status?.rank_tier === 'elite' ? 'text-matriarch-gold' : status?.rank_tier === 'high' ? 'text-matriarch-violetBright' : 'text-matriarch-textSoft';

  return (
    <div className="mat-shell pb-32 mat-noise-overlay relative overflow-hidden">
      {/* Sovereign Background Aura */}
      <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
        <SoftAurora 
          speed={0.1} 
          brightness={0.8} 
          color1="#6E3FF3" 
          color2="#24152E" 
          enableMouseInteraction={false}
        />
      </div>

      {/* Premium Dashboard Header */}
      <header className="border-b border-white/5 bg-matriarch-bg/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={handleLogout} className="text-matriarch-textSoft hover:text-white">
                <LogOut className="w-5 h-5" />
             </Button>
             <Badge variant="outline" className="hidden sm:flex py-1.5 border-matriarch-gold/30 text-matriarch-goldSoft">
               <Fingerprint className="w-3 h-3 mr-2" />
               <DecryptedText 
                 text="V-PROTOCOL ACTIVE" 
                 animateOn="view" 
                 speed={80} 
                 className="tracking-widest" 
                 sequential
               />
             </Badge>
             <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 grid place-items-center">
                <Users className="w-5 h-5 text-matriarch-textSoft" />
             </div>
          </div>
        </div>
      </header>

      <main className="mat-container pt-12 space-y-12">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4 border-b border-white/5 mat-stagger-fade-in">
           <div className="space-y-2">
              <span className="mat-eyebrow">Protocol View / Dashboard</span>
              <h1 className="mat-heading-md">
                <DecryptedText 
                  text="Sovereign" 
                  animateOn="view" 
                  speed={120} 
                  className="inline-block" 
                  sequential
                /> <span className="text-matriarch-gold">Scoreboard</span>
              </h1>
           </div>
           <div className="flex gap-4">
              <Button variant="secondary" className="gap-2 transition-transform hover:scale-95">
                <TrendingUp className="w-4 h-4" />
                History
              </Button>
              <Button variant="gold" className="gap-2 shadow-mat-gold">
                <Zap className="w-4 h-4" />
                Boost Visibility
              </Button>
           </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mat-stagger-fade-in">
           {/* Rank Card */}
           <Card className="md:col-span-2 mat-glass-premium mat-float-hover border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                <Trophy size={200} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                   <div>
                      <CardTitle className="text-sm font-black tracking-[0.2em] text-matriarch-textFaint uppercase mb-2">
                        <DecryptedText text="Protocol Standing" animateOn="view" />
                      </CardTitle>
                      <div className="flex items-center gap-4">
                         <h2 className="text-6xl font-display font-black tracking-tighter text-white">
                           {status?.rank_tier?.toUpperCase() || 'SOVEREIGN'}
                         </h2>
                         <Crown className={cn("w-10 h-10 animate-pulse", tierColor)} strokeWidth={1} />
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-matriarch-gold mb-1 uppercase tracking-widest">
                        {status?.rank_tier === 'matriarch' ? 'Selection Power' : 'Sovereignty Score'}
                      </div>
                      <div className="text-4xl font-display font-black text-white">
                        <CountUp to={Math.round(status?.rank_score || 0)} duration={2.5} />
                      </div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="mt-8 space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-matriarch-textSoft">
                       <span>{status?.rank_tier === 'matriarch' ? 'Selection Fidelity' : 'Visibility saturation'}</span>
                       <span className="text-matriarch-gold">
                         <CountUp to={99.4} duration={3} />%
                       </span>
                    </div>
                    <Progress value={99} className="h-2 bg-white/5" />
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <Badge variant="violet">{status?.rank_tier === 'matriarch' ? 'Arch-Matriarch' : 'Top 0.1% Globally'}</Badge>
                    <Badge variant="violet">Premium Verified</Badge>
                    <Badge variant="violet">Sovereign Protocol</Badge>
                 </div>
              </CardContent>
           </Card>

           {/* Vertical Profile Health */}
           <Card className="mat-panel mat-glass-premium mat-float-hover border-none flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-sm font-black tracking-[0.2em] text-matriarch-textFaint uppercase">
                   <DecryptedText text="Profile Integrity" animateOn="view" />
                </CardTitle>
                <div className="pt-6 flex justify-center">
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
                         <span className="text-2xl font-black">
                           <CountUp to={status?.profile_completeness_pct || 0} duration={3} />%
                         </span>
                      </div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                 <p className="text-xs text-matriarch-textSoft mb-6">Complete your bio to reach Elite visibility status.</p>
                 <Button variant="secondary" size="sm" className="w-full transition-transform hover:scale-[0.98]">Edit Profile</Button>
              </CardContent>
           </Card>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mat-stagger-fade-in">
           {[
             { label: 'STATUS', title: 'Identity', val: status?.is_aadhaar_verified ? 'VERIFIED' : 'PENDING', icon: ShieldCheck, color: 'text-matriarch-violetBright' },
             { label: 'POWER', title: 'Signal Boost', val: status?.rank_tier === 'matriarch' ? 'ACTIVE' : 'IDLE', icon: Zap, color: 'text-matriarch-plum' },
             { label: 'INBOX', title:  status?.rank_tier === 'matriarch' ? 'Selections' : 'Pending', val: '0', icon: Heart, color: 'text-matriarch-gold' },
             { label: 'ACTIVITY', title: 'Exposure', val: 'HIGH', icon: Activity, color: 'text-white' },
           ].map((item, i) => (
             <Card key={i} className="mat-panel mat-glass-premium mat-float-hover border-none group cursor-pointer hover:bg-white/[0.06] transition-all">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-6">
                      <item.icon className={cn("w-6 h-6", item.color)} strokeWidth={1.5} />
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-matriarch-textFaint tracking-widest uppercase">{item.label}</span>
                      <h4 className="text-xl font-bold text-white">{item.title}</h4>
                      <p className={cn("text-xs font-black tracking-widest pt-2", item.color)}>{item.val}</p>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        {/* Sovereign Guard Protocol (007 Integration) */}
        <section className="space-y-6 mat-stagger-fade-in">
           <div className="flex items-center gap-4">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em]">
                <DecryptedText text="Sovereign Guard Protocol" animateOn="view" sequential />
              </h3>
              <Separator className="flex-1 bg-emerald-500/10" />
           </div>
           
           <Card className="mat-panel mat-glass-premium border-emerald-500/20 bg-emerald-500/[0.02]">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse-slow">
                       <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-white">Advanced Threat Protection Active</h4>
                       <p className="text-sm text-matriarch-textSoft">Account audited 2 hours ago. No shadow-risk patterns detected.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                       <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Integrity Score</div>
                       <div className="text-2xl font-black text-white">
                         <CountUp to={98} duration={1.5} onStart={() => console.log('Sovereign integrity verified.')} />/100
                       </div>
                    </div>
                    <Button variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 shadow-sm">Full Audit</Button>
                 </div>
              </CardContent>
           </Card>
        </section>
      </main>

      <div className="fixed bottom-0 w-full py-6 text-center pointer-events-none opacity-[0.05]">
          <span className="text-[10px] font-black uppercase tracking-[2em] text-white">PROTOCOL ARCHIVE 02.4.9 — SOVEREIGN STATUS CONFIRMED</span>
      </div>
    </div>
  );
};

export default Dashboard;
