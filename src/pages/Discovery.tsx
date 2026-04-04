import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Eye, 
  TrendingUp, 
  Lock, 
  Shield, 
  Crown,
  Zap,
  Activity,
  ArrowUpRight,
  Heart
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Discovery: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'woman' | 'man' | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const initDiscovery = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData } = await supabase
          .from('profiles')
          .select('role, is_verified')
          .eq('user_id', user.id)
          .single();
        
        const userRole = userData?.role;
        setRole(userRole);
        setIsVerified(userData?.is_verified || false);

        if (userRole === 'woman') {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || ''}/api/v1/discovery/potential-matches?user_id=${user.id}`
          );
          const data = await response.json();
          setProfiles(data || []);
        }
      } catch (err) {
        console.error("Discovery error", err);
      } finally {
        setLoading(false);
      }
    };
    initDiscovery();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="p-1 rounded-full bg-gradient-to-tr from-matriarch-violet/20 to-mat-gold/20"
      >
        <div className="bg-white rounded-full p-10 border border-black/5 shadow-2xl">
          <Crown className="w-16 h-16 text-mat-gold opacity-20" strokeWidth={0.5} />
        </div>
      </motion.div>
      <div className="space-y-4 text-center">
        <h3 className="text-[10px] font-black uppercase tracking-[1em] text-black/20 animate-pulse">Invoking Sanctuary...</h3>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/10 italic">Curating Designated Souls</p>
      </div>
    </div>
  );

  if (!isVerified) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full p-2 bg-black/5 rounded-[4rem] shadow-2xl overflow-hidden"
        >
          <div className="mat-glass-deep p-16 space-y-12">
             <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-black text-white flex items-center justify-center shadow-2xl">
                <Lock className="w-10 h-10" strokeWidth={1.5} />
             </div>
             
             <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-2 border-black/10 text-black/40 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Protocol Restriction</Badge>
                <h2 className="text-5xl md:text-7xl mat-text-display-pro text-black uppercase leading-none italic">Access <br /><span className="opacity-10 text-4xl md:text-6xl">Restricted.</span></h2>
                <p className="text-xs text-black/40 font-mono uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic">
                   The Sanctuary's Discovery Layer is reserved for verified initiates. Complete your identity seal to explore.
                </p>
             </div>

             <Button 
                onClick={() => window.location.href = '/dashboard'} 
                className="w-full h-20 bg-black text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-[2rem] hover:bg-neutral-800 transition-all shadow-xl"
             >
                Initiate Verification
             </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (role === 'man') {
    return (
      <div className="mat-container py-12 space-y-24">
         <div className="text-center space-y-4">
            <Badge variant="outline" className="px-5 py-2 border-black/10 text-black/40 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Temporal Status</Badge>
            <h1 className="text-6xl md:text-8xl mat-text-display-pro text-black italic lowercase leading-none">Awaiting <br /><span className="text-black/20">The Gaze.</span></h1>
         </div>

         <div className="bento-grid">
            <div className="bento-span-8 bento-item mat-glass-deep p-12 group h-[400px]">
               <div className="flex flex-col h-full justify-between">
                  <div className="space-y-8">
                     <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                        <Clock className="w-8 h-8" />
                     </div>
                     <h2 className="text-4xl font-black text-black italic uppercase tracking-tighter leading-tight">The Art of <br />Presence.</h2>
                     <p className="text-black/60 font-mono text-xs uppercase leading-relaxed max-w-sm italic">You walk a path of patience. Your story is shared with those who hold the power of choice. Connection begins when she is ready.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-black/20 uppercase tracking-[0.4em]">
                     <Activity size={14} className="animate-pulse" />
                     Broadcast Signal: ACTIVE
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                  <Crown size={280} strokeWidth={0.5} />
               </div>
            </div>

            <div className="bento-span-4 bento-item bg-black text-white p-12 flex flex-col justify-between h-[400px]">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-xl font-black italic uppercase italic tracking-tighter leading-none">Matriarchal <br /><span className="opacity-20 text-lg">Interest.</span></h3>
                     <Eye className="text-mat-gold w-6 h-6" />
                  </div>
                  <p className="text-white/40 font-mono text-[9px] uppercase leading-relaxed italic underline decoration-white/10 underline-offset-8">Engagement with your designate identifier.</p>
               </div>

               <div className="space-y-8">
                  <div className="flex items-baseline gap-2">
                     <span className="text-6xl font-black tracking-tighter">42</span>
                     <span className="text-[10px] font-black uppercase text-mat-gold tracking-widest italic">Views</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ x: "-100%" }} 
                        animate={{ x: "0%" }} 
                        className="h-full w-full bg-mat-gold/50" 
                     />
                  </div>
               </div>

               <button className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.4em] text-[9px] rounded-xl hover:bg-neutral-200 transition-all">Refine Identity</button>
            </div>

            <div className="bento-span-4 bento-item mat-glass flex flex-col justify-between">
               <div className="space-y-4">
                  <TrendingUp className="text-matriarch-violet w-8 h-8" />
                  <h4 className="text-xl font-black italic uppercase tracking-tighter italic">Ranking <br />Standing.</h4>
               </div>
               <div className="text-4xl font-black text-black tracking-tighter py-6 border-y border-black/5">Top 8%</div>
               <p className="text-[9px] font-black uppercase tracking-widest text-black/20 italic">Presence Tier: ELITE</p>
            </div>

            <div className="bento-span-4 bento-item mat-glass flex flex-col justify-between">
               <div className="space-y-4">
                  <Heart className="text-red-500/40 w-8 h-8" />
                  <h4 className="text-xl font-black italic uppercase tracking-tighter italic">Covenant <br />Resonance.</h4>
               </div>
               <div className="text-4xl font-black text-black tracking-tighter py-6 border-y border-black/5">Active</div>
               <p className="text-[9px] font-black uppercase tracking-widest text-black/20 italic">Heart Harmony Status</p>
            </div>

            <div className="bento-span-4 bento-item mat-glass border-dashed border-black/10 flex items-center justify-center">
               <div className="text-center space-y-4 scale-90 group-hover:scale-100 transition-transform">
                  <Shield className="w-8 h-8 text-black/10 mx-auto" strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 italic leading-relaxed">
                     Archival Record <br />Purge scheduled <br />in 48h.
                  </p>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (profiles.length === 0 && role === 'woman') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full p-px bg-black/5 rounded-[4rem] overflow-hidden"
        >
          <div className="mat-glass-deep p-16 space-y-12">
             <div className="mx-auto w-24 h-24 rounded-[3rem] bg-black/5 flex items-center justify-center border border-black/5">
                <Crown className="w-12 h-12 text-mat-gold" strokeWidth={0.5} />
             </div>
             
             <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-2 border-black/10 text-black/40 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Protocol Cycle</Badge>
                <h2 className="text-5xl md:text-7xl mat-text-display-pro text-black uppercase leading-none italic">Quiet <br /><span className="opacity-10 text-4xl md:text-6xl">Sanctuary.</span></h2>
                <p className="text-xs text-black/40 font-mono uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic">
                   The seekers have all been met. Connection begins again at the next temporal pulse. Check back shortly.
                </p>
             </div>

             <div className="pt-8 flex justify-center gap-3">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-black/10 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mat-container py-12 md:py-24">
       <div className="mb-16 space-y-4">
          <Badge variant="outline" className="px-5 py-2 border-matriarch-violet/10 text-matriarch-violet text-[9px] font-black uppercase tracking-[0.4em] rounded-full bg-matriarch-violet/5">Discovery Protocol</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-black italic lowercase leading-none">Find <br /><span className="text-black/20">The Seeker.</span></h1>
       </div>
       <SeekerBrowse />
    </div>
  );
};

export default Discovery;
