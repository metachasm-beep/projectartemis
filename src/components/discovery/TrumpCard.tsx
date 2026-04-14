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

  // Calculate total power level
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
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 30, opacity: 0 }}
      className={cn(
        "relative bg-mat-ivory border-[2px] border-mat-gold/20 rounded-[3rem] shadow-[0_32px_100px_rgba(90,77,65,0.12)] overflow-hidden flex flex-col group p-2",
        isDashboard ? "w-full h-full" : "w-full max-w-[480px] min-h-[750px]"
      )}
    >
      {isPremium && <div className="absolute inset-0 mat-card-holographic pointer-events-none z-10 opacity-30 mix-blend-overlay group-hover:opacity-50 transition-opacity" />}
      
      {/* 🏆 TRUMP CARD HEADER */}
      <div className={cn(
        "absolute top-2 left-2 right-2 bg-mat-gold flex items-center justify-between px-6 z-20 border-b border-mat-gold-dark/10 shadow-lg overflow-hidden rounded-t-[1.5rem]",
        isDashboard ? "h-14" : "h-16"
      )}>
        <div className="flex flex-col">
           <span className="text-[12px] font-black uppercase tracking-[0.3em] text-mat-wine italic leading-none">Matriarch League // {profile.rank_tier || 'Aspirant'}</span>
           <span className="text-[14px] font-black uppercase tracking-widest text-mat-wine/40 italic">Series 01 // ID-{profile.id?.slice(0,4)}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[12px] font-black uppercase text-mat-wine/40">Power Lvl</span>
              <span className="mat-text-impact text-mat-wine text-3xl leading-none">{powerLevel}</span>
           </div>
           {onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X size={18} className="text-white" />
              </button>
           )}
        </div>
      </div>

      {/* 🖼️ HERO PORTRAIT AREA - MASSIVE UPSCALE (400% IMPACT) */}
      <div className={cn(
        "relative min-h-0 mt-14 overflow-hidden border-b border-mat-gold/10 group-hover:brightness-105 transition-all duration-700 rounded-t-[1.5rem] z-10 flex flex-col",
        isDashboard ? "flex-[0_0_45%]" : "flex-[0_0_68%]"
      )}>
        <div className="w-full h-full relative overflow-hidden flex-1 bg-mat-obsidian">
          <img 
            src={profile.img} 
            className="w-full h-full object-cover mat-gritty-filter scale-105 group-hover:scale-110 transition-transform duration-[2s]" 
            alt={profile.name}
            loading="eager"
          />
        </div>

        {/* 🏅 COLLECTIBLE RANK BADGE - TOP LEFT TUCKED */}
        <div className="absolute top-6 left-6 z-30">
           <div className="w-20 h-20 bg-mat-wine rounded-2xl flex flex-col items-center justify-center border border-mat-gold/20 shadow-xl scale-100 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-[10px] font-black text-mat-cream/40 uppercase tracking-tighter">Rank</span>
              <span className="text-3xl font-black text-mat-gold italic -mt-1 leading-none">#{profile.absolute_rank || '--'}</span>
           </div>
        </div>
        
        {/* 🔘 CHARACTER THUMBNAIL - BOTTOM RIGHT TUCKED */}
        <div className="absolute bottom-4 right-4 z-30 hidden md:block">
           <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden shadow-2xl bg-mat-obsidian animate-pulse group-hover:animate-none">
              <img src={profile.img} className="w-full h-full object-cover grayscale opacity-50" alt="thumb" />
           </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-8 right-8 z-20">
           <div className="px-6 py-2 bg-mat-rose text-white rounded-full flex items-center gap-2 shadow-2xl border border-white/10">
              <Crown size={16} fill="currentColor" />
              <span className="text-[13px] font-black uppercase tracking-widest">{profile.status}</span>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-mat-cream via-mat-cream/60 to-transparent z-10">
            <div className="flex items-center gap-3">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <p className="font-display text-mat-gold text-5xl italic drop-shadow-sm tracking-tight leading-tight">
                        {profile.name}
                     </p>
                     <VerificationBadge verified={profile.is_verified} />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-mat-slate/40 mt-1 italic">{archetype}</span>
               </div>
            </div>
           <p className="text-[14px] uppercase tracking-[0.5em] font-black text-mat-slate mt-2">
             Age {profile.age} • {profile.city.toUpperCase()}
           </p>
        </div>
      </div>

      {/* 📜 CONSOLIDATED INTEL */}
      <div className={cn(
        "flex-1 min-h-0 bg-mat-cream/95 backdrop-blur-xl flex flex-col justify-between relative rounded-b-[2rem] z-20 overflow-y-auto custom-scrollbar",
        isDashboard ? "p-5" : "p-8"
      )}>
        
        {/* Bio Inlay */}
        <div className={cn("flex-shrink-0", isDashboard ? "mb-3" : "mb-6")}>
           <p className="text-mat-slate text-[14px] leading-relaxed font-light line-clamp-2 italic">
              "{sanitizeBio(profile.bio) || "Identity narrative not established."}"
           </p>
        </div>

        {/* 📊 STAT GRID (3 IN A ROW) */}
        <div className={cn("grid grid-cols-3 gap-x-4", isDashboard ? "gap-y-3" : "gap-y-6")}>
          {statItems.map((s, i) => (
            <Tooltip key={i}>
               <TooltipTrigger asChild>
                  <div className="space-y-2 cursor-help group/stat">
                     <div className="flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-mat-slate group-hover/stat:text-mat-gold transition-colors">{s.label}</span>
                        <span className="text-[13px] font-black text-mat-gold italic">{s.value}</span>
                     </div>
                     <div className="w-full h-2 bg-mat-gold/10 rounded-full overflow-hidden border border-mat-gold/5">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${s.value}%` }}
                           transition={{ delay: i * 0.1, duration: 0.8 }}
                           className={cn("h-full bg-gradient-to-r shadow-sm", s.color)} 
                        />
                     </div>
                  </div>
               </TooltipTrigger>
               <TooltipContent side="top">
                  <p className="text-[11px] uppercase tracking-widest font-bold">{s.label}: {s.value}% POTENCY</p>
               </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* 📋 DOSSIER FOOTER */}
        <div className={cn("grid grid-cols-2 gap-4 border-t border-mat-gold/20 pb-2 text-mat-slate", isDashboard ? "mt-4 pt-4" : "mt-8 pt-6")}>
           <Tooltip>
              <TooltipTrigger asChild>
                 <div className="flex items-center gap-3 cursor-help opacity-80 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-lg bg-mat-gold/5 flex items-center justify-center border border-mat-gold/10 text-mat-gold">
                       <Trophy size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[11px] uppercase font-black tracking-widest text-mat-slate/60">Tier</span>
                       <span className="text-[13px] font-bold text-mat-slate uppercase truncate">{profile.tier}</span>
                    </div>
                 </div>
              </TooltipTrigger>
              <TooltipContent side="top">Assigned sanctuary capital tier</TooltipContent>
           </Tooltip>
           
           <Tooltip>
              <TooltipTrigger asChild>
                 <div className="flex items-center gap-3 cursor-help opacity-80 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-lg bg-mat-gold/5 flex items-center justify-center border border-mat-gold/10 text-mat-gold">
                       <MapPin size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[11px] uppercase font-black tracking-widest text-mat-slate/60">Stature</span>
                       <span className="text-[13px] font-bold text-mat-slate uppercase">{profile.height_str}</span>
                    </div>
                 </div>
              </TooltipTrigger>
              <TooltipContent side="top">Physical identification profile</TooltipContent>
           </Tooltip>

           <Tooltip>
              <TooltipTrigger asChild>
                 <div className="flex items-center gap-3 col-span-2 cursor-help opacity-80 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-lg bg-mat-gold/5 flex items-center justify-center border border-mat-gold/10 text-mat-gold">
                       <Lock size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[11px] uppercase font-black tracking-widest text-mat-slate/60">Vocation</span>
                       <span className="text-[13px] font-bold text-mat-slate italic truncate">{profile.vocation}</span>
                    </div>
                 </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Primary societal contribution archetype</TooltipContent>
           </Tooltip>
        </div>

        {/* ⚡ ARTISTIC ENGAGEMENT MATRIX */}
        <div className="flex items-center justify-center gap-6 pt-6">
           
           {/* Report Button */}
           <Tooltip>
              <TooltipTrigger>
                 <Button 
                   onPress={() => onAction?.('report')}
                   isIconOnly 
                   className="w-12 h-12 min-w-0 bg-mat-gold/5 border-2 border-mat-gold/20 text-mat-slate/40 hover:text-mat-slate hover:bg-mat-gold/10 transition-all rounded-full p-0 flex items-center justify-center shadow-md"
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
                   className="w-12 h-12 min-w-0 bg-mat-gold/5 border-2 border-mat-gold/20 text-mat-slate/40 hover:text-mat-slate hover:bg-mat-gold/10 transition-all rounded-full p-0 flex items-center justify-center shadow-md"
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
                    "w-16 h-16 min-w-0 rounded-full shadow-xl border-2 border-mat-gold/30 transition-all flex items-center justify-center p-0 scale-110",
                    profile.is_verified 
                      ? "bg-gradient-to-br from-mat-gold to-mat-gold-dark text-mat-cream" 
                      : "bg-mat-cream text-mat-slate/20 border-mat-gold/10"
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
                   className="w-12 h-12 min-w-0 bg-mat-gold/5 border-2 border-mat-gold/20 text-mat-slate/40 hover:text-mat-slate hover:bg-mat-gold/10 transition-all rounded-full p-0 flex items-center justify-center shadow-md"
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
      {!isDashboard && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-mat-rose/10 z-0 pointer-events-none scale-150">
           <Crosshair size={200} strokeWidth={0.3} />
        </div>
      )}
    </motion.div>
  );
};

export default TrumpCard;
