import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Eye, 
  TrendingUp, 
  Lock, 
  Shield, 
  Crown
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import SoftAurora from "@/components/ui/react-bits/SoftAurora";

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

        // Fetch user role
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
        } else {
          // Petitioners don't load profiles
          setProfiles([]);
        }
      } catch (err) {
        console.error("Discovery error", err);
      } finally {
        setLoading(false);
      }
    };
    initDiscovery();
  }, []);

  if (!isVerified && !loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center mat-shell px-12 text-center mat-noise-overlay relative">
         <div className="fixed inset-0 -z-50 opacity-10 pointer-events-none">
          <SoftAurora speed={0.05} brightness={0.5} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-matriarch-violet/10 blur-[150px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-12"
        >
          <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative group">
            <Lock className="w-10 h-10 text-mat-gold transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-mat-gold/20 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl mat-text-display-pro text-white leading-tight uppercase shadow-mat-gold/10 overflow-visible py-2">Access <span className="mat-text-gradient-gold">Restricted</span></h2>
            <p className="text-xs lg:text-sm text-white/40 font-medium tracking-wide italic leading-relaxed">
              The Sanctuary's Discovery is reserved for verified souls. Verify your Aadhaar to explore the curated connections.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
             <Button 
                onClick={() => window.location.href = '/dashboard'} 
                className="h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:scale-[0.98] transition-all shadow-2xl"
             >
               Go to Dashboard to Verify
             </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center mat-shell px-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-12 p-1.5 rounded-full bg-gradient-to-tr from-matriarch-violetBright to-mat-gold shadow-2xl"
      >
        <div className="bg-[#0F0F10] rounded-full p-8">
          <Crown className="w-16 h-16 text-mat-gold" strokeWidth={0.5} />
        </div>
      </motion.div>
      <div className="space-y-4 text-center">
        <h3 className="mat-text-label-pro !text-mat-gold/40 animate-pulse">Invoking Sanctuary...</h3>
        <p className="text-[10px] text-white/20 uppercase tracking-[1em] font-black italic">Curating Souls</p>
      </div>
    </div>
  );

  if (role === 'man') {
    return (
      <div className="min-h-screen mat-shell mat-noise-overlay relative bg-[#0A0A0B]">
        <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
          <SoftAurora speed={0.1} brightness={0.8} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
        </div>

      <main className="mat-container py-24 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full mat-panel-premium bg-white/[0.01] border-white/5 p-8 lg:p-24 rounded-[3rem] lg:rounded-[4rem] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-mat-gold-glow opacity-5" />
            
            <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-mat-gold/10 flex items-center justify-center border border-mat-gold/20 shadow-2xl mb-12">
              <Clock className="w-12 h-12 text-mat-gold" strokeWidth={1} />
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl mat-text-display-pro text-white leading-tight uppercase overflow-visible py-2">Awaiting Her <span className="mat-text-gradient-gold">Gaze</span></h2>
              <p className="mat-text-label-pro opacity-40 italic">Your story is shared with those who choose.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 py-12">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto transition-all group-hover:bg-mat-gold group-hover:text-black">
                   <Eye size={18} />
                </div>
                <div className="text-3xl lg:text-4xl mat-text-display-pro text-white">42</div>
                <div className="mat-text-label-pro !text-[7px] lg:!text-[8px] !not-italic opacity-40">Kindred Souls</div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto transition-all group-hover:bg-matriarch-violetBright group-hover:text-white">
                   <TrendingUp size={18} />
                </div>
                <div className="text-3xl lg:text-4xl mat-text-display-pro text-white">Top 8%</div>
                <div className="mat-text-label-pro !text-[7px] lg:!text-[8px] !not-italic opacity-40">Your Presence</div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto transition-all group-hover:bg-green-500 group-hover:text-black">
                   <Shield size={18} />
                </div>
                <div className="text-3xl lg:text-4xl mat-text-display-pro text-white">Active</div>
                <div className="mat-text-label-pro !text-[7px] lg:!text-[8px] !not-italic opacity-40">Heart Harmony</div>
              </div>
            </div>

            <div className="p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center text-center lg:text-left mb-12">
              <div className="w-16 h-16 rounded-[1.25rem] bg-matriarch-violetBright flex items-center justify-center shrink-0 shadow-mat-violet">
                <Crown size={28} className="text-white" strokeWidth={1} />
              </div>
              <div>
                <h4 className="mat-text-label-pro !text-white !not-italic mb-2">The Art of Waiting</h4>
                <p className="text-[11px] lg:text-[12px] text-white/40 italic font-medium leading-relaxed">
                  Seekers walk a path of patience. Connection begins when she is ready. Let your story speak for the heart you carry.
                </p>
              </div>
            </div>

            <Button className="w-full h-18 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
              Deepen Your Story
            </Button>
          </motion.div>
        </main>

        <div className="fixed bottom-0 w-full py-10 text-center pointer-events-none opacity-[0.03]">
          <span className="text-[12px] font-black uppercase tracking-[2em] text-white">A JOURNEY OF HEART AND CHOICE // MATRIARCH</span>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 && role === 'woman' && !loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center mat-shell px-12 text-center mat-noise-overlay">
        <div className="fixed inset-0 -z-50 opacity-10 pointer-events-none">
          <SoftAurora speed={0.05} brightness={0.5} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-matriarch-violet/10 blur-[150px] -z-10" />
        <Crown className="w-24 h-24 text-mat-gold mb-12 shadow-mat-gold/20 animate-pulse" strokeWidth={0.5} />
        <h2 className="text-5xl lg:text-6xl mat-text-display-pro text-white leading-tight uppercase mb-6">The Sanctuary is <span className="mat-text-gradient-gold">Quiet</span></h2>
        <p className="text-lg lg:text-xl text-white/40 max-w-sm font-medium tracking-wide leading-relaxed italic">
          The seekers have all been met. A moment of peace before the next stories unfold. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mat-shell mat-noise-overlay relative bg-[#0A0A0B]">
      <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
        <SoftAurora speed={0.1} brightness={0.8} color1="#6E3FF3" color2="#24152E" enableMouseInteraction={false} />
      </div>

      <main className="mat-container pt-12 lg:pt-16 pb-32">
        <SeekerBrowse />
      </main>

      <div className="fixed bottom-0 w-full py-10 text-center pointer-events-none opacity-[0.03]">
          <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-[2.5em] text-white">MATRIARCH // THE CHOICE IS YOURS</span>
      </div>
    </div>
  );
};

export default Discovery;
