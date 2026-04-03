import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Users, 
  Heart, 
  Crown,
  ChevronRight,
  TrendingUp,
  Fingerprint,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import { api } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { cn } from "@/lib/utils";

// Standard components from react-bits
import ShinyText from "@/components/ui/react-bits/ShinyText";

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const data = await api.getRankStatus('male_demo');
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
    <div className="mat-shell pb-32">
      {/* Premium Dashboard Header */}
      <header className="border-b border-white/5 bg-matriarch-bg/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="hidden sm:flex py-1.5 border-matriarch-gold/30 text-matriarch-goldSoft">
               <Fingerprint className="w-3 h-3 mr-2" />
               V-PROTOCOL ACTIVE
             </Badge>
             <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 grid place-items-center">
                <Users className="w-5 h-5 text-matriarch-textSoft" />
             </div>
          </div>
        </div>
      </header>

      <main className="mat-container pt-12 space-y-12">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4 border-b border-white/5">
           <div className="space-y-2">
              <span className="mat-eyebrow">Protocol View / Dashboard</span>
              <h1 className="mat-heading-md">Sovereign <span className="text-matriarch-gold">Scoreboard</span></h1>
           </div>
           <div className="flex gap-4">
              <Button variant="secondary" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                History
              </Button>
              <Button variant="gold" className="gap-2">
                <Zap className="w-4 h-4" />
                Boost Visibility
              </Button>
           </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Rank Card */}
           <Card className="md:col-span-2 mat-panel-premium border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                <Trophy size={200} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                   <div>
                      <CardTitle className="text-sm font-black tracking-[0.2em] text-matriarch-textFaint uppercase mb-2">Global Standing</CardTitle>
                      <div className="flex items-center gap-4">
                         <h2 className="text-6xl font-display font-black tracking-tighter text-white">
                           {status?.rank_tier?.toUpperCase() || 'ELITE'}
                         </h2>
                         <Crown className={cn("w-10 h-10 animate-pulse", tierColor)} strokeWidth={1} />
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-matriarch-gold mb-1 uppercase tracking-widest">Sovereignty Score</div>
                      <div className="text-4xl font-display font-black text-white">{Math.round(status?.rank_score || 0)}</div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="mt-8 space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-matriarch-textSoft">
                       <span>Visibility saturation</span>
                       <span className="text-matriarch-gold">99.4%</span>
                    </div>
                    <Progress value={99} className="h-2 bg-white/5" />
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <Badge variant="violet">Top 0.1% Globally</Badge>
                    <Badge variant="violet">Premium Verified</Badge>
                    <Badge variant="violet">High Intent</Badge>
                 </div>
              </CardContent>
           </Card>

           {/* Vertical Profile Health */}
           <Card className="mat-panel border-none flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-sm font-black tracking-[0.2em] text-matriarch-textFaint uppercase">Profile Integrity</CardTitle>
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
                           strokeDashoffset={251.2 * (1 - 0.85)} 
                           strokeLinecap="round" 
                           stroke="currentColor" 
                           fill="transparent" 
                           r="40" cx="50" cy="50" 
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-2xl font-black">85%</span>
                      </div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                 <p className="text-xs text-matriarch-textSoft mb-6">Complete your bio to reach Elite visibility status.</p>
                 <Button variant="secondary" size="sm" className="w-full">Edit Profile</Button>
              </CardContent>
           </Card>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'STATUS', title: 'Identity', val: status?.is_aadhaar_verified ? 'VERIFIED' : 'PENDING', icon: ShieldCheck, color: 'text-matriarch-violetBright' },
             { label: 'POWER', title: 'Signal Boost', val: 'IDLE', icon: Zap, color: 'text-matriarch-plum' },
             { label: 'INBOX', title: 'Selections', val: '0', icon: Heart, color: 'text-matriarch-gold' },
             { label: 'ACTIVITY', title: 'Exposure', val: 'HIGH', icon: Activity, color: 'text-white' },
           ].map((item, i) => (
             <Card key={i} className="mat-panel border-none group cursor-pointer hover:bg-white/[0.06] transition-all">
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

        {/* Strategy Section */}
        <section className="space-y-6">
           <div className="flex items-center gap-4">
              <h3 className="text-xs font-black text-matriarch-textFaint uppercase tracking-[0.4em]">Selection Strategy</h3>
              <Separator className="flex-1 bg-white/5" />
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="mat-panel border-none bg-matriarch-plum/5">
                 <CardContent className="p-10 flex gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-matriarch-plum/10 border border-matriarch-plum/20 flex items-center justify-center flex-shrink-0">
                       <Users className="text-matriarch-plum w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold mb-4">Discovery Insights</h4>
                       <p className="mat-copy mb-6 leading-relaxed">
                         Your profile was reviewed by 14 Sovereign users this week. Visibility is tracking 12% higher than average.
                       </p>
                       <Button variant="link" className="p-0 h-auto text-matriarch-plum">View Details <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-4">
                 {(status?.tips || [
                    "Complete your 'Intentional Goals' section for a +15 score boost.",
                    "Profiles with verified social links see 3x more selections.",
                    "Wait time for selection cycle: 4 days estimated."
                 ]).map((tip: string, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="mat-panel p-6 border-none bg-white/[0.03] flex items-center gap-6 group hover:bg-white/[0.05] transition-all cursor-default"
                    >
                       <div className="w-2 h-2 rounded-full bg-matriarch-goldSoft shrink-0 shadow-mat-gold" />
                       <p className="text-sm font-medium text-matriarch-textSoft group-hover:text-white transition-colors">{tip}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* Decorative Glow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-matriarch-violet/5 blur-[100px] pointer-events-none -z-10" />
    </div>
  );
};

export default Dashboard;
