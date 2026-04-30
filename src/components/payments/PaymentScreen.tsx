import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Crown, Sparkles, TrendingUp, ShieldCheck, ChevronRight, HelpCircle, Info, ArrowRight, CheckCircle2, Copy, Loader2, Tag, X, Gift
} from 'lucide-react';
import { api } from '@/services/api';

// ─── TIER CONFIG ───────────────────────────────────────────────────────────────
const JUMP_TIERS = [
  {
    id: 'nudge',
    name: 'The Nudge',
    amount: 49,
    power: '5% leap',
    icon: TrendingUp,
    description: 'Precision lift. Subtle but effective in tight brackets.',
    color: 'from-mat-rose/20 to-transparent',
    accent: 'text-mat-rose',
    border: 'border-mat-rose/20 hover:border-mat-rose/60',
    badge: 'bg-mat-rose/10 text-mat-rose',
  },
  {
    id: 'surge',
    name: 'The Surge',
    amount: 149,
    power: '15% leap',
    icon: Zap,
    description: 'Decisive momentum. The most popular choice.',
    color: 'from-mat-wine/30 to-transparent',
    accent: 'text-mat-wine',
    border: 'border-mat-wine/30 hover:border-mat-wine/80',
    badge: 'bg-mat-wine/10 text-mat-wine',
    featured: true,
  },
  {
    id: 'elite',
    name: 'The Elite',
    amount: 499,
    power: '50% leap',
    icon: Crown,
    description: 'Sovereign-grade. Vaults past half the registry.',
    color: 'from-mat-gold/20 to-transparent',
    accent: 'text-mat-gold',
    border: 'border-mat-gold/30 hover:border-mat-gold/80',
    badge: 'bg-mat-gold/10 text-mat-gold',
  },
];

type ClaimStatus = 'idle' | 'loading' | 'success' | 'pending' | 'error';
type CouponStatus = 'idle' | 'checking' | 'valid' | 'invalid';

export const PaymentScreen: React.FC = () => {
  const { profile, user } = useAuthContext();

  const [selectedTier, setSelectedTier] = useState<typeof JUMP_TIERS[0]>(JUMP_TIERS[1]);
  const [utr, setUtr] = useState('');
  const [status, setStatus] = useState<ClaimStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [leapResult, setLeapResult] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Promo code state
  const [showPromo, setShowPromo] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_pct: number; influencer_name: string } | null>(null);
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle');
  const [couponError, setCouponError] = useState('');

  const upiId = 'matriarch@ptyes';
  const city = profile?.city || 'Delhi';
  const userRef = user?.id ? `MTRCH_${user.id.substring(0, 8).toUpperCase()}` : 'GUEST';

  // Effective amount after coupon (50% off if applied)
  const effectiveAmount = appliedCoupon
    ? Math.round(selectedTier.amount * (1 - appliedCoupon.discount_pct / 100))
    : selectedTier.amount;

  const upiUrl = `upi://pay?pa=${upiId}&pn=Matriarch&am=${effectiveAmount}&cu=INR&tn=MTRCH_${selectedTier.id.toUpperCase()}_${userRef}`;

  const applyCoupon = async () => {
    if (!promoInput.trim()) return;
    setCouponStatus('checking');
    setCouponError('');
    try {
      const data = await api.validateCoupon(promoInput.trim());
      setCouponStatus('valid');
      setAppliedCoupon(data);
      setShowPromo(false);
    } catch (e: any) {
      setCouponStatus('invalid');
      setCouponError(e.response?.data?.detail || 'Invalid coupon code.');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponStatus('idle');
    setPromoInput('');
    setCouponError('');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length < 12) {
      setErrorMessage('Please enter a valid 12-digit UTR number.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await api.post('/payments/claim', {
        user_id: user?.id,
        utr: utr.trim(),
        jump_type: selectedTier.id,
        city,
        coupon_code: appliedCoupon?.code || '',
      });

      const data = res.data;
      if (res.status === 202) {
        setStatus('pending');
      } else {
        setLeapResult(data.leap_bonus || null);
        setStatus('success');
      }
    } catch (err: any) {
      console.error('💳 CLAIM_ERROR:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during sync.');
      setStatus('error');
    }
  };

  const bloomVariants = {
    initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={bloomVariants}
      className="max-w-5xl mx-auto px-6 py-16 space-y-16"
    >
      {/* ── Header ── */}
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-mat-rose/50">Aura Store</span>
        <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-[0.9]">
          Ascend the<br /><span className="text-mat-rose/30">Registry.</span>
        </h1>
        <p className="text-mat-slate/50 max-w-md text-sm leading-relaxed">
          Purchase a rank jump. Your leap is calculated relative to the live density of your city — the more competitive the bracket, the more powerful the move.
        </p>
      </div>

      {/* ── BENTO GRID: Tier Selection ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {JUMP_TIERS.map((tier) => {
          const Icon = tier.icon;
          const isActive = selectedTier.id === tier.id;
          return (
            <motion.button
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              whileTap={{ scale: 0.97 }}
              className={`relative mat-glass-deep p-10 rounded-[3rem] text-left space-y-6 transition-all duration-500 border-2 ${tier.border} ${isActive ? 'shadow-mat-premium scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
            >
              {/* Featured pill */}
              {tier.featured && (
                <div className="absolute -top-3 left-8 px-4 py-1 bg-mat-wine text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="tierHalo"
                  className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${tier.color} pointer-events-none`}
                />
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.badge}`}>
                <Icon size={20} />
              </div>

              <div className="space-y-1">
                <h3 className={`text-2xl font-bold italic ${tier.accent}`}>{tier.name}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-mat-slate/40">{tier.power}</p>
              </div>

              <p className="text-xs text-mat-slate/60 leading-relaxed">{tier.description}</p>

              <div className="flex items-end justify-between pt-2 border-t border-mat-rose/10">
                <span className={`text-4xl font-black italic tracking-tighter ${tier.accent}`}>₹{tier.amount}</span>
                {isActive && <CheckCircle2 size={20} className={tier.accent} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── BENTO: Pay + Claim ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left: UPI Payment Cell */}
        <div className="mat-glass-deep p-10 rounded-[3rem] border border-mat-rose/10 space-y-8">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Step 1</span>
            <h3 className="text-3xl font-bold italic text-mat-wine">Pay via UPI</h3>
          </div>

          {/* Amount preview */}
          <div className="flex items-center gap-4 py-6 border-y border-mat-rose/10">
            <selectedTier.icon className={`w-8 h-8 ${selectedTier.accent}`} />
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-mat-slate/40">{selectedTier.name} — {selectedTier.power}</p>
              <div className="flex items-baseline gap-3">
                {appliedCoupon ? (
                  <>
                    <p className="text-2xl font-black italic line-through text-mat-slate/30">₹{selectedTier.amount}</p>
                    <p className={`text-4xl font-black italic ${selectedTier.accent}`}>₹{effectiveAmount}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{appliedCoupon.discount_pct}% OFF</span>
                  </>
                ) : (
                  <p className={`text-4xl font-black italic ${selectedTier.accent}`}>₹{selectedTier.amount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-3">
            {!showPromo && !appliedCoupon && (
              <button
                onClick={() => setShowPromo(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-mat-rose/60 hover:text-mat-rose transition-colors"
              >
                <Tag size={12} />
                Have a promo code?
              </button>
            )}

            <AnimatePresence>
              {showPromo && !appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => { setPromoInput(e.target.value.toUpperCase()); setCouponStatus('idle'); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="ENTER CODE"
                      maxLength={20}
                      className="flex-1 bg-mat-ivory/60 border-2 border-mat-rose/10 focus:border-mat-wine rounded-2xl py-3 px-5 text-mat-wine text-xs font-mono tracking-[0.3em] outline-none transition-all placeholder:tracking-normal placeholder:text-mat-slate/30"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponStatus === 'checking' || !promoInput}
                      className="px-5 py-3 bg-mat-wine text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-mat-wine-soft transition-all disabled:opacity-40 flex items-center gap-2"
                    >
                      {couponStatus === 'checking' ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
                    </button>
                    <button onClick={() => { setShowPromo(false); setCouponError(''); }} className="p-3 text-mat-slate/30 hover:text-mat-slate transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {couponStatus === 'invalid' && (
                    <p className="text-[10px] text-mat-rose mt-2 px-1">{couponError}</p>
                  )}
                </motion.div>
              )}

              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3"
                >
                  <Gift size={14} className="text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Code Applied: {appliedCoupon.code}</p>
                    <p className="text-[9px] text-emerald-500">via {appliedCoupon.influencer_name} · {appliedCoupon.discount_pct}% discount active</p>
                  </div>
                  <button onClick={removeCoupon} className="p-1.5 text-emerald-400 hover:text-emerald-700 transition-colors">
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href={upiUrl}
            className="w-full flex items-center justify-center gap-3 py-5 bg-mat-wine text-white rounded-2xl font-bold hover:bg-mat-wine-soft transition-all shadow-mat-premium group"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4 brightness-[10]" />
            Open UPI App
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <div className="flex items-center gap-3 bg-mat-ivory/60 rounded-2xl px-5 py-4 border border-mat-rose/5">
            <p className="text-xs text-mat-slate/50 flex-1">
              Or pay manually to <strong className="text-mat-wine">{upiId}</strong>
            </p>
            <button onClick={handleCopyUpi} className={`p-2 rounded-xl transition-all ${copied ? 'bg-mat-wine text-white' : 'bg-mat-rose/10 text-mat-rose hover:bg-mat-rose/20'}`}>
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Right: UTR Claim Cell */}
        <div className="mat-glass-deep p-10 rounded-[3rem] border border-mat-gold/10 space-y-8 flex flex-col">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Step 2</span>
            <h3 className="text-3xl font-bold italic text-mat-wine">Claim Your Leap</h3>
            <p className="text-xs text-mat-slate/50 leading-relaxed">
              After payment, paste your 12-digit UTR from the bank/UPI confirmation SMS.
            </p>
          </div>

          <form onSubmit={handleClaim} className="flex-1 flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="w-14 h-14 shrink-0 bg-mat-ivory/60 border border-mat-rose/10 rounded-2xl flex items-center justify-center text-mat-wine hover:bg-mat-ivory transition-all"
                  title="How to find UTR?"
                >
                  <HelpCircle size={22} />
                </button>
                
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={12}
                    value={utr}
                    onChange={(e) => { setUtr(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
                    placeholder="12-digit UTR"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-mat-ivory/60 border-2 border-mat-rose/10 focus:border-mat-wine rounded-2xl py-5 pl-6 pr-14 text-mat-wine text-sm font-mono tracking-[0.3em] outline-none transition-all placeholder:tracking-normal"
                  />
                  <button
                    type="submit"
                    disabled={utr.length < 12 || status === 'loading' || status === 'success'}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-mat-wine text-white rounded-xl disabled:opacity-20 hover:bg-mat-wine-soft transition-all flex items-center"
                  >
                    {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
              
              <p className="text-[10px] text-mat-slate/40 uppercase tracking-widest font-bold px-1 leading-relaxed">
                Enter the 12-digit Ref/UTR number from your bank confirmation.
              </p>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-mat-rose text-xs flex gap-2 items-start">
                  <ShieldCheck size={14} className="shrink-0 mt-0.5" />{errorMessage}
                </motion.p>
              )}

              {status === 'pending' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 text-xs leading-relaxed space-y-2">
                  <p className="font-bold">⏳ Verification Pending</p>
                  <p>Your UTR has been logged. Once the Admin manually verifies the transaction, your rank jump will be activated and you will be notified in your Inbox.</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-mat-wine/5 border border-mat-wine/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-mat-wine w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold text-mat-wine text-sm">Leap Activated!</p>
                      {leapResult && (
                        <p className="text-[10px] text-mat-slate/50">+{leapResult.toLocaleString()} rank points credited to your standing.</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-mat-slate/50 pl-8">Your new absolute rank will reflect within moments. Refresh your dashboard to see the update.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto flex items-center gap-2 text-[9px] uppercase font-black tracking-widest text-mat-slate/20">
              <ShieldCheck size={10} /> Secured by the Turso Vault
            </div>
          </form>
        </div>
      </div>

      <div className="py-20 text-center space-y-4">
        <p className="text-[11px] font-black uppercase tracking-[1.5em] opacity-10 text-mat-wine pointer-events-none select-none">
          Matriarch // Pay Once, Rise Permanently
        </p>
        <p className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 text-mat-wine pointer-events-none select-none">
          Matriarch is a trademark of METACHASM (OPC) PRIVATE LIMITED.
        </p>
      </div>

      {/* ── Help Modal Coverage ── */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-mat-obsidian/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-mat-cream border border-mat-rose/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center gap-4 text-mat-wine">
                <div className="w-10 h-10 rounded-full bg-mat-rose/10 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-bold italic uppercase tracking-tight">Purchase Help</h3>
              </div>

              <div className="space-y-6 text-sm leading-relaxed text-mat-slate/60">
                <div className="space-y-2">
                  <p className="text-mat-wine font-bold text-xs uppercase tracking-widest">Step 1: Payment</p>
                  <p>Open your UPI app and pay the exact amount to <span className="text-mat-wine font-mono">{upiId}</span>.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-mat-wine font-bold text-xs uppercase tracking-widest">Step 2: Finding UTR</p>
                  <p>Look for a 12-digit number (UTR, Ref No, or Bank Reference) in your transaction history or SMS confirmation.</p>
                </div>

                <div className="space-y-2">
                  <p className="text-mat-wine font-bold text-xs uppercase tracking-widest">Step 3: Validation</p>
                  <p>Submit that 12-digit code. Once verified by the Admin, your Aura will be credited.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-4 bg-mat-wine text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-mat-wine-soft transition-all"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
