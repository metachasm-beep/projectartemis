import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Activity, 
  Sparkles,
  MessageCircle,
  Eye,
  Star,
  Compass,
  HelpCircle,
  X,
  LayoutGrid
} from 'lucide-react';

import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface WomenSanctuaryProps {
  profile: any;
  metrics: { 
    matches: number; 
    sessionSeconds: number;
    profilesViewed?: number;
    profilesEngaged?: number;
    responseRate?: string;
    vibeRating?: number;
    activeStreak?: number;
    safetyLevel?: string;
  };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

/**
 * 🏛️ Women's Sanctuary 3.0: Atelier Edition
 * Redesigned for a 'Modern, Sleek, Feminine' fashion aesthetic.
 * High-end editorial typography, Ivory/Noir/Rose Gold palette, and monumental scale.
 */
export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ 
  profile,
  metrics, 
  setIsEditing,
  onBeginDiscovery 
}) => {
  const [showFAQ, setShowFAQ] = React.useState(false);
  const [showVerification, setShowVerification] = React.useState(false);
  const { refreshProfile } = useAuth();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const stats = [
    { label: 'Profile Views', value: '4.2k', icon: <Eye size={18} /> },
    { label: 'Trust Score', value: `${profile?.profile_completeness || 99}%`, icon: <ShieldCheck size={18} /> },
    { label: 'Matches', value: metrics.matches || '0', icon: <Heart size={18} /> },
    { label: 'Profiles Viewed', value: metrics.profilesViewed || '142', icon: <LayoutGrid size={18} /> },
    { label: 'Interactions', value: metrics.profilesEngaged || '28', icon: <MessageCircle size={18} /> },
    { label: 'Time Online', value: formatTime(metrics.sessionSeconds || 12400), icon: <Activity size={18} /> },
    { label: 'Response Rate', value: metrics.responseRate || 'High', icon: <Sparkles size={18} /> },
    { label: 'Vibe Rating', value: metrics.vibeRating || '9.8', icon: <Compass size={18} /> },
    { label: 'Daily Streak', value: `${metrics.activeStreak || 12}d`, icon: <Zap size={18} /> },
    { label: 'Security Level', value: metrics.safetyLevel || 'Elite', icon: <Star size={18} /> },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-mat-ivory selection:bg-mat-rose-gold selection:text-white flex flex-col">
      {/* 🌊 Liquid Foundation (Silk Drift) */}
      <LiquidMesh />

      {/* 🎞️ Global Post-Processing (Grain & Bloom) */}
      <PostProcessOverlay />

      {/* 🏙️ The Haute Sanctuary Canvas */}
      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-4 lg:px-16 lg:pt-4 min-h-0">
        {/* ✨ Editorial Header: The Monumental Serif */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4 shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
               <span className="w-12 h-[1px] bg-mat-rose-gold" />
               <h3 className="mat-text-editorial-caps">Sanctuary Alpha</h3>
            </div>
            <h1 className="mat-text-editorial-huge text-6xl lg:text-8xl leading-none">
              Sovereign <br className="hidden md:block" />
              <span className="text-mat-rose-gold italic font-medium">Existence.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-end gap-6"
          >
            <div className="flex -space-x-3">
              {[
                "1494790108377-be9c29b29330", 
                "1534528741775-53994a69daeb", 
                "1531746020798-e6953c6e8e04"
              ].map((id, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-mat-bone overflow-hidden shadow-2xl relative z-10 transition-transform hover:scale-110 hover:z-20 cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=100`} alt="Sanctuary Member" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-mat-bone bg-mat-cashmere flex items-center justify-center text-[10px] mat-text-editorial-caps text-mat-noir/40 z-0">
                +1.2k
              </div>
            </div>
            <div className="mat-text-body-chic text-right max-w-xs text-mat-noir/60">
              A curated space for the feminine architectural mind. Authenticated at 99.4% purity.
            </div>
          </motion.div>
        </header>

        <TooltipProvider>
          {/* 🧩 The Editorial Spread (Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 pb-20">
            
            {/* 👗 Profile Portrait (The Hero Anchor) */}
            <div className="md:col-span-3 h-full">
              <GlassCard className="h-full p-0 flex flex-col group/card overflow-hidden shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.1)] border-white/20" delay={0.1} noPadding={true}>
                <div className="relative h-[35%] overflow-hidden shrink-0">
                  <img 
                    src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"} 
                    alt={profile?.full_name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                     <div className="px-2 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mat-text-editorial-caps text-[6px] text-white">
                        Live Essence
                     </div>
                  </div>
                </div>
                
                <div className="p-3 lg:p-4 flex flex-col justify-between flex-grow min-h-0 bg-white/5 backdrop-blur-md">
                  <div className="space-y-0.5">
                    <h2 className="mat-text-editorial-huge text-xl lg:text-2xl text-mat-noir leading-none">{profile?.full_name || 'User'}</h2>
                    <p className="mat-text-editorial-caps text-mat-rose-gold text-[7px]">{profile?.city || 'The Sanctuary'}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 shrink-0">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-grow py-2 bg-mat-noir text-mat-bone mat-text-editorial-caps text-[8px] rounded-full hover:bg-mat-rose-gold transition-all duration-500 shadow-xl"
                    >
                      Edit Profile
                    </button>
                    <button className="w-8 h-8 rounded-full border border-mat-noir/10 flex items-center justify-center hover:bg-mat-noir hover:text-white transition-all">
                       <LayoutGrid size={12} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* 💎 The Skill Atelier (Metrics & Interaction) */}
            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-6 gap-2 h-full overflow-y-auto custom-scrollbar p-1">
              {stats.map((stat, idx) => (
                <div key={idx} className="col-span-1">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className={cn(
                      "w-full h-11 px-3 flex items-center gap-2 group/stat relative overflow-hidden transition-all duration-500",
                      "bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full",
                      "shadow-[0_4px_12px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.2)]",
                      "hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    {/* Liquid Highlight Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-mat-rose-gold/20 flex items-center justify-center text-mat-rose-gold transition-colors duration-500 group-hover/stat:bg-mat-rose-gold group-hover/stat:text-white">
                      {React.cloneElement(stat.icon as React.ReactElement, { size: 12 })}
                    </div>

                    <div className="flex flex-col items-start min-w-0">
                      <p className="mat-text-editorial-huge text-[11px] text-mat-noir leading-none truncate">{stat.value}</p>
                      <h3 className="mat-text-editorial-caps text-[5px] opacity-40 tracking-wider truncate uppercase">{stat.label}</h3>
                    </div>

                    {/* 🌊 Thin Underline Progress Bar (Liquid Style) */}
                    <div className="absolute bottom-1.5 left-10 right-3 h-[1px] bg-mat-noir/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: Math.random() * 40 + 60 + '%' }}
                         transition={{ duration: 2, delay: 0.8 }}
                         className="h-full bg-mat-rose-gold/40 shadow-[0_0_8px_rgba(183,110,121,0.2)]" 
                       />
                    </div>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>

        {/* 🚀 Editorial Command Dock Container */}
        <div className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-50">
          <Dock 
            onShowFAQ={() => setShowFAQ(true)}
            onShowVerification={!profile?.is_verified ? () => setShowVerification(true) : undefined}
            hideLogout={true}
          />
        </div>
      </main>

      {/* 🦢 Sticky Verification Bar (Floating System Registry) */}
      <div className="fixed bottom-20 left-6 right-6 lg:left-16 lg:right-16 z-40">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={cn(
            "w-full bg-mat-noir px-4 py-1.5 flex flex-col md:flex-row items-center justify-between rounded-full gap-2",
            "shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0.5px_1px_rgba(255,255,255,0.1)]",
            "border border-white/5 relative overflow-hidden"
          )}
        >
          <div className="flex items-center gap-3 relative z-10 text-white">
            <div className="w-6 h-6 rounded-full bg-mat-rose-gold/20 flex items-center justify-center text-mat-rose-gold">
               <ShieldCheck size={12} />
            </div>
            <div className="flex items-center gap-2">
               <h3 className="mat-text-editorial-caps text-mat-rose-gold text-[6px] tracking-[0.3em] whitespace-nowrap">Identity Protocol</h3>
               <div className="w-[1px] h-2 bg-white/10" />
               <h2 className="mat-text-editorial text-[10px] text-mat-bone leading-tight">
                  Status: <span className={profile?.is_verified ? "text-mat-rose-gold font-medium" : "text-white/40 italic"}>
                    {profile?.is_verified ? "Verified" : "Action Required"}
                  </span>
               </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto text-white">
            {!profile?.is_verified ? (
              <button 
                onClick={() => setShowVerification(true)}
                className="w-full md:w-auto px-4 py-1.5 bg-mat-rose-gold text-mat-bone mat-text-editorial-caps text-[7px] rounded-full hover:bg-white hover:text-mat-noir transition-all duration-700 active:scale-[0.98] shadow-lg"
              >
                Authenticate
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                 <div className="w-1 h-1 rounded-full bg-mat-rose-gold animate-pulse" />
                 <span className="mat-text-editorial-caps text-[7px] text-white/60">Synchronized</span>
              </div>
            )}
          </div>
          
          {/* Subtle Visual Accent */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-mat-rose-gold opacity-10 blur-[80px]" />
        </motion.div>
      </div>

      {/* 🧩 FAQ Editorial Modal */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-12 backdrop-blur-3xl bg-mat-noir/20"
            onClick={() => setShowFAQ(false)}
          >
            <GlassCard className="w-full max-w-5xl p-0 h-auto max-h-[85vh] overflow-hidden rounded-[3rem]" delay={0} onClick={(e) => e.stopPropagation()}>
               <button 
                 onClick={() => setShowFAQ(false)}
                 className="absolute top-10 right-10 w-14 h-14 bg-mat-noir/5 rounded-full flex items-center justify-center text-mat-noir/40 hover:text-mat-rose-gold transition-all z-20"
               >
                 <X size={26} />
               </button>
               
               <div className="p-12 lg:p-24 space-y-16 overflow-y-auto max-h-[80vh] custom-scrollbar">
                  <div className="space-y-6">
                    <h3 className="mat-text-editorial-caps">The Oracle</h3>
                    <h2 className="mat-text-editorial-huge text-7xl text-mat-noir leading-none">
                      Sanctuary <span className="italic font-medium text-mat-rose-gold">Knowledge.</span>
                    </h2>
                  </div>
                  
                  <div className="pointer-events-auto prose max-w-none">
                    <FAQ />
                  </div>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧩 Verification Editorial Modal */}
      <AnimatePresence>
        {showVerification && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-12 bg-mat-noir/40 backdrop-blur-2xl" 
            onClick={() => setShowVerification(false)}
          >
             <GlassCard className="w-full max-w-2xl p-0 rounded-[3rem]" delay={0} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowVerification(false)} className="absolute top-10 right-10 text-mat-noir/20 hover:text-mat-rose-gold z-20"><X size={28} /></button>
                <div className="p-16">
                  <AadhaarVerification 
                    userId={profile?.user_id} 
                    onVerified={async () => {
                       await refreshProfile();
                       setShowVerification(false);
                    }} 
                  />
                </div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WomenSanctuary;
