import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Crown,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';

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
    <div className="min-h-screen bg-white">
      <main className="mat-container pt-24 space-y-24">
        {!profile?.is_verified && (
          <div className="bg-black text-white p-12 border border-black mb-12">
             <VerificationPrompt 
               userId={profile?.user_id} 
               role="woman" 
               onVerified={() => window.location.reload()} 
             />
          </div>
        )}

        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-12 border-b border-black/10">
           <div className="space-y-6">
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-black/10 rounded-none">The Inner Sanctuary</Badge>
              <h1 className="text-6xl lg:text-8xl mat-text-display-pro text-black leading-[0.9] uppercase tracking-tighter">
                Your <br />
                <span className="text-black/20">Grace.</span>
              </h1>
           </div>
           <div className="flex items-center gap-px bg-black/5 border border-black/5 p-px w-full lg:w-auto">
              <div className="bg-white px-12 py-8 flex flex-col items-start min-w-[200px]">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-2">Blessings</span>
                 <span className="text-4xl mat-text-display-pro text-black">{status?.points || 0} Pts</span>
              </div>
              <button 
                className="bg-black text-white px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-neutral-800 transition-all h-full disabled:opacity-30"
                onClick={handleBoost} 
                disabled={status?.points < 100}
              >
                {status?.points >= 100 ? "Active Boost" : "100 Pts Req"}
              </button>
           </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
           <div className="md:col-span-2 bg-white p-12 lg:p-24 space-y-16">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                 <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Divine Standing</span>
                    <div className="flex items-center gap-6">
                       <h2 className="text-6xl lg:text-8xl mat-text-display-pro text-black uppercase leading-none">
                         {status?.rank_tier === 'matriarch' ? "MATRIARCH" : (status?.rank_tier?.toUpperCase() || 'ELITE')}
                       </h2>
                       <Crown className="w-12 h-12 text-black" strokeWidth={1} />
                    </div>
                 </div>
                 <div className="lg:text-right space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Grace Score</span>
                    <div className="text-6xl mat-text-display-pro text-black leading-none">
                       {Math.round(status?.rank_score || 0)}
                    </div>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-black/40">
                    <span>Heart Harmony</span>
                    <span className="text-black">99.4%</span>
                 </div>
                 <div className="h-4 bg-black/5 relative">
                    <div className="absolute inset-y-0 left-0 bg-black" style={{ width: '99%' }} />
                 </div>
              </div>

              <div className="flex flex-wrap gap-4">
                 <Badge variant="outline" className="border-black/10 text-black font-black tracking-widest text-[9px] px-4 py-1 uppercase rounded-none">Top 0.1% Globally</Badge>
                 <Badge variant="outline" className="border-black/10 text-black font-black tracking-widest text-[9px] px-4 py-1 uppercase rounded-none">Premium Verified</Badge>
              </div>
           </div>

           <div className="bg-black text-white p-12 lg:p-16 flex flex-col justify-between">
              <div className="space-y-12">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">True Reflection</span>
                 <div className="flex justify-center">
                    <div className="relative w-40 h-40 border-4 border-white/10 flex items-center justify-center">
                       <div className="text-5xl mat-text-display-pro text-white leading-none">
                         {status?.profile_completeness_pct || 0}%
                       </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-8 mt-12">
                 <p className="text-[10px] font-black tracking-widest uppercase text-white/40 leading-relaxed">Complete your story to find your kindred spirit.</p>
                 <button className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-neutral-200 transition-all">Edit Story</button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
           {[
              { label: 'TRUTH', title: 'Identity Seal', val: profile?.is_verified ? 'VERIFIED' : 'PENDING', icon: ShieldCheck },
              { label: 'LIGHT', title: 'Inner Glow', val: status?.rank_tier === 'matriarch' ? 'RADIANT' : 'GATHERING', icon: Zap },
              { label: 'WHISPERS', title: 'Heartbeats', val: '0', icon: Heart },
              { label: 'ENERGY', title: 'Standing Index', val: 'STABLE', icon: Activity },
           ].map((item, i) => (
             <div key={i} className="bg-white p-12 space-y-12 group hover:bg-black/5 transition-all">
                <div className="flex justify-between items-start text-black">
                   <item.icon className="w-6 h-6" strokeWidth={1.5} />
                   <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-black transition-colors" />
                </div>
                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">{item.label}</span>
                   <h4 className="text-xl font-bold text-black uppercase tracking-tight">{item.title}</h4>
                   <p className="text-[11px] font-black tracking-widest text-black/60 pt-2">{item.val}</p>
                </div>
                {item.label === 'TRUTH' && (
                    <div className="pt-8 border-t border-black/5 space-y-4">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40">Referral Protocol</span>
                       <div className="flex items-center justify-between p-4 bg-black/5 border border-black/5">
                          <span className="text-xs font-mono font-bold text-black">{profile?.referral_code || '---'}</span>
                          <button 
                            className="text-[9px] font-black uppercase tracking-widest text-black hover:underline"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
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

        <div className="py-40 text-center border-t border-black/5">
          <p className="text-[11px] font-black uppercase tracking-[1.5em] text-black/10">MATRIARCH // CONNECTION BEGINS WITH HER CHOICE</p>
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
                  <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">Truth Sealed // Alignment Processing</p>
                </div>
              </div>
              <button onClick={() => window.location.reload()} className="text-[11px] font-black uppercase tracking-[0.4em] hover:underline">Synchronize</button>
            </div>
        </div>
      )}
    </div>
  );
};
