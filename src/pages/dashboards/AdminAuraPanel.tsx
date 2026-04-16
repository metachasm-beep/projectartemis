import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '@/services/admin';
import { Check, X, CreditCard, Clock, MapPin, User, Search, RefreshCw, Smartphone } from 'lucide-react';
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
        alert("JUDGMENT FAILED: The ledger uplink rejected the transaction.");
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
       if (tier === 'elite') return <Badge className="bg-mat-gold text-mat-obsidian text-[8px] font-black uppercase tracking-widest">ELITE LEAP</Badge>;
       if (tier === 'surge') return <Badge className="bg-mat-wine text-white text-[8px] font-black uppercase tracking-widest">SURGE LEAP</Badge>;
       return <Badge className="bg-mat-rose text-white text-[8px] font-black uppercase tracking-widest">NUDGE LEAP</Badge>;
    } catch (e) {
       return <Badge className="bg-mat-slate text-white text-[8px] font-black uppercase tracking-widest">STANDARD</Badge>;
    }
  };

  return (
    <div className="space-y-8 min-h-[60vh]">
      <div className="flex justify-between items-center px-4 md:px-0">
         <div className="space-y-1">
            <h2 className="text-2xl font-light text-mat-wine">Sovereign <span className="italic text-mat-rose/50">Tithe Ledger</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-slate/70 flex items-center gap-2">
               <CreditCard size={10} className="text-mat-rose" /> Verification of Incoming Identity Offsets
            </p>
         </div>
         <button 
           onClick={loadClaims}
           className="p-3 rounded-2xl bg-white/5 border border-mat-rose/10 text-mat-rose hover:bg-mat-rose hover:text-white transition-all active:scale-95"
         >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
         </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {claims.length > 0 ? (
            claims.map((claim, idx) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <SpotlightCard className="p-0 overflow-hidden border-mat-rose/10 group">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-mat-rose/5">
                    {/* User Info */}
                    <div className="p-6 md:w-1/3 bg-mat-rose/[0.02] flex items-center gap-6">
                       <div className="relative">
                          <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-mat-rose/20 to-mat-gold/20">
                             <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-mat-cream">
                                {claim.user_photos ? (
                                   <img 
                                     src={JSON.parse(claim.user_photos)[0]} 
                                     className="w-full h-full object-cover" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-mat-wine text-2xl font-black">
                                      {claim.full_name?.[0] || '?'}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h3 className="font-bold text-mat-wine italic tracking-tight">{claim.full_name}</h3>
                          <div className="flex flex-col gap-0.5">
                             <span className="text-[9px] text-mat-slate/70 flex items-center gap-1.5 uppercase font-black tracking-widest">
                                <MapPin size={8} /> {claim.user_city || 'PARTS_UNKNOWN'}
                             </span>
                             <span className="text-[7px] text-mat-wine/70 font-mono ring-1 ring-mat-wine/20 px-1.5 py-0.5 rounded self-start">
                                ID: {claim.user_id.split('-').pop()}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-mat-slate/30 uppercase tracking-[0.3em] mb-1">Submitted UTR</span>
                             <div className="text-2xl font-black font-mono tracking-tighter text-mat-wine flex items-center gap-3">
                                {claim.submitted_utr}
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-[8px] font-black tracking-[0.2em]">ACTUAL_PAYMENT</Badge>
                             </div>
                          </div>
                          <div className="text-right">
                             {getTierBadge(claim.metadata)}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6 pt-2">
                           <div className="flex items-center gap-2 text-mat-slate/70">
                              <Clock size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                 {new Date(claim.created_at).toLocaleDateString()} at {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                           <div className="flex items-center gap-2 text-mat-wine/70">
                              <Smartphone size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Unified Payments Interface</span>
                           </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 md:w-48 bg-mat-wine/[0.02] flex md:flex-col items-center justify-center gap-4">
                       <button
                         onClick={() => handleResolve(claim.id, true)}
                         disabled={!!processingId}
                         className="flex-1 md:w-full h-12 rounded-xl bg-green-500 text-white flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                       >
                          {processingId === claim.id ? <RefreshCw size={14} className="animate-spin" /> : <Check size={16} />}
                          Approve
                       </button>
                       <button
                         onClick={() => handleResolve(claim.id, false)}
                         disabled={!!processingId}
                         className="flex-1 md:w-full h-12 rounded-xl bg-mat-rose/10 text-mat-rose border border-mat-rose/20 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-mat-rose hover:text-white transition-all active:scale-95 disabled:opacity-50"
                       >
                          {processingId === claim.id ? <RefreshCw size={14} className="animate-spin" /> : <X size={16} />}
                          Reject
                       </button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))
          ) : !loading && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-mat-rose/10 rounded-[2.5rem] bg-mat-rose/[0.01]"
            >
               <CreditCard size={48} className="text-mat-rose/20 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-slate/70">Registry Clear: No Pending Tithes.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
