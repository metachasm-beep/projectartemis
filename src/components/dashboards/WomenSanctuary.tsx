import React, { useState } from 'react';
import { Camera, ShieldCheck, Clock, Crown, Sparkles, ChevronRight, Lock, Heart, ArrowLeft } from 'lucide-react';
import type { MatriarchProfile } from '@/types';
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import InfiniteMenu from '@/components/ui/InfiniteMenu';

interface WomenSanctuaryProps {
  profile: MatriarchProfile;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

const DUMMY_MEN = [
  { image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop', title: 'Vikram, 28', description: 'Rank #1 • Imperial Vault', link: '#' },
  { image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1287&auto=format&fit=crop', title: 'Arjun, 31', description: 'Rank #12 • Vanguard', link: '#' },
  { image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop', title: 'Kabir, 29', description: 'Rank #45 • Sealed', link: '#' },
  { image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1287&auto=format&fit=crop', title: 'Rohan, 27', description: 'Rank #102 • Rising', link: '#' },
  { image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1287&auto=format&fit=crop', title: 'Dev, 30', description: 'Rank #230', link: '#' },
  { image: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=1287&auto=format&fit=crop', title: 'Neel, 26', description: 'Rank #450', link: '#' },
  { image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1287&auto=format&fit=crop', title: 'Aryan, 32', description: 'Rank #890', link: '#' },
  { image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1287&auto=format&fit=crop', title: 'Dhruv, 29', description: 'Rank #1,204', link: '#' },
];

export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ profile, metrics, setIsEditing, onBeginDiscovery }) => {
  const [isBrowsingArray, setIsBrowsingArray] = useState(false);
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  
  if (isBrowsingArray) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col">
         {/* Navigation Overlay */}
         <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <Button 
               onPress={() => setIsBrowsingArray(false)} 
               variant="flat" 
               color="default"
               radius="full"
               className="pointer-events-auto bg-white/10 text-white backdrop-blur-md"
               startContent={<ArrowLeft size={16} />}
            >
               Return to Sanctuary
            </Button>
            <div className="text-right">
               <h2 className="text-mat-gold font-bold italic tracking-widest text-lg">THE ARRAY</h2>
               <p className="text-[10px] text-white/50 uppercase tracking-[0.3em]">Sovereign Browsing Active</p>
            </div>
         </div>
         
         {/* 3D Infinite Menu (ReactBits Component) */}
         <div className="flex-1 w-full h-full">
           <InfiniteMenu items={DUMMY_MEN} scale={1.2} />
         </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-mat-cream min-h-screen relative overflow-hidden">
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-mat-rose/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-mat-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32 relative z-10 max-w-7xl">
        
        {/* ─── SCENE 1: THE PORTRAIT & INFLUENCE ─── */}
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
                       className="absolute -bottom-4 -right-4 w-14 h-14 bg-mat-wine text-mat-cream rounded-full shadow-lg hover:scale-110"
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
                   startContent={<Crown size={14} className="text-mat-rose" />}
                   variant="flat"
                   color="danger"
                   radius="full"
                   className="bg-mat-wine/5 border border-mat-rose/10 pointer-events-none"
                 >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-mat-wine">Sovereign Presence</span>
                 </Chip>
                 <h1 className="mat-text-display-pro text-mat-wine leading-[0.8] tracking-tighter text-[5rem] sm:text-[6rem] md:text-[8rem]">
                    {firstName}
                 </h1>
                 <p className="text-mat-slate/50 font-light text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                    Your sanctuary awaits. The protocol curates the highest strata of aspirants governed entirely by your choice.
                 </p>
              </div>

              {/* The Massive Portal Action (HeroUI Refactor) */}
              <div className="pt-8">
                 <Button 
                   onPress={() => setIsBrowsingArray(true)} 
                   className="group relative w-full lg:w-[80%] h-auto aspect-[4/1] md:aspect-[5/1] rounded-[3rem] overflow-hidden shadow-2xl shadow-mat-rose/20 bg-mat-wine"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-mat-wine via-mat-rose-deep to-mat-wine" />
                    
                    <div className="relative h-full w-full flex items-center justify-between px-8 md:px-12 text-mat-cream">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                             <Sparkles size={24} className="text-mat-gold group-hover:animate-pulse" />
                          </div>
                          <div className="text-left space-y-1">
                             <h3 className="text-xl md:text-2xl font-bold italic tracking-wide">Enter the Array</h3>
                             <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/60">Begin Sovereign Browsing</p>
                          </div>
                       </div>
                       <ChevronRight size={32} className="text-mat-gold/50 group-hover:text-mat-gold group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                 </Button>
              </div>
           </div>

        </div>

        {/* ─── SCENE 2: SOVEREIGN METRICS (HeroUI Cards) ─── */}
        <div className="mt-32 border-t border-mat-rose/10 pt-20">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Metric 1 */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-sm border border-mat-rose/5 hover:shadow-lg transition-all duration-500 bg-white" shadow="none">
                 <CardHeader className="flex justify-between items-center px-4 pt-4">
                    <div className="w-12 h-12 bg-mat-wine/5 rounded-2xl flex items-center justify-center text-mat-wine/40">
                       <Heart size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Matches</span>
                 </CardHeader>
                 <CardBody className="px-4 pb-6 overflow-hidden">
                    <h4 className="text-5xl font-serif font-black italic text-mat-wine">{metrics.matches}</h4>
                    <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Resonances</p>
                 </CardBody>
              </Card>

              {/* Metric 2 */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-sm border border-mat-rose/5 hover:shadow-lg transition-all duration-500 bg-white" shadow="none">
                 <CardHeader className="flex justify-between items-center px-4 pt-4">
                    <div className="w-12 h-12 bg-mat-gold/5 rounded-2xl flex items-center justify-center text-mat-gold/60">
                       <Clock size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-mat-slate/30">Engagement</span>
                 </CardHeader>
                 <CardBody className="px-4 pb-6 overflow-hidden">
                    <h4 className="text-5xl font-serif font-black italic text-mat-wine">{Math.floor(metrics.sessionSeconds / 60)}<span className="text-2xl text-mat-wine/40">m</span></h4>
                    <p className="text-xs text-mat-slate/40 mt-4 font-medium uppercase tracking-widest">Time within Sanctuary</p>
                 </CardBody>
              </Card>

              {/* Security Status */}
              <Card className="col-span-1 p-4 rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-mat-obsidian text-mat-cream" shadow="none">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-mat-rose/10 blur-[50px] pointer-events-none" />
                 
                 <CardHeader className="flex justify-between items-center px-4 pt-4 relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40">
                       <ShieldCheck size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Privacy</span>
                 </CardHeader>
                 
                 <CardBody className="px-4 pb-6 relative z-10 space-y-6 overflow-hidden">
                    <div>
                       <h4 className="text-2xl font-bold italic">Identity Sealed</h4>
                       <p className="text-xs text-white/40 mt-2 leading-relaxed whitespace-break-spaces">Your true identity remains completely hidden from observers until a resonance is confirmed.</p>
                    </div>
                    <Button variant="bordered" className="w-full text-white border-white/10 rounded-2xl h-14 flex items-center gap-3 uppercase tracking-widest font-black text-[9px] mt-2">
                       <Lock size={14} /> Review Visibility Rules
                    </Button>
                 </CardBody>
              </Card>

           </div>
        </div>

      </div>
    </div>
  );
};
