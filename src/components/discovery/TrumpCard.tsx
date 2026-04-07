import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Flame, Users, Sword, Crosshair } from 'lucide-react';
import { mapToTrumpStats } from '@/utils/trumpData';
import { Button } from '@heroui/react';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { Lock } from 'lucide-react';

interface TrumpCardProps {
  profile: {
    name: string;
    age: number;
    city: string;
    img: string;
    status: string;
    bio: string;
    is_verified?: boolean;
  };
  onClose?: () => void;
  onAction?: () => void;
}

export const TrumpCard: React.FC<TrumpCardProps> = ({ profile, onClose, onAction }) => {
  const stats = mapToTrumpStats(profile);
  const isHighRank = profile.status?.toLowerCase().includes('imperial') || profile.status?.toLowerCase().includes('vanguard');
  const needsVerification = isHighRank && !profile.is_verified;
  const isPremium = profile.status === 'Imperial' || profile.status === 'Vanguard';

  const statItems = [
    { label: 'Charisma', value: stats.charisma, icon: Flame, color: 'text-orange-500' },
    { label: 'Stamina', value: stats.stamina, icon: Zap, color: 'text-yellow-400' },
    { label: 'Intellect', value: stats.intellect, icon: Brain, color: 'text-blue-400' },
    { label: 'Vibe', value: stats.vibe, icon: Crosshair, color: 'text-mat-rose' },
    { label: 'Social', value: stats.social, icon: Users, color: 'text-green-400' },
  ];

  return (
    <motion.div 
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 30, opacity: 0 }}
      className="relative w-full max-w-[400px] aspect-[2/3] bg-mat-obsidian border-[6px] border-mat-gold rounded-[2rem] shadow-[0_0_60px_rgba(191,160,106,0.3)] overflow-hidden flex flex-col"
    >
      {/* 1. THE CARD FRAME & HOLOGRAPHIC OVERLAY */}
      {isPremium && <div className="absolute inset-0 mat-card-holographic pointer-events-none z-10 opacity-40 mix-blend-overlay" />}
      
      {/* 2. HEADER: SOBRIQUET */}
      <div className="absolute top-0 left-0 w-full h-16 bg-mat-gold flex items-center justify-center px-4 z-20">
        <h2 className="mat-text-impact text-mat-obsidian text-2xl tracking-tighter text-center">
          {stats.sobriquet}
        </h2>
      </div>

      {/* 3. HERO IMAGE */}
      <div className="relative flex-1 mt-14 mb-32 overflow-hidden border-b-[3px] border-mat-gold">
        <img 
          src={profile.img} 
          className="w-full h-full object-cover mat-gritty-filter scale-110" 
          alt={profile.name}
        />
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-mat-obsidian via-transparent to-transparent z-10">
           <p className="mat-text-impact text-mat-gold text-4xl italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
             {profile.name.toUpperCase()}
           </p>
        </div>
      </div>

      {/* 4. STATS & FLAVOR BOX */}
      <div className="absolute bottom-0 left-0 w-full bg-mat-obsidian/95 backdrop-blur-md p-6 pt-4 border-t-[3px] border-mat-gold z-20 h-40">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {statItems.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <s.icon size={14} className={`${s.color} mb-1`} />
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${s.value}%` }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className={`h-full ${s.color.replace('text-', 'bg-')}`} 
                />
              </div>
              <span className="text-[7px] font-black uppercase text-white/50 mt-1">{s.label}</span>
              <span className="text-[9px] font-black text-white">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="space-y-1">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black italic uppercase tracking-wider text-mat-cream font-['Roboto Condensed']">
                    {profile.name}
                  </h3>
                  <VerificationBadge verified={profile.is_verified} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-mat-gold/80 mt-1">
                  {profile.age} • {profile.city.toUpperCase()}
                </p>
            </div>
          </div>
          <div className="space-y-1">
             <div className="flex items-center gap-1">
                <Sword size={10} className="text-mat-gold/60" />
                <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Signature Move</span>
             </div>
             <p className="text-[10px] font-black text-mat-rose uppercase leading-none truncate">{stats.signatureMove}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
           <span className="text-[8px] font-black text-mat-gold bg-mat-gold/10 px-2 py-1 rounded-sm border border-mat-gold/30 italic">
             {stats.weightClass}
           </span>
           <div className="flex gap-2">
             {/* Action Button */}
          <div className="mt-8 relative z-40">
            {needsVerification ? (
              <div className="space-y-3">
                 <div className="flex items-center gap-2 justify-center py-2 px-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Lock size={10} className="text-red-500" />
                    <span className="text-[8px] uppercase tracking-widest font-bold text-red-400">Restricted Access: Verification Required</span>
                 </div>
                 <Button 
                   className="w-full h-14 bg-white/5 text-white/20 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] border border-white/10 cursor-not-allowed"
                   isDisabled
                 >
                   Sync Identity to Unlock
                 </Button>
              </div>
            ) : (
              <Button 
                onPress={onAction}
                className="w-full h-14 bg-mat-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]"
              >
                Initiate Connection Protocol
              </Button>
            )}
          </div>
              {onClose && (
                <Button 
                  isIconOnly
                  size="sm" 
                  onPress={onClose}
                  className="h-7 w-7 bg-white/5 text-white/50 border border-white/10 rounded-none"
                >
                  X
                </Button>
              )}
           </div>
        </div>
      </div>

      {/* Decorative Symbols */}
      <div className="absolute top-2 right-2 text-mat-obsidian/30 z-30 pointer-events-none">
         <Crosshair size={48} />
      </div>
    </motion.div>
  );
};
