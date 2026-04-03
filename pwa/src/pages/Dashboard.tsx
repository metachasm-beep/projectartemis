import React, { useEffect, useState } from 'react';
import { MagicBento } from '../components/MagicBento';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Zap, Users, MessageSquare, Heart, Crown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const data = await api.getRankStatus('male_demo');
      if (data) {
        setStatus(data);
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <div className="mb-6 rounded-2xl bg-[#6E3FF3]/10 p-4 border border-[#6E3FF3]/20 shadow-glow animate-pulse">
        <Crown className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
      </div>
      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] animate-pulse">Calculating Sovereignty...</div>
    </div>
  );

  const tierColor = status?.rank_tier === 'elite' ? '#D4AF37' : status?.rank_tier === 'high' ? '#6E3FF3' : '#A6A0B3';

  const bentoItems = [
    {
      id: 'rank',
      title: 'Global Rank',
      description: status?.rank_tier?.toUpperCase() || 'HIGH',
      label: 'SOVEREIGNTY',
      size: 'large' as const,
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
          <div className="relative group">
             <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl group-hover:bg-[#D4AF37]/40 transition-all duration-700" />
             <Trophy size={80} style={{ color: tierColor }} className="relative z-10 drop-shadow-premium" strokeWidth={1} />
          </div>
          <div className="text-center">
            <div className="text-7xl font-black leading-none text-[#F6F3EE] mb-2 tracking-tighter">{Math.round(status?.rank_score || 0)}</div>
            <div className="text-[10px] tracking-[0.6em] font-black text-white/30 uppercase">Sovereign Points</div>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Identity',
      description: status?.is_aadhaar_verified ? 'Verified' : 'Pending',
      label: 'STATUS',
      size: 'medium' as const,
      content: (
        <div className="flex items-center gap-6 h-full px-4">
           <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${status?.is_aadhaar_verified ? 'bg-[#6E3FF3]/10 text-[#6E3FF3]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'} shadow-glow`}>
              <ShieldCheck size={32} strokeWidth={1.5} />
           </div>
           <div>
              <div className="text-[10px] font-black tracking-[0.4em] text-white/20 mb-2 uppercase">Protocol Status</div>
              <div className="text-sm font-black text-white tracking-[0.2em]">{status?.is_aadhaar_verified ? 'VERIFIED_SOVEREIGN' : 'ACTION_REQUIRED'}</div>
           </div>
        </div>
      )
    },
    {
       id: 'boost',
       title: 'Visibility',
       description: 'Inactive',
       label: 'POWER',
       size: 'medium' as const,
       content: (
        <div className="flex items-center gap-6 h-full px-4">
           <div className="w-16 h-16 rounded-xl bg-[#6E3FF3]/10 text-[#6E3FF3] flex items-center justify-center shadow-glow">
              <Zap size={32} strokeWidth={1.5} />
           </div>
           <div>
              <div className="text-[10px] font-black tracking-[0.4em] text-white/20 mb-2 uppercase">Signal Boost</div>
              <div className="text-sm font-black text-white tracking-[0.2em]">PROTOCOL_IDLE</div>
           </div>
        </div>
      )
    },
    {
        id: 'msg',
        title: 'Activity',
        description: 'No requests',
        label: 'INBOX',
        size: 'small' as const,
        content: (
          <div className="flex flex-col items-center justify-center h-full gap-1">
            <MessageSquare size={20} className="text-white/20" />
            <div className="text-[8px] font-black text-white/10 uppercase">Null</div>
          </div>
        )
    },
    {
        id: 'safety',
        title: 'Safety',
        description: 'Elite',
        label: 'PROTECT',
        size: 'small' as const,
        content: (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Heart size={20} className="text-[#D4AF37]/40" />
            <div className="text-[8px] font-black text-[#D4AF37]/20 uppercase tracking-widest">Secure</div>
          </div>
        )
    }
  ];

  return (
    <div className="min-h-screen px-6 py-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 rounded-2xl bg-[#D4AF37]/10 p-4 border border-[#D4AF37]/20 shadow-glow">
               <Crown className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h1 className="text-6xl font-black text-[#F6F3EE] italic mb-4 tracking-tighter uppercase font-sora">MATRIARCH</h1>
            <div className="text-[10px] tracking-[0.8em] font-black text-[#6E3FF3] uppercase">Sovereign Scoreboard</div>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#6E3FF3]/40 to-transparent mt-12 mb-4" />
            <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Protocol Version 2.0.4</div>
          </motion.div>
        </header>

        <section className="mb-16">
          <MagicBento 
             items={bentoItems}
             glowColor="110, 63, 243"
             enableBorderGlow={true}
             enableTilt={true}
          />
        </section>

        <section className="grid grid-cols-1 gap-8">
           <div className="p-12 surface-premium rounded-xl relative overflow-hidden group border-none shadow-premium">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                 <Users size={160} className="text-white" />
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-12 relative z-10">
                 <div className="w-24 h-24 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 shadow-glow">
                    <Users size={48} className="text-[#D4AF37]" strokeWidth={1.5} />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-3xl font-black text-[#F6F3EE] mb-8 tracking-tighter italic uppercase">Selection Strategy</h3>
                    <div className="space-y-6">
                       {(status?.tips || ["Complete your profile to unlock visibility."]).map((tip: string, i: number) => (
                         <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-lg font-medium text-[#A6A0B3] flex items-center gap-6 surface-raised p-6 rounded-xl border-none hover:bg-white/[0.04] transition-all"
                         >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0 shadow-glow" />
                            {tip}
                         </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
