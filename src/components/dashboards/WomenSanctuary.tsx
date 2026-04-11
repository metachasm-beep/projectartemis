import { X, ShieldCheck, Camera, Crown, MessageSquarePlus, Heart, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@heroui/react';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { SanctuaryForum } from '@/components/forum/SanctuaryForum';
import AdUnit from '@/components/common/AdUnit';
import { SEO_COPY } from '@/content/copy';
import type { MatriarchProfile } from '@/types';
import React, { useState } from 'react';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface WomenSanctuaryProps {
  profile: MatriarchProfile;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ profile, metrics, setIsEditing }) => {
  const forumRef = React.useRef<HTMLDivElement>(null);
  const [showVerification, setShowVerification] = useState(false);
  const { refreshProfile } = useAuth();
  
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  
  const scrollToForum = () => {
    forumRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <TooltipProvider>
    <div className="w-full bg-mat-cream min-h-screen relative overflow-hidden">
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-mat-rose/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-mat-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32 relative z-10 max-w-7xl">
        
        {/* Header Actions & Branding */}
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
             <Tooltip>
                <TooltipTrigger asChild>
                   <Button 
                      onPress={() => !profile.is_verified && setShowVerification(true)}
                      className={`h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] border transition-all ${profile.is_verified ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-default' : 'bg-mat-gold text-black border-transparent shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.05]'}`}
                   >
                      {profile.is_verified ? (
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={12} /> Sync Established
                        </div>
                      ) : (
                        "Get Verified"
                      )}
                   </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                   {profile.is_verified ? "Your sanctuary presence is sealed." : "Establish biometric synchronization to seal your sanctuary presence."}
                </TooltipContent>
             </Tooltip>
          </div>
          <div className="text-right hidden sm:block">
             <h1 className="text-mat-wine text-sm font-black tracking-tighter uppercase italic">The Sanctuary</h1>
             <p className="text-mat-gold text-[8px] font-bold tracking-[0.3em] uppercase opacity-80">Presence: {firstName.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
           
           {/* Centerpiece Portrait */}
           <div className="col-span-1 lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[320px] lg:max-w-[400px]">
                 <div className="absolute -inset-4 bg-gradient-to-tr from-mat-rose/20 via-transparent to-mat-gold/20 rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
                 
                 <div className="relative aspect-[3/4] w-full bg-white rounded-[2.5rem] p-3 shadow-2xl transition-transform duration-700 hover:-translate-y-2">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                       <img 
                         src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                         alt="Sovereign Portrait" 
                         className="w-full h-full object-cover scale-105"
                       />
                    </div>
                    <Tooltip>
                       <TooltipTrigger asChild>
                          <Button 
                             isIconOnly
                             onPress={() => setIsEditing(true)}
                             className="absolute -bottom-4 -right-4 w-14 h-14 bg-mat-wine text-mat-cream rounded-full shadow-lg hover:scale-110 flex items-center justify-center p-0"
                          >
                             <Camera size={20} />
                          </Button>
                       </TooltipTrigger>
                       <TooltipContent side="right" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                          Capture your sovereign essence for the discovery archive.
                       </TooltipContent>
                    </Tooltip>
                 </div>
              </div>
           </div>

           {/* Typography & Actions */}
           <div className="col-span-1 lg:col-span-7 space-y-12 text-center lg:text-left">
              
              <div className="space-y-6">
                 <Chip
                   variant="soft"
                   className="bg-mat-wine/5 border border-mat-rose/10 pointer-events-none rounded-full h-8 px-4"
                 >
                    <div className="flex items-center gap-2">
                       <Crown size={14} className="text-mat-rose" />
                       <span className="text-[10px] uppercase tracking-[0.3em] font-black text-mat-wine">Sovereign Presence</span>
                    </div>
                 </Chip>
                 <h1 className="mat-text-display-pro text-mat-wine leading-[0.8] tracking-tighter text-[5rem] sm:text-[6rem] md:text-[8rem]">
                    {firstName}
                 </h1>
                 <p className="text-mat-slate/50 font-light text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                    Your sanctuary awaits. The protocol curates the highest strata of aspirants governed entirely by your choice.
                 </p>
              </div>

              {/* The Primary Actions */}
              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <Button 
                          onPress={scrollToForum} 
                          className="group relative flex-1 h-20 rounded-[2rem] overflow-hidden shadow-2xl bg-[#0e0e0e] border border-mat-gold/20 hover:border-mat-gold/50 transition-all p-0"
                       >
                          <div className="relative h-full w-full flex items-center justify-center gap-4 text-mat-cream">
                             <div className="w-10 h-10 rounded-full bg-mat-gold/10 flex items-center justify-center backdrop-blur-md">
                                <MessageSquarePlus size={20} className="text-mat-gold group-hover:scale-110 transition-transform" />
                             </div>
                             <div className="text-left">
                                <h3 className="text-lg font-bold italic font-['Impact'] text-mat-gold tracking-tight">THE COVEN</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Elite Community Forums</p>
                             </div>
                          </div>
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                       Enter the sacred forum of the Matriarch to commune with the high-strata community.
                    </TooltipContent>
                 </Tooltip>

                 <Tooltip>
                    <TooltipTrigger asChild>
                       <Button 
                          variant="ghost"
                          className="flex-1 h-20 rounded-[2rem] border-mat-wine/10 text-mat-wine/60 hover:text-mat-wine hover:bg-mat-wine/5 uppercase tracking-[0.2em] font-black text-[10px] transition-all"
                          onPress={() => setIsEditing(true)}
                       >
                          Adjust Sovereign Identity
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                       Refine the parameters of your sovereign identity.
                    </TooltipContent>
                 </Tooltip>
              </div>
           </div>

        </div>

        {/* ─── SCENE 2: SOVEREIGN METRICS ─── */}
        <div className="mt-32 border-t border-mat-rose/10 pt-20">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Metric 1 */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-sm border border-mat-rose/5 hover:shadow-lg transition-all duration-500 bg-white">
                 <CardHeader className="flex justify-between items-center px-4 pt-4 border-none bg-transparent gap-4">
                    <div className="w-12 h-12 bg-mat-wine/5 rounded-2xl flex items-center justify-center text-mat-wine/40 flex-shrink-0">
                       <Heart size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Matches</span>
                 </CardHeader>
                 <CardContent className="px-4 pb-6 overflow-hidden">
                    <h4 className="text-5xl font-serif font-black italic text-mat-wine">{metrics.matches}</h4>
                    <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Resonances</p>
                 </CardContent>
              </Card>

              {/* Metric 2 */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-sm border border-mat-rose/5 hover:shadow-lg transition-all duration-500 bg-white">
                 <CardHeader className="flex justify-between items-center px-4 pt-4 border-none bg-transparent gap-4">
                    <div className="w-12 h-12 bg-mat-gold/5 rounded-2xl flex items-center justify-center text-mat-gold/60 flex-shrink-0">
                       <Clock size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Engagement</span>
                 </CardHeader>
                 <CardContent className="px-4 pb-6 overflow-hidden">
                    <h4 className="text-5xl font-serif font-black italic text-mat-wine">{Math.floor(metrics.sessionSeconds / 60)}<span className="text-2xl text-mat-wine/40">m</span></h4>
                    <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Time within Sanctuary</p>
                 </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-mat-obsidian text-mat-cream border-none">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-mat-rose/10 blur-[50px] pointer-events-none" />
                 
                 <CardHeader className="flex justify-between items-center px-4 pt-4 relative z-10 border-none bg-transparent gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 flex-shrink-0">
                       <ShieldCheck size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Privacy</span>
                 </CardHeader>
                 
                 <CardContent className="px-4 pb-6 relative z-10 space-y-6 overflow-hidden">
                    <div>
                       <h4 className="text-2xl font-bold italic leading-tight">Identity Sealed</h4>
                       <p className="text-xs text-white/40 mt-2 leading-relaxed whitespace-pre-wrap">Your true identity remains completely hidden from observers until a resonance is confirmed.</p>
                    </div>
                    <Tooltip>
                       <TooltipTrigger asChild>
                          <Button className="w-full bg-white/10 text-white border border-white/10 rounded-2xl h-14 flex items-center justify-center gap-3 uppercase tracking-widest font-black text-[9px] mt-2 group hover:bg-white/20 transition-all">
                             <Lock size={14} className="group-hover:scale-110 transition-transform" /> Review Visibility Rules
                          </Button>
                       </TooltipTrigger>
                       <TooltipContent className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
                          Examine the protocols governing your presence and visibility.
                       </TooltipContent>
                    </Tooltip>
                 </CardContent>
              </Card>

           </div>

           {/* Subtle AdUnit for the Sanctuary Floor */}
           <AdUnit 
             slot="1234567892" 
             className="mt-16 bg-white border-mat-rose/10 opacity-60" 
             ads_accepted={profile.data_processing_consent?.ads_accepted}
           />
        </div>

        <div className="mt-40 border-t border-mat-gold/10 pt-20">
           <Leaderboard isInline={true} />
        </div>

        {/* ─── SCENE 3: THE COVEN (INLINE) ─── */}
        <div ref={forumRef} className="mt-40 -mx-6 lg:-mx-8 border-t border-mat-gold/20">
           <SanctuaryForum profile={profile} onClose={() => {}} isInline={true} />
        </div>

      </div>

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
