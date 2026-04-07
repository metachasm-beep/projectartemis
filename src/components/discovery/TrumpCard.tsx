import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Flame, Users, Home, Sword, Crosshair } from 'lucide-react';
import { mapToTrumpStats } from '@/utils/trumpData';
import { Button } from '@heroui/react';

interface TrumpCardProps {
  profile: {
    name: string;
    age: number;
    city: string;
    img: string;
    status: string;
    bio: string;
  };
  onClose?: () => void;
  onAction?: () => void;
}

export const TrumpCard: React.FC<TrumpCardProps> = ({ profile, onClose, onAction }) => {
  const stats = mapToTrumpStats({ name: profile.name, bio: profile.bio, status: profile.status });
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
             <div className="flex items-center gap-1">
                <Home size={10} className="text-mat-gold/60" />
                <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Hometown</span>
             </div>
             <p className="text-[10px] font-black text-mat-cream uppercase leading-none">{profile.city}</p>
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
             {onAction && (
               <Button 
                 size="sm" 
                 onPress={onAction}
                 className="h-7 bg-mat-gold text-mat-obsidian text-[8px] font-black px-4 rounded-none border border-mat-obsidian"
               >
                 LET'S WRESTLE
               </Button>
             )}
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
