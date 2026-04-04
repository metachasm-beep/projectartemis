import React from 'react';
import { Camera, ShieldCheck, Clock, Crown, Sparkles, ChevronRight, Lock, Heart } from 'lucide-react';
import type { MatriarchProfile } from '@/types';
import { Button } from '@/components/ui/button';

interface WomenSanctuaryProps {
  profile: MatriarchProfile;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ profile, metrics, setIsEditing, onBeginDiscovery }) => {
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  
  return (
    <div className="w-full bg-mat-cream min-h-screen relative overflow-hidden">
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-mat-rose/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-mat-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32 relative z-10 max-w-7xl">
        
        {/* ─── SCENE 1: THE PORTRAIT & INFLUENCE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
           
           {/* Centerpiece Portrait */}
           <div className="col-span-1 lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[320px] lg:max-w-[400px]">
                 {/* The Frame */}
                 <div className="absolute -inset-4 bg-gradient-to-tr from-mat-rose/20 via-transparent to-mat-gold/20 rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
                 
                 <div className="relative aspect-[3/4] w-full bg-white rounded-[2.5rem] p-3 shadow-2xl transition-transform duration-700 hover:-translate-y-2">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                       <img 
                         src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                         alt="Sovereign Portrait" 
                         className="w-full h-full object-cover scale-105"
                       />
                    </div>
                    {/* Floating Avatar Edit Trigger */}
                    <button 
                       onClick={() => setIsEditing(true)}
                       className="absolute -bottom-4 -right-4 w-14 h-14 bg-mat-wine text-mat-cream rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                       <Camera size={20} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Typography & Actions */}
           <div className="col-span-1 lg:col-span-7 space-y-12 text-center lg:text-left">
              
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-3 px-5 py-2 bg-mat-wine/5 rounded-full border border-mat-rose/10">
                    <Crown size={14} className="text-mat-rose" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-mat-wine">Sovereign Presence</span>
                 </div>
                 <h1 className="mat-text-display-pro text-mat-wine leading-[0.8] tracking-tighter text-[5rem] sm:text-[6rem] md:text-[8rem]">
                    {firstName}
                 </h1>
                 <p className="text-mat-slate/50 font-light text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                    Your sanctuary awaits. The protocol curates the highest strata of aspirants governed entirely by your choice.
                 </p>
              </div>

              {/* The Massive Portal Action */}
              <div className="pt-8">
                 <button 
                   onClick={onBeginDiscovery} 
                   className="group relative w-full lg:w-[80%] aspect-[4/1] md:aspect-[5/1] rounded-[3rem] overflow-hidden shadow-2xl shadow-mat-rose/20 transition-all duration-700 hover:scale-[1.02]"
                 >
                    <div className="absolute inset-0 bg-mat-wine transition-transform duration-700 group-hover:scale-105">
                       {/* Subtle Background Pattern in Button */}
                       <div className="absolute inset-0 opacity-10 blur-sm mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-mat-wine via-mat-rose-deep to-mat-wine" />
                    
                    <div className="relative h-full flex items-center justify-between px-8 md:px-12 text-mat-cream">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                             <Sparkles size={24} className="text-mat-gold group-hover:animate-pulse" />
                          </div>
                          <div className="text-left space-y-1">
                             <h3 className="text-xl md:text-2xl font-bold italic tracking-wide">Enter the Array</h3>
                             <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/60">Begin Sovereign Browsing</p>
                          </div>
                       </div>
                       <ChevronRight size={32} className="text-mat-gold/50 group-hover:text-mat-gold group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                 </button>
              </div>
           </div>

        </div>

        {/* ─── SCENE 2: SOVEREIGN METRICS ─── */}
        <div className="mt-32 border-t border-mat-rose/10 pt-20">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Metric 1 */}
              <div className="col-span-1 p-10 bg-white rounded-[2.5rem] shadow-sm border border-mat-rose/5 group hover:shadow-mat-premium transition-all duration-500">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-mat-wine/5 rounded-2xl flex items-center justify-center text-mat-wine/40 group-hover:bg-mat-wine/10 group-hover:text-mat-wine transition-colors">
                       <Heart size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Matches</span>
                 </div>
                 <h4 className="text-5xl font-serif font-black italic text-mat-wine">{metrics.matches}</h4>
                 <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Resonances</p>
              </div>

              {/* Metric 2 */}
              <div className="col-span-1 p-10 bg-white rounded-[2.5rem] shadow-sm border border-mat-rose/5 group hover:shadow-mat-premium transition-all duration-500">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-mat-gold/5 rounded-2xl flex items-center justify-center text-mat-gold/60 group-hover:bg-mat-gold/20 group-hover:text-mat-gold transition-colors">
                       <Clock size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Engagement</span>
                 </div>
                 <h4 className="text-5xl font-serif font-black italic text-mat-wine">{Math.floor(metrics.sessionSeconds / 60)}<span className="text-2xl text-mat-wine/40">m</span></h4>
                 <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Time within Sanctuary</p>
              </div>

              {/* Security Status */}
              <div className="col-span-1 p-10 bg-mat-obsidian rounded-[2.5rem] text-mat-cream shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-mat-rose/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
                 
                 <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-mat-rose transition-colors">
                       <ShieldCheck size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Privacy</span>
                 </div>
                 
                 <div className="relative z-10 space-y-6">
                    <div>
                       <h4 className="text-2xl font-bold italic">Identity Sealed</h4>
                       <p className="text-xs text-white/40 mt-2 leading-relaxed">Your true identity remains completely hidden from observers until a resonance is confirmed.</p>
                    </div>
                    <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-14 flex items-center gap-3 uppercase tracking-widest font-black text-[9px]">
                       <Lock size={14} /> Review Visibility Rules
                    </Button>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};
