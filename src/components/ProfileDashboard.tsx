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
  ArrowRight,
  History,
  CheckCircle2,
  Eye,
  Bookmark,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditProfile } from '@/components/EditProfile';
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { cn } from '@/lib/utils';

// 💎 Aura Progress Ring: Visualizing status ascent
const AuraProgressRing = ({ current, max, label }: { current: number, max: number, label: string }) => {
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
          className="text-mat-gold" 
        />
      </svg>
      <div className="absolute flex flex-col items-center">
         <span className="text-3xl font-black text-mat-wine italic">{current}</span>
         <span className="text-[8px] font-black uppercase tracking-widest text-mat-slate/40">{label}</span>
      </div>
    </div>
  );
};

// 📈 Signal Sparkline: Visualizing visibility trends
const SignalSparkline = ({ data }: { data: number[] }) => {
  const points = data.map((d, i) => `${i * 10},${40 - (d / Math.max(...data, 1)) * 30}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" className="w-20 h-8 text-mat-rose/30 overflow-visible">
      <motion.polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
    </svg>
  );
};

const getAuraTier = (count: number = 0) => {
  if (count >= 500) return { label: 'Imperial Sovereign', next: 1000, color: 'text-mat-gold' };
  if (count >= 200) return { label: 'Grand Initiate', next: 500, color: 'text-mat-wine' };
  if (count >= 50) return { label: 'Verified Seeker', next: 200, color: 'text-mat-rose' };
  return { label: 'Rising Aspirant', next: 50, color: 'text-mat-slate/60' };
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

const SignalMetric = ({ icon: Icon, label, value, sub, trend }: { icon: any, label: string, value: string, sub: string, trend?: number[] }) => (
  <div className="p-8 rounded-[3rem] bg-white border border-mat-rose/5 shadow-sm hover:shadow-mat-premium transition-all group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-mat-wine/5 rounded-2xl text-mat-wine group-hover:bg-mat-wine group-hover:text-white transition-colors"><Icon size={20} /></div>
        {trend && <SignalSparkline data={trend} />}
     </div>
     <div className="space-y-1">
        <p className="text-4xl font-black text-mat-wine italic">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-slate/40">{label}</p>
        <p className="text-[8px] font-bold text-mat-rose/60 mt-3">{sub}</p>
     </div>
  </div>
);

export const ProfileDashboard: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState({ impression: 0, visit: 0, save: 0 });

  useEffect(() => {
    const init = async () => {
      if (profile?.user_id) {
         const sigs = await SanctuaryService.getSignalMetrics(profile.user_id);
         setMetrics({
           impression: Number(sigs.impression || 0),
           visit: Number(sigs.visit || 0),
           save: Number(sigs.save || 0)
         });
      }
    };
    init();
  }, [profile?.user_id]);

  if (!profile) return null;

  const handleVerify = async () => {
    if (!profile?.user_id) return;
    const success = await SanctuaryService.rewardRank(profile.user_id, 100, "Seal of Truth: Identity Verified");
    if (success) {
       await refreshProfile();
       alert("Identity Sealed. Your Aura has ascended.");
    }
  };

  const rankCount = profile.rank_boost_count || 0;
  const tier = getAuraTier(rankCount);

  return (
    <div className="space-y-24 pb-20">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <EditProfile profile={profile} onUpdate={() => { refreshProfile(); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-24">
             {/* ─── Hero Header ─── */}
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-mat-rose/10 pb-20">
                <div className="space-y-8 flex-1">
                   <div className="flex flex-wrap items-center gap-4">
                      <Badge variant="outline" className="px-6 py-2 border-mat-rose/20 text-mat-wine text-[10px] uppercase tracking-[0.4em] rounded-full font-black">Personal Sanctuary // Station</Badge>
                      <Badge variant="gold" className="px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black">{tier.label}</Badge>
                   </div>
                   <h1 className="text-8xl md:text-[12rem] font-bold text-mat-wine italic leading-[0.8]" style={{fontFamily: 'var(--font-display)'}}>
                      {profile?.full_name?.split(' ')[0]} <br />
                      <span className="text-mat-rose/10 -mt-8 block">{profile?.full_name?.split(' ').slice(1).join(' ') || 'Identifier'}</span>
                   </h1>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                   <div className="px-10 py-8 mat-glass-deep rounded-[3rem] border-mat-rose/10 flex items-center gap-8 shadow-mat-premium">
                      <AuraProgressRing current={rankCount} max={tier.next} label="AURA POWER" />
                      <div className="space-y-2">
                         <p className="text-[10px] font-black uppercase tracking-widest text-mat-gold italic">Next Ascent</p>
                         <h5 className="text-xl font-bold text-mat-wine italic">{tier.label === 'Rising Aspirant' ? 'Verified Seeker' : tier.label === 'Verified Seeker' ? 'Grand Initiate' : 'Imperial Sovereign'}</h5>
                         <div className="h-1 bg-mat-fog rounded-full w-32 overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${(rankCount / tier.next) * 100}%` }} 
                               className="h-full bg-mat-gold" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* ─── Symmetrical Grid (Main Info) ─── */}
             <div className="bento-grid gap-12">
                {/* Profile Portrait */}
                <div className="bento-span-4 bento-item mat-glass-deep p-0 overflow-hidden h-[600px] shadow-mat-premium border-mat-rose/10 group">
                   <img src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} alt="" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/40 to-transparent pointer-events-none" />
                   <Button onClick={() => setIsEditing(true)} className="absolute bottom-8 left-8 right-8 h-18 rounded-[2rem] bg-white/90 backdrop-blur-xl border border-mat-rose/20 text-mat-wine font-black uppercase tracking-widest text-[11px] hover:bg-white shadow-xl flex items-center justify-center gap-4">
                      <Camera size={18} /> Update Narrative
                   </Button>
                </div>

                {/* Aura Ascent Protocol */}
                <div className="bento-span-5 bento-item mat-glass border-mat-rose/10 p-14 flex flex-col justify-between h-[600px]">
                   <div className="space-y-10">
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <Zap className="text-mat-gold" size={24} />
                            <h3 className="text-4xl font-bold italic text-mat-wine leading-tight">Identity <br /><span className="text-mat-gold/60">Ascension.</span></h3>
                         </div>
                         <p className="mat-text-label-pro text-[10px] opacity-40">Architectural tasks to augment your resonance</p>
                      </div>
                      
                      <div className="space-y-6">
                         {[
                           { label: 'Seal Identity (Verify)', done: !!profile.is_verified, val: '+100 Aura', link: 'VERIFY' },
                           { label: 'Narrative Portrait', done: (profile.photos?.length || 0) > 0, val: '+50 Aura', link: 'PHOTO' },
                           { label: 'Roots & Academy', done: !!profile.education && !!profile.city, val: '+30 Aura', link: 'BASICS' },
                           { label: '30-Day Devotion', done: (profile.consecutive_days || 0) >= 30, val: '+1000 Aura', link: 'REWARDS' }
                         ].map((task, i) => (
                           <button 
                              key={i} 
                              onClick={() => { if (!task.done) setIsEditing(true); }}
                              className={cn(
                                 "w-full flex justify-between items-center p-6 rounded-3xl border transition-all active:scale-[0.98]", 
                                 task.done ? "bg-mat-wine/5 border-mat-rose/10 opacity-30" : "bg-white border-mat-rose/5 hover:border-mat-gold/30 hover:shadow-lg"
                              )}
                           >
                              <div className="flex items-center gap-6">
                                 <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", task.done ? "bg-mat-rose/10 text-mat-rose" : "bg-mat-fog/30 text-mat-slate/40")}>
                                    {task.done ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                                 </div>
                                 <div className="text-left">
                                    <span className="text-[12px] font-black text-mat-wine uppercase tracking-[0.2em] block leading-none">{task.label}</span>
                                    {!task.done && <span className="text-[8px] font-bold text-mat-gold uppercase tracking-widest mt-1 inline-block">Pending Resonance</span>}
                                 </div>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-[10px] font-black text-mat-gold italic">{task.val}</span>
                                 <ArrowRight size={14} className="text-mat-rose/20" />
                              </div>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Presence Rewards Table */}
                <div className="bento-span-3 bento-item bg-mat-obsidian text-mat-cream p-12 flex flex-col justify-between h-[600px] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-mat-gold/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                   
                   <div className="space-y-10 relative z-10">
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10"><Flame size={28} className="text-mat-rose" /></div>
                         <Badge variant="outline" className="border-white/10 text-white/40 px-3 py-1 uppercase tracking-widest text-[8px] font-bold">Resonance Streak</Badge>
                      </div>
                      
                      <div className="space-y-2">
                         <h3 className="text-5xl font-bold italic leading-tight text-white">{profile.consecutive_days || 0}</h3>
                         <p className="mat-text-label-pro text-white/20">Consecutive Dawns</p>
                      </div>

                      <div className="space-y-6 pt-10 border-t border-white/5">
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
                   
                   <Button variant="outline" className="w-full h-16 bg-transparent border-white/10 text-white/60 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-white/5">View History</Button>
                </div>

                {/* ─── Sanctuary Signals (Analytical Feedback) ─── */}
                <div className="bento-span-12 bento-item mat-glass-deep border-mat-rose/10 p-16 space-y-16 shadow-mat-premium">
                   <div className="flex items-center justify-between border-b border-mat-rose/10 pb-10">
                      <div className="flex items-center gap-6">
                         <Activity size={24} className="text-mat-rose" />
                         <span className="text-[11px] font-black uppercase tracking-[0.6em] text-mat-rose/60 leading-none">Identity Feedback Signals</span>
                      </div>
                      <Badge variant="outline" className="border-mat-rose/10 text-[9px] opacity-40 px-4 py-1 italic uppercase font-black">Archive updated 2m ago</Badge>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                      <SignalMetric 
                         icon={Eye} 
                         label="Discovery Impressions" 
                         value={metrics.impression.toLocaleString()} 
                         sub="Frequency in Sanctuary" 
                         trend={[10, 40, 20, 80, 50, 90, 120]} 
                      />
                      <SignalMetric 
                         icon={Users} 
                         label="The Profile Gaze" 
                         value={metrics.visit.toLocaleString()} 
                         sub="Deep Inspection Rate" 
                         trend={[5, 12, 8, 24, 15, 36, 42]} 
                      />
                      <SignalMetric 
                         icon={Bookmark} 
                         label="Intentional Saves" 
                         value={metrics.save.toLocaleString()} 
                         sub="Shortlisted for Connection" 
                         trend={[0, 2, 1, 4, 3, 6, 8]} 
                      />
                      <SignalMetric 
                         icon={Sparkles} 
                         label="Ascent Projection" 
                         value={`${((rankCount / tier.next) * 100).toFixed(1)}%`} 
                         sub="Distance to Next Tier" 
                         trend={[1, 5, 8, 12, 15, 22, 28]} 
                      />
                   </div>
                </div>

                {/* Identity Ledger / Archive Details */}
                <div className="bento-span-12 bento-item mat-glass border-mat-rose/10 p-16 space-y-16 bg-mat-cream/40">
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
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
