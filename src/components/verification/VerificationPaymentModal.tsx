import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Copy, ArrowRight, Loader2, CheckCircle2, X, HelpCircle, Info } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/api';

interface VerificationPaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationPaymentModal: React.FC<VerificationPaymentModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuthContext();
  const [utr, setUtr] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const upiId = 'matriarch@ptyes';
  const amount = 49; // Default verification fee

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length < 12) {
      setErrorMessage('Please enter a valid 12-digit UTR number.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          utr: utr.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification claim failed.');

      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md z-10 bg-[#0F0F10] border border-white/10 rounded-[3rem] p-8 space-y-8"
      >
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-mat-gold text-mat-obsidian border border-white/10 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-mat-gold/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={28} className="text-mat-gold" />
          </div>
          <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Identity Tithe</h2>
          <p className="text-[10px] text-white/50 uppercase tracking-widest leading-relaxed">
            A centralized biometric check requires a one-time ledger validation fee of ₹{amount}.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase text-mat-gold tracking-[0.3em]">Pay via UPI</span>
              <p className="text-lg font-mono tracking-widest text-white">{upiId}</p>
            </div>
            <button onClick={handleCopyUpi} className="p-2 bg-mat-gold/10 text-mat-gold rounded-xl hover:bg-mat-gold/20 transition-all">
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowHelp(true)}
                className="w-14 h-14 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-mat-gold hover:bg-white/10 transition-all"
                title="How to find UTR?"
              >
                <HelpCircle size={24} />
              </button>
              
              <div className="relative flex-1">
                <input 
                  type="text" 
                  maxLength={12}
                  value={utr}
                  onChange={(e) => { setUtr(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
                  placeholder="12-digit UTR"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-black/40 border-2 border-white/10 focus:border-mat-gold rounded-2xl py-4 pl-6 pr-14 text-white font-mono tracking-[0.2em] outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={utr.length < 12 || status === 'loading' || status === 'success'}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-mat-gold text-mat-obsidian rounded-xl disabled:opacity-20 hover:bg-white transition-all flex items-center justify-center font-bold"
                >
                  {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} strokeWidth={3} />}
                </button>
              </div>
            </div>
            
            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-medium px-2">
              Enter the 12-digit Ref/UTR number from your payment confirmation.
            </p>
          </form>

          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs text-center border border-red-500/20 bg-red-500/10 p-3 rounded-xl overflow-hidden">
                {errorMessage}
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-green-400 text-xs text-center border border-green-500/20 bg-green-500/10 p-3 rounded-xl overflow-hidden space-y-1">
                <p className="font-bold uppercase tracking-widest text-[9px]">Validation Pending</p>
                <p>The Admin will verify your transaction. Check your messages shortly for the identity link.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Help Modal Coverage ── */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-[#161617] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center gap-4 text-mat-gold">
                <div className="w-10 h-10 rounded-full bg-mat-gold/10 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-bold italic uppercase tracking-tight">Identity Help</h3>
              </div>

              <div className="space-y-6 text-sm leading-relaxed text-white/60">
                <div className="space-y-2">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Step 1: Payment</p>
                  <p>Open your UPI app (GPay, PhonePe, Paytm) and pay ₹{amount} to <span className="text-mat-gold font-mono">{upiId}</span>.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Step 2: Finding UTR</p>
                  <p>Look for a 12-digit number labeled as <span className="text-white">UTR</span>, <span className="text-white">Ref No</span>, or <span className="text-white">Bank Reference</span> in your transaction history or SMS.</p>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Step 3: Submission</p>
                  <p>Paste that 12-digit code into the box. Once the Admin verifies it, your link will be delivered.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
