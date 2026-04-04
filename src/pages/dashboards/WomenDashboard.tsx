import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Crown,
  Activity,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">The Inner Sanctuary</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Your <br /><span className="text-mat-rose/30">Grace.</span></h1>
        </div>
        
        <div className="flex gap-px bg-mat-rose/10 p-px w-full md:w-auto overflow-hidden rounded-[2rem] mat-glass border border-mat-rose/20">
           <div className="bg-mat-ivory/80 px-10 py-6 flex flex-col justify-center min-w-[160px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mat-slate/60">Blessing Points</span>
              <span className="text-2xl font-bold text-mat-wine">{status?.points || 0} Pts</span>
           </div>
           <button 
             onClick={handleBoost} 
             disabled={status?.points < 100}
             className="bg-mat-wine text-white px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-2 disabled:opacity-20"
             style={{ fontFamily: 'var(--font-body)' }}
           >
             {status?.points >= 100 ? "Activate Radiance" : "Gathering Energy"} <Zap size={14} className={status?.points >= 100 ? "text-mat-gold" : "text-white/20"} />
           </button>
        </div>
      </div>

      {!profile?.is_verified && (
        <div className="mat-glass-deep p-12 rounded-[3.5rem] border-mat-rose/10 shadow-mat-rose/5">
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
                <div className="relative shrink-0 w-full md:w-64 aspect-[3/4] md:h-full bg-mat-rose/5 rounded-[4rem] overflow-hidden border border-mat-rose/20">
                  {profile?.photos?.[0] ? (
                    <img 
                      src={profile.photos[0]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale hover:grayscale-0 filter sepia-[0.2]" 
                      alt="Sovereign" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-mat-rose/20 bg-mat-rose/5">
                      <Crown className="w-12 h-12 mb-4 opacity-40" />
                      <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Awaiting <br />Portrait</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/30 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Crown className="text-white w-6 h-6" />
                     </div>
                     <Badge className="bg-mat-wine text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest">{profile?.role?.toUpperCase() || 'MATRIARCH'}</Badge>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-4">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-mat-rose">Sovereign Profile</span>
                        <h2 className="text-5xl font-bold text-mat-wine italic leading-none">
                           {profile?.full_name?.split(' ')[0]} <br />
                           <span className="opacity-20">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                     </div>
                     
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="px-5 py-2 border-mat-rose/30 bg-mat-rose/5 text-mat-wine text-[9px] font-bold uppercase tracking-widest rounded-xl italic">{profile?.city || 'Sanctuary'}</Badge>
                        <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 bg-mat-gold/5 text-mat-gold-deep text-[9px] font-bold uppercase tracking-widest rounded-xl italic">Premium Verified</Badge>
                     </div>

                     <p className="text-[14px] text-mat-slate font-medium leading-relaxed italic border-l-2 border-mat-rose/30 pl-6">
                        "{profile?.bio || "Your sacred story awaits completion. Share your vision with the sanctuary."}"
                     </p>
                  </div>

                  <div className="pt-8 flex items-center gap-8">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-mat-slate/40 italic">Engagement Data Synchronizing...</span>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Harmony Quotient (Small) */}
         <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream group h-full shadow-mat-premium">
            <div className="flex flex-col h-full justify-between">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-bold italic leading-none">Harmony <br /><span className="text-mat-rose/40 text-xl">Index.</span></h3>
                     <Sparkles className="text-mat-gold w-6 h-6" />
                  </div>
                  <p className="text-mat-cream/40 font-medium text-[9px] uppercase leading-relaxed italic">Your resonance within the divine order of the sanctuary.</p>
               </div>

               <div className="py-12 border-y border-white/5 space-y-10">
                  <div className="flex justify-between items-end">
                     <span className="text-7xl font-bold text-mat-cream tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>{Math.round(status?.rank_score || 0)}</span>
                     <div className="text-right">
                        <p className="text-[9px] font-bold uppercase text-mat-gold tracking-widest">Aura: Radiant</p>
                        <p className="text-[12px] font-bold text-mat-cream/40 italic">Grace Scale</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-mat-cream/40">
                        <span>Profile Authenticity</span>
                        <span>{status?.profile_completeness_pct || 94}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${status?.profile_completeness_pct || 94}%` }} 
                           className="h-full bg-mat-gold shadow-[0_0_20px_rgba(191,160,106,0.4)]" 
                        />
                     </div>
                  </div>
               </div>

               <button className="w-full h-18 bg-mat-cream text-mat-wine font-bold uppercase tracking-[0.5em] text-[9px] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3">
                  Refine Story <Star size={14} className="fill-current" />
               </button>
            </div>
         </div>

         {/* 3. Connection Archway (Medium) */}
         <div className="bento-span-8 bento-item mat-glass p-12">
            <div className="space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold italic leading-none text-mat-wine">Connection Arch.</h3>
                     <p className="text-mat-rose font-bold uppercase tracking-[0.4em] text-[9px]">Live Synchronicity Manifests</p>
                  </div>
                  <Heart className="text-mat-wine/10 w-8 h-8" fill="rgba(123,45,66,0.05)" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'New Seekers', val: '28', icon: Activity },
                    { label: 'Dialogs', val: '4', icon: MessageCircle },
                    { label: 'Admiration', val: '142', icon: Eye },
                    { label: 'Tier Status', val: 'Elite', icon: Star },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-4 p-6 bg-mat-ivory/50 rounded-3xl border border-mat-rose/10 hover:bg-mat-ivory transition-all group">
                       <stat.icon size={16} className="text-mat-rose group-hover:text-mat-wine transition-colors" />
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-mat-wine">{stat.val}</p>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-mat-slate/60">{stat.label}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 4. Sanctuary Records (Small) */}
         <div className="bento-span-4 bento-item mat-glass border-dashed border-mat-rose/30 group">
            <div className="flex flex-col h-full justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-14 h-14 mat-glass rounded-2xl flex items-center justify-center text-mat-rose group-hover:text-mat-wine transition-all shadow-sm">
                     <ShieldCheck size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold italic leading-none text-mat-wine">Vetted <br /><span className="text-mat-rose/40 text-lg">History.</span></h4>
                  <p className="text-mat-slate/70 font-medium text-[9px] leading-relaxed uppercase italic">All historical connections are encrypted and archived for your absolute privacy.</p>
               </div>
               
               <div className="bg-mat-rose/5 rounded-3xl p-8 border border-mat-rose/10 space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-mat-slate/40">
                     <span>Last Audit</span>
                     <span className="text-mat-wine">3h Ago</span>
                  </div>
                  <div className="h-0.5 bg-mat-rose/10 rounded-full" />
                  <p className="text-[8px] font-bold text-mat-wine/40 uppercase tracking-[0.3em] italic">System Status: Sovereign Secure</p>
               </div>
            </div>
         </div>
      </div>

      <FAQ />

      <div className="py-24 text-center border-t border-mat-rose/10">
         <p className="text-[11px] font-bold uppercase tracking-[1em] opacity-20 select-none text-mat-wine">
            Matriarch // Connection Begins With Her Choice
         </p>
      </div>
    </div>
  );
};
