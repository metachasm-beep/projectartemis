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
    absolute_rank?: number | null;
    rank_tier?: string;
  };
  onClose?: () => void;
  onAction?: (type: string) => void;
  isDashboard?: boolean;
}

export const TrumpCard: React.FC<TrumpCardProps> = ({ profile, onClose, onAction, isDashboard }) => {
  const stats = mapToTrumpStats(profile);
  const isPremium = profile.status === 'Imperial' || profile.status === 'Vanguard';

  const statItems = [
    { label: 'CHARISMA', value: stats.charisma, color: 'from-orange-600 to-orange-400' },
    { label: 'STAMINA', value: stats.stamina, color: 'from-yellow-600 to-yellow-400' },
    { label: 'INTELLECT', value: stats.intellect, color: 'from-blue-600 to-blue-400' },
    { label: 'VIBE', value: stats.vibe, color: 'from-rose-600 to-rose-400' },
    { label: 'SOCIAL', value: stats.social, color: 'from-emerald-600 to-emerald-400' },
  ];

  const powerLevel = Math.round((stats.charisma + stats.stamina + stats.intellect + stats.vibe + stats.social) / 5);

  const VOCATIONS: Record<string, string> = {
    'Architect': 'The Architect',
    'Strategist': 'The Strategist',
    'Imperial': 'The Imperial',
    'Aspirant': 'The Aspirant',
    'Director': 'The Visionary',
    'Engineer': 'The Strategist',
    'Creative': 'The Catalyst'
  };
  const archetype = VOCATIONS[profile.vocation] || profile.vocation || 'The Aspirant';

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className={cn(
        "relative bg-[#1A1A1A] border-l-[1px] border-t-[1px] border-white/10 border-r-[2px] border-b-[2px] border-black/60 rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col group p-[1px] select-none",
        isDashboard ? "w-full h-full aspect-[2/3] lg:aspect-[3/4.2]" : "w-full max-w-[480px] h-[85vh] md:min-h-[750px] max-h-[900px]"
      )}
    >
      {/* 🧬 Material Texture Overlay (Carbon/Noise) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0" />
      
      {isPremium && <div className="absolute inset-0 mat-card-holographic pointer-events-none z-10 opacity-20 mix-blend-overlay group-hover:opacity-40 transition-opacity" />}
      
      {/* 🏆 SKEUOMORPHIC METAL HEADER */}
      <div className={cn(
        "relative bg-gradient-to-b from-[#D4AF37] via-[#B8860B] to-[#996515] flex items-center justify-between px-6 z-20 border-b border-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_2px_10px_rgba(0,0,0,0.3)] overflow-hidden rounded-t-[2.4rem]",
        isDashboard ? "h-12" : "h-16"
      )}>
        <div className="flex flex-col">
           <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#2C1E0F]/80 italic leading-none">Matriarch League // {profile.rank_tier || 'Aspirant'}</span>
           <span className="text-[12px] md:text-[13px] font-black uppercase tracking-widest text-[#2C1E0F]/30 italic">ID-{profile.id?.slice(0,4)}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-black text-[#2C1E0F]/30">Power</span>
              <span className="text-2xl md:text-3xl font-black text-[#2C1E0F] tracking-tighter leading-none">{powerLevel}</span>
           </div>
           {onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors border border-white/10">
                <X size={16} className="text-white" />
              </button>
           )}
        </div>
      </div>

      {/* 🖼️ RECESSED PORTRAIT FRAME */}
      <div className={cn(
        "relative min-h-0 overflow-hidden z-10 flex flex-col pt-1 px-1",
        isDashboard ? "flex-[0_0_42%]" : "flex-[0_0_65%]"
      )}>
        <div className="w-full h-full relative overflow-hidden flex-1 rounded-2xl bg-black shadow-[inset_0_10px_30px_rgba(0,0,0,1)] group-hover:shadow-[inset_0_10px_40px_rgba(0,0,0,1)] transition-all">
          <img 
            src={profile.img} 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.85] group-hover:brightness-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out" 
            alt={profile.name}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
        </div>

        {/* 🏅 RANK PLATE - PHYSICAL INSET */}
        <div className="absolute top-4 left-4 z-30">
           <div className="min-w-16 px-3 py-2 bg-neutral-800 rounded-xl flex flex-col items-center justify-center border-t border-white/5 border-b border-black shadow-2xl">
              <span className="text-[8px] font-black text-white/30 uppercase">Rank</span>
              <span className="text-2xl font-black text-mat-gold italic leading-none">#{profile.absolute_rank || '--'}</span>
           </div>
        </div>

        {/* Level Badge - Tactile */}
        <div className="absolute top-4 right-4 z-20">
           <div className="px-4 py-1.5 bg-mat-rose-gold text-mat-wine rounded-full flex items-center gap-2 shadow-xl border border-white/20">
              <Crown size={14} fill="currentColor" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{profile.status}</span>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black to-transparent z-10">
            <div className="flex flex-col">
               <div className="flex items-center gap-3">
                  <h2 className="font-display text-white text-3xl md:text-4xl italic tracking-tighter leading-tight drop-shadow-md">
                   {profile.name}
                  </h2>
                  <VerificationBadge verified={profile.is_verified} />
               </div>
               <span className="text-[9px] uppercase font-black tracking-[0.4em] text-white/40 mt-1 italic">{archetype}</span>
            </div>
        </div>
      </div>

      {/* 📜 PHYSICAL INTEL PANEL - NO GLASS */}
      <div className={cn(
        "flex-1 min-h-0 bg-[#121212] flex flex-col justify-between relative z-20 overflow-y-auto no-scrollbar border-t-[1px] border-white/5",
        isDashboard ? "p-4" : "p-8"
      )}>
        
        {/* Bio Embossing */}
        {sanitizeBio(profile.bio) && (
          <div className={cn("flex-shrink-0", isDashboard ? "mb-2" : "mb-4")}>
             <p className="text-white/60 text-[12px] md:text-[13px] leading-relaxed font-normal line-clamp-2 italic">
                "{sanitizeBio(profile.bio)}"
             </p>
          </div>
        )}

        {/* 📊 TACTILE STATS GRID */}
        <div className={cn("grid grid-cols-3 gap-x-2 md:gap-x-4", isDashboard ? "gap-y-2" : "gap-y-6")}>
          {statItems.map((s, i) => (
            <Tooltip key={i}>
               <TooltipTrigger asChild>
                  <div className="space-y-1.5 cursor-help group/stat">
                     <div className="flex items-center justify-between px-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 group-hover/stat:text-mat-gold transition-colors">{s.label}</span>
                        <span className="text-[11px] font-black text-mat-gold italic">{s.value}</span>
                     </div>
                     <div className="w-full h-1.5 bg-black rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${s.value}%` }}
                           transition={{ delay: i * 0.1, duration: 0.8 }}
                           className={cn("h-full bg-gradient-to-r shadow-inner", s.color)} 
                        />
                     </div>
                  </div>
               </TooltipTrigger>
               <TooltipContent side="top">
                  <p className="text-[10px] uppercase tracking-widest font-bold">{s.label}: {s.value}%</p>
               </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* 📋 SKEUOMORPHIC DOSSIER DATA */}
        <div className={cn("grid grid-cols-2 gap-3 border-t border-white/5 pt-4 pb-2", isDashboard ? "mt-3" : "mt-8")}>
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner">
               <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center border border-white/5 text-mat-gold/60">
                  <Trophy size={14} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black tracking-widest text-white/20">Tier</span>
                  <span className="text-[11px] font-bold text-white/70 uppercase truncate">{profile.tier}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner">
               <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center border border-white/5 text-mat-gold/60">
                  <MapPin size={14} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black tracking-widest text-white/20">Height</span>
                  <span className="text-[11px] font-bold text-white/70 uppercase">{profile.height_str}</span>
               </div>
            </div>

            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner col-span-2">
               <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center border border-white/5 text-mat-gold/60">
                  <Lock size={14} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black tracking-widest text-white/20">Vocation</span>
                  <span className="text-[11px] font-bold text-white/70 italic truncate">{profile.vocation}</span>
               </div>
            </div>
        </div>

        {/* ⚡ PHYSICAL ACTION MATRIX */}
        {!isDashboard && (
          <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/5 mt-4">
             {[{ id: 'report', icon: ShieldAlert }, { id: 'block', icon: UserX }, { id: 'ping', icon: MessageSquarePlus, primary: true }, { id: 'never_show', icon: EyeOff }].map((btn) => (
               <Tooltip key={btn.id}>
                  <TooltipTrigger>
                     <Button 
                       onPress={() => onAction?.(btn.id)}
                       isIconOnly 
                       className={cn(
                         "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-xl active:scale-95",
                         btn.primary 
                          ? "bg-mat-gold text-[#2C1E0F] border-t border-white/30 border-b-2 border-black/40 scale-125" 
                          : "bg-neutral-800 text-white/30 border-t border-white/5 border-b border-black hover:text-white"
                       )}
                     >
                        <btn.icon size={btn.primary ? 24 : 18} />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{btn.id}</TooltipContent>
               </Tooltip>
             ))}
          </div>
        )}
      </div>

      {/* Decorative Branding */}
      <div className="absolute bottom-2 right-6 opacity-[0.05] pointer-events-none">
         <span className="text-[40px] font-display text-white italic tracking-tighter mix-blend-overlay">MATRIARCH</span>
      </div>
    </motion.div>
  );
};

export default TrumpCard;
