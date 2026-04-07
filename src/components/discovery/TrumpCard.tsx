import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Flame, 
  Users, 
  Crosshair, 
  MessageSquarePlus, 
  ShieldAlert, 
  UserX, 
  EyeOff,
  X,
  Lock,
  MapPin,
  Trophy
} from 'lucide-react';
import { mapToTrumpStats } from '@/utils/trumpData';
import { Button } from '@heroui/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { cn } from '@/lib/utils';

interface TrumpCardProps {
  profile: {
    user_id?: string;
    name: string;
    age: number;
    city: string;
    img: string;
    status: string;
    bio: string;
    height_str: string;
    vocation: string;
    tier: string;
    is_verified?: boolean;
  };
  onClose?: () => void;
  onAction?: (type: string) => void;
}

export const TrumpCard: React.FC<TrumpCardProps> = ({ profile, onClose, onAction }) => {
  const stats = mapToTrumpStats(profile);
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
      className="relative w-full max-w-[420px] aspect-[2/3.4] bg-mat-obsidian border-[6px] border-mat-gold rounded-[2.5rem] shadow-[0_0_80px_rgba(191,160,106,0.4)] overflow-hidden flex flex-col"
    >
      {isPremium && <div className="absolute inset-0 mat-card-holographic pointer-events-none z-10 opacity-40 mix-blend-overlay" />}
      
      {/* CARD HEADER */}
      <div className="absolute top-0 left-0 w-full h-14 bg-mat-gold flex items-center justify-between px-6 z-20">
        <span className="text-[10px] font-black uppercase tracking-widest text-mat-obsidian/40 italic">Matriarch Protocol</span>
        <h2 className="mat-text-impact text-mat-obsidian text-xl tracking-tighter uppercase">
          {stats.sobriquet}
        </h2>
        {onClose ? (
           <button onClick={onClose} className="p-1 hover:scale-110 transition-transform"><X size={18} className="text-mat-obsidian" /></button>
        ) : <div className="w-4" />}
      </div>

      {/* HERO IMAGE */}
      <div className="relative h-[48%] mt-14 overflow-hidden border-b-[3px] border-mat-gold">
        <img 
          src={profile.img} 
          className="w-full h-full object-cover mat-gritty-filter scale-110" 
          alt={profile.name}
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent z-10">
           <div className="flex items-center gap-3">
              <p className="mat-text-impact text-mat-gold text-4xl italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                {profile.name.toUpperCase()}
              </p>
              <VerificationBadge verified={profile.is_verified} />
           </div>
           <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/50 mt-1">
             Age {profile.age} • {profile.city.toUpperCase()}
           </p>
        </div>
      </div>

      {/* STATS & MINI DOSSIER */}
      <div className="flex-1 bg-mat-obsidian/95 backdrop-blur-md p-6 flex flex-col justify-between">
        
        {/* Core Stats Bar */}
        <div className="grid grid-cols-5 gap-3">
          {statItems.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <s.icon size={10} className={`${s.color} mb-1.5`} />
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${s.value}%` }}
                   className={`h-full ${s.color.replace('text-', 'bg-')}`} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini Dossier Summary */}
        <div className="mt-4 space-y-2 border-y border-white/5 py-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/30">
                 <Trophy size={10} />
                 <span className="text-[8px] uppercase font-black tracking-widest">Tier</span>
              </div>
              <span className="text-mat-gold text-[9px] font-bold italic uppercase">{profile.tier}</span>
           </div>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/30">
                 <MapPin size={10} />
                 <span className="text-[8px] uppercase font-black tracking-widest">Stature</span>
              </div>
              <span className="text-mat-cream/60 text-[9px] font-medium">{profile.height_str}</span>
           </div>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/30">
                 <Lock size={10} />
                 <span className="text-[8px] uppercase font-black tracking-widest">Vocation</span>
              </div>
              <span className="text-mat-cream/40 text-[9px] font-medium italic">{profile.vocation}</span>
           </div>
        </div>

        {/* REFINED ENGAGEMENT MATRIX (Neat Icon-Sized Buttons) */}
        <div className="flex items-center justify-center gap-5 mt-4">
           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('report')}
                   isIconOnly 
                   className="w-10 h-10 min-w-0 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-mat-wine transition-all rounded-full p-0"
                 >
                    <ShieldAlert size={16} />
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Report Signal</TooltipContent>
           </Tooltip>

           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('block')}
                   isIconOnly 
                   className="w-10 h-10 min-w-0 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-mat-wine transition-all rounded-full p-0"
                 >
                    <UserX size={16} />
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Purge Resonance</TooltipContent>
           </Tooltip>

           <Button 
             onPress={() => onAction?.('ping')}
             isIconOnly
             className={cn(
               "w-12 h-12 min-w-0 rounded-full shadow-2xl transition-all flex items-center justify-center p-0",
               profile.is_verified ? "bg-mat-gold text-mat-obsidian" : "bg-white/10 text-white/20"
             )}
           >
              {profile.is_verified ? <MessageSquarePlus size={24} /> : <Lock size={20} />}
           </Button>

           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('never_show')}
                   isIconOnly
                   className="w-10 h-10 min-w-0 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-full p-0"
                 >
                    <EyeOff size={14} />
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Filter Protocol</TooltipContent>
           </Tooltip>
        </div>
      </div>

      {/* DECORATIVE CROSSHAIR */}
      <div className="absolute top-16 right-4 text-mat-gold/10 z-0 pointer-events-none">
         <Crosshair size={100} strokeWidth={0.5} />
      </div>
    </motion.div>
  );
};

export default TrumpCard;
