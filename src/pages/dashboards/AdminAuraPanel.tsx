import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '@/services/admin';
import { Check, X, CreditCard, RefreshCw, Smartphone } from 'lucide-react';
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
        alert("ARCHIVE ERROR: Registry refused the transaction.");
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
       if (tier === 'elite') return <Badge className="bg-[#D4AF37] text-white text-[8px] font-black uppercase tracking-widest shadow-md">ELITE LEAP</Badge>;
       if (tier === 'surge') return <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[8px] font-black uppercase tracking-widest">SURGE LEAP</Badge>;
       return <Badge className="bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border border-[#1A1A1A]/10 text-[8px] font-black uppercase tracking-widest">NUDGE LEAP</Badge>;
    } catch (e) {
       return <Badge className="bg-[#1A1A1A]/5 text-[#1A1A1A]/40 text-[8px] font-black uppercase tracking-widest">STANDARD</Badge>;
    }
  };

  return (
    <div className="space-y-16 min-h-[60vh] pb-24 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-[#D4AF37]/10 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#D4AF37]" />
                <h2 className="text-4xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter">Spectral <span className="text-[#D4AF37]">Tithe Ledger</span></h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/30 flex items-center gap-2 italic">
                <CreditCard size={12} className="text-[#D4AF37]" /> Verification of Incoming Identity Offsets
             </p>
          </div>
          <button 
            onClick={loadClaims}
            className="p-5 rounded-full bg-white border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid gap-10">
        <AnimatePresence mode="popLayout">
          {claims.length > 0 ? (
            claims.map((claim, idx) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
              >
                <div className="bg-white border border-[#D4AF37]/10 rounded-[3rem] overflow-hidden shadow-[0_15px_40px_rgba(212,175,55,0.05)] group">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/10">
                    {/* User Info */}
                    <div className="p-12 md:w-1/3 bg-[#D4AF37]/[0.02] flex items-center gap-10">
                       <div className="relative">
                          <div className="w-24 h-24 rounded-[2.5rem] p-px bg-gradient-to-tr from-[#D4AF37]/60 to-[#BFA06A]/60 shadow-[0_10px_20px_rgba(212,175,55,0.15)]">
                             <div className="w-full h-full rounded-[2.4rem] overflow-hidden bg-white">
                                {claim.user_photos ? (
                                   <img 
                                     src={JSON.parse(claim.user_photos)[0]} 
                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-3xl font-black">
                                      {claim.user_name?.charAt(0)}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-2xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter">{claim.user_name}</h4>
                          <span className="text-[10px] font-black text-[#1A1A1A]/20 uppercase tracking-[0.2em]">ID: {claim.user_id.slice(0,10)}</span>
                       </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-12 flex-1 grid grid-cols-2 lg:grid-cols-3 gap-10 items-center">
                       <div className="space-y-3">
                          <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-[0.4em] italic leading-none">Protocol Tier</p>
                          <div className="flex items-center gap-2">
                             {getTierBadge(claim.metadata)}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-[0.4em] italic leading-none">Master Key</p>
                          <div className="text-xs font-royal font-bold text-[#1A1A1A] tracking-widest uppercase">
                             {claim.reference_id || 'TERMINAL_LINK'}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-[0.4em] italic leading-none">Registry Offset</p>
                          <div className="text-4xl font-royal font-black text-[#D4AF37] leading-none tabular-nums">
                             +{claim.amount.toLocaleString()}
                          </div>
                       </div>
                    </div>

                    {/* Action Block */}
                    <div className="p-12 bg-[#D4AF37]/[0.01] flex items-center justify-center gap-4">
                       <button 
                         onClick={() => handleResolve(claim.id, false)}
                         disabled={!!processingId}
                         className="p-6 rounded-[1.5rem] bg-[#1A1A1A]/5 text-[#1A1A1A]/20 hover:bg-red-50 hover:text-red-400 transition-all shadow-sm"
                         title="Deny Tithe"
                       >
                          <X size={24} />
                       </button>
                       <button 
                         onClick={() => handleResolve(claim.id, true)}
                         disabled={!!processingId}
                         className="flex-1 md:flex-none px-12 py-6 bg-[#D4AF37] text-white rounded-[1.5rem] font-black text-[11px] tracking-[0.4em] uppercase hover:bg-[#BFA06A] transition-all shadow-xl active:scale-95"
                       >
                          Authenticate
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/40 rounded-[4rem] border border-[#D4AF37]/10 opacity-60">
                <div className="w-24 h-24 rounded-full bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
                   <Smartphone size={40} strokeWidth={1} />
                </div>
                <div className="space-y-3">
                   <h3 className="text-2xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter">Archive Synchronized</h3>
                   <p className="text-[10px] font-black text-[#1A1A1A]/40 uppercase tracking-[0.3em]">The Tithe ledger is current and authenticated.</p>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
