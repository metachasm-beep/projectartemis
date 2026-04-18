import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '@/services/admin';
import { Check, X, RefreshCw, Zap, Activity, Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      console.error("Archive retrieval failed:", err);
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
        alert("ARCHIVE SYSTEM REJECTION: Ledger synchronization failed.");
      }
    } catch (err) {
      console.error("Data transmission fault:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getTierBadge = (metadataStr: string) => {
    try {
       const meta = JSON.parse(metadataStr);
       const tier = meta.jump_type || 'nudge';
       if (tier === 'elite') return <Badge className="bg-slate-900 text-white text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg">ELITE_LINK</Badge>;
       if (tier === 'surge') return <Badge className="bg-slate-100 text-slate-500 border border-slate-200 text-[8px] font-bold uppercase tracking-[0.2em]">SURGE_LINK</Badge>;
       return <Badge className="bg-black/[0.02] text-slate-400 border border-black/[0.03] text-[8px] font-bold uppercase tracking-[0.2em]">NUDGE_LINK</Badge>;
    } catch (e) {
       return <Badge className="bg-black/[0.02] text-slate-300 text-[8px] font-bold uppercase tracking-[0.2em]">PRTCL_LINK</Badge>;
    }
  };

  return (
    <div className="space-y-12 min-h-[60vh] pb-24 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-black/[0.03] pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <h2 className="text-3xl font-bold text-slate-900 uppercase italic tracking-tighter">TITHE <span className="font-light text-slate-400">LEDGER</span></h2>
             </div>
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Fingerprint size={12} className="text-slate-400" /> Registry Verification Stream
             </p>
          </div>
          <button 
            onClick={loadClaims}
            className="w-14 h-14 rounded-[2rem] bg-white border border-black/[0.03] text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90"
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
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <div className="bg-white border border-black/[0.02] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.03)] group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-black/[0.02]">
                    {/* Identity Data */}
                    <div className="p-10 md:w-1/3 bg-black/[0.01] flex items-center gap-8">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-[1.75rem] p-0.5 bg-slate-50 shadow-inner">
                             <div className="w-full h-full rounded-[1.6rem] overflow-hidden bg-slate-100">
                                {claim.user_photos ? (
                                   <img 
                                     src={(() => {
                                       try {
                                         const p = typeof claim.user_photos === 'string' ? JSON.parse(claim.user_photos) : claim.user_photos;
                                         return Array.isArray(p) ? p[0] : p;
                                       } catch (e) {
                                         return `https://api.dicebear.com/7.x/avataaars/svg?seed=${claim.user_id}`;
                                       }
                                     })()} 
                                     className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl font-bold">
                                      {claim.user_name?.charAt(0)}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-0.5">
                          <h4 className="text-xl font-bold text-slate-900 uppercase italic tracking-tighter group-hover:text-slate-900 transition-colors">{claim.user_name}</h4>
                          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.25em]">ID: {claim.user_id.slice(0,12)}</span>
                       </div>
                    </div>

                    {/* Transaction Payload */}
                    <div className="p-10 flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 items-center bg-white">
                       <div className="space-y-2">
                          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em] italic leading-none">Access Grade</p>
                          <div className="flex items-center gap-2">
                             {getTierBadge(claim.metadata)}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em] italic leading-none">Security Pin</p>
                          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                             {claim.reference_id || 'REGISTERED'}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em] italic leading-none">Aura Expansion</p>
                          <div className="text-3xl font-bold text-slate-900 leading-none tabular-nums tracking-tighter">
                             +{(claim.amount || 0).toLocaleString()}
                          </div>
                       </div>
                    </div>

                    {/* Protocol Execution */}
                     <div className="p-10 bg-black/[0.01] flex items-center justify-center gap-4">
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <button 
                                   onClick={() => handleResolve(claim.id, false)}
                                   disabled={!!processingId}
                                   className="p-5 rounded-2xl bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-black/[0.02]"
                                 >
                                    <X size={20} strokeWidth={1.5} />
                                 </button>
                              </TooltipTrigger>
                              <TooltipContent>Reject Ledger Entry</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <button 
                                   onClick={() => handleResolve(claim.id, true)}
                                   disabled={!!processingId}
                                   className="flex-1 md:flex-none px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                                 >
                                    VERIFY RECORD
                                 </button>
                              </TooltipTrigger>
                              <TooltipContent>Authorize & Sync Ledger</TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[3rem] border border-black/[0.02] shadow-sm opacity-60">
                <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 flex items-center justify-center text-slate-200">
                   <Activity size={32} strokeWidth={1} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tighter">ARCHIVE_CURRENT</h3>
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">ALL_PENDING_IDENTITY_OFFSETS_AUTHENTICATED.</p>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
