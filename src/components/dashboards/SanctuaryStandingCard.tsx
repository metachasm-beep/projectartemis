import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Camera, 
  Eye, 
  UserCheck as UserCheckIcon, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  BookOpen 
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuraCalibrationPanel } from './AuraCalibrationPanel';
import { QueueStatus } from './QueueStatus';
import type { MatriarchProfile } from '@/types';

interface SanctuaryStandingCardProps {
  profile: MatriarchProfile;
  integrity: number;
  currentLevel: { name: string; id: string; color?: string };
  gazeCount: number;
  cityRank: number | null;
  absRank: number | null;
  totalMen: number;
  meritPct: number;
  queueCount: number;
  syncStatus: 'idle' | 'syncing' | 'success';
  handleSyncIntegrity: () => Promise<void>;
  setIsEditing?: (val: boolean) => void;
  isMobile?: boolean;
}

export const SanctuaryStandingCard: React.FC<SanctuaryStandingCardProps> = ({
  profile,
  integrity,
  currentLevel,
  gazeCount,
  cityRank,
  absRank,
  totalMen,
  meritPct,
  queueCount,
  syncStatus,
  handleSyncIntegrity,
  setIsEditing,
  isMobile
}) => {
  const cardSpring = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  const metricsList = [
    { label: 'Narrative', val: integrity, icon: Sparkles, isRaw: false, tip: 'Completeness score of your bio, story & personal details.' },
    { label: 'Portrait', val: (profile.photos?.length || 0) > 0 ? 100 : 0, icon: Camera, isRaw: false, tip: 'Profile photo uploaded and visible to Sovereigns.' },
    { label: 'Verification', val: profile.is_verified ? 100 : 0, icon: UserCheckIcon, isRaw: false, tip: 'Identity Seal — verified status grants priority resonance access.' },
    { label: 'Daily Merit', val: meritPct, icon: Zap, isRaw: false, tip: 'Quest completion rate. Daily rituals raise your standing.' },
    { label: 'Considered By', val: queueCount, icon: Eye, isRaw: true, tip: 'Sovereigns currently considering your profile in discovery.' },
    { label: 'Resonance', val: 85, icon: TrendingUp, isRaw: false, tip: 'Overall resonance index — a composite of all sanctuary signals.' }
  ];

  if (isMobile) {
    return (
      <motion.div variants={cardSpring} className="mat-glass-deep p-6 rounded-[2.5rem] border border-mat-rose/10 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center mb-6">
           <AuraCalibrationPanel integrity={integrity} />
           <div className="text-center mt-3">
              <p className="text-2xl font-bold italic text-mat-bone leading-none">{currentLevel.name}</p>
              <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Sanctuary Standing Rank</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col items-center cursor-help">
                     <span className="text-[7px] font-black uppercase text-mat-gold/60">Gaze Index</span>
                     <span className={cn("text-xl font-black italic", (absRank || 100) > 50 ? "blur-[3px] opacity-40" : "text-mat-gold")}>+{gazeCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" avoidCollisions sideOffset={6} className="max-w-[200px] bg-mat-obsidian/95 border-mat-gold/20 text-[9px] p-3 shadow-2xl backdrop-blur-xl z-50">
                  <p className="text-mat-gold font-medium italic leading-relaxed text-center">Total times Sovereigns have viewed your profile. Unlocks clearly when you rank in the top 50%.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col items-center cursor-help">
                     <span className="text-[7px] font-black uppercase text-mat-gold/60">Local League</span>
                     <span className="text-xl font-black italic text-mat-gold">#{cityRank || '--'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" avoidCollisions sideOffset={6} className="max-w-[200px] bg-mat-obsidian/95 border-mat-gold/20 text-[9px] p-3 shadow-2xl backdrop-blur-xl z-50">
                  <p className="text-mat-gold font-medium italic leading-relaxed text-center">Your rank among Aspirants in your city.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
         </div>

        <div className="grid grid-cols-2 gap-2 pb-6 border-b border-white/10">
            {metricsList.map((m, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5 cursor-help">
                       <div className="flex justify-between items-center text-[7px] font-bold uppercase text-white/40">
                          <span>{m.label}</span>
                          <span>{m.isRaw ? m.val : `${m.val}%`}</span>
                       </div>
                       <div className="h-0.5 bg-white/5 rounded-full mt-1">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${m.isRaw ? Math.min(100, (m.val as number) * 20) : m.val}%` }} className="h-full bg-mat-gold" />
                       </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={i < 4 ? 'bottom' : 'top'} align={i % 2 === 0 ? 'start' : 'end'} avoidCollisions sideOffset={6} className="max-w-[180px] bg-mat-obsidian/95 border-mat-gold/20 text-[9px] p-3 shadow-2xl backdrop-blur-xl z-50">
                    <p className="text-mat-gold font-medium italic leading-relaxed">{m.tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </div>

        <div className="pt-6 space-y-4">
           <div className="flex gap-2">
              <button onClick={() => setIsEditing?.(true)} className="flex-1 py-3.5 border border-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit Profile</button>
              <TooltipProvider>
                <div className="flex-1 relative flex items-center gap-1 group">
                  <button 
                    onClick={handleSyncIntegrity} 
                    disabled={syncStatus === 'syncing'}
                    className="flex-1 py-3.5 bg-mat-gold text-black rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Recalibrating...</span>
                      </>
                    ) : syncStatus === 'success' ? (
                      <span>Synced!</span>
                    ) : (
                      <span>Sync Status</span>
                    )}
                  </button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 text-white/20 hover:text-mat-gold transition-colors">
                        <HelpCircle size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={8} className="max-w-[280px] bg-mat-obsidian/95 border-mat-gold/20 text-[9px] p-5 shadow-2xl backdrop-blur-xl">
                      <p className="text-center text-mat-gold font-medium italic leading-relaxed">
                        "Completing your profile and getting verified boosts your rank power, helping you climb higher in global standings."
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
           </div>
            <button 
              onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')}
              className="w-full py-3.5 border border-white/10 text-white/40 rounded-xl text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-2 hover:bg-white/5 transition-all mt-4"
            >
               <BookOpen size={12} />
               <span>Blogs</span>
            </button>
            <p className="text-[8px] text-center text-white/40 uppercase tracking-tighter italic mt-4">Absolute Standing: <span className="text-mat-gold font-bold">#{absRank || '--'}</span> of {totalMen}</p>
           <div className="pt-8 flex justify-center border-t border-white/5 mt-6 px-4">
              <QueueStatus />
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
      <motion.div variants={cardSpring} className="mat-glass-deep p-10 rounded-[3.5rem] border border-mat-gold/10 flex flex-col items-center justify-between text-center">
         <div className="w-full">
            <AuraCalibrationPanel integrity={integrity} />
            <div className="mt-8 space-y-2">
              <p className="text-4xl font-black italic text-mat-bone">{currentLevel.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Sanctuary Standing</p>
            </div>
         </div>
         <div className="w-full pt-10 border-t border-white/10 grid grid-cols-2 gap-4">
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div className="cursor-help">
                     <p className="text-[9px] uppercase font-black text-mat-gold/60">Gaze Index</p>
                     <p className={cn("text-2xl font-black italic", (absRank || 100) > 50 ? "blur-[4px] opacity-40" : "text-mat-gold")}>+{gazeCount}</p>
                   </div>
                 </TooltipTrigger>
                 <TooltipContent side="top" align="start" avoidCollisions sideOffset={8} className="max-w-[240px] bg-mat-obsidian/95 border-mat-gold/20 text-[10px] p-4 shadow-2xl backdrop-blur-xl z-50">
                   <p className="text-mat-gold font-medium italic leading-relaxed">Total cumulative profile views by Sovereigns. Visible without blur when you rank in the top 50%.</p>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div className="cursor-help">
                     <p className="text-[9px] uppercase font-black text-mat-gold/60">City Rank</p>
                     <p className="text-2xl font-black italic text-mat-gold">#{cityRank || '--'}</p>
                   </div>
                 </TooltipTrigger>
                 <TooltipContent side="top" align="end" avoidCollisions sideOffset={8} className="max-w-[240px] bg-mat-obsidian/95 border-mat-gold/20 text-[10px] p-4 shadow-2xl backdrop-blur-xl z-50">
                   <p className="text-mat-gold font-medium italic leading-relaxed">Your standing rank among Aspirants in your city.</p>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
          </div>
      </motion.div>

      <motion.div variants={cardSpring} className="col-span-1 md:col-span-2 mat-glass-deep p-12 rounded-[3.5rem] border border-mat-rose/10 flex flex-col justify-between">
         <div className="space-y-10">
            <div className="flex justify-between items-center">
               <div>
                  <h3 className="mat-text-fluid-huge text-mat-bone">Integrity Dial.</h3>
                  <p className="text-[12px] uppercase tracking-widest text-white/40 mt-2">Core Calibration Metrics</p>
               </div>
               <Activity className="text-mat-gold/20 w-12 h-12" />
            </div>
             <div className="grid grid-cols-3 gap-6">
                {metricsList.map((m, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all cursor-help">
                           <div className="flex justify-between items-center mb-4">
                              <m.icon size={16} className="text-mat-gold" />
                              <span className="text-xl font-bold text-mat-gold italic">
                                {m.isRaw ? m.val : `${m.val}%`}
                              </span>
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{m.label}</p>
                           <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                             <motion.div
                               initial={{ width: 0 }}
                               animate={{ width: `${m.isRaw ? Math.min(100, (m.val as number) * 20) : m.val}%` }}
                               className="h-full bg-mat-gold"
                             />
                           </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side={i < 3 ? 'top' : 'bottom'} align={i % 3 === 0 ? 'start' : i % 3 === 2 ? 'end' : 'center'} avoidCollisions sideOffset={10} className="max-w-[220px] bg-mat-obsidian/95 border-mat-gold/20 text-[10px] p-4 shadow-2xl backdrop-blur-xl z-50">
                        <p className="text-mat-gold font-medium italic leading-relaxed">{m.tip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
             </div>
         </div>
        <div className="flex gap-4 mt-10">
          <button onClick={() => setIsEditing?.(true)} className="flex-1 py-5 border border-white/20 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Edit Profile</button>
          <TooltipProvider>
            <div className="flex-1 flex items-center gap-2">
              <button 
                onClick={handleSyncIntegrity} 
                disabled={syncStatus === 'syncing'}
                className="flex-1 py-5 bg-mat-gold text-black rounded-2xl font-bold uppercase tracking-widest shadow-mat-premium hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Recalibrating...</span>
                  </>
                ) : syncStatus === 'success' ? (
                  <span>Standing Synchronized!</span>
                ) : (
                  <span>Recalibrate standing</span>
                )}
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 text-white/20 hover:text-mat-gold transition-colors">
                    <HelpCircle size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" sideOffset={10} className="max-w-[320px] bg-mat-obsidian/95 border-mat-gold/20 text-[11px] p-6 shadow-2xl backdrop-blur-xl">
                  <p className="text-mat-gold font-medium leading-relaxed italic text-center">
                    "Completing your profile and getting verified boosts your rank power, helping you climb higher in global standings."
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <button 
          onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')}
          className="w-full mt-4 py-5 border border-white/10 text-white/40 rounded-2xl font-bold uppercase tracking-[0.5em] text-[11px] hover:bg-white/5 transition-all flex items-center justify-center gap-3"
        >
          <BookOpen size={16} />
          <span>Blogs</span>
        </button>
      </motion.div>
    </div>
  );
};
