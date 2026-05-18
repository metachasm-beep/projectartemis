import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Tag, Clock, ChevronDown, IndianRupee, Users, TrendingUp, Loader2, Copy, CheckCircle2, Sparkles, User, ArrowRight, Shield, Zap, Trophy, Star, Share2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { EditProfile } from '@/components/EditProfile';

// ─── Top-of-File Pocock UI Prototype Plan ──────────────────────────────────────
// "Three radically different variants of the Influencer Dashboard, switchable via ?variant=, on the existing InfluencerDashboard component."

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

interface VariantProps {
  data: DashboardData;
  profile: any;
  onSwitchToProfile?: () => void;
  setIsEditing: (val: boolean) => void;
  copyCode: () => void;
  codeCopied: boolean;
  showAllTx: boolean;
  setShowAllTx: React.Dispatch<React.SetStateAction<boolean>>;
}

// ─── VARIANT A: The Executive Command Center (Glassmorphism Grid) ─────────────

const VariantA: React.FC<VariantProps> = ({
  data, profile, onSwitchToProfile, setIsEditing, copyCode, codeCopied, showAllTx, setShowAllTx
}) => {
  const visibleTx = showAllTx ? data.transactions : data.transactions.slice(0, 5);
  const nextMilestone = 10000;
  const progressPct = Math.min(100, Math.round(((data.pending_balance || 0) / nextMilestone) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 pb-36 md:pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-mat-wine/10 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-mat-rose font-black text-[10px] tracking-[0.5em] uppercase">
            <Shield size={14} /> Executive Command Center
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl mat-text-display-pro text-mat-wine italic leading-none">
            Influence <span className="text-mat-rose">Matrix.</span>
          </h1>
          <p className="text-mat-slate/60 text-xs sm:text-sm max-w-xl leading-relaxed">
            Welcome back, <strong className="text-mat-wine font-bold">{data.influencer_name}</strong>. Here is your real-time referral performance and commission ledger.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 md:flex-none px-6 py-3.5 bg-mat-rose text-white hover:bg-mat-rose-soft transition-all rounded-2xl font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-xl"
          >
            <Sparkles size={14} className="animate-pulse" /> Edit Influencer Profile
          </button>
          {onSwitchToProfile && (
            <button
              onClick={onSwitchToProfile}
              className="flex-1 md:flex-none px-6 py-3.5 bg-mat-wine text-white hover:bg-mat-wine-soft transition-all rounded-2xl font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-xl"
            >
              <User size={14} /> Switch to Normal User
            </button>
          )}
        </div>
      </div>

      {/* Velocity Progress Bar */}
      <div className="mat-glass-deep p-8 rounded-[2.5rem] border border-mat-wine/10 space-y-4 bg-mat-cream/40">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-mat-wine">
          <span>Next Payout Milestone (₹{nextMilestone.toLocaleString('en-IN')})</span>
          <span>{progressPct}% Achieved</span>
        </div>
        <div className="h-3 bg-mat-wine/10 rounded-full overflow-hidden p-0.5">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} className="h-full bg-gradient-to-r from-mat-rose to-mat-wine rounded-full shadow-lg" />
        </div>
        <p className="text-[10px] text-mat-slate/50 italic tracking-wide">
          * Earn 10% commission on every transaction. Payouts are settled directly by the Matriarch administrative team upon reaching milestones.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="mat-glass-deep p-8 rounded-[2.5rem] border border-mat-wine/10 space-y-4 relative overflow-hidden bg-white/40 shadow-xl">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-mat-wine/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-mat-wine/10 flex items-center justify-center text-mat-wine">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/40 mb-1">Total Referrals</p>
            <p className="text-4xl font-black italic text-mat-wine tracking-tighter">{data.stats.total_referrals}</p>
          </div>
        </div>

        <div className="mat-glass-deep p-8 rounded-[2.5rem] border border-mat-rose/10 space-y-4 relative overflow-hidden bg-white/40 shadow-xl">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-mat-rose/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-mat-rose/10 flex items-center justify-center text-mat-rose">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/40 mb-1">Total Sales Generated</p>
            <p className="text-4xl font-black italic text-mat-rose tracking-tighter">₹{data.stats.total_sales.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mat-glass-deep p-8 rounded-[2.5rem] border border-amber-500/10 space-y-4 relative overflow-hidden bg-white/40 shadow-xl">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/40 mb-1">Total Earnings (10%)</p>
            <p className="text-4xl font-black italic text-amber-600 tracking-tighter">₹{data.stats.total_commission.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Promo Code + Pending Balance Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mat-glass-deep p-8 md:p-10 rounded-[3rem] border border-mat-wine/10 space-y-6 bg-gradient-to-br from-white/60 to-mat-cream/40 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Pending Balance</span>
            <p className="text-5xl font-black italic text-mat-wine tracking-tighter truncate">
              ₹{(data.pending_balance || 0).toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-mat-slate/50 leading-relaxed">
            Your accumulated commissions ready for administrative settlement. Share your promo code to increase your pending payout.
          </p>
        </div>

        <div className="mat-glass-deep p-8 md:p-10 rounded-[3rem] border border-mat-rose/10 space-y-6 bg-gradient-to-br from-white/60 to-mat-cream/40 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Your Promo Code</span>
            <p className="text-xs text-mat-slate/50">Grants 50% discount to your audience</p>
          </div>
          {data.coupon ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 bg-white/80 rounded-2xl p-4 border border-mat-rose/20 shadow-inner">
                <Tag size={20} className="text-mat-rose shrink-0 hidden sm:block" />
                <span className="font-mono text-xl md:text-2xl font-black tracking-widest text-mat-wine truncate flex-1">
                  {data.coupon.code}
                </span>
                <button
                  onClick={copyCode}
                  className={`p-3 rounded-xl transition-all ${codeCopied ? 'bg-mat-wine text-white' : 'bg-mat-rose text-white hover:bg-mat-rose-soft shadow-lg'}`}
                >
                  {codeCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
              {codeCopied && <p className="text-[10px] text-mat-wine font-bold tracking-widest uppercase text-center animate-pulse">✓ Copied to clipboard!</p>}
            </div>
          ) : (
            <p className="text-xs text-mat-slate/40 italic">No promo code assigned. Contact administration.</p>
          )}
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="mat-glass-deep rounded-[3rem] border border-mat-wine/10 overflow-hidden bg-white/40 shadow-2xl">
        <div className="p-8 border-b border-mat-wine/10 flex justify-between items-center bg-mat-cream/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Ledger</span>
            <h3 className="text-2xl font-bold italic text-mat-wine">Recent Referrals</h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-mat-wine/60 bg-mat-wine/10 px-4 py-2 rounded-full">
            {data.transactions.length} Total Records
          </span>
        </div>

        {data.transactions.length === 0 ? (
          <div className="py-20 text-center text-mat-slate/40 text-xs uppercase tracking-widest">No referrals recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mat-wine/10 bg-mat-wine/5 text-[10px] font-bold uppercase tracking-widest text-mat-wine/60">
                  <th className="p-6">Date</th>
                  <th className="p-6">Referred User</th>
                  <th className="p-6 text-right">Sale Amount</th>
                  <th className="p-6 text-right">Commission (10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mat-wine/5">
                {visibleTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/50 transition-colors">
                    <td className="p-6 font-mono text-xs text-mat-slate/60">{new Date(tx.approved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="p-6 font-mono text-xs font-bold text-mat-wine tracking-wider">{tx.redacted_user}</td>
                    <td className="p-6 text-right font-bold text-mat-wine text-sm">₹{tx.discounted_amount.toLocaleString('en-IN')}</td>
                    <td className="p-6 text-right font-black text-amber-600 text-sm">+₹{tx.commission_earned.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.transactions.length > 5 && (
              <div className="p-6 text-center border-t border-mat-wine/10 bg-mat-cream/20">
                <button onClick={() => setShowAllTx(v => !v)} className="text-[10px] font-black uppercase tracking-widest text-mat-wine hover:text-mat-rose transition-colors flex items-center gap-2 mx-auto">
                  <ChevronDown size={14} className={showAllTx ? 'rotate-180' : ''} /> {showAllTx ? 'Show Less' : `Show All ${data.transactions.length} Records`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VARIANT B: The Cinematic Immersive Sanctuary (Dark Mode Minimalist) ──────

const VariantB: React.FC<VariantProps> = ({
  data, profile, onSwitchToProfile, setIsEditing, copyCode, codeCopied, showAllTx, setShowAllTx
}) => {
  const visibleTx = showAllTx ? data.transactions : data.transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-mat-obsidian text-mat-bone px-4 sm:px-8 py-16 space-y-20 pb-36 md:pb-24 selection:bg-mat-rose selection:text-white">
      {/* Cinematic Hero */}
      <div className="max-w-6xl mx-auto space-y-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-mat-gold text-[10px] font-black uppercase tracking-[0.6em]">
          <Star size={12} className="animate-spin" /> Sovereign Influencer Hub
        </div>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-light tracking-tighter leading-[0.85] italic">
          Absolute <br /><span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-mat-rose via-mat-gold to-white not-italic uppercase tracking-normal text-5xl sm:text-7xl md:text-8xl block mt-2">Influence.</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-xs sm:text-sm tracking-widest uppercase font-mono">
          Steward of Resonance: <span className="text-mat-gold font-bold">{data.influencer_name}</span> // 10% Royalties
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-4 bg-white text-black hover:bg-mat-gold transition-all rounded-full font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <Sparkles size={16} /> Edit Sanctuary Profile
          </button>
          {onSwitchToProfile && (
            <button
              onClick={onSwitchToProfile}
              className="px-8 py-4 bg-white/10 text-white hover:bg-white/20 transition-all rounded-full font-bold text-[10px] tracking-[0.3em] uppercase border border-white/10 flex items-center gap-3 backdrop-blur-xl"
            >
              <User size={16} /> Normal User Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Massive Promo Banner */}
      <div className="max-w-5xl mx-auto mat-glass-deep p-12 md:p-16 rounded-[4rem] border border-mat-gold/20 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center space-y-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-mat-rose/10 rounded-full blur-[120px] pointer-events-none" />
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-mat-gold block">Your Sacred Transmission Code</span>
        {data.coupon ? (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="py-6 px-8 bg-black/60 rounded-3xl border border-white/10 flex items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl">
              <span className="font-mono text-2xl sm:text-4xl font-black tracking-[0.3em] text-white truncate flex-1 text-center">
                {data.coupon.code}
              </span>
              <button onClick={copyCode} className="p-4 bg-mat-gold text-black rounded-2xl hover:bg-white transition-all shadow-lg shrink-0">
                {codeCopied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
              </button>
            </div>
            {codeCopied && <p className="text-[10px] text-mat-gold font-bold tracking-[0.4em] uppercase animate-bounce">✓ Code Secured to Clipboard</p>}
            <p className="text-xs text-white/40 tracking-widest uppercase font-mono">Grants 50% discount • Generates 10% instant commission</p>
          </div>
        ) : (
          <p className="text-sm text-white/40 italic font-mono">Awaiting transmission code assignment.</p>
        )}
      </div>

      {/* Minimalist Metrics Triad */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Total Referrals</p>
          <p className="text-5xl font-light tracking-tighter text-white">{data.stats.total_referrals}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-gold w-1/3" /></div>
        </div>
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Sales Generated</p>
          <p className="text-5xl font-light tracking-tighter text-mat-rose">₹{data.stats.total_sales.toLocaleString('en-IN')}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-rose w-1/2" /></div>
        </div>
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Pending Payout</p>
          <p className="text-5xl font-light tracking-tighter text-mat-gold">₹{(data.pending_balance || 0).toFixed(2)}</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mat-gold w-3/4" /></div>
        </div>
      </div>

      {/* Cinematic Ledger */}
      <div className="max-w-6xl mx-auto p-12 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-2xl space-y-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 block mb-1">Ledger</span>
            <h3 className="text-3xl font-light tracking-tight text-white">Chronicle of Referrals</h3>
          </div>
          <span className="font-mono text-xs text-mat-gold border border-mat-gold/20 px-4 py-2 rounded-full bg-mat-gold/5">
            {data.transactions.length} Transmissions
          </span>
        </div>
        {data.transactions.length === 0 ? (
          <p className="py-20 text-center text-white/40 font-mono text-xs tracking-widest uppercase">No transmissions found.</p>
        ) : (
          <div className="space-y-4">
            {visibleTx.map(tx => (
              <div key={tx.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-all">
                <div className="space-y-1">
                  <p className="font-mono text-sm font-bold text-white tracking-widest">{tx.redacted_user}</p>
                  <p className="font-mono text-[10px] text-white/40">{new Date(tx.approved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] font-mono uppercase text-white/40">Sale Amount</p>
                    <p className="text-base font-bold text-white">₹{tx.discounted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono uppercase text-mat-gold">Your Commission</p>
                    <p className="text-lg font-black text-mat-gold">+₹{tx.commission_earned.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            {data.transactions.length > 5 && (
              <div className="pt-6 text-center">
                <button onClick={() => setShowAllTx(v => !v)} className="text-[10px] font-mono uppercase tracking-[0.4em] text-mat-gold hover:text-white transition-colors flex items-center gap-2 mx-auto">
                  <ChevronDown size={14} className={showAllTx ? 'rotate-180' : ''} /> {showAllTx ? 'Collapse Chronicle' : `Expand All ${data.transactions.length} Records`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VARIANT C: The Cyberpunk Gamified Dossier (Terminal Aesthetic) ───────────

const VariantC: React.FC<VariantProps> = ({
  data, profile, onSwitchToProfile, setIsEditing, copyCode, codeCopied, showAllTx, setShowAllTx
}) => {
  const visibleTx = showAllTx ? data.transactions : data.transactions.slice(0, 5);
  const currentLevel = Math.floor(data.stats.total_referrals / 5) + 1;
  const nextLevelReq = currentLevel * 5;
  const questProgress = Math.min(100, Math.round(((data.stats.total_referrals % 5) / 5) * 100));

  return (
    <div className="min-h-screen bg-[#0D0B0C] text-amber-500/90 font-mono px-4 sm:px-6 py-12 space-y-10 pb-36 md:pb-24 selection:bg-amber-500 selection:text-black">
      {/* Terminal Header */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 border-2 border-amber-500/30 bg-black/60 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-4 py-1 uppercase tracking-widest">
          SYS.VER: 4.0.9 // LIVE
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-amber-500/20 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500/60 text-xs tracking-widest uppercase">
              <Zap size={14} className="animate-pulse text-amber-400" /> Matriarch Operative Dossier
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tighter uppercase">
              // {data.influencer_name}
            </h1>
            <p className="text-xs text-amber-500/60 tracking-wider">
              STATUS: ACTIVE | ROYALTY RATE: 10% | CLEARANCE: INFLUENCER
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-amber-500 text-black hover:bg-amber-400 transition-all rounded font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            >
              <Sparkles size={14} /> EDIT PROFILE_CFG
            </button>
            {onSwitchToProfile && (
              <button
                onClick={onSwitchToProfile}
                className="flex-1 md:flex-none px-6 py-3 bg-transparent text-amber-500 hover:bg-amber-500/10 transition-all rounded font-bold text-xs tracking-widest uppercase border border-amber-500/40 flex items-center justify-center gap-2"
              >
                <User size={14} /> EXIT TO USER_MODE
              </button>
            )}
          </div>
        </div>

        {/* Gamified Quest Tracker */}
        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-amber-400">
            <span className="flex items-center gap-2"><Trophy size={14} /> Operative Level: {currentLevel}</span>
            <span>Quest Progress: {data.stats.total_referrals % 5} / 5 Referrals to Level {currentLevel + 1}</span>
          </div>
          <div className="h-4 bg-black border border-amber-500/40 rounded p-0.5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${questProgress}%` }} className="h-full bg-amber-500 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          </div>
          <p className="text-[10px] text-amber-500/50 uppercase tracking-widest">
            * Leveling up increases your standing prestige in the Matriarch network.
          </p>
        </div>
      </div>

      {/* Cyberpunk Bento Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 border-2 border-amber-500/30 bg-black/40 rounded-2xl space-y-4 shadow-lg backdrop-blur-sm relative group hover:border-amber-500/60 transition-all">
          <div className="flex justify-between items-center text-amber-500/60 text-xs uppercase tracking-widest">
            <span>[01] TOTAL_REFS</span>
            <Users size={18} />
          </div>
          <p className="text-5xl font-black text-amber-400 tracking-tight">{data.stats.total_referrals}</p>
          <div className="text-[10px] text-amber-500/40 uppercase tracking-widest border-t border-amber-500/10 pt-2">Successful audience conversions</div>
        </div>

        <div className="p-8 border-2 border-amber-500/30 bg-black/40 rounded-2xl space-y-4 shadow-lg backdrop-blur-sm relative group hover:border-amber-500/60 transition-all">
          <div className="flex justify-between items-center text-amber-500/60 text-xs uppercase tracking-widest">
            <span>[02] GROSS_VOL</span>
            <TrendingUp size={18} />
          </div>
          <p className="text-5xl font-black text-amber-400 tracking-tight">₹{data.stats.total_sales.toLocaleString('en-IN')}</p>
          <div className="text-[10px] text-amber-500/40 uppercase tracking-widest border-t border-amber-500/10 pt-2">Total revenue generated</div>
        </div>

        <div className="p-8 border-2 border-amber-500/30 bg-black/40 rounded-2xl space-y-4 shadow-lg backdrop-blur-sm relative group hover:border-amber-500/60 transition-all">
          <div className="flex justify-between items-center text-amber-500/60 text-xs uppercase tracking-widest">
            <span>[03] NET_REWARD</span>
            <IndianRupee size={18} />
          </div>
          <p className="text-5xl font-black text-amber-400 tracking-tight">₹{data.stats.total_commission.toLocaleString('en-IN')}</p>
          <div className="text-[10px] text-amber-500/40 uppercase tracking-widest border-t border-amber-500/10 pt-2">10% commission allocation</div>
        </div>
      </div>

      {/* Terminal Code & Balance Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border-2 border-amber-500/30 bg-black/60 rounded-2xl space-y-6 shadow-xl backdrop-blur-xl">
          <div className="space-y-1 border-b border-amber-500/20 pb-4">
            <span className="text-xs text-amber-500/60 uppercase tracking-widest block">// PENDING_SETTLEMENT</span>
            <p className="text-5xl font-black text-amber-400 tracking-tighter truncate">
              ₹{(data.pending_balance || 0).toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-amber-500/70 leading-relaxed tracking-wide">
            Accumulated commissions awaiting manual dispatch by Matriarch command stewards. Settle threshold active.
          </p>
        </div>

        <div className="p-8 border-2 border-amber-500/30 bg-black/60 rounded-2xl space-y-6 shadow-xl backdrop-blur-xl">
          <div className="space-y-1 border-b border-amber-500/20 pb-4">
            <span className="text-xs text-amber-500/60 uppercase tracking-widest block">// PROMO_CODE_KEY</span>
            <p className="text-xs text-amber-500/70">50% discount payload attached</p>
          </div>
          {data.coupon ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded flex items-center justify-between gap-4">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-[0.2em] truncate flex-1">
                  {data.coupon.code}
                </span>
                <button
                  onClick={copyCode}
                  className={`p-3 rounded font-black text-xs uppercase tracking-widest transition-all ${codeCopied ? 'bg-amber-400 text-black' : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`}
                >
                  {codeCopied ? 'COPIED' : 'COPY_KEY'}
                </button>
              </div>
              {codeCopied && <p className="text-[10px] text-amber-400 tracking-widest text-center animate-pulse">>>> KEY_COPIED_TO_CLIPBOARD <<<</p>}
            </div>
          ) : (
            <p className="text-xs text-amber-500/50 italic">// NO_KEY_ALLOCATED</p>
          )}
        </div>
      </div>

      {/* Cyberpunk Ledger Table */}
      <div className="max-w-7xl mx-auto p-8 border-2 border-amber-500/30 bg-black/60 rounded-2xl shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex justify-between items-center border-b border-amber-500/20 pb-6">
          <div>
            <span className="text-xs text-amber-500/60 uppercase tracking-widest block">// TRANSACTION_LOG</span>
            <h3 className="text-2xl font-black text-amber-400">AUDIT_LEDGER</h3>
          </div>
          <span className="text-xs text-amber-400 border border-amber-500/40 px-3 py-1 rounded bg-amber-500/10 font-bold uppercase">
            RECS: {data.transactions.length}
          </span>
        </div>

        {data.transactions.length === 0 ? (
          <p className="py-20 text-center text-amber-500/50 text-xs uppercase tracking-widest">// NO_LOGS_FOUND</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-amber-500/30 text-amber-500/60 uppercase tracking-widest bg-amber-500/5">
                  <th className="p-4">TIMESTAMP</th>
                  <th className="p-4">OPERATIVE_ID</th>
                  <th className="p-4 text-right">GROSS_VOL</th>
                  <th className="p-4 text-right">COMMISSION (10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10 text-amber-500/90">
                {visibleTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-amber-500/10 transition-colors">
                    <td className="p-4 text-amber-500/60">{new Date(tx.approved_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td className="p-4 font-bold text-amber-400">{tx.redacted_user}</td>
                    <td className="p-4 text-right font-bold text-amber-400">₹{tx.discounted_amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right font-black text-amber-400">+₹{tx.commission_earned.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.transactions.length > 5 && (
              <div className="pt-6 text-center border-t border-amber-500/20">
                <button onClick={() => setShowAllTx(v => !v)} className="text-xs font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 mx-auto">
                  <ChevronDown size={14} className={showAllTx ? 'rotate-180' : ''} /> {showAllTx ? 'COLLAPSE_LOGS' : `EXPAND_ALL_${data.transactions.length}_RECS`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FLOATING PROTOTYPE SWITCHER (Pocock Standard) ─────────────────────────────

const PrototypeSwitcher: React.FC<{
  variants: string[];
  current: string;
  onSelect: (variant: string) => void;
}> = ({ variants, current, onSelect }) => {
  const currentIndex = variants.indexOf(current);

  const handlePrev = () => {
    const nextIndex = (currentIndex - 1 + variants.length) % variants.length;
    onSelect(variants[nextIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % variants.length;
    onSelect(variants[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable) {
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, variants, onSelect]);

  const variantNames: Record<string, string> = {
    'A': 'A — Executive Command Center',
    'B': 'B — Cinematic Immersive Sanctuary',
    'C': 'C — Cyberpunk Gamified Dossier'
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[5000] bg-black/90 backdrop-blur-2xl border border-white/20 px-4 py-2.5 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center gap-4 text-white font-mono text-xs selection:bg-transparent">
      <button onClick={handlePrev} className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white" title="Previous Variant (Left Arrow)">
        ←
      </button>
      <div className="flex items-center gap-2 font-bold tracking-wider px-2">
        <span className="w-2 h-2 rounded-full bg-mat-gold animate-pulse" />
        <span>{variantNames[current] || `Variant ${current}`}</span>
      </div>
      <button onClick={handleNext} className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white" title="Next Variant (Right Arrow)">
        →
      </button>
    </div>
  );
};

// ─── Main Dashboard Wrapper ────────────────────────────────────────────────────

export const InfluencerDashboard: React.FC<{ onSwitchToProfile?: () => void }> = ({ onSwitchToProfile }) => {
  const { user, profile, refreshProfile } = useAuthContext();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [variant, setVariant] = useState('A');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('variant');
    if (v && ['A', 'B', 'C'].includes(v)) {
      setVariant(v);
    }
  }, []);

  const handleVariantChange = (newVariant: string) => {
    setVariant(newVariant);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', newVariant);
    window.history.replaceState({}, '', url);
  };

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

  // ── Loading ──
  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-mat-cream/10">
      <div className="flex flex-col items-center gap-6 opacity-40 text-center">
        <Loader2 size={32} className="animate-spin text-mat-wine" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate">Loading Influence Hub...</span>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-mat-cream/10">
      <div className="text-center space-y-6 max-w-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-rose/60">Access Restricted</p>
        <p className="text-sm text-mat-slate/50">{error}</p>
        <button onClick={fetchDashboard} className="px-8 py-4 bg-mat-wine text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-mat-wine-soft transition-all flex items-center gap-2 mx-auto shadow-xl">
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    </div>
  );

  const variantProps: VariantProps = {
    data: data!,
    profile,
    onSwitchToProfile,
    setIsEditing,
    copyCode,
    codeCopied,
    showAllTx,
    setShowAllTx
  };

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {variant === 'A' && <motion.div key="A" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VariantA {...variantProps} /></motion.div>}
        {variant === 'B' && <motion.div key="B" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VariantB {...variantProps} /></motion.div>}
        {variant === 'C' && <motion.div key="C" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VariantC {...variantProps} /></motion.div>}
      </AnimatePresence>

      <PrototypeSwitcher variants={['A', 'B', 'C']} current={variant} onSelect={handleVariantChange} />

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
    </div>
  );
};

export default InfluencerDashboard;
