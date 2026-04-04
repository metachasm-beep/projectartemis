import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Zap, 
  Camera, 
  ShieldCheck, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Church, 
  Languages, 
  Activity, 
  Flame,
  ArrowRight,
  TrendingUp,
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

const getAuraTier = (count: number = 0) => {
  if (count >= 50) return { label: 'Imperial Resonance', color: 'text-mat-gold' };
  if (count >= 20) return { label: 'High Sovereign', color: 'text-mat-wine' };
  if (count >= 10) return { label: 'Verified Initiate', color: 'text-mat-rose' };
  return { label: 'Rising Seeker', color: 'text-mat-slate/60' };
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
  <div className="p-8 rounded-[2rem] bg-white/40 border border-mat-rose/5 flex flex-col gap-4">
     <div className="flex justify-between items-start">
        <div className="p-3 bg-mat-wine/5 rounded-xl text-mat-wine"><Icon size={20} /></div>
        <Badge variant="outline" className="text-[8px] border-mat-rose/10 opacity-40">{sub}</Badge>
     </div>
     <div className="space-y-1">
        <p className="text-3xl font-black text-mat-wine italic">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-mat-slate/40">{label}</p>
     </div>
  </div>
);

export const ProfileDashboard: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [rankHistory, setRankHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (profile?.user_id) {
         const history = await SanctuaryService.getRankHistory(profile.user_id);
         setRankHistory(history || []);
      }
    };
    fetchHistory();
  }, [profile?.user_id]);

  if (!profile) return null;

  const handleVerify = async () => {
    const success = await SanctuaryService.rewardRank(profile.user_id, 100, "Seal of Truth: Identity Verified");
    if (success) {
       await refreshProfile();
       alert("Identity Sealed. Your Aura has ascended.");
    }
  };

  const isMan = profile.role === 'man';

  return (
    <div className="space-y-24">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <EditProfile profile={profile} onUpdate={() => { refreshProfile(); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-24">
             {/* ─── Hero Header ─── */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-mat-rose/10 pb-20">
                <div className="space-y-8 flex-1">
                   <div className="flex flex-wrap items-center gap-4">
                      <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[10px] uppercase tracking-[0.4em] rounded-full font-black">Personal Station</Badge>
                      <Badge variant="gold" className="px-5 py-2 text-[10px] uppercase tracking-[0.4em] font-black">{getAuraTier(profile?.rank_boost_count).label}</Badge>
                   </div>
                   <h1 className="text-8xl md:text-[10rem] font-bold text-mat-wine italic leading-none" style={{fontFamily: 'var(--font-display)'}}>
                      {profile?.full_name?.split(' ')[0]} <br />
                      <span className="text-mat-rose/10 -mt-6 block">{profile?.full_name?.split(' ').slice(1).join(' ') || 'Identifier'}</span>
                   </h1>
                </div>
                <div className="flex gap-4">
                   <Button onClick={() => setIsEditing(true)} className="h-20 px-12 bg-mat-wine text-mat-cream font-bold uppercase tracking-[0.4em] text-[12px] rounded-[2.5rem] hover:bg-mat-wine-soft shadow-mat-premium flex items-center gap-6 transition-all transform hover:scale-105">
                      <Camera size={24} /> Refine Narrative
                   </Button>
                </div>
             </div>

             {/* ─── Symmetrical Grid (Main Info) ─── */}
             <div className="bento-grid gap-10">
                <div className="bento-span-4 bento-item mat-glass-deep p-0 overflow-hidden h-[540px] shadow-mat-premium border-mat-rose/10">
                   <img src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} alt="" className="w-full h-full object-cover grayscale sepia-[0.1] hover:sepia-0 transition-all duration-1000" />
                </div>

                {isMan ? (
                   /* ─── Aura Ascent Checklist (Man Only) ─── */
                   <div className="bento-span-4 bento-item mat-glass border-mat-rose/10 p-12 flex flex-col justify-between h-[540px]">
                      <div className="space-y-8">
                         <div className="space-y-2">
                            <h3 className="text-4xl font-bold italic text-mat-wine leading-tight">Aura <br /><span className="text-mat-gold">Ascent.</span></h3>
                            <p className="mat-text-label-pro text-[9px] opacity-40">Tasks to augment your sanctuary resonance</p>
                         </div>
                         
                         <div className="space-y-5">
                            {[
                              { label: 'Seal Identity (Verify)', done: !!profile.is_verified, val: '+100 Aura' },
                              { label: 'Narrative Portrait', done: (profile.photos?.length || 0) > 0, val: '+50 Aura' },
                              { label: 'Refine Intent', done: !!profile.intent, val: '+20 Aura' },
                              { label: 'Academy / Occupation', done: !!profile.education && !!profile.occupation, val: '+30 Aura' }
                            ].map((task, i) => (
                              <div key={i} className={cn("flex justify-between items-center p-4 rounded-2xl border transition-all", task.done ? "bg-mat-wine/5 border-mat-rose/10 opacity-40" : "bg-white border-mat-rose/5 hover:border-mat-rose/20")}>
                                 <div className="flex items-center gap-4">
                                    {task.done ? <CheckCircle2 className="text-mat-rose" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-mat-fog" />}
                                    <span className="text-[11px] font-bold text-mat-wine uppercase tracking-widest">{task.label}</span>
                                 </div>
                                 <span className="text-[9px] font-black text-mat-gold italic">{task.val}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                      {!profile.is_verified && (
                        <Button onClick={handleVerify} className="w-full h-16 bg-mat-gold text-mat-wine rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">Begin Verification Protocol</Button>
                      )}
                   </div>
                ) : (
                   /* ─── Resonance Streak (Woman View) ─── */
                   <div className="bento-span-4 bento-item bg-mat-wine text-mat-cream p-12 flex flex-col justify-between h-[540px] shadow-mat-premium">
                      <div className="space-y-8">
                         <div className="flex justify-between items-start">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center"><Sparkles size={24} className="text-mat-gold" /></div>
                            <Badge variant="outline" className="border-white/20 text-white px-4 py-2 uppercase tracking-widest text-[9px] font-black">Sovereign</Badge>
                         </div>
                         <h3 className="text-5xl font-bold italic leading-tight text-mat-cream">Resonance <br /><span className="text-mat-gold/60">Flow.</span></h3>
                         <div className="space-y-6 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4">
                               <Flame className={cn("w-6 h-6", profile?.consecutive_days ? "text-mat-rose" : "text-white/10")} />
                               <p className="text-xl font-bold text-mat-cream italic">{profile?.consecutive_days || 0} Consecutive Days</p>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                <div className="bento-span-4 bento-item mat-glass border-mat-rose/10 flex flex-col justify-between h-[540px] p-12">
                   <div className="space-y-6">
                      <TrendingUp className="text-mat-rose" size={28} />
                      <h4 className="text-2xl font-bold italic text-mat-wine uppercase tracking-widest">Aura Ledger</h4>
                   </div>
                   <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar py-6">
                      {rankHistory.length === 0 ? (
                        <p className="text-[10px] text-mat-slate/40 italic">No resonance events recorded.</p>
                      ) : (
                        rankHistory.map((log) => (
                          <div key={log.id} className="flex justify-between items-center border-b border-mat-rose/5 pb-3">
                             <div>
                                <p className="text-[10px] font-black text-mat-wine uppercase tracking-widest leading-none">{log.reason}</p>
                                <p className="text-[8px] text-mat-slate/40 mt-2">{new Date(log.created_at).toLocaleDateString()}</p>
                             </div>
                             <span className="text-xs font-black text-mat-rose">+{log.delta}</span>
                          </div>
                        ))
                      )}
                   </div>
                </div>

                {/* ─── Sanctuary Signals (Visibility Analytics - Man Only) ─── */}
                {isMan && (
                  <div className="bento-span-12 bento-item mat-glass-deep border-mat-rose/10 p-16 space-y-12 shadow-mat-rose/5 transform hover:scale-[1.01] transition-transform">
                     <div className="flex items-center gap-5 border-b border-mat-rose/10 pb-8 uppercase text-xs font-black tracking-[0.5em] text-mat-rose/60">
                        <Activity size={24} className="text-mat-rose" /> Sanctuary Feedback Signals
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <SignalMetric icon={Eye} label="Impressions" value="1,240" sub="Top 15%" />
                        <SignalMetric icon={Users} label="Profile Gaze" value="86" sub="Last 7 Days" />
                        <SignalMetric icon={Bookmark} label="Identity Saves" value="12" sub="Intentional" />
                        <SignalMetric icon={Sparkles} label="Aura Score" value={(profile.rank_boost_count * 12 + 150).toLocaleString()} sub="Growth +12%" />
                     </div>
                  </div>
                )}

                {/* Identity Archive */}
                <div className="bento-span-12 bento-item mat-glass border-mat-rose/10 p-16 space-y-16">
                   <div className="flex items-center gap-5 border-b border-mat-rose/10 pb-8 uppercase text-xs font-black tracking-[0.5em] text-mat-rose/60">
                      <Archive className="text-mat-rose" size={24} /> Identity Archive
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                      <DataPoint icon={Briefcase} label="Occupation" value={profile?.occupation} />
                      <DataPoint icon={GraduationCap} label="Academy" value={profile?.education} />
                      <DataPoint icon={Church} label="Religion" value={profile?.religion} />
                      <DataPoint icon={Globe} label="Sanctuary" value={profile?.city} />
                      <DataPoint icon={Heart} label="Intent" value={profile?.intent} />
                      <DataPoint icon={Activity} label="Status" value={profile?.marital_status} />
                      <DataPoint icon={Languages} label="Language" value={profile?.mother_tongue} />
                      <DataPoint icon={Sparkles} label="Diet" value={profile?.diet} />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Archive = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);
