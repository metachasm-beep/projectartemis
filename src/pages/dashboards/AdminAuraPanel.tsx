import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '@/services/admin';
import { Check, X, CreditCard, RefreshCw, Smartphone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/ui/cyber/SpotlightCard';

export const AdminAuraPanel: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getPendingAuraClaims();
      setClaims(data);
    } catch (err) {
      console.error("Ledger acquisition failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (claimId: string, approved: boolean) => {
    if (processingId) return;
    setProcessingId(claimId);
    
    try {
      const ok = await AdminService.resolveAuraClaim(claimId, approved);
      if (ok) {
        setClaims(prev => prev.filter(c => c.id !== claimId));
      } else {
        alert("TERMINAL ERROR: Judgment rejected by registry.");
      }
    } catch (err) {
      console.error("Transaction fault:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getTierBadge = (metadataStr: string) => {
    try {
       const meta = JSON.parse(metadataStr);
       const tier = meta.jump_type || 'nudge';
       if (tier === 'elite') return <Badge className="bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_#10b981]">ELITE LEAP</Badge>;
       if (tier === 'surge') return <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 text-[8px] font-black uppercase tracking-widest">SURGE LEAP</Badge>;
       return <Badge className="bg-white/5 text-slate-400 border border-white/10 text-[8px] font-black uppercase tracking-widest">NUDGE LEAP</Badge>;
    } catch (e) {
       return <Badge className="bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest">STANDARD</Badge>;
    }
  };

  return (
    <div className="space-y-12 min-h-[60vh] pb-20">
      <div className="flex justify-between items-center px-4 md:px-0">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-emerald-500/40" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Observer <span className="text-emerald-500/50">Tithe Ledger</span></h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/30 flex items-center gap-2 italic">
                <CreditCard size={10} className="text-emerald-500 animate-pulse" /> Verification of Incoming Identity Offsets
             </p>
          </div>
          <button 
            onClick={loadClaims}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all active:scale-90"
          >
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {claims.length > 0 ? (
            claims.map((claim, idx) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <SpotlightCard className="p-0 overflow-hidden border-emerald-500/10 bg-slate-900/40 group">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-emerald-500/10">
                    {/* User Info */}
                    <div className="p-10 md:w-1/3 bg-emerald-500/[0.02] flex items-center gap-8">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-2xl p-px bg-gradient-to-tr from-emerald-500/40 to-cyan-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                             <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-slate-950">
                                {claim.user_photos ? (
                                   <img 
                                     src={JSON.parse(claim.user_photos)[0]} 
                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-emerald-500 text-2xl font-black">
                                      {claim.user_name?.charAt(0)}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{claim.user_name}</h4>
                          <span className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em]">ID: {claim.user_id.slice(0,8)}...</span>
                       </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-10 flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 items-center bg-black/20">
                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Target Protocol</p>
                          <div className="flex items-center gap-2">
                             {getTierBadge(claim.metadata)}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Reference ID</p>
                          <div className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                             {claim.reference_id || 'TERMINAL_LINK'}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Aura Offset</p>
                          <div className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                             +{claim.amount.toLocaleString()}
                          </div>
                       </div>
                    </div>

                    {/* Action Block */}
                    <div className="p-10 bg-emerald-500/[0.01] flex items-center justify-center gap-4">
                       <button 
                         onClick={() => handleResolve(claim.id, false)}
                         disabled={!!processingId}
                         className="p-5 rounded-2xl bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                         title="Deny Tithe"
                       >
                          <X size={20} />
                       </button>
                       <button 
                         onClick={() => handleResolve(claim.id, true)}
                         disabled={!!processingId}
                         className="flex-1 md:flex-none px-10 py-5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95"
                       >
                          Authenticate
                       </button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.01] rounded-[3rem] border border-white/5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center text-emerald-500 animate-pulse">
                   <Smartphone size={32} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">No Pending Offsets</h3>
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">The Tithe ledger is synchronized and current.</p>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
