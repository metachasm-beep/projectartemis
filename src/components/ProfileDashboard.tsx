import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Zap, 
  Camera, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Church, 
  Languages, 
  Activity, 
  Flame,
  History,
  CheckCircle2,
  Eye,
  Bookmark,
  Users,
  ShieldCheck,
  Clock,
  Crown,
  LayoutDashboard,
  BarChart3,
  Archive
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditProfile } from '@/components/EditProfile';
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { MenDossier } from '@/components/dashboards/MenDossier';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// 💎 Aura Progress Ring
const AuraProgressRing = ({ current, max, label, color = "text-mat-gold" }: { current: number, max: number, label: string, color?: string }) => {
  const percentage = Math.min((current / max) * 100, 100);
  const stroke = 8;
  const radius = 60;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset: 0 }} r={normalizedRadius} cx={radius} cy={radius} className="text-mat-wine/5" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} r={normalizedRadius} cx={radius} cy={radius} 
          className={color}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
         <span className="text-3xl font-black text-mat-wine italic">{current}</span>
         <span className="text-[8px] font-black uppercase tracking-widest text-mat-slate/40">{label}</span>
      </div>
    </div>
  );
};

const getAuraTier = (count: number = 0) => {
  if (count >= 500) return { label: 'Imperial Sovereign', next: 1000, color: 'text-mat-gold' };
  if (count >= 200) return { label: 'Grand Initiate', next: 500, color: 'text-mat-wine' };
  if (count >= 50) return { label: 'Verified Seeker', next: 200, color: 'text-mat-rose' };
  return { label: 'Rising Aspirant', next: 50, color: 'text-mat-slate/60' };
};

const getSovereignTier = (matches: number, seconds: number) => {
  const hours = seconds / 3600;
  if (matches >= 10 && hours >= 10) return { label: 'Matriarch', color: 'text-mat-rose', next: 'Supreme Guide' };
  if (matches >= 5 || hours >= 5) return { label: 'Sovereign', color: 'text-mat-wine', next: 'Matriarch' };
  if (matches >= 1) return { label: 'Selector', color: 'text-mat-slate', next: 'Sovereign' };
  return { label: 'Observer', color: 'text-mat-slate/40', next: 'Selector' };
};

const DataPoint = ({ icon: Icon, label, value }: { icon: any, label: string, value: any }) => (
  <div className="flex items-center gap-4 p-6 rounded-[2.5rem] bg-mat-wine/[0.03] border border-mat-rose/10 group/item hover:bg-mat-cream/80 transition-all">
     <div className="p-3 rounded-2xl bg-mat-wine/5 text-mat-rose/60 group-hover/item:text-mat-rose transition-colors">
        <Icon size={18} strokeWidth={1.5} />
     </div>
     <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-slate/40">{label}</p>
        <p className="text-[13px] font-bold text-mat-wine italic">{value || 'Unwoven'}</p>
     </div>
  </div>
);

const SignalMetric = ({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) => (
  <div className="p-8 rounded-[3rem] bg-white border border-mat-rose/5 shadow-sm hover:shadow-mat-premium transition-all group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-mat-wine/5 rounded-2xl text-mat-wine group-hover:bg-mat-wine group-hover:text-white transition-colors"><Icon size={20} /></div>
     </div>
     <div className="space-y-1">
        <p className="text-4xl font-black text-mat-wine italic">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-slate/40">{label}</p>
        <p className="text-[8px] font-bold text-mat-rose/60 mt-3">{sub}</p>
     </div>
  </div>
);

export const ProfileDashboard: React.FC<{ onBeginDiscovery?: () => void }> = ({ onBeginDiscovery }) => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState({ impression: 0, visit: 0, save: 0 });
  const [sovereignMetrics, setSovereignMetrics] = useState({ matches: 0, sessionSeconds: 0 });

  useEffect(() => {
    const init = async () => {
      if (profile?.user_id) {
         if (profile.role === 'man') {
            const sigs = await SanctuaryService.getSignalMetrics(profile.user_id);
            setMetrics({
              impression: Number(sigs.impression || 0),
              visit: Number(sigs.visit || 0),
              save: Number(sigs.save || 0)
            });
         } else {
            const sov = await SanctuaryService.getSovereignMetrics(profile.user_id);
            setSovereignMetrics(sov);
         }
      }
    };
    init();
  }, [profile?.user_id, profile?.role]);

  if (!profile) return null;

  const handleVerify = async () => {
    if (!profile?.user_id) return;
    const success = await SanctuaryService.rewardRank(profile.user_id, 100, "Seal of Truth: Identity Verified");
    if (success) {
       await refreshProfile();
       alert("Identity Sealed. Your Aura has ascended.");
    }
  };

  const isMan = profile.role === 'man';
  const rankCount = profile.rank_boost_count || 0;
  
  return (
    <div className={cn("space-y-20 pb-20", isMan ? "w-full" : "")}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <EditProfile profile={profile} onUpdate={() => { refreshProfile(); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
          </motion.div>
        ) : isMan ? (
          <motion.div key="view-man" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
             <MenDossier profile={profile} metrics={{ impression: metrics.impression, visit: metrics.visit, save: metrics.save }} setIsEditing={setIsEditing} handleVerify={handleVerify} />
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-20 p-4 md:p-0">
             {/* ─── Hero Header & Status Handshake ─── */}
             <div className="space-y-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                   <div className="space-y-8 flex-1">
                      <div className="flex flex-wrap items-center gap-4">
                         <Badge variant="outline" className="px-6 py-2 border-mat-rose/20 text-mat-wine text-[10px] uppercase tracking-[0.4em] rounded-full font-black">Personal Sanctuary // Station</Badge>
                         {isMan ? (
                            <Badge variant="gold" className="px-6 py-2">{getAuraTier(rankCount).label}</Badge>
                         ) : (
                            <Badge variant="sovereign" className="px-6 py-2">Sovereign Presence</Badge>
                         )}
                      </div>
                       <h1 className="mat-text-display-pro leading-[0.8] mt-4 text-[3rem] sm:text-[4rem] md:text-[clamp(3rem,15vw,12rem)] px-1">
                          {profile?.full_name?.split(' ')[0]} <br />
                          <span className="text-mat-rose/10 -mt-2 md:-mt-8 block hidden md:block">{profile?.full_name?.split(' ').slice(1).join(' ') || 'Identifier'}</span>
                       </h1>
                   </div>
                   
                   {isMan && (
                     <div className="px-10 py-8 mat-glass-deep rounded-[3rem] border-mat-rose/10 flex items-center gap-8 shadow-mat-premium">
                        <AuraProgressRing current={rankCount} max={getAuraTier(rankCount).next} label="AURA POWER" />
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-mat-gold italic">Next Ascent</p>
                           <h5 className="text-xl font-bold text-mat-wine italic">{getAuraTier(rankCount).next} Rank Threshold</h5>
                        </div>
                     </div>
                   )}
                </div>
                <Separator className="bg-mat-rose/10" />
             </div>

             {/* ─── Identity Station Tabs ─── */}
             <Tabs defaultValue="station" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
                   <TabsList className="w-full sm:w-auto overflow-x-auto flex-nowrap">
                      <TabsTrigger value="station" className="gap-2 text-[10px] sm:text-xs whitespace-nowrap"><LayoutDashboard size={14} /> Station</TabsTrigger>
                      {isMan && <TabsTrigger value="oracle" className="gap-2 text-[10px] sm:text-xs whitespace-nowrap"><BarChart3 size={14} /> Oracle</TabsTrigger>}
                      <TabsTrigger value="archive" className="gap-2 text-[10px] sm:text-xs whitespace-nowrap"><Archive size={14} /> Archive</TabsTrigger>
                   </TabsList>
                   
                   <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-full px-6 h-10 sm:h-12 gap-2 text-[9px] font-black uppercase tracking-widest hidden sm:flex">
                      <Camera size={14} /> Update Narrative
                   </Button>
                </div>


                <TabsContent value="station" className="mt-0">
                   <div className="bento-grid gap-6 md:gap-12">
                       <div className="bento-span-4 bento-item mat-glass-deep p-0 overflow-hidden h-[350px] sm:h-[400px] md:h-[600px] shadow-mat-premium border-mat-rose/10 group relative">
                          <img src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-mat-wine/80 to-transparent">
                             <span className="mat-text-label-pro text-mat-cream opacity-40">Primary Portrait</span>
                          </div>
                       </div>

                      {isMan ? (
                         <div className="bento-span-5 bento-item mat-glass border-mat-rose/10 p-8 sm:p-14 flex flex-col justify-between h-auto min-h-[350px] md:h-[600px]">
                            <div className="space-y-10">
                               <div className="space-y-3">
                                  <Zap className="text-mat-gold" size={24} />
                                  <h3 className="text-2xl sm:text-4xl font-bold italic text-mat-wine leading-tight">Identity <br /><span className="text-mat-gold/60">Ascension.</span></h3>
                               </div>
                               <div className="space-y-6">
                                  {[
                                    { label: 'Seal Identity (Verify)', done: !!profile.is_verified, val: '+100 Aura' },
                                    { label: 'Narrative Portrait', done: (profile.photos?.length || 0) > 0, val: '+50 Aura' },
                                    { label: 'Roots & Academy', done: !!profile.education && !!profile.city, val: '+30 Aura' }
                                  ].map((task, i) => (
                                    <button key={i} onClick={() => setIsEditing(true)} className={cn("w-full flex justify-between items-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all", task.done ? "bg-mat-wine/5 opacity-30" : "bg-white hover:border-mat-gold/30 shadow-sm")}>
                                       <div className="flex items-center gap-6">
                                          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", task.done ? "bg-mat-rose/10 text-mat-rose" : "bg-mat-fog/30")}><CheckCircle2 size={20} /></div>
                                          <span className="text-[12px] font-black text-mat-wine uppercase tracking-[0.2em]">{task.label}</span>
                                       </div>
                                       <span className="text-[10px] font-black text-mat-gold italic">{task.val}</span>
                                    </button>
                                  ))}
                               </div>
                            </div>
                            {!profile.is_verified && <Button variant="gold" size="lg" onClick={handleVerify} className="w-full">Begin Seal Ritual</Button>}
                         </div>
                      ) : (
                         <div className="bento-span-5 bento-item mat-glass border-mat-wine/5 bg-mat-wine/5 p-8 sm:p-14 flex flex-col justify-between h-auto min-h-[350px] md:h-[600px] shadow-mat-premium relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-mat-wine/5 blur-[100px]" />
                             <div className="space-y-8 relative z-10">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-4 text-mat-wine">
                                      <Crown size={32} strokeWidth={1.5} />
                                      <h3 className="text-4xl md:text-5xl font-bold italic leading-tight">Sovereign <br /><span className="opacity-30">Status.</span></h3>
                                   </div>
                                </div>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
                                   <div className="p-5 bg-white/60 rounded-3xl border border-mat-wine/5 shadow-sm space-y-4">
                                      <Clock className="text-mat-wine" size={20} />
                                      <p className="text-3xl md:text-4xl font-black text-mat-wine italic">{(sovereignMetrics.sessionSeconds / 60).toFixed(0)}m</p>
                                      <p className="mat-text-label-pro text-mat-wine/40">Time Spent</p>
                                   </div>
                                   <div className="p-5 bg-white/60 rounded-3xl border border-mat-wine/5 shadow-sm space-y-4">
                                      <Heart className="text-mat-rose" size={20} fill="currentColor" />
                                      <p className="text-3xl md:text-4xl font-black text-mat-wine italic">{sovereignMetrics.matches}</p>
                                      <p className="mat-text-label-pro text-mat-wine/40">Resonances</p>
                                   </div>
                                </div>

                                <div className="pt-8 border-t border-mat-wine/5 space-y-6">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-black uppercase tracking-widest text-mat-wine/60">Sovereign Tier</span>
                                      <Badge variant="sovereign">{getSovereignTier(sovereignMetrics.matches, sovereignMetrics.sessionSeconds).label}</Badge>
                                   </div>
                                </div>
                             </div>

                             <div className="flex flex-col gap-4">
                                <Button variant="gold" size="lg" onClick={onBeginDiscovery} className="w-full gap-4 group/btn">
                                   <Sparkles size={18} className="group-hover/btn:animate-pulse" /> Begin Sovereign Browsing
                                </Button>
                                <Button variant="default" size="lg" className="w-full gap-4"><ShieldCheck size={18} /> Seal Identity Private</Button>
                             </div>
                         </div>
                      )}

                      <div className="bento-span-3 bento-item bg-mat-obsidian text-mat-cream p-8 sm:p-12 flex flex-col justify-between h-auto min-h-[350px] md:h-[600px] shadow-2xl relative overflow-hidden">
                         <div className="space-y-10 relative z-10">
                            <div className="flex justify-between items-start">
                               <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10"><Flame size={28} className={cn(profile.consecutive_days ? "text-mat-rose" : "text-white/10")} /></div>
                               <Badge variant="outline" className="border-white/10 text-white/40 px-3 py-1 text-[8px] font-bold">Streak Ritual</Badge>
                            </div>
                            <div className="space-y-2">
                               <h3 className="text-7xl font-bold italic leading-tight text-white">{profile.consecutive_days || 0}</h3>
                               <p className="mat-text-label-pro text-white/20">Consecutive Dawns</p>
                            </div>
                            <div className="space-y-6 pt-10 border-t border-white/5 opacity-60">
                               {[
                                 { l: 'Daily Gift', v: '+10 Aura', s: true },
                                 { l: '7 Day Ritual', v: '+100 Aura', s: (profile.consecutive_days || 0) >= 7 },
                                 { l: '30 Day Covenant', v: '+1000 Aura', s: (profile.consecutive_days || 0) >= 30 }
                               ].map(r => (
                                 <div key={r.l} className={cn("flex justify-between items-center", r.s ? "opacity-100" : "opacity-20")}>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{r.l}</span>
                                    <span className="text-[10px] font-bold text-mat-gold italic">{r.v}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                         <Button variant="ghost" className="text-white/40 hover:bg-white/5 hover:text-white">View Streak History</Button>
                      </div>
                   </div>
                </TabsContent>

                {isMan && (
                  <TabsContent value="oracle" className="mt-0">
                     <div className="mat-glass-deep border-mat-rose/10 p-16 space-y-16 rounded-[4rem] shadow-mat-premium">
                        <div className="flex items-center justify-between border-b border-mat-rose/10 pb-10">
                           <div className="flex items-center gap-6">
                              <Activity size={24} className="text-mat-rose" />
                              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-mat-rose/60 leading-none">Identity Feedback Oracle</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                           <SignalMetric icon={Eye} label="Discovery Impressions" value={metrics.impression.toLocaleString()} sub="Frequency in Sanctuary" />
                           <SignalMetric icon={Users} label="The Profile Gaze" value={metrics.visit.toLocaleString()} sub="Deep Inspection Rate" />
                           <SignalMetric icon={Bookmark} label="Intentional Saves" value={metrics.save.toLocaleString()} sub="Shortlisted for Connection" />
                           <SignalMetric icon={Sparkles} label="Ascent Projection" value={`${((rankCount / getAuraTier(rankCount).next) * 100).toFixed(1)}%`} sub="Distance to Next Tier" />
                        </div>
                     </div>
                  </TabsContent>
                )}

                <TabsContent value="archive" className="mt-0">
                   <div className="mat-glass border-mat-rose/10 p-16 space-y-16 bg-mat-cream/40 rounded-[4rem]">
                      <div className="flex items-center gap-6 border-b border-mat-rose/10 pb-10">
                         <History className="text-mat-rose" size={24} />
                         <span className="text-[11px] font-black uppercase tracking-[0.6em] text-mat-rose/60 leading-none">The Sovereign Archive</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                         <DataPoint icon={Briefcase} label="Occupation" value={profile?.occupation} />
                         <DataPoint icon={GraduationCap} label="Academy" value={profile?.education} />
                         <DataPoint icon={Church} label="Religion" value={profile?.religion} />
                         <DataPoint icon={Globe} label="Current Sanctuary" value={profile?.city} />
                         <DataPoint icon={Heart} label="Vowed Intent" value={profile?.intent} />
                         <DataPoint icon={Activity} label="Identity Status" value={profile?.marital_status} />
                         <DataPoint icon={Languages} label="Origin Language" value={profile?.mother_tongue} />
                         <DataPoint icon={Flame} label="Lifestyle Habit" value={profile?.diet} />
                      </div>
                   </div>
                </TabsContent>
             </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
