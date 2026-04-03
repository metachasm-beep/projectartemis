import React, { useEffect, useState } from 'react';
import { MatriarchText } from '../components/MatriarchText';
import { MagicBento } from '../components/MagicBento';
import GlassSurface from '../components/GlassSurface';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Zap, Users, MessageSquare, Heart } from 'lucide-react';

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
    <div className="h-screen flex items-center justify-center">
      <MatriarchText text="CALCULATING SOVEREIGNTY..." variant="h3" gold />
    </div>
  );

  const tierColor = status?.rank_tier === 'elite' ? '#D4AF37' : status?.rank_tier === 'high' ? '#A78BFA' : '#C0C0C0';

  const bentoItems = [
    {
      id: 'rank',
      title: 'Global Rank',
      description: status?.rank_tier?.toUpperCase() || 'HIGH',
      label: 'SOVEREIGNTY',
      size: 'large' as const,
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
          <div className="relative">
             <Trophy size={80} className="text-gold opacity-20 absolute -top-4 -left-4 blur-xl" />
             <Trophy size={80} style={{ color: tierColor }} className="relative z-10" />
          </div>
          <div className="text-center">
            <div className="text-[64px] font-black leading-none text-gold mb-2">{Math.round(status?.rank_score || 0)}</div>
            <div className="text-[10px] tracking-[0.5em] font-bold text-white/40 uppercase">Sovereign Points</div>
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
        <div className="flex items-center gap-4 h-full">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${status?.is_aadhaar_verified ? 'bg-green-500/10 text-green-400' : 'bg-gold/10 text-gold'}`}>
              <ShieldCheck size={28} />
           </div>
           <div>
              <div className="text-[10px] font-black tracking-widest text-white/40 mb-1 uppercase">Identification</div>
              <div className="text-sm font-bold text-white tracking-widest">{status?.is_aadhaar_verified ? 'AADHAAR_SECURE' : 'ACTION_REQUIRED'}</div>
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
        <div className="flex items-center gap-4 h-full">
           <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
              <Zap size={28} />
           </div>
           <div>
              <div className="text-[10px] font-black tracking-widest text-white/40 mb-1 uppercase">Active Boost</div>
              <div className="text-sm font-bold text-white tracking-widest">LEVEL_ZERO</div>
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
          <div className="flex flex-col items-center justify-center h-full gap-1">
            <Heart size={20} className="text-gold/40" />
            <div className="text-[8px] font-black text-gold/20 uppercase">Secure</div>
          </div>
        )
    }
  ];

  return (
    <div className="min-h-screen px-6 py-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center pt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MatriarchText text="MATRIARCH" variant="h1" gold className="italic mb-2" />
            <MatriarchText text="Sovereign Scoreboard" variant="caption" className="tracking-[0.4em] opacity-50 uppercase text-[10px] font-bold" />
            <div className="h-px w-16 bg-gold/30 mx-auto mt-6" />
          </motion.div>
        </header>

        <section className="mb-10">
          <MagicBento 
             items={bentoItems}
             glowColor="212, 175, 55"
             enableBorderGlow={true}
             enableTilt={true}
          />
        </section>

        <section className="grid grid-cols-1 gap-6">
           <GlassSurface 
              borderRadius={40} 
              brightness={15} 
              opacity={0.3} 
              blur={20}
              className="p-8 border border-white/5 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Users size={120} className="text-white" />
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
                 <div className="w-20 h-20 rounded-[28px] bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <Users size={40} className="text-gold" />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-gold mb-4 tracking-widest italic uppercase">Selection Strategy</h3>
                    <div className="space-y-4">
                       {(status?.tips || ["Complete your profile to unlock visibility."]).map((tip: string, i: number) => (
                         <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="text-sm font-medium text-white/70 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                         >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 shadow-[0_0_10px_#D4AF37]" />
                            {tip}
                         </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
           </GlassSurface>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
