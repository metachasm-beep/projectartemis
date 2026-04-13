import { X, ShieldCheck, Camera, Crown, MessageSquarePlus, Heart, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@heroui/react';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import AdUnit from '@/components/common/AdUnit';
import { SEO_COPY } from '@/content/copy';
import type { MatriarchProfile } from '@/types';
import React, { useState } from 'react';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import '@/styles/skeuomorph.css';

interface WomenSanctuaryProps {
  profile: MatriarchProfile;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}
export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ profile, metrics, setIsEditing }) => {
  const [showVerification, setShowVerification] = useState(false);
  const { refreshProfile } = useAuth();
  const { scrollY } = useScroll();
  
  // 🎭 IMMERSIVE REVEAL CALCULATIONS
  const revealOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const revealScale = useTransform(scrollY, [0, 800], [1, 1.1]);
  const revealBlur = useTransform(scrollY, [0, 600], [0, 10]);
  const contentY = useTransform(scrollY, [0, 600], [0, -100]);
  const textY = useTransform(scrollY, [0, 300], [0, 100]);
  
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  
  return (
    <TooltipProvider>
    <div className="w-full bg-mat-cream min-h-[200vh] relative overflow-x-hidden">
      
      {/* ─── SCENE 1: SOVEREIGN REVEAL (IMMERSIVE) ─── */}
      <motion.div 
        style={{ opacity: revealOpacity, scale: revealScale, filter: `blur(${revealBlur}px)` }}
        className="fixed inset-0 z-0 h-screen w-full pointer-events-none"
      >
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-cream/20 to-mat-cream z-10" />
         <img 
            src={profile.photos?.[0] || 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=2000'} 
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            alt="Reveal Base"
         />
         
         <motion.div 
            style={{ y: textY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
         >
            <Chip color="primary" className="mb-8 border-mat-gold/30 text-mat-gold bg-black/40 backdrop-blur-md px-6 py-2 uppercase tracking-[0.5em] font-black text-[10px]">Registry: Established</Chip>
            <h1 className="mat-text-display-pro text-white text-[10vw] leading-[0.8] tracking-tightest drop-shadow-2xl">
               {firstName}<br /><span className="text-mat-gold italic opacity-80 uppercase text-[3vw] tracking-[0.4em] font-black">Sovereign Presence</span>
            </h1>
            <div className="mt-12 w-px h-24 bg-gradient-to-b from-mat-gold/0 via-mat-gold to-mat-gold/0 animate-pulse" />
         </motion.div>
      </motion.div>

      {/* ─── SCENE 2: TACTILE DASHBOARD (SKEUOMORPHIC) ─── */}
      <motion.div 
         style={{ y: contentY }}
         className="relative z-10 pt-[85vh] md:pt-[90vh] pb-32"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[30vh] bg-gradient-to-b from-transparent to-mat-cream pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-7xl">
          
          {/* Header Action Strip (Skeuomorphic) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
             <div className="mat-glass-tactile p-1 rounded-full flex items-center gap-4 pr-6">
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button 
                         onPress={() => !profile.is_verified && setShowVerification(true)}
                         className={`h-12 px-8 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${profile.is_verified ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-default' : 'mat-button-gold'}`}
                      >
                         {profile.is_verified ? (
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={14} /> Identity Sealed
                           </div>
                         ) : (
                           "Establish Sync"
                         )}
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent className="bg-mat-wine text-mat-cream font-bold text-[10px] uppercase border-none tracking-widest px-4 py-2">
                      {profile.is_verified ? "Your presence is immutable." : "Initiate biometric synchronization."}
                   </TooltipContent>
                </Tooltip>
                <div className="pr-4 border-r border-mat-rose/20">
                   <p className="text-mat-wine/40 text-[8px] font-black uppercase tracking-widest">Protocol Status</p>
                   <p className="text-mat-wine text-[10px] font-bold uppercase">{profile.is_verified ? 'Active Sanctuary' : 'Pending Verification'}</p>
                </div>
             </div>

             <div className="text-center md:text-right">
                <h2 className="text-mat-wine text-2xl font-black tracking-tightest uppercase italic">The Master Dashboard</h2>
                <div className="h-1 w-24 bg-mat-gold ml-auto mt-2" />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* 🎖️ Skeuomorphic Dossier Card */}
             <div className="col-span-1 lg:col-span-4">
                <div className="mat-tactile-card p-4 aspect-[3/4.2] relative group">
                   <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner border-[12px] border-white/50">
                      <img 
                        src={profile.photos?.[0] || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon'} 
                        alt="Portrait" 
                        className="w-full h-full object-cover grayscale brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/40 to-transparent pointer-events-none" />
                   </div>
                   
                   <Button 
                      isIconOnly
                      onPress={() => setIsEditing(true)}
                      className="absolute -bottom-4 -right-4 w-16 h-16 mat-button-wine rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center p-0"
                   >
                      <Camera size={24} />
                   </Button>

                   <div className="absolute top-10 left-10 p-3 mat-glass-tactile rounded-2xl">
                      <Crown className="text-mat-gold" size={20} />
                   </div>
                </div>
             </div>

             <div className="col-span-1 lg:col-span-8 space-y-8">
                {/* Tactical Bio Surface */}
                <div className="mat-tactile-card p-10 space-y-6 text-center lg:text-left">
                   <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="w-2 h-2 rounded-full bg-mat-rose animate-ping" />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-mat-wine/60">Profile Manifesto</span>
                   </div>
                   <h3 className="text-4xl font-serif font-black italic text-mat-wine">Control is the ultimate <br />expression of grace.</h3>
                   <p className="text-mat-slate/70 text-lg leading-relaxed max-w-2xl font-light">
                      Welcome to your sovereign sanctuary, {firstName}. Every interaction on Matriarch is engineered for depth, governed by your precise requirements.
                   </p>
                   
                   <div className="pt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                      <Button 
                         onPress={() => setIsEditing(true)}
                         className="h-16 px-10 rounded-[1.5rem] mat-button-wine font-black uppercase tracking-widest text-[11px]"
                      >
                         Modify Sovereign Identity
                      </Button>
                      <Button 
                         variant="ghost"
                         className="h-16 px-10 rounded-[1.5rem] border border-mat-wine/10 text-mat-wine font-black uppercase tracking-widest text-[11px] hover:bg-white"
                         onPress={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                      >
                         Sanctuary Leaderboard
                      </Button>
                   </div>
                </div>

                {/* ─── SCENE 3: TACTILE CLUSTER (METRICS) ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Resonance Metric */}
                   <div className="mat-tactile-card p-8 flex items-center justify-between group hover:translate-y-[-4px] transition-all duration-500">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-wine/40">Resonances</span>
                         <h4 className="text-6xl font-serif font-black italic text-mat-wine">{metrics.matches}</h4>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-mat-rose">Confirmed Matches</p>
                      </div>
                      <div className="w-20 h-20 rounded-[2rem] bg-mat-rose/5 border border-mat-rose/10 flex items-center justify-center text-mat-rose shadow-inner group-hover:scale-110 transition-transform">
                         <Heart size={32} />
                      </div>
                   </div>

                   {/* Engagement Metric */}
                   <div className="mat-tactile-card p-8 flex items-center justify-between group hover:translate-y-[-4px] transition-all duration-500">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-wine/40">Engagement</span>
                         <h4 className="text-6xl font-serif font-black italic text-mat-wine">{Math.floor(metrics.sessionSeconds / 60)}<span className="text-2xl text-mat-rose/40">m</span></h4>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-mat-rose">Presence Duration</p>
                      </div>
                      <div className="w-20 h-20 rounded-[2rem] bg-mat-gold/5 border border-mat-gold/10 flex items-center justify-center text-mat-gold shadow-inner group-hover:scale-110 transition-transform">
                         <Clock size={32} />
                      </div>
                   </div>
                </div>

                {/* Privacy Safeguard (Dark Tactical Card) */}
                <div className="bg-mat-obsidian rounded-[3rem] p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-mat-rose/10 blur-[80px] pointer-events-none" />
                   <div className="flex gap-10 items-center">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-mat-rose flex-shrink-0">
                         <Lock size={40} />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-3xl font-bold italic text-white">Identity Shield: Active</h4>
                         <p className="text-white/40 text-sm leading-relaxed max-w-md">
                            Your biometric signature is isolated. No aspirant can view your full visual identity until you initiate resonant contact.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-40 border-t border-mat-wine/5 pt-20">
             <Leaderboard isInline={true} />
             <AdUnit slot="1234567892" className="mt-16 bg-white/40 mat-glass-tactile border-none" />
          </div>
        </div>
      </motion.div>

      {/* Verification Modal Global */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowVerification(false)}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
             />
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-mat-gold/30 bg-[#0A0A0B] shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
             >
                <button 
                  onClick={() => setShowVerification(false)}
                  className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2 z-20"
                >
                  <X size={24} />
                </button>
                <AadhaarVerification 
                  userId={profile.user_id} 
                  onVerified={async () => {
                     await refreshProfile();
                     setShowVerification(false);
                  }} 
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </TooltipProvider>
  );
};

export default WomenSanctuary;
