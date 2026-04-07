import React, { useState } from 'react';
import { Camera, ShieldCheck, Clock, Crown, Sparkles, ChevronRight, Lock, Heart, ArrowLeft, Trophy, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MatriarchProfile } from '@/types';
import { Button, Card, CardContent, CardHeader, Chip } from "@heroui/react";
import CircularGallery from '@/components/animations/CircularGallery';
import MenDiscovery from '@/components/discovery/MenDiscovery';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { SanctuaryForum } from '@/components/forum/SanctuaryForum';
import AdUnit from '@/components/common/AdUnit';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';
import { VerificationModal } from '@/components/verification/VerificationModal';
import { SanctuaryService } from '@/services/sanctuary';

interface WomenSanctuaryProps {
  profile: MatriarchProfile;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

const GALLERY_ITEMS = DUMMY_ASPIRANTS.map(m => ({ image: m.img, text: m.name }));

export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ profile, metrics, setIsEditing, onBeginDiscovery }) => {
  const forumRef = React.useRef<HTMLDivElement>(null);
  const [isBrowsingArray, setIsBrowsingArray] = useState(false);
  const [isBrowsingDirectory, setIsBrowsingDirectory] = useState(false);
  const [isBrowsingLeaderboard, setIsBrowsingLeaderboard] = useState(false);
  const [engagementTarget, setEngagementTarget] = useState<typeof DUMMY_ASPIRANTS[0] | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  
  const scrollToForum = () => {
    forumRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isBrowsingArray) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <Button 
               onPress={() => setIsBrowsingArray(false)} 
               variant="ghost" 
               className="pointer-events-auto bg-white/10 text-white backdrop-blur-md rounded-full px-6 flex items-center gap-2"
            >
               <ArrowLeft size={16} />
               Return to Sanctuary
            </Button>
            <div className="text-right">
               <h2 className="text-mat-gold font-bold italic tracking-widest text-lg uppercase underline decoration-mat-gold/20 underline-offset-8">The Array</h2>
               <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] mt-1">Sovereign Browsing Active</p>
            </div>
          </div>
          
          <div className="absolute inset-0 z-0">
            <CircularGallery 
              items={GALLERY_ITEMS}
              bend={1}
              borderRadius={0}
              font='900 40px "Roboto Condensed"'
              scrollSpeed={2}
              scrollEase={0.05}
              onSelect={(idx) => {
                 setEngagementTarget(DUMMY_ASPIRANTS[idx]);
              }}
            />
          </div>

          {/* Engagement Overlay */}
          <AnimatePresence>
            {engagementTarget && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
                  onClick={() => setEngagementTarget(null)}
              >
                  <div onClick={(e) => e.stopPropagation()}>
                    <TrumpCard 
                        profile={{
                          name: engagementTarget.name,
                          age: engagementTarget.age,
                          city: engagementTarget.city,
                          img: engagementTarget.img,
                          status: engagementTarget.status,
                          bio: engagementTarget.bio,
                          is_verified: engagementTarget.is_verified
                        }}
                        onClose={() => setEngagementTarget(null)}
                        onAction={() => {
                          const isHighRank = engagementTarget.status === 'Imperial' || engagementTarget.status === 'Vanguard';
                          if (isHighRank && !engagementTarget.is_verified) {
                             alert("PROTOCOL RESTRICTED: Aspirant identity sync required for this connection.");
                             return;
                          }
                          alert(`Protocol Synced: Contact initiated with ${engagementTarget.name.toUpperCase()}.`);
                          setEngagementTarget(null);
                        }}
                      />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interaction Hint */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[110] pointer-events-none text-center space-y-3">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30 animate-pulse">Drag to Navigate</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
          </div>

          {/* Fast-Travel to Forum FAB */}
          <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-[120]">
            <Button
                isIconOnly
                onPress={() => {
                    setIsBrowsingArray(false);
                    // Instead of full-screen, we can scroll to forum if we return to sanctuary or leave as is
                    setTimeout(scrollToForum, 100);
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#c9a75d] to-[#8a723e] border border-white/20 rounded-full shadow-[0_0_40px_rgba(201,167,93,0.4)] flex items-center justify-center hover:scale-110 transition-all duration-300 group"
            >
                <MessageSquarePlus size={24} className="text-black group-hover:-rotate-12 transition-transform duration-500" />
            </Button>
          </div>
      </div>
    );
  }

  if (isBrowsingDirectory) {
    return <MenDiscovery onClose={() => setIsBrowsingDirectory(false)} />;
  }

  if (isBrowsingLeaderboard) {
    return <Leaderboard onClose={() => setIsBrowsingLeaderboard(false)} />;
  }

  return (
    <div className="w-full bg-mat-cream min-h-screen relative overflow-hidden">
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-mat-rose/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-mat-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32 relative z-10 max-w-7xl">
        
        {/* Header Actions & Branding */}
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
             <Button 
                onPress={() => setShowVerification(true)}
                className={`h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] border transition-all ${profile.is_verified ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-default' : 'bg-mat-gold text-black border-transparent shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.05]'}`}
             >
                {profile.is_verified ? (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={12} /> Sync Established
                  </div>
                ) : (
                  "Secure Identity"
                )}
             </Button>
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
                    <Button 
                       isIconOnly
                       onPress={() => setIsEditing(true)}
                       className="absolute -bottom-4 -right-4 w-14 h-14 bg-mat-wine text-mat-cream rounded-full shadow-lg hover:scale-110 flex items-center justify-center p-0"
                    >
                       <Camera size={20} />
                    </Button>
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

              {/* The Massive Portal Actions */}
              <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Button 
                    onPress={() => setIsBrowsingArray(true)} 
                    className="group relative w-full h-24 rounded-[2rem] overflow-hidden shadow-2xl shadow-mat-rose/20 bg-mat-wine border-none p-0"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-mat-wine via-mat-rose-deep to-mat-wine opacity-90 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative h-full w-full flex items-center justify-between px-8 text-mat-cream">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                             <Sparkles size={20} className="text-mat-gold group-hover:animate-pulse" />
                          </div>
                          <div className="text-left text-white">
                             <h3 className="text-lg font-bold italic">The Array</h3>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/60">3D Discovery</p>
                          </div>
                       </div>
                       <ChevronRight size={24} className="text-mat-gold/50 group-hover:text-mat-gold group-hover:translate-x-1 transition-all" />
                    </div>
                 </Button>

                 <Button 
                    onPress={() => {
                      if (onBeginDiscovery) onBeginDiscovery();
                      else setIsBrowsingDirectory(true);
                    }} 
                    className="group relative w-full h-24 rounded-[2rem] overflow-hidden border border-mat-wine/10 bg-white hover:bg-mat-wine/5 transition-all duration-500 p-0"
                 >
                    <div className="relative h-full w-full flex items-center justify-between px-8 text-mat-wine">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-mat-wine/5 flex items-center justify-center backdrop-blur-md">
                             <Lock size={20} className="text-mat-rose group-hover:animate-bounce" />
                          </div>
                          <div className="text-left text-mat-wine">
                             <h3 className="text-lg font-bold italic">The Directory</h3>
                             <p className="text-[8px] font-black uppercase tracking-widest text-mat-wine/30">Vertical Feed</p>
                          </div>
                       </div>
                       <ChevronRight size={24} className="text-mat-wine/20 group-hover:text-mat-wine group-hover:translate-x-1" />
                    </div>
                 </Button>

                 <Button 
                    onPress={scrollToForum} 
                    className="group relative w-full h-24 rounded-[2rem] overflow-hidden shadow-2xl bg-[#0e0e0e] border border-mat-gold/20 hover:border-mat-gold/50 transition-all p-0"
                 >
                    <div className="relative h-full w-full flex items-center justify-between px-8 text-mat-cream">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-mat-gold/10 flex items-center justify-center backdrop-blur-md">
                             <MessageSquarePlus size={20} className="text-mat-gold group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-left">
                             <h3 className="text-lg font-bold italic font-['Impact'] text-mat-gold tracking-tight">THE COVEN</h3>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Elite Forums</p>
                          </div>
                       </div>
                       <ChevronRight size={24} className="text-mat-gold/30 group-hover:text-mat-gold group-hover:translate-x-1" />
                    </div>
                 </Button>

                 <Button 
                    onPress={() => setIsBrowsingLeaderboard(true)} 
                    className="group relative w-full h-24 rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-mat-gold/30 hover:shadow-mat-gold/10 transition-all p-0"
                   >
                      <div className="relative h-full w-full flex items-center justify-between px-8 text-mat-wine">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-mat-gold/10 flex items-center justify-center backdrop-blur-md">
                               <Trophy size={20} className="text-mat-gold" />
                            </div>
                            <div className="text-left">
                               <h3 className="text-lg font-bold italic font-['Impact'] text-mat-gold tracking-tighter">LEADERBOARD</h3>
                               <p className="text-[8px] font-black uppercase tracking-widest text-mat-wine/30">Rooted Ascent</p>
                            </div>
                         </div>
                         <ChevronRight size={24} className="text-mat-gold/30 group-hover:text-mat-gold group-hover:translate-x-1" />
                      </div>
                   </Button>
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
                    <Button className="w-full bg-white/10 text-white border border-white/10 rounded-2xl h-14 flex items-center justify-center gap-3 uppercase tracking-widest font-black text-[9px] mt-2 group hover:bg-white/20 transition-all">
                       <Lock size={14} className="group-hover:scale-110 transition-transform" /> Review Visibility Rules
                    </Button>
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

        {/* ─── SCENE 3: THE COVEN (INLINE) ─── */}
        <div ref={forumRef} className="mt-40 -mx-6 lg:-mx-8 border-t border-mat-gold/20">
           <SanctuaryForum profile={profile} onClose={() => {}} isInline={true} />
        </div>

      </div>

      {/* Verification Modal Global */}
      <AnimatePresence>
        {showVerification && (
          <VerificationModal 
            onClose={() => setShowVerification(false)}
            onSuccess={async () => {
              // Seal the audit trail before updating profile status
              await SanctuaryService.uploadVerificationEvidence(profile.user_id, "BIOMETRIC_SCAN_SUCCESS");
              await SanctuaryService.verifyProfile(profile.user_id);
              setShowVerification(false);
              // Profile refresh handled by parent via Sanctuary data cycle
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
