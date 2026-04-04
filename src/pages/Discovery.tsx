import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Heart,
  Plus
} from 'lucide-react';

import { SeekerBrowse } from '@/components/SeekerBrowse';
import { Badge } from "@/components/ui/badge";
import { SkeletonRail } from "@/components/ui/SkeletonCard";
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { cn } from '@/lib/utils';

const RailCard = ({ profile, onSelect }: { profile: any, onSelect: (p: any) => void }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    onClick={() => onSelect(profile)}
    className="min-w-[280px] w-[280px] aspect-[3/4] rounded-[2.5rem] bg-mat-wine/5 border border-mat-rose/10 overflow-hidden relative cursor-pointer group shadow-sm transition-all"
  >
     <img 
        src={JSON.parse(profile.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
     />
     <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/80 via-transparent to-transparent opacity-60 group-hover:opacity-80" />
     
     <div className="absolute top-6 left-6 flex flex-col gap-2">
        {profile.is_verified && <Badge variant="gold" className="w-fit scale-75 origin-left"><ShieldCheck size={12} /></Badge>}
     </div>

     <div className="absolute bottom-8 left-8 right-8 space-y-2">
        <h4 className="text-2xl font-bold text-mat-cream italic leading-none">{profile.full_name.split(' ')[0]}</h4>
        <div className="flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{profile.city || 'Sanctuary'}</p>
           <Zap className="text-mat-gold scale-75" />
        </div>
     </div>
  </motion.div>
);

const ResonanceRail = ({ title, type, onSelect }: { title: string, type: 'imperial' | 'truth' | 'rising', onSelect: (p: any) => void }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
       const feed = await SanctuaryService.getRailFeed('', type);
       setProfiles(feed || []);
       setLoading(false);
    };
    fetch();
  }, [type]);

  if (loading) return <div className="space-y-6"><h3 className="mat-text-label-pro opacity-20">{title}</h3><SkeletonRail /></div>;
  if (profiles.length === 0) return null;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end px-2">
          <h3 className="mat-text-label-pro text-mat-wine/60">{title}</h3>
          <span className="text-[9px] font-black uppercase tracking-widest text-mat-rose italic">View All</span>
       </div>
       <div className="flex gap-6 overflow-x-auto pb-10 px-2 custom-scrollbar mask-horizontal">
          {profiles.map((p, i) => <RailCard key={p.user_id + i} profile={p} onSelect={onSelect} />)}
       </div>
    </div>
  );
};

export const Discovery: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Sparkles className="animate-spin text-mat-rose" /></div>;

  if (profile?.role === 'man') {
    return (
      <div className="py-24 space-y-12">
        <div className="text-center space-y-4">
           <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 text-mat-gold text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Temporal Signal</Badge>
           <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic">Awaiting <br /><span className="text-mat-rose/20">The Gaze.</span></h1>
        </div>
        <div className="mat-glass-deep p-16 rounded-[4rem] border-mat-rose/10 text-center space-y-8 max-w-2xl mx-auto">
           <div className="w-20 h-20 bg-mat-wine text-mat-cream rounded-full mx-auto flex items-center justify-center shadow-mat-premium"><Sparkles size={32} /></div>
           <p className="text-lg italic text-mat-wine font-medium leading-relaxed">"Your resonance is pulse-frequency in the sanctuary. Connection flows from her sovereign choice."</p>
           <div className="h-1 bg-mat-fog rounded-full overflow-hidden w-2/3 mx-auto"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-full bg-mat-gold" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-32 py-12 md:py-24">
       {/* ─── Resonance Rails (Curated) ─── */}
       <div className="space-y-20">
          <div className="space-y-4">
             <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-wine text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Sanctuary Curation</Badge>
             <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic">Curated <br /><span className="text-mat-rose/20">Resonances.</span></h1>
          </div>
          
          <div className="space-y-10">
             <ResonanceRail title="Imperial Aura" type="imperial" onSelect={() => {}} />
             <ResonanceRail title="Seal of Truth (Verified)" type="truth" onSelect={() => {}} />
             <ResonanceRail title="Rising Seekers" type="rising" onSelect={() => {}} />
          </div>
       </div>

       {/* ─── Infinite Resonance ─── */}
       <div className="space-y-16">
          <div className="flex items-center gap-6">
             <h2 className="text-4xl mat-text-display-pro text-mat-wine">Infinite <span className="text-mat-rose/30">Sanctuary</span></h2>
             <div className="h-px flex-1 bg-mat-rose/10" />
          </div>
          <SeekerBrowse />
       </div>
    </div>
  );
};

export default Discovery;
