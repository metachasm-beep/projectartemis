import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Tag, Clock, ChevronDown, IndianRupee, Users, TrendingUp, Loader2, Copy, CheckCircle2, Sparkles, User, Star } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { EditProfile } from '@/components/EditProfile';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InfluencerStats {
  total_referrals: number;
  total_sales: number;
  total_commission: number;
}

interface CouponInfo {
  code: string;
  discount_pct: number;
}

interface Transaction {
  id: string;
  redacted_user: string;
  original_amount: number;
  discounted_amount: number;
  commission_earned: number;
  approved_at: string;
}

interface DashboardData {
  influencer_name: string;
  coupon: CouponInfo | null;
  pending_balance: number;
  stats: InfluencerStats;
  transactions: Transaction[];
}

// ─── Main Dashboard (Cinematic Immersive Sanctuary - Winning Variant) ─────────

export const InfluencerDashboard: React.FC<{ onSwitchToProfile?: () => void }> = ({ onSwitchToProfile }) => {
  const { user, profile, refreshProfile } = useAuthContext();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getInfluencerDashboard();
      setData(data);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const copyCode = () => {
    if (!data?.coupon?.code) return;
    navigator.clipboard.writeText(data.coupon.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const bloomVariants = {
    initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  // ── Loading ──
  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-mat-obsidian text-mat-bone">
      <div className="flex flex-col items-center gap-6 opacity-40 text-center">
        <Loader2 size={32} className="animate-spin text-mat-rose" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate">Loading Sovereign Influence Hub...</span>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-mat-obsidian text-mat-bone">
      <div className="text-center space-y-6 max-w-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-rose/60">Access Restricted</p>
        <p className="text-sm text-mat-slate/50">{error}</p>
        <button onClick={fetchDashboard} className="px-8 py-4 bg-mat-wine text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-mat-wine-soft transition-all flex items-center gap-2 mx-auto shadow-xl">
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    </div>
  );

  const visibleTx = showAllTx ? data!.transactions : data!.transactions.slice(0, 5);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={bloomVariants}
      className="min-h-screen bg-mat-obsidian text-mat-bone px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20 pb-36 md:pb-24 selection:bg-mat-rose selection:text-white relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-mat-rose/10 via-mat-wine/5 to-transparent blur-[150px] pointer-events-none" />

      {/* Cinematic Hero */}
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 text-center pt-4 sm:pt-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-mat-gold text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] shadow-lg backdrop-blur-md">
          <Star size={12} className="animate-spin text-mat-gold" /> Sovereign Influencer Hub
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.9] italic px-2">
          Absolute <br />
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-mat-rose via-mat-gold to-white not-italic uppercase tracking-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl block mt-2 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
            Influence.
          </span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-[10px] sm:text-xs tracking-widest uppercase font-mono px-4 leading-relaxed">
          Steward of Resonance: <span className="text-mat-gold font-bold">{data!.influencer_name}</span> // 10% Royalties
        </p>
        
        {/* Responsive Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 pt-6 w-full max-w-md sm:max-w-none mx-auto px-4">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-mat-gold transition-all rounded-full font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center leading-normal"
          >
            <Sparkles size={16} className="shrink-0 animate-pulse" /> 
            <span>Edit Sanctuary Profile</span>
          </button>

          {onSwitchToProfile && (
            <button
              onClick={onSwitchToProfile}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white hover:bg-white/20 transition-all rounded-full font-bold text-[10px] tracking-[0.3em] uppercase border border-white/10 flex items-center justify-center gap-3 backdrop-blur-xl text-center leading-normal shadow-lg"
            >
              <User size={16} className="shrink-0" /> 
              <span>Switch to Normal User <span className="hidden sm:inline">Profile</span></span>
            </button>
          )}
        </div>
      </div>

      {/* Massive Promo Banner (Sacred Transmission Code) */}
      <div className="max-w-5xl mx-auto mat-glass-deep p-8 sm:p-12 md:p-16 rounded-[3rem] sm:rounded-[4rem] border border-mat-gold/20 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center space-y-6 sm:space-y-8 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-mat-rose/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] sm:tracking-[0.8em] text-mat-gold block px-2">Your Sacred Transmission Code</span>
        
        {data!.coupon ? (
          <div className="space-y-6 max-w-xl mx-auto w-full px-2 sm:px-0">
            <div className="py-4 px-6 sm:py-6 sm:px-8 bg-black/60 rounded-2xl sm:rounded-3xl border border-white/10 flex items-center justify-between gap-3 sm:gap-4 shadow-2xl backdrop-blur-2xl overflow-hidden w-full">
              <span className="font-mono text-lg sm:text-2xl md:text-4xl font-black tracking-widest sm:tracking-[0.3em] text-white truncate flex-1 text-center">
                {data!.coupon.code}
              </span>
              <button onClick={copyCode} className="p-3 sm:p-4 bg-mat-gold text-black rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-lg shrink-0">
                {codeCopied ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> : <Copy size={20} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
            {codeCopied && <p className="text-[10px] text-mat-gold font-bold tracking-[0.4em] uppercase animate-bounce">✓ Code Secured to Clipboard</p>}
            <p className="text-[10px] sm:text-xs text-white/40 tracking-widest uppercase font-mono px-4 leading-relaxed">
              Grants {data!.coupon.discount_pct}% discount • Generates 10% instant commission
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-white/40 italic font-mono py-6">Awaiting transmission code assignment.</p>
        )}
      </div>

      {/* Minimalist Metrics Triad */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 z-10 relative">
        <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center text-white/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] truncate">Total Referrals</p>
            <Users size={16} />
          </div>
          <p className="text-4xl sm:text-5xl font-light tracking-tighter text-white">{data!.stats.total_referrals}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-gold w-1/3" /></div>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mat-rose/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center text-white/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] truncate">Sales Generated</p>
            <TrendingUp size={16} className="text-mat-rose" />
          </div>
          <p className="text-4xl sm:text-5xl font-light tracking-tighter text-mat-rose">₹{data!.stats.total_sales.toLocaleString('en-IN')}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-rose w-1/2" /></div>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all sm:col-span-2 md:col-span-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mat-gold/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center text-white/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] truncate">Pending Payout</p>
            <IndianRupee size={16} className="text-mat-gold" />
          </div>
          <p className="text-4xl sm:text-5xl font-light tracking-tighter text-mat-gold">₹{(data!.pending_balance || 0).toFixed(2)}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-gold w-3/4" /></div>
        </div>
      </div>

      {/* Cinematic Ledger */}
      <div className="max-w-6xl mx-auto p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-2xl space-y-6 sm:space-y-8 shadow-2xl z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-1">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 block">Ledger</span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Chronicle of Referrals</h3>
          </div>
          <span className="font-mono text-xs text-mat-gold border border-mat-gold/20 px-4 py-2 rounded-full bg-mat-gold/5 self-start sm:self-auto shadow-sm">
            {data!.transactions.length} Transmissions
          </span>
        </div>

        {data!.transactions.length === 0 ? (
          <p className="py-20 text-center text-white/40 font-mono text-xs tracking-widest uppercase px-4">No transmissions found.</p>
        ) : (
          <div className="space-y-4">
            {visibleTx.map(tx => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-all shadow-md"
              >
                <div className="space-y-1 w-full sm:w-auto">
                  <p className="font-mono text-xs sm:text-sm font-bold text-white tracking-widest truncate">{tx.redacted_user}</p>
                  <p className="font-mono text-[9px] sm:text-[10px] text-white/40">{new Date(tx.approved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                  <div className="text-left sm:text-right">
                    <p className="text-[8px] sm:text-[9px] font-mono uppercase text-white/40">Sale Amount</p>
                    <p className="text-sm sm:text-base font-bold text-white">₹{tx.discounted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] sm:text-[9px] font-mono uppercase text-mat-gold">Your Commission</p>
                    <p className="text-base sm:text-lg font-black text-mat-gold">+₹{tx.commission_earned.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {data!.transactions.length > 5 && (
              <div className="pt-6 text-center border-t border-white/5">
                <button 
                  onClick={() => setShowAllTx(v => !v)} 
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.4em] text-mat-gold hover:text-white transition-colors flex items-center gap-2 mx-auto py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  <ChevronDown size={14} className={`transition-transform ${showAllTx ? 'rotate-180' : ''}`} /> 
                  <span>{showAllTx ? 'Collapse Chronicle' : `Expand All ${data!.transactions.length} Records`}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-8 pb-12 text-center border-t border-white/5 mt-12 z-10 relative">
        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.8em] sm:tracking-[1.2em] opacity-30 text-mat-gold pointer-events-none select-none px-4 leading-relaxed">
          Matriarch // Absolute Influence. Royalties. Rise.
        </p>
      </div>

      {/* ─── IDENTITY EDIT OVERLAY LAYER ─── */}
      <AnimatePresence>
        {isEditing && profile && (
          <EditProfile 
            profile={profile} 
            onUpdate={() => { refreshProfile(); setIsEditing(false); }} 
            onCancel={() => setIsEditing(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InfluencerDashboard;
