import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  Crown, 
  Star, 
  Trophy,
  ArrowUpRight,
  BrainCircuit,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  label: string;
  level: number;
  mastery_pct: number;
  description: string;
}

export const Playbook: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/agentic/playbook/skills`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error("Playbook fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'identity-sealing': return Fingerprint;
      case 'sanctuary-design': return BrainCircuit;
      case 'elite-comms': return Zap;
      default: return Target;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">The Playbook</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Mastery of the Matriarch Protocol</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-mat-gold/20 flex items-center justify-center">
            <Trophy className="text-mat-gold" size={20} />
          </div>
          <div>
            <span className="block text-white/40 text-[9px] font-black uppercase tracking-widest">Global Rank</span>
            <span className="text-white font-mono text-lg">Top 4%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => {
          const Icon = getIcon(skill.id);
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={skill.id}
              className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 group hover:border-mat-gold/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-mat-gold/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-mat-gold/10 transition-colors" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-mat-gold/20 transition-colors">
                    <Icon className="text-white/40 group-hover:text-mat-gold transition-colors" size={32} strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">{skill.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-mat-gold font-black uppercase tracking-[0.2em]">Level {skill.level}</span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">{skill.id.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[24px] font-display font-black text-white/10 group-hover:text-mat-gold/20 transition-colors">0{index + 1}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Mastery Progress</span>
                  <span className="text-white font-mono text-sm">{skill.mastery_pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.mastery_pct}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-mat-gold/40 to-mat-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                  />
                </div>
              </div>

              <p className="mt-6 text-[11px] text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors relative z-10">
                {skill.description}
              </p>

              <button className="mt-6 flex items-center gap-2 text-[9px] font-black text-mat-gold uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">
                View Playbook <ArrowUpRight size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {skills.length === 0 && !loading && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <Star size={48} className="mx-auto text-white/10 mb-4" strokeWidth={1} />
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">No skills recorded in the Playbook yet.</p>
          <button className="mt-6 text-[11px] text-mat-gold font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Begin Training Session</button>
        </div>
      )}
    </div>
  );
};
