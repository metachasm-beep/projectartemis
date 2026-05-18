import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Tag, Clock, ChevronDown, IndianRupee, Users, TrendingUp, Loader2, Copy, CheckCircle2, Sparkles, User } from 'lucide-react';
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

// ─── Animated Stat Card ───────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: string | number;
  prefix?: string;
  icon: React.FC<any>;
  delay?: number;
  accent?: string;
}> = ({ label, value, prefix = '', icon: Icon, delay = 0, accent = 'text-mat-wine' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className="mat-glass-deep p-6 md:p-8 rounded-[2.5rem] border border-mat-rose/10 space-y-4 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-mat-rose/3 blur-2xl pointer-events-none" />
    <div className="w-10 h-10 rounded-2xl bg-mat-rose/10 flex items-center justify-center">
      <Icon size={18} className={accent} />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40 mb-1 truncate">{label}</p>
      <p className={`text-3xl md:text-4xl font-black italic tracking-tighter ${accent}`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
    </div>
  </motion.div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 opacity-40 text-center">
        <Loader2 size={32} className="animate-spin text-mat-wine" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate">Loading Influence Hub...</span>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
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
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-12 md:space-y-16 pb-36 md:pb-24"
    >
      {/* ── Header ── */}
      <div className="space-y-6">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-mat-rose/50">Influence Hub</span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl mat-text-display-pro text-mat-wine italic leading-[0.9]">
            Your<br /><span className="text-mat-rose/30">Impact.</span>
          </h1>
          <p className="text-mat-slate/50 max-w-md text-xs sm:text-sm leading-relaxed">
            Welcome back, <strong className="text-mat-wine">{data!.influencer_name}</strong>. Every referral you make builds the Matriarch community.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-mat-rose text-white hover:bg-mat-rose-soft transition-all rounded-2xl font-bold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl border border-white/10 text-center leading-normal"
          >
            <Sparkles size={16} className="shrink-0 animate-pulse" /> 
            <span>Edit Influencer Profile</span>
          </button>

          {onSwitchToProfile && (
            <button
              onClick={onSwitchToProfile}
              className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-mat-wine text-white hover:bg-mat-wine-soft transition-all rounded-2xl font-bold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl border border-white/10 text-center leading-normal"
            >
              <User size={16} className="shrink-0" /> 
              <span>Switch to Normal User <span className="hidden sm:inline">Profile </span>({profile?.role === 'woman' ? 'Woman Sanctuary' : 'Man Dashboard'})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Referrals"
          value={data!.stats.total_referrals}
          icon={Users}
          delay={0}
          accent="text-mat-wine"
        />
        <StatCard
          label="Total Sales Generated"
          value={data!.stats.total_sales.toFixed(0)}
          prefix="₹"
          icon={TrendingUp}
          delay={0.1}
          accent="text-mat-rose"
        />
        <StatCard
          label="Current Earnings (10%)"
          value={data!.stats.total_commission.toFixed(2)}
          prefix="₹"
          icon={IndianRupee}
          delay={0.2}
          accent="text-amber-600"
        />
      </div>

      {/* ── Pending Balance + Coupon Widget ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Pending Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mat-glass-deep p-6 sm:p-8 md:p-10 rounded-[3rem] border border-mat-gold/20 space-y-6"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Pending Balance</span>
            <p className="text-4xl sm:text-5xl font-black italic text-mat-gold tracking-tighter truncate">
              ₹{(data!.pending_balance || 0).toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-mat-slate/40 leading-relaxed">
            Your accumulated commissions. The Matriarch team will settle these earnings with you directly.
          </p>
          <div className="flex items-center gap-2 text-[9px] uppercase font-black tracking-widest text-mat-slate/20">
            <Sparkles size={10} className="shrink-0" /> Settled manually by the admin team
          </div>
        </motion.div>

        {/* Coupon Code Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mat-glass-deep p-6 sm:p-8 md:p-10 rounded-[3rem] border border-mat-rose/10 space-y-6"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Your Promo Code</span>
            <p className="text-xs text-mat-slate/40">Share this with your audience for 50% off</p>
          </div>

          {data!.coupon ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 md:gap-4 bg-mat-obsidian/5 rounded-2xl px-4 py-4 md:px-6 md:py-5 border border-mat-rose/10 overflow-hidden">
                <Tag size={16} className="text-mat-rose shrink-0 hidden sm:block" />
                <span className="font-mono text-lg sm:text-xl md:text-2xl font-black tracking-widest md:tracking-[0.3em] text-mat-wine truncate flex-1">
                  {data!.coupon.code}
                </span>
                <motion.button
                  onClick={copyCode}
                  whileTap={{ scale: 0.92 }}
                  className={`p-2.5 md:p-3 rounded-xl shrink-0 transition-all ${codeCopied ? 'bg-mat-wine text-white' : 'bg-mat-rose/10 text-mat-rose hover:bg-mat-rose/20'}`}
                >
                  <AnimatePresence mode="wait">
                    {codeCopied ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle2 size={16} />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {codeCopied && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-mat-wine font-bold tracking-widest uppercase text-center"
                  >
                    ✓ Copied to clipboard!
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-[9px] text-mat-slate/30 text-center uppercase tracking-widest font-bold">
                {data!.coupon.discount_pct}% off for every user who applies this code
              </p>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/30">No code assigned yet</p>
              <p className="text-xs text-mat-slate/20">Contact the Matriarch admin team to get your promo code set up.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Transaction Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mat-glass-deep rounded-[3rem] border border-mat-rose/10 overflow-hidden"
      >
        <div className="px-6 pt-6 md:px-10 md:pt-10 pb-6 border-b border-mat-rose/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Recent Referrals</span>
            <h3 className="text-xl sm:text-2xl font-bold italic text-mat-wine">Transaction Ledger</h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-mat-slate/30">
            <Clock size={10} />
            {data!.transactions.length} records
          </div>
        </div>

        {data!.transactions.length === 0 ? (
          <div className="py-20 text-center space-y-3 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/20">No referrals yet</p>
            <p className="text-xs text-mat-slate/20">Start sharing your code — every referral earns you 10% commission.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-mat-ivory/40">
                    <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.3em] text-mat-slate/40">Date</th>
                    <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.3em] text-mat-slate/40">User</th>
                    <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.3em] text-mat-slate/40 text-right">Sale Amount</th>
                    <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.3em] text-mat-slate/40 text-right">Commission (10%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mat-rose/5">
                  {visibleTx.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="group hover:bg-mat-ivory/30 transition-colors"
                    >
                      <td className="px-10 py-6 text-xs text-mat-slate/50 font-mono">
                        {new Date(tx.approved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-mono text-xs font-bold text-mat-wine/60 tracking-widest">{tx.redacted_user}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-sm font-black italic text-mat-wine">₹{tx.discounted_amount.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] text-mat-slate/30 block">of ₹{tx.original_amount}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-sm font-black italic text-amber-600">+₹{tx.commission_earned.toFixed(2)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-mat-rose/5">
              {visibleTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="px-6 py-5 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-mat-wine/60 tracking-widest">{tx.redacted_user}</span>
                    <span className="text-[10px] text-mat-slate/40 font-mono">
                      {new Date(tx.approved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[9px] text-mat-slate/40 uppercase tracking-widest">Sale</p>
                      <p className="text-lg font-black italic text-mat-wine">₹{tx.discounted_amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-mat-slate/40 uppercase tracking-widest">Your Cut</p>
                      <p className="text-lg font-black italic text-amber-600">+₹{tx.commission_earned.toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Show more */}
            {data!.transactions.length > 5 && (
              <div className="px-6 sm:px-10 py-8 border-t border-mat-rose/5">
                <button
                  onClick={() => setShowAllTx(v => !v)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-mat-rose/60 hover:text-mat-rose transition-colors mx-auto"
                >
                  <ChevronDown size={12} className={`transition-transform ${showAllTx ? 'rotate-180' : ''}`} />
                  {showAllTx ? 'Show less' : `Show all ${data!.transactions.length} records`}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Footer */}
      <div className="pt-8 pb-24 md:pb-12 text-center border-t border-mat-rose/5 mt-12">
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.8em] md:tracking-[1.2em] opacity-30 text-mat-wine pointer-events-none select-none px-4 leading-relaxed">
          Matriarch // Influence. Commission. Rise.
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
