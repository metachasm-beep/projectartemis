import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Eye, 
  TrendingUp, 
  Lock, 
  Shield, 
  Crown,
  Activity,
  Heart
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';
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

        const result = await turso.execute(
          "SELECT role, is_verified FROM profiles WHERE user_id = ?",
          [user.id]
        );
        
        const userData = result.rows[0];
        const userRole = userData?.role as any;
        setRole(userRole);
        setIsVerified(!!userData?.is_verified);

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
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="p-1 rounded-full bg-gradient-to-tr from-mat-rose/30 to-mat-gold/30 shadow-mat-rose"
      >
        <div className="bg-mat-ivory rounded-full p-10 border border-mat-rose/20 shadow-xl">
          <Heart className="w-16 h-16 text-mat-rose fill-mat-rose/10" strokeWidth={1} />
        </div>
      </motion.div>
      <div className="space-y-4 text-center">
        <h3 className="text-[10px] font-bold uppercase tracking-[1em] text-mat-wine/40 animate-pulse">Invoking Sanctuary...</h3>
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-mat-slate/40 italic">Curating Designated Souls</p>
      </div>
    </div>
  );

  if (!isVerified) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full p-px bg-mat-rose/10 rounded-[4rem] shadow-mat-rose/5 overflow-hidden"
        >
          <div className="mat-glass-deep p-16 space-y-12">
             <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-mat-wine text-mat-cream flex items-center justify-center shadow-mat-premium">
                <Lock className="w-10 h-10" strokeWidth={1.5} />
             </div>
             
             <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">Nobility Restriction</Badge>
                <h2 className="text-5xl md:text-7xl mat-text-display-pro text-mat-wine uppercase leading-none italic">Access <br /><span className="text-mat-rose/20 text-4xl md:text-6xl">Restricted.</span></h2>
                <p className="text-xs text-mat-slate/60 font-medium uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic">
                   The Sanctuary's Discovery Layer is reserved for verified initiates. Complete your identity seal to explore.
                </p>
             </div>

             <Button 
                onClick={() => window.location.href = '/dashboard'} 
                className="w-full h-16 bg-mat-wine text-mat-cream font-bold uppercase tracking-[0.3em] text-[11px] rounded-[2rem] hover:bg-mat-wine-soft transition-all shadow-mat-premium"
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
            <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 text-mat-gold text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-gold/5">Temporal Status</Badge>
            <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Awaiting <br /><span className="text-mat-rose/20">The Gaze.</span></h1>
         </div>

         <div className="bento-grid">
            <div className="bento-span-8 bento-item mat-glass-deep p-12 group h-[400px]">
               <div className="flex flex-col h-full justify-between">
                  <div className="space-y-8">
                     <div className="w-16 h-16 bg-mat-wine text-mat-cream rounded-2xl flex items-center justify-center shadow-mat-premium">
                        <Clock className="w-8 h-8" />
                     </div>
                     <h2 className="text-4xl font-bold text-mat-wine italic leading-tight">The Art of <br /><span className="text-mat-gold">Presence.</span></h2>
                     <p className="text-mat-slate font-medium text-[13px] leading-relaxed max-w-sm italic border-l-2 border-mat-rose/20 pl-6">You walk a path of patience. Your story is shared with those who hold the power of choice. Connection begins when she is ready.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-mat-rose uppercase tracking-[0.4em]">
                     <Activity size={14} className="animate-pulse" />
                     Broadcast Signal: ACTIVE
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                  <Crown size={280} strokeWidth={0.5} className="text-mat-wine" />
               </div>
            </div>

            <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream p-12 flex flex-col justify-between h-[400px] shadow-mat-premium">
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <h3 className="text-xl font-bold italic leading-none text-mat-cream">Matriarchal <br /><span className="text-mat-gold/40 text-lg">Interest.</span></h3>
                     <Eye className="text-mat-gold w-6 h-6" />
                  </div>
                  <p className="text-mat-cream/40 font-medium text-[9px] uppercase leading-relaxed italic border-b border-white/5 pb-4">Engagement with your designate identifier.</p>
               </div>

               <div className="space-y-8">
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold tracking-tighter italic opacity-20" style={{ fontFamily: 'var(--font-display)' }}>SYNCING</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ x: "-100%" }} 
                        animate={{ x: "0%" }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-full w-full bg-mat-gold/50" 
                     />
                  </div>
               </div>

               <button className="w-full h-16 bg-mat-cream text-mat-wine font-bold uppercase tracking-[0.4em] text-[9px] rounded-xl hover:bg-white transition-all shadow-sm">Refine Identity</button>
            </div>

            <div className="bento-span-4 bento-item mat-glass flex flex-col justify-between border-mat-rose/10">
               <div className="space-y-4">
                  <TrendingUp className="text-mat-wine w-8 h-8" />
                  <h4 className="text-xl font-bold italic leading-none text-mat-wine">Ranking <br /><span className="text-mat-rose/40">Standing.</span></h4>
               </div>
               <div className="text-4xl font-bold text-mat-wine tracking-tighter py-6 border-y border-mat-rose/10 opacity-20" style={{ fontFamily: 'var(--font-display)' }}>...</div>
               <p className="text-[9px] font-bold uppercase tracking-widest text-mat-slate/40 italic">Evaluating Signal</p>
            </div>

            <div className="bento-span-4 bento-item mat-glass flex flex-col justify-between border-mat-rose/10 shadow-sm">
               <div className="space-y-4">
                  <Heart className="text-mat-rose/40 w-8 h-8" fill="currentColor" />
                  <h4 className="text-xl font-bold italic leading-none text-mat-wine">Covenant <br /><span className="text-mat-rose/40">Resonance.</span></h4>
               </div>
               <div className="text-4xl font-bold text-mat-wine tracking-tighter py-6 border-y border-mat-rose/10" style={{ fontFamily: 'var(--font-display)' }}>Active</div>
               <p className="text-[9px] font-bold uppercase tracking-widest text-mat-slate/40 italic">Heart Harmony Status</p>
            </div>

            <div className="bento-span-4 bento-item mat-glass border-dashed border-mat-rose/30 flex items-center justify-center">
               <div className="text-center space-y-4 scale-90 group-hover:scale-100 transition-transform">
                  <Shield className="w-8 h-8 text-mat-rose/20 mx-auto" strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/40 italic leading-relaxed">
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
          className="max-w-xl w-full p-px bg-mat-rose/10 rounded-[4rem] overflow-hidden"
        >
          <div className="mat-glass-deep p-16 space-y-12">
             <div className="mx-auto w-24 h-24 rounded-[3rem] bg-mat-rose/5 flex items-center justify-center border border-mat-rose/20 shadow-sm">
                <Heart className="w-12 h-12 text-mat-rose fill-mat-rose/10" strokeWidth={1} />
             </div>
             
             <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full">Temporal Cycle</Badge>
                <h2 className="text-5xl md:text-7xl mat-text-display-pro text-mat-wine uppercase leading-none italic">Quiet <br /><span className="text-mat-rose/20 text-4xl md:text-6xl">Sanctuary.</span></h2>
                <p className="text-xs text-mat-slate/60 font-medium uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic">
                   The seekers have all been met. Connection begins again at the next temporal pulse. Check back shortly.
                </p>
             </div>

             <div className="pt-8 flex justify-center gap-3">
                {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 bg-mat-rose/20 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mat-container py-12 md:py-24">
       <div className="mb-16 space-y-4">
          <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-wine text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5 shadow-sm">Discovery layer</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">Find <br /><span className="text-mat-rose/20">The Seeker.</span></h1>
       </div>
       <SeekerBrowse />
    </div>
  );
};

export default Discovery;
