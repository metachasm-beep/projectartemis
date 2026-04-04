import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Crown,
  Activity,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Eye,
  Star
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';
import { motion } from 'framer-motion';

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleBoost 
}) => {
  return (
    <div className="space-y-12 pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-black/5">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-black/10 text-black/40 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">The Inner Sanctuary</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-black italic lowercase leading-none">Your <br /><span className="text-black/20">Grace.</span></h1>
        </div>
        
        <div className="flex gap-px bg-black/5 p-px w-full md:w-auto overflow-hidden rounded-[2rem] mat-glass border border-black/5">
           <div className="bg-white/80 px-10 py-6 flex flex-col justify-center min-w-[160px]">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Blessing Points</span>
              <span className="text-2xl font-black text-black">{status?.points || 0} Pts</span>
           </div>
           <button 
             onClick={handleBoost} 
             disabled={status?.points < 100}
             className="bg-black text-white px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-20"
           >
             {status?.points >= 100 ? "Activate Radiance" : "Gathering Energy"} <Zap size={14} className={status?.points >= 100 ? "text-matriarch-violet" : "text-white/20"} />
           </button>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[3.5rem] border-matriarch-violet/10">
           <VerificationPrompt 
              userId={profile?.user_id} 
              role="woman" 
              onVerified={() => window.location.reload()} 
           />
        </div>
      )}

      {/* Bento Matrix */}
      <div className="bento-grid">
         {/* 1. Sovereign Identity (Large) */}
         <div className="bento-span-8 bento-item mat-glass-deep group min-h-[450px]">
            <div className="flex flex-col md:flex-row h-full gap-12">
               <div className="relative shrink-0 w-full md:w-64 aspect-[3/4] md:h-full bg-black/5 rounded-[4rem] overflow-hidden border border-black/5">
                  <img 
                    src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale hover:grayscale-0" 
                    alt="Sovereign" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matriarch-violet/20 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Crown className="text-white w-6 h-6" />
                     </div>
                     <Badge className="bg-matriarch-violet text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{profile?.role?.toUpperCase() || 'MATRIARCH'}</Badge>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-4">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">Sovereign Profile</span>
                        <h2 className="text-5xl font-black text-black italic uppercase tracking-tighter leading-none">
                           {profile?.full_name?.split(' ')[0]} <br />
                           <span className="opacity-10">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                     </div>
                     
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="px-5 py-2 border-matriarch-violet/5 bg-matriarch-violet/5 text-matriarch-violet text-[9px] font-black uppercase tracking-widest rounded-xl italic">{profile?.city || 'Sanctuary'}</Badge>
                        <Badge variant="outline" className="px-5 py-2 border-black/5 bg-black/5 text-black text-[9px] font-black uppercase tracking-widest rounded-xl italic">Premium Verified</Badge>
                     </div>

                     <p className="text-[13px] text-black/60 font-mono leading-relaxed uppercase max-w-sm italic border-l-2 border-matriarch-violet/20 pl-6">
                        {profile?.bio || "Your sacred story awaits completion. Share your vision with the sanctuary."}
                     </p>
                  </div>

                  <div className="pt-8 flex items-center gap-8">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-full h-full object-cover grayscale" />
                           </div>
                        ))}
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-black/20 italic">Admired by 12+ Souls</span>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Harmony Quotient (Small) */}
         <div className="bento-span-4 bento-item bg-black text-white group h-full">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Harmony <br /><span className="opacity-20 text-xl">Index.</span></h3>
                     <Sparkles className="text-matriarch-violet w-6 h-6" />
                  </div>
                  <p className="text-white/40 font-mono text-[9px] uppercase leading-relaxed italic">Your resonance within the divine order of the sanctuary.</p>
               </div>

               <div className="py-12 border-y border-white/5 space-y-10">
                  <div className="flex justify-between items-end">
                     <span className="text-7xl font-black text-white tracking-tighter">{Math.round(status?.rank_score || 0)}</span>
                     <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-matriarch-violet tracking-widest">Aura: Radiant</p>
                        <p className="text-[12px] font-black text-white/40 italic">Grace Scale</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                        <span>Profile Authenticity</span>
                        <span>{status?.profile_completeness_pct || 94}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${status?.profile_completeness_pct || 94}%` }} 
                           className="h-full bg-matriarch-violet shadow-[0_0_20px_rgba(110,63,243,0.4)]" 
                        />
                     </div>
                  </div>
               </div>

               <button className="w-full h-18 bg-white text-black font-black uppercase tracking-[0.5em] text-[9px] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3">
                  Refine Story <Star size={14} />
               </button>
            </div>
         </div>

         {/* 3. Connection Archway (Medium) */}
         <div className="bento-span-8 bento-item mat-glass p-12">
            <div className="space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Connection Arch.</h3>
                     <p className="text-black/30 font-black uppercase tracking-[0.4em] text-[9px]">Live Synchronicity Manifests</p>
                  </div>
                  <Heart className="text-red-500/20 w-8 h-8" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'New Seekers', val: '28', icon: Activity },
                    { label: 'Dialogs', val: '4', icon: MessageCircle },
                    { label: 'Admiration', val: '142', icon: Eye },
                    { label: 'Tier Status', val: 'Elite', icon: Star },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-4 p-6 bg-white/40 rounded-3xl border border-black/5 hover:bg-white transition-all group">
                       <stat.icon size={16} className="text-black/20 group-hover:text-black transition-colors" />
                       <div className="space-y-1">
                          <p className="text-xs font-black text-black">{stat.val}</p>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-black/20">{stat.label}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 4. Sanctuary Records (Small) */}
         <div className="bento-span-4 bento-item mat-glass border-dashed border-black/10 group">
            <div className="flex flex-col h-full justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-14 h-14 mat-glass rounded-2xl flex items-center justify-center text-black/20 group-hover:text-black transition-all">
                     <ShieldCheck size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-black italic uppercase tracking-tighter italic leading-none">Vetted <br /><span className="opacity-10 text-lg">History.</span></h4>
                  <p className="text-black/40 font-mono text-[9px] leading-relaxed uppercase italic">All historical connections are encrypted and archived for your absolute privacy.</p>
               </div>
               
               <div className="bg-black/5 rounded-3xl p-8 border border-black/5 space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
                     <span>Last Audit</span>
                     <span className="text-black">3h Ago</span>
                  </div>
                  <div className="h-0.5 bg-black/10 rounded-full" />
                  <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.3em] italic">System Status: Sovereign Secure</p>
               </div>
            </div>
         </div>
      </div>

      <FAQ />

      <div className="py-24 text-center border-t border-black/5">
         <p className="text-[11px] font-black uppercase tracking-[1em] opacity-5 select-none text-black">
            Matriarch // Connection Begins With Her Choice
         </p>
      </div>
    </div>
  );
};
