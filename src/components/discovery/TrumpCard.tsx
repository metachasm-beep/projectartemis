import React from 'react';
import { motion } from 'framer-motion';
import { 
  X,
  Lock,
  MapPin,
  Trophy,
  Crown,
  MessageSquarePlus,
  ShieldAlert,
  UserX,
  EyeOff,
  Crosshair
} from 'lucide-react';
import { mapToTrumpStats, sanitizeBio } from '@/utils/trumpData';
import { Button } from '@heroui/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { cn } from '@/lib/utils';

interface TrumpCardProps {
  profile: {
    id: string;
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
    { label: 'CHARISMA', value: stats.charisma, color: 'from-orange-600 to-orange-400' },
    { label: 'STAMINA', value: stats.stamina, color: 'from-yellow-600 to-yellow-400' },
    { label: 'INTELLECT', value: stats.intellect, color: 'from-blue-600 to-blue-400' },
    { label: 'VIBE', value: stats.vibe, color: 'from-rose-600 to-rose-400' },
    { label: 'SOCIAL', value: stats.social, color: 'from-emerald-600 to-emerald-400' },
  ];

  // Calculate total power level
  const powerLevel = Math.round((stats.charisma + stats.stamina + stats.intellect + stats.vibe + stats.social) / 5);

  return (
    <motion.div 
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 30, opacity: 0 }}
      className="relative w-full max-w-[420px] aspect-[2/3.6] bg-mat-obsidian border-[8px] border-mat-gold rounded-[2.5rem] shadow-[0_0_100px_rgba(191,160,106,0.5)] overflow-hidden flex flex-col group"
    >
      {isPremium && <div className="absolute inset-0 mat-card-holographic pointer-events-none z-10 opacity-30 mix-blend-overlay group-hover:opacity-50 transition-opacity" />}
      
      {/* 🏆 WRESTLING CARD HEADER */}
      <div className="absolute top-0 left-0 w-full h-16 bg-mat-gold flex items-center justify-between px-6 z-20 border-b-4 border-mat-gold-dark shadow-2xl">
        <div className="flex flex-col">
           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-mat-obsidian/60 italic leading-none">Matriarch League</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-mat-obsidian/40 italic">Series 01 // Aspirant</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase text-mat-obsidian/60">Power Lvl</span>
              <span className="mat-text-impact text-mat-obsidian text-2xl leading-none">{powerLevel}</span>
           </div>
           {onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-mat-obsidian/10 flex items-center justify-center hover:bg-mat-obsidian/20 transition-colors">
                <X size={18} className="text-mat-obsidian" />
              </button>
           )}
        </div>
      </div>

      {/* 🖼️ HERO PORTRAIT */}
      <div className="relative h-[42%] mt-16 overflow-hidden border-b-4 border-mat-gold group-hover:brightness-110 transition-all duration-700">
        <img 
          src={profile.img} 
          className="w-full h-full object-cover mat-gritty-filter scale-105 group-hover:scale-110 transition-transform duration-[2s]" 
          alt={profile.name}
        />
        
        {/* Status Badge */}
        <div className="absolute top-6 left-6 z-20">
           <div className="px-4 py-1.5 bg-mat-gold text-mat-obsidian rounded-full flex items-center gap-2 shadow-2xl border-2 border-mat-obsidian/10">
              <Crown size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">{profile.status}</span>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/60 to-transparent z-10">
           <div className="flex items-center gap-3">
              <p className="mat-text-impact text-mat-gold text-5xl italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tighter leading-tight">
                {profile.name.toUpperCase()}
              </p>
              <VerificationBadge verified={profile.is_verified} />
           </div>
           <p className="text-[11px] uppercase tracking-[0.5em] font-black text-white/70 mt-1 drop-shadow-md">
             Age {profile.age} • {profile.city.toUpperCase()}
           </p>
        </div>
      </div>

      {/* 📜 CONSOLIDATED INTEL */}
      <div className="flex-1 bg-mat-obsidian/95 backdrop-blur-xl p-8 flex flex-col justify-between relative">
        
        {/* Bio Inlay */}
        <div className="mb-6">
           <p className="text-mat-cream/80 text-[11px] leading-relaxed font-light line-clamp-2 italic">
              "{sanitizeBio(profile.bio) || "Identity narrative not established."}"
           </p>
        </div>

        {/* 📊 STAT GRID (3 IN A ROW) */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          {statItems.map((s, i) => (
            <div key={i} className="space-y-1.5">
               <div className="flex items-center justify-between px-0.5">
                  <span className="text-[7.5px] font-black uppercase tracking-wider text-white/40">{s.label}</span>
                  <span className="text-[9px] font-black text-mat-gold italic">{s.value}</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${s.value}%` }}
                     transition={{ delay: i * 0.1, duration: 0.8 }}
                     className={cn("h-full bg-gradient-to-r shadow-[0_0_10px_rgba(255,255,255,0.1)]", s.color)} 
                  />
               </div>
            </div>
          ))}
        </div>

        {/* 📋 DOSSIER FOOTER */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 pb-2">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-mat-gold">
                 <Trophy size={14} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] uppercase font-black tracking-widest text-white/30">Capital Tier</span>
                 <span className="text-[9px] font-bold text-mat-cream uppercase truncate">{profile.tier}</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-mat-gold">
                 <MapPin size={14} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] uppercase font-black tracking-widest text-white/30">Stature</span>
                 <span className="text-[9px] font-bold text-mat-cream uppercase">{profile.height_str}</span>
              </div>
           </div>
           <div className="flex items-center gap-3 col-span-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-mat-gold">
                 <Lock size={14} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] uppercase font-black tracking-widest text-white/30">Core Vocation</span>
                 <span className="text-[9px] font-bold text-mat-cream/50 italic truncate">{profile.vocation}</span>
              </div>
           </div>
        </div>

        {/* ⚡ ARTISTIC ENGAGEMENT MATRIX */}
        <div className="flex items-center justify-center gap-6 pt-6">
           
           {/* Report Button */}
           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('report')}
                   isIconOnly 
                   className="w-12 h-12 min-w-0 bg-white/5 border-2 border-mat-gold/30 text-white/40 hover:text-white hover:bg-mat-wine hover:border-mat-wine transition-all rounded-full p-0 flex items-center justify-center shadow-xl"
                 >
                    <div className="flex items-center justify-center w-full h-full">
                       <ShieldAlert size={20} />
                    </div>
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Report</TooltipContent>
           </Tooltip>

           {/* Block Button */}
           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('block')}
                   isIconOnly 
                   className="w-12 h-12 min-w-0 bg-white/5 border-2 border-mat-gold/30 text-white/40 hover:text-white hover:bg-mat-wine hover:border-mat-wine transition-all rounded-full p-0 flex items-center justify-center shadow-xl"
                 >
                    <div className="flex items-center justify-center w-full h-full">
                       <UserX size={20} />
                    </div>
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Block</TooltipContent>
           </Tooltip>

           {/* PRIMARY Ping Button */}
           <Tooltip>
              <TooltipTrigger>
                <Button 
                  onPress={() => onAction?.('ping')}
                  isIconOnly
                  className={cn(
                    "w-16 h-16 min-w-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-mat-gold-dark transition-all flex items-center justify-center p-0 scale-110",
                    profile.is_verified 
                      ? "bg-gradient-to-br from-mat-gold to-mat-gold-dark text-mat-obsidian" 
                      : "bg-white/10 text-white/20 border-white/5"
                  )}
                >
                    <div className="flex items-center justify-center w-full h-full">
                      {profile.is_verified ? <MessageSquarePlus size={32} /> : <Lock size={24} />}
                    </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Message</TooltipContent>
           </Tooltip>

           {/* Never Button */}
           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('never_show')}
                   isIconOnly
                   className="w-12 h-12 min-w-0 bg-white/5 border-2 border-mat-gold/30 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-full p-0 flex items-center justify-center shadow-xl"
                 >
                    <div className="flex items-center justify-center w-full h-full">
                       <EyeOff size={18} />
                    </div>
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Hide From View</TooltipContent>
           </Tooltip>
        </div>
      </div>

      {/* DECORATIVE CROSSHAIR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-mat-gold/5 z-0 pointer-events-none scale-150">
         <Crosshair size={200} strokeWidth={0.3} />
      </div>
    </motion.div>
  );
};

export default TrumpCard;
