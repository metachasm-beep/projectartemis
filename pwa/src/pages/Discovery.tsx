import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Crown, 
  Shield, 
  Lock,
  Bookmark
} from 'lucide-react';

import { DiscoveryCard } from '@/components/DiscoveryCard';
import { api } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatriarchLogo } from "@/components/MatriarchLogo";

const DEMO_WOMAN_ID = 'woman_demo_888';

export const Discovery: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.getDiscoveryProfiles(DEMO_WOMAN_ID);
        if (data && data.length > 0) {
          setProfiles(data);
        } else {
          // Fallback demo data
          setProfiles([
            { 
              user_id: '1', 
              full_name: 'Aravind Sharma', 
              age: 28, 
              bio: 'Sovereign Tech Lead in Bengaluru. Architect of selective systems.', 
              image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000',
              rank_score: 94
            },
            {
              user_id: '2',
              full_name: 'Vikram Malhotra',
              age: 31,
              bio: 'Venture partner. Focused on intentional growth.',
              image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
              rank_score: 88
            }
          ]);
        }
      } catch (err) {
        console.error("Discovery error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAction = async (action: 'match' | 'skip' | 'save') => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile) {
      // In a real app we would fire the API here
      // await api.selectAction(DEMO_WOMAN_ID, currentProfile.user_id, action);
    }
    
    setDirection(action === 'match' ? 1 : -1);
    
    // Smooth transition to next
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (profiles.length || 1));
    }, 10);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center mat-shell px-8">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-8 p-1 rounded-full bg-gradient-to-tr from-matriarch-violet to-matriarch-gold"
      >
        <div className="bg-matriarch-bg rounded-full p-6">
          <Crown className="w-12 h-12 text-matriarch-gold" strokeWidth={1} />
        </div>
      </motion.div>
      <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-[0.8em] animate-pulse">Scanning Sovereign Database...</div>
    </div>
  );

  const profile = profiles[currentIndex];

  return (
    <div className="h-screen flex flex-col mat-shell overflow-hidden">
      {/* Sovereign Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-matriarch-bg/40 backdrop-blur-xl">
        <div className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          <div className="flex items-center gap-6">
             <Badge variant="gold" className="hidden sm:flex">ELITE DISCOVERY</Badge>
             <div className="flex gap-2">
                <div className="w-8 h-1 bg-matriarch-violetBright rounded-full" />
                <div className="w-8 h-1 bg-white/10 rounded-full" />
                <div className="w-8 h-1 bg-white/10 rounded-full" />
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative pt-20 pb-32 px-8">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-matriarch-violet/5 blur-[120px] -z-10" />
        
        <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-12 items-center">
           {/* Controls Left - Hidden on Mobile */}
           <div className="hidden lg:flex flex-col gap-6 col-span-1 h-full justify-center">
              <div className="mat-panel p-6 space-y-4 border-none bg-white/[0.02]">
                 <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest">Current Batch</div>
                 <div className="text-3xl font-display font-black text-white italic">00{currentIndex + 1}</div>
                 <div className="text-[10px] font-bold text-matriarch-violetSoft uppercase tracking-tight italic">Protocol Active</div>
              </div>
              <Button variant="secondary" onClick={() => handleAction('skip')} className="h-16 w-full rounded-2xl group border-white/5 hover:border-matriarch-red/20">
                 <X className="w-6 h-6 text-matriarch-textSoft group-hover:text-matriarch-red transition-colors" />
              </Button>
           </div>

           {/* Central Card */}
           <div className="col-span-3 perspective-1000">
             <AnimatePresence mode="wait">
                <motion.div
                  key={profile?.user_id || 'empty'}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 50, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <div className="mat-panel-premium p-3 rounded-[2.5rem] border-none shadow-mat-premium group">
                     <DiscoveryCard 
                        imageSrc={profile?.image_url}
                        altText={profile?.full_name}
                        containerHeight="600px"
                        scaleOnHover={1.02}
                        showTooltip={false}
                        overlayContent={
                          <div className="p-10 h-full flex flex-col justify-end bg-gradient-to-t from-matriarch-bg via-matriarch-bg/60 to-transparent">
                             <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-end">
                                   <div>
                                      <Badge variant="gold" className="mb-4">RANK {Math.round(profile?.rank_score || 0)}</Badge>
                                      <h2 className="text-5xl font-display font-black tracking-tighter text-white leading-none">
                                        {profile?.full_name}, {profile?.age}
                                      </h2>
                                   </div>
                                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                                      <Shield className="w-6 h-6 text-matriarch-violetBright" />
                                   </div>
                                </div>
                                
                                <div className="mat-panel bg-white/[0.05] p-6 border-white/10 italic text-matriarch-textSoft leading-relaxed font-medium">
                                  "{profile?.bio}"
                                </div>

                                <div className="flex gap-3 overflow-hidden">
                                   {['Tech', 'Innovation', 'Fitness'].map(tag => (
                                     <Badge key={tag} variant="outline" className="border-white/10 text-white/40">{tag}</Badge>
                                   ))}
                                </div>
                             </div>
                          </div>
                        }
                     />
                  </div>
                </motion.div>
             </AnimatePresence>
           </div>

           {/* Controls Right - Hidden on Mobile */}
           <div className="hidden lg:flex flex-col gap-6 col-span-1 h-full justify-center">
              <Button variant="gold" onClick={() => handleAction('match')} className="h-24 w-full rounded-2xl group shadow-mat-gold">
                 <Heart className="w-8 h-8 group-hover:scale-125 transition-transform" fill="currentColor" />
              </Button>
              <Button variant="secondary" onClick={() => handleAction('save')} className="h-16 w-full rounded-2xl group border-white/5">
                 <Bookmark className="w-6 h-6 text-matriarch-textSoft group-hover:text-matriarch-gold transition-colors" />
              </Button>
              <div className="mat-panel p-6 space-y-2 border-none bg-white/[0.02] text-center">
                 <Lock className="w-4 h-4 text-white/20 mx-auto" />
                 <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Encrypted</div>
              </div>
           </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden fixed bottom-12 left-0 right-0 flex justify-center gap-8 px-8 z-40">
           <Button variant="secondary" size="lg" onClick={() => handleAction('skip')} className="w-20 h-20 rounded-full border-white/5 bg-matriarch-surface backdrop-blur-xl">
             <X className="w-8 h-8 text-matriarch-red/60" />
           </Button>
           <Button variant="gold" size="lg" onClick={() => handleAction('match')} className="w-24 h-24 rounded-full shadow-mat-gold scale-110">
             <Heart className="w-10 h-10" fill="currentColor" />
           </Button>
           <Button variant="secondary" size="lg" onClick={() => handleAction('save')} className="w-20 h-20 rounded-full border-white/5 bg-matriarch-surface backdrop-blur-xl">
             <Bookmark className="w-7 h-7 text-matriarch-gold/60" />
           </Button>
        </div>
      </main>

      {/* Decorative Text */}
      <div className="fixed bottom-0 w-full py-6 text-center pointer-events-none opacity-[0.05]">
         <span className="text-[10px] font-black uppercase tracking-[2em] text-white">Sovereign Selection Protocol Active — Archive 024.9</span>
      </div>
    </div>
  );
};

export default Discovery;
