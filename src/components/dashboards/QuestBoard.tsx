import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ScrollText, 
  UserPlus, 
  ChevronRight,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { QuestService, Quest } from '@/services/questService';
import { cn } from '@/lib/utils';

export const QuestBoard: React.FC<{ refreshProfile: () => void }> = ({ refreshProfile }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const data = await QuestService.getQuests();
    setQuests(data);
    setLoading(false);
  };

  const handleClaim = async (questId: string) => {
    setClaimingId(questId);
    try {
      await QuestService.claimReward(questId);
      await fetchQuests();
      refreshProfile();
    } catch (err) {
      console.error("Claim failed:", err);
    } finally {
      setClaimingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'journal': return <ScrollText className="text-mat-gold" size={18} />;
      case 'profile': return <Sparkles className="text-mat-rose-gold" size={18} />;
      case 'daily_login': return <Clock className="text-mat-gold" size={18} />;
      default: return <Zap className="text-mat-gold" size={18} />;
    }
  };

  if (loading) return null;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Header with Aura Balance */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-2xl font-light text-mat-bone italic tracking-tight">Merit Board.</h3>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mt-1">The Path to Honor</p>
        </div>
        <div className="flex items-center gap-2 mat-glass-deep px-4 py-2 rounded-full border border-mat-gold/20">
           <span className="text-[10px] font-black uppercase text-mat-gold/60 tracking-widest">Aura:</span>
           <span className="text-lg font-black text-white italic leading-none flex items-center gap-1.5">
             <span className="text-mat-gold">🟡</span>
             {quests.reduce((acc, q) => acc + (q.status === 'completed' ? q.aura_reward : 0), 0) + 1240}
           </span>
        </div>
      </div>

      {/* Quest Grid */}
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group relative p-4 rounded-3xl border transition-all duration-500",
                quest.status === 'completed' 
                  ? "bg-white/[0.02] border-white/5 opacity-50" 
                  : "bg-white/[0.05] border-white/10 hover:border-mat-gold/30 hover:bg-white/[0.08]"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                  {getIcon(quest.objective_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-mat-bone tracking-wide">{quest.title}</h4>
                    {quest.is_daily && (
                      <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-mat-gold/10 text-mat-gold border border-mat-gold/20">
                        Daily
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    {quest.description}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {/* Progress Bar Label */}
                    <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-white/30">
                      <span>Standing Progress</span>
                      <span>{Math.round(quest.progress_pct)}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress_pct}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className={cn(
                          "h-full rounded-full transition-colors",
                          quest.progress_pct >= 100 ? "bg-mat-gold" : "bg-mat-gold/40"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward & Action Overlay */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-mat-gold">🟡</span>
                    <span className="text-[10px] font-bold text-white">+{quest.aura_reward}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                    <TrendingUp size={10} className="text-mat-rose-gold" />
                    <span className="text-[10px] font-bold text-white">+{quest.rank_reward} Rank</span>
                  </div>
                </div>

                {quest.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-mat-gold/40">
                    <CheckCircle2 size={14} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Claimed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaim(quest.id)}
                    disabled={quest.progress_pct < 100 || claimingId === quest.id}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                      quest.progress_pct >= 100 
                        ? "bg-mat-gold text-black shadow-mat-premium hover:scale-105 active:scale-95" 
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    )}
                  >
                    {claimingId === quest.id ? "Syncing..." : "Claim Merit"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Hint */}
      <div className="text-center">
        <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] italic">
          Higher standing attracts deeper resonance.
        </p>
      </div>
    </div>
  );
};
