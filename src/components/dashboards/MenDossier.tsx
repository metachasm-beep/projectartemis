import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, Zap, Flame, Eye, MousePointerClick, Heart, Coins, ArrowUpRight, ShieldCheck, Gem } from 'lucide-react';
import type { MatriarchProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface MenDossierProps {
  profile: MatriarchProfile;
  metrics: { impression: number; visit: number; save: number };
  setIsEditing: (val: boolean) => void;
  handleVerify: () => void;
}

export const MenDossier: React.FC<MenDossierProps> = ({ profile, metrics, setIsEditing, handleVerify }) => {
  // Tokenomics Mock State (To be connected to Supabase RPC)
  const [auraBalance, setAuraBalance] = useState(150); 
  const rankCount = profile.rank_boost_count || 0;
  
  // Calculate a reverse rank (lower is better). Base rank minus any boosts.
  const baseRank = 8404;
  const sanctuaryRank = Math.max(1, baseRank - (rankCount * 120)); // Arbitrary formula for display
  const isTopPercentile = sanctuaryRank < 1000;

  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  const lastName = profile.full_name?.split(' ').slice(1).join(' ') || '';

  const handleBumpRank = () => {
     if (auraBalance >= 49) {
        setAuraBalance(prev => prev - 49);
        // Call backend logic here
        alert("Rank successfully boosted. Protocol prioritizing your visibility.");
     } else {
        alert("Insufficient AURA. Please visit the Treasury.");
     }
  };

  const auraBundles = [
    { name: "The Initiate", aura: 50, price: 49, saving: false },
    { name: "The Vanguard", aura: 250, price: 199, saving: "20% Discount" },
    { name: "The Sovereign", aura: 1000, price: 699, saving: "30% Discount" },
    { name: "The Monolith", aura: 5000, price: 2499, saving: "50% Discount" }
  ];

  return (
    <div className="w-full bg-mat-obsidian text-mat-cream min-h-screen pb-32">
      
      {/* ─── SCENE 1: THE MONOLITHIC HERO ─── */}
      <div className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden">
        <img 
          src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
          alt="Identity Primary" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent"></div>
        
        {/* Floating Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute bottom-12 md:bottom-24 left-6 md:left-16 lg:left-24"
        >
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 border border-mat-gold/30 text-mat-gold text-[9px] uppercase tracking-[0.3em] font-black rounded-full backdrop-blur-md bg-mat-obsidian/30 flex items-center gap-2">
                  <Flame size={12} /> Rank #{sanctuaryRank.toLocaleString()}
                </span>
                {profile.is_verified && (
                  <span className="px-4 py-1.5 bg-mat-wine text-mat-cream text-[9px] uppercase tracking-[0.3em] font-black rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(114,47,55,0.5)]">
                    <CheckCircle2 size={12} /> Sealed
                  </span>
                )}
             </div>
             
             <h1 className="mat-text-display-pro text-mat-cream leading-[0.8] tracking-tighter text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
                {firstName} <br />
                {lastName && <span className="text-mat-cream/40 italic font-light">{lastName}</span>}
             </h1>
          </div>
        </motion.div>

        <button 
           onClick={() => setIsEditing(true)}
           className="absolute top-6 md:top-12 right-6 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full bg-mat-obsidian/40 backdrop-blur-xl border border-white/10 text-mat-cream flex items-center justify-center hover:bg-mat-wine transition-colors duration-500 z-10 group"
        >
           <Camera size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* ─── SCENE 2: THE TOKENOMICS ENGINE (Rank & Offering) ─── */}
      <div className="px-6 md:px-16 lg:px-24 py-24 space-y-32">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
           
           {/* Rank & Token Readout */}
           <div className="col-span-1 lg:col-span-4 space-y-12">
              <div>
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 italic">Sanctuary Rank</p>
                    {isTopPercentile && <span className="text-[8px] bg-mat-gold/10 text-mat-gold px-2 py-1 rounded">Top 1%</span>}
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl text-mat-gold italic font-bold">#</span>
                    <h2 className="text-[6rem] md:text-[7rem] font-black italic tracking-tighter leading-none text-mat-gold">{sanctuaryRank.toLocaleString()}</h2>
                 </div>
                 <p className="text-xs text-white/40 leading-relaxed mt-4">
                   Your absolute position in the sanctuary. Lower rank equals priority placement during Sovereign Browsing.
                 </p>
              </div>

              {/* AURA Wallet & Bump Action */}
              <div className="p-8 border border-mat-rose/20 bg-mat-wine/5 rounded-[2rem] space-y-8 shadow-[0_0_30px_rgba(114,47,55,0.05)]">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-mat-wine/20 rounded-full flex items-center justify-center text-mat-rose">
                          <Coins size={16} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Aura Balance</p>
                          <p className="text-2xl font-bold font-serif">{auraBalance}</p>
                       </div>
                    </div>
                    <Button variant="outline" className="border-mat-rose/30 text-mat-rose hover:bg-mat-wine rounded-full h-8 text-[9px] uppercase tracking-widest px-4">+ Acquire</Button>
                 </div>
                 
                 <Button onClick={handleBumpRank} className="w-full h-16 bg-mat-rose hover:bg-mat-rose-deep text-white rounded-[1.5rem] flex justify-between items-center px-6 transition-all duration-300">
                    <span className="font-bold flex items-center gap-2"><ArrowUpRight size={18} /> Bump Rank</span>
                    <span className="bg-black/20 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-inner">-49 AURA</span>
                 </Button>
              </div>
           </div>

           {/* The Treasury (Token Purchase) */}
           <div className="col-span-1 lg:col-span-8 lg:col-start-6">
              <div className="p-8 md:p-12 border border-white/5 bg-white/[0.02] rounded-[3rem] space-y-8 relative overflow-hidden backdrop-blur-sm h-full">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                 
                 <div className="space-y-2 relative z-10 mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold italic text-white leading-tight">The <span className="text-mat-gold/60">Treasury.</span></h3>
                    <p className="text-xs text-white/50 max-w-sm leading-relaxed">Exchange offerings for AURA to guarantee visibility in the primary selection protocol.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    {auraBundles.map((bundle, i) => (
                      <button 
                        key={i} 
                        className="group w-full flex flex-col justify-between p-6 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 hover:border-mat-gold/30 transition-all duration-500 text-left relative overflow-hidden"
                      >
                         {bundle.saving && (
                            <div className="absolute top-4 right-4 bg-mat-gold/10 text-mat-gold text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">
                               {bundle.saving}
                            </div>
                         )}
                         <div className="mb-8">
                            <span className="text-[10px] font-black text-mat-gold uppercase tracking-[0.2em]">{bundle.name}</span>
                            <div className="flex items-baseline gap-2 mt-2">
                               <h4 className="text-3xl font-bold font-serif text-white">{bundle.aura}</h4>
                               <span className="text-xs text-white/40 uppercase tracking-widest">Aura</span>
                            </div>
                         </div>
                         <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-xs font-bold text-white">₹{bundle.price}</span>
                            <span className="text-[9px] text-white/30 uppercase tracking-widest group-hover:text-mat-gold group-hover:translate-x-1 transition-all">Exchange →</span>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ─── SCENE 3: CONCIERGE & ASCENSION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-white/10 pt-24">
           
           <div className="col-span-1 lg:col-span-6 space-y-12">
              <div className="space-y-2">
                 <Zap className="text-mat-gold mb-4" size={24} />
                 <h3 className="text-3xl font-bold italic text-white leading-tight">Identity Ascension</h3>
                 <p className="text-white/40 text-xs max-w-sm">Complete your profile to organically improve your Sanctuary Rank.</p>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Aadhaar Verification', done: !!profile.is_verified, act: handleVerify },
                   { label: 'Narrative Portrait', done: (profile.photos?.length || 0) > 0, act: () => setIsEditing(true) },
                   { label: 'Foundation Details', done: !!profile.education && !!profile.city, act: () => setIsEditing(true) }
                 ].map((task, i) => (
                   <button 
                     key={i} 
                     onClick={task.act} 
                     className={cn("w-full flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all duration-500", task.done ? "bg-white/5 border-white/5 opacity-50" : "bg-mat-wine/5 border-mat-rose/20 text-white hover:bg-mat-wine/10")}
                   >
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", task.done ? "bg-mat-rose/20 text-mat-rose" : "bg-white/5 text-white/30")}>
                         <CheckCircle2 size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{task.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* The Seal of Excellence Premium Offering */}
           <div className="col-span-1 lg:col-span-6">
              <div className="p-8 md:p-12 border border-mat-gold/30 bg-mat-obsidian rounded-[3rem] space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)] h-full flex flex-col justify-between group">
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-mat-gold/10 to-transparent pointer-events-none" />
                 
                 <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 bg-mat-gold/10 rounded-full flex items-center justify-center text-mat-gold border border-mat-gold/30">
                       <Gem size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl md:text-3xl font-bold italic text-white leading-tight mb-3">Concierge Review & <br/><span className="text-mat-gold">Seal of Excellence</span></h3>
                       <p className="text-sm text-white/60 leading-relaxed">
                         A rigorous manual audit of your entire dossier by the Matriarch Council. Profiles that earn the Seal of Excellence bypass the standard protocol, organically ranking higher than all non-sealed aspirants indefinitely.
                       </p>
                    </div>
                 </div>

                 <div className="relative z-10 space-y-6 pt-8 border-t border-white/10 mt-8">
                    <ul className="space-y-3">
                       {['Manual Profile Optimization', 'Professional Formatting', 'Permanent Algorithmic Priority'].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs text-white/70">
                            <ShieldCheck size={14} className="text-mat-gold" /> {item}
                         </li>
                       ))}
                    </ul>
                    <Button className="w-full h-16 bg-mat-gold hover:bg-mat-gold/80 text-mat-obsidian rounded-[1.5rem] flex justify-between items-center px-6 transition-all duration-300">
                       <span className="font-bold uppercase tracking-widest text-[10px]">Commission Review</span>
                       <span className="bg-black/10 px-4 py-2 rounded-full text-xs font-black">₹7,999</span>
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* ─── SCENE 4: THE ORACLE (Metrics) ─── */}
        <div className="py-12 border-t border-white/10 mt-32">
           <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2 italic">The Oracle Analytics</p>
              <h3 className="text-3xl font-bold italic text-white">Observer Engagement</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { l: 'Impressions', v: metrics.impression, i: Eye, sub: 'Times your profile appeared in the sanctuary.' },
                { l: 'Deep Dives', v: metrics.visit, i: MousePointerClick, sub: 'Observers who opened your full dossier.' },
                { l: 'Resonances', v: metrics.save, i: Heart, sub: 'Observers who sparked a connection.' }
              ].map((m, idx) => (
                <div key={idx} className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] space-y-8 flex flex-col justify-between group hover:bg-white/[0.03] transition-colors">
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-mat-wine/10 rounded-2xl flex items-center justify-center text-mat-rose group-hover:scale-110 transition-transform">
                         <m.i size={20} />
                      </div>
                      <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">{m.l}</h4>
                   </div>
                   <div>
                      <p className="text-5xl font-serif text-white">{m.v}</p>
                      <p className="text-[10px] font-medium text-white/30 leading-snug mt-4">{m.sub}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
