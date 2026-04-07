import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Assuming user auth exists based on App.tsx
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Copy, IndianRupee, Loader2, ShieldCheck, Wallet } from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  const { user } = useAuth();
  
  // State
  const [topupAmount, setTopupAmount] = useState<number>(500); // Default ₹500
  const [utr, setUtr] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'pending' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Dynamic Intent Link
  // Fetched via VITE_UPI_ID from env
  const upiId = import.meta.env.VITE_UPI_ID || 'example@ybl';
  const userIdSegment = user?.id ? `MATRIARCH_USER_${user.id.substring(0, 8)}` : 'MATRIARCH_GUEST';
  
  // Construct pure UPI protocol URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=Matriarch&am=${topupAmount}&cu=INR&tn=${userIdSegment}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit UTR.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 'TEST_USER_ID',
          utr: utr
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify payment.');
      }

      if (res.status === 202) {
        setStatus('pending');
      } else {
        setStatus('success');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4B0082]/20 via-black to-black z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-tr from-[#9D4EDD] to-[#4B0082] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(157,78,221,0.3)] mb-4">
             <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Purchase Aura</h1>
          <p className="text-zinc-400 mt-2 text-sm">Empower your premium selection protocol. 1 Aura = ₹1.</p>
        </div>

        {/* Amount Selector */}
        <div className="mb-8">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 block">Select Amount</label>
          <div className="grid grid-cols-3 gap-3">
            {[100, 500, 1000].map(amt => (
              <button
                key={amt}
                onClick={() => setTopupAmount(amt)}
                className={`py-3 rounded-xl border transition-all duration-300 font-bold flex items-center justify-center gap-1 ${
                  topupAmount === amt 
                    ? 'border-[#9D4EDD] bg-[#9D4EDD]/10 text-[#9D4EDD] relative overflow-hidden' 
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {topupAmount === amt && (
                  <motion.div layoutId="activeAmount" className="absolute inset-0 bg-[#9D4EDD]/10" />
                )}
                <IndianRupee className="w-4 h-4" /> {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Phase 1: Intent View */}
        <div className="bg-black/40 rounded-2xl p-5 border border-zinc-800/80 mb-6 relative overflow-hidden group hover:border-[#9D4EDD]/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-12 h-12 text-[#9D4EDD]" />
          </div>
          <p className="text-sm text-zinc-400 mb-4 pr-10">
            Pay directly via your phone's UPI app (Google Pay, PhonePe, Paytm).
          </p>
          
          <a
            href={upiUrl}
            className="w-full flex items-center gap-3 justify-center bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-transform active:scale-95"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4" />
            Pay via Phone/UPI App
          </a>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 bg-zinc-900 rounded-lg p-3">
             <span className="truncate mr-2">Or send manually to: <strong className="text-zinc-300">{upiId}</strong></span>
             <button onClick={handleCopyUpi} className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors text-[#9D4EDD]">
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
             </button>
          </div>
        </div>

        {/* Phase 2: Claim View */}
        <div className="pt-2 border-t border-zinc-800/50">
          <form onSubmit={handleClaim}>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 block">Confirm transaction</label>
            <div className="relative">
              <input 
                type="text" 
                maxLength={12}
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))} // only digits
                placeholder="Enter 12-digit UTR number"
                className="w-full bg-black/50 border border-zinc-800 focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] rounded-xl py-3.5 pl-4 pr-12 text-white outline-none transition-all placeholder:text-zinc-600 font-mono tracking-widest"
                disabled={status ===('loading') || status === ('success')}
              />
              <button 
                type="submit"
                disabled={utr.length !== 12 || status === 'loading' || status === 'success'}
                className="absolute right-2 top-2 bottom-2 bg-[#9D4EDD] hover:bg-[#7b32b3] disabled:bg-zinc-800 disabled:text-zinc-500 text-white w-10 flex items-center justify-center rounded-lg transition-colors"
              >
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
            
            {status === 'error' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-red-400 text-sm flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> {errorMessage}
              </motion.p>
            )}
            
            {status === 'pending' && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500/90 text-sm">
                 We've logged your request. We're waiting for the bank confirmation to instantly credit your Aura.
               </motion.div>
            )}

            {status === 'success' && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="font-bold mb-1">Top-up Successful!</h4>
                    <p className="text-emerald-500/80">Your Aura balance has been updated. You can now use premium features.</p>
                 </div>
               </motion.div>
            )}

          </form>
        </div>
      </motion.div>
    </div>
  );
};
