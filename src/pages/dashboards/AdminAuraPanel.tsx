import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '@/services/admin';
import { Check, X, RefreshCw, Terminal, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
        alert("TERMINAL ERROR: Registry rejected packet.");
      }
    } catch (err) {
      console.error("Transmission fault:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getTierBadge = (metadataStr: string) => {
    try {
       const meta = JSON.parse(metadataStr);
       const tier = meta.jump_type || 'nudge';
       if (tier === 'elite') return <Badge className="bg-purple-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(168,85,247,0.4)]">ELITE_LINK</Badge>;
       if (tier === 'surge') return <Badge className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 text-[8px] font-mono font-black uppercase tracking-[0.2em]">SURGE_LINK</Badge>;
       return <Badge className="bg-white/5 text-white/40 border border-white/10 text-[8px] font-mono font-black uppercase tracking-[0.2em]">NUDGE_LINK</Badge>;
    } catch (e) {
       return <Badge className="bg-white/5 text-white/40 text-[8px] font-mono font-black uppercase tracking-[0.2em]">STND_LINK</Badge>;
    }
  };

  return (
    <div className="space-y-12 min-h-[60vh] pb-24 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-white/5 pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7] animate-pulse" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">NETWORK <span className="text-purple-500">TITHE_LEDGER</span></h2>
             </div>
             <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Terminal size={12} className="text-cyan-500" /> IDENTITY_OFFSET_VERIFICATION_STREAM
             </p>
          </div>
          <button 
            onClick={loadClaims}
            className="w-14 h-14 rounded-xl bg-black border border-white/10 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {claims.length > 0 ? (
            claims.map((claim, idx) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, scale: 0.98, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
              >
                <div className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden shadow-2xl group hover:border-purple-500/40 transition-colors duration-500">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                    {/* Source Node */}
                    <div className="p-8 md:w-1/3 bg-white/[0.01] flex items-center gap-8">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-xl p-0.5 bg-gradient-to-tr from-purple-500/40 to-cyan-500/40 shadow-inner">
                             <div className="w-full h-full rounded-[0.6rem] overflow-hidden bg-black">
                                {claim.user_photos ? (
                                   <img 
                                     src={JSON.parse(claim.user_photos)[0]} 
                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-purple-500 text-2xl font-black">
                                      {claim.user_name?.charAt(0)}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-purple-400 transition-colors">{claim.user_name}</h4>
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.25em]">NODE_REF: {claim.user_id.slice(0,12)}</span>
                       </div>
                    </div>

                    {/* Packet Payload */}
                    <div className="p-8 flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 items-center bg-black/40">
                       <div className="space-y-2">
                          <p className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Access_Tier</p>
                          <div className="flex items-center gap-2">
                             {getTierBadge(claim.metadata)}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Security_Hash</p>
                          <div className="text-[10px] font-mono font-bold text-cyan-500 tracking-wider uppercase">
                             {claim.reference_id || 'U_TX_LINK'}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Aura_Expansion</p>
                          <div className="text-3xl font-mono font-black text-white leading-none tabular-nums group-hover:text-purple-500 transition-colors">
                             +{claim.amount.toLocaleString()}
                          </div>
                       </div>
                    </div>

                    {/* Protocol Action */}
                    <div className="p-8 bg-white/[0.02] flex items-center justify-center gap-4">
                       <button 
                         onClick={() => handleResolve(claim.id, false)}
                         disabled={!!processingId}
                         className="p-4 rounded-xl bg-white/5 text-white/20 hover:bg-red-600/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                         title="Reject_Packet"
                       >
                          <X size={20} />
                       </button>
                       <button 
                         onClick={() => handleResolve(claim.id, true)}
                         disabled={!!processingId}
                         className="flex-1 md:flex-none px-10 py-4 bg-purple-600 text-white rounded-xl font-black text-[10px] font-mono tracking-[0.4em] uppercase hover:bg-black hover:text-purple-500 hover:border-purple-500/40 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95"
                       >
                          AUTHENTICATE
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-black/40 rounded-3xl border border-white/5 opacity-60">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-500">
                   <Activity size={32} strokeWidth={1} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter text-purple-500">MATRIX_SYNCED</h3>
                   <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.3em]">ALL_PENDING_TX_RESOLVED_IN_REGISTRY.</p>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
