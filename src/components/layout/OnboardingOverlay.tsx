import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Shield, Zap, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OnboardingOverlayProps {
  isOpen: boolean;
  onComplete: (data: { dob: string; analytics: boolean; ads: boolean }) => Promise<void>;
  userEmail?: string;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ isOpen, onComplete, userEmail }) => {
  const [dob, setDob] = useState('');
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleFinish = async () => {
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }

    const age = calculateAge(dob);
    if (age < 18) {
      setError("Statutory Hard Block: You must be 18+ to enter Matriarch.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await onComplete({ dob, analytics, ads });
    } catch (err: any) {
      setError(err.message || "Onboarding failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[400] bg-mat-obsidian/95 backdrop-blur-3xl flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="max-w-xl w-full bg-mat-cream rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border border-mat-rose/10"
          style={{ minHeight: '70vh' }}
        >
          {/* Progress Decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-mat-wine/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '40%' }}
               className="h-full bg-mat-wine"
             />
          </div>

          <div className="p-10 md:p-16 flex-1 flex flex-col space-y-10">
            {/* Header */}
            <div className="space-y-4">
               <div className="w-14 h-14 bg-mat-wine rounded-2xl flex items-center justify-center text-white mb-6">
                  <Shield size={28} strokeWidth={1.5} />
               </div>
               <h2 className="text-4xl font-black text-mat-wine italic">Sovereign Onboarding</h2>
               <p className="text-sm text-mat-slate/50 leading-relaxed">
                 Welcome to Matriarch, {userEmail || 'Sovereign'}. Before you enter the ecosystem, we must establish your statutory eligibility and data preferences.
               </p>
            </div>

            {/* Age Gate */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-mat-wine">
                  <Calendar size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Statutory Age Verification</span>
               </div>
               <div className="relative group">
                  <input 
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-16 bg-white border border-mat-rose/10 rounded-2xl px-6 font-bold text-mat-wine-deep focus:ring-2 focus:ring-mat-wine/20 outline-none transition-all"
                  />
                  <p className="mt-2 text-[10px] text-mat-slate/40 font-medium">You must be at least 18 years of age to participate.</p>
               </div>
            </div>

            {/* Granular Consent */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-mat-wine">
                  <Zap size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Data Processing Consent</span>
               </div>
               
               <div className="space-y-4">
                  {/* Analytics */}
                  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-mat-rose/5 group hover:border-mat-wine/20 transition-all cursor-pointer" onClick={() => setAnalytics(!analytics)}>
                     <div>
                        <p className="text-sm font-bold text-mat-wine">Advanced Analytics</p>
                        <p className="text-[10px] text-mat-slate/40 mt-1">Improves your discovery and selection experience.</p>
                     </div>
                     <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${analytics ? 'bg-mat-wine' : 'bg-mat-rose/10'}`}>
                        <motion.div animate={{ x: analytics ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                     </div>
                  </div>

                  {/* Ads */}
                  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-mat-rose/5 group hover:border-mat-wine/20 transition-all cursor-pointer" onClick={() => setAds(!ads)}>
                     <div>
                        <p className="text-sm font-bold text-mat-wine">Personalized Media</p>
                        <p className="text-[10px] text-mat-slate/40 mt-1">Tailored ad experiences based on your ranking data.</p>
                     </div>
                     <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${ads ? 'bg-mat-wine' : 'bg-mat-rose/10'}`}>
                        <motion.div animate={{ x: ads ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                     </div>
                  </div>

                  {/* Ranking - Essential */}
                  <div className="flex items-center justify-between p-5 bg-mat-wine/5 rounded-2xl border border-mat-wine/10 opacity-60">
                     <div>
                        <p className="text-sm font-bold text-mat-wine">Ranking Algorithms</p>
                        <p className="text-[10px] text-mat-slate/40 mt-1">Essential for the platform&apos;s asymmetric mechanics.</p>
                     </div>
                     <CheckCircle2 className="text-mat-wine w-6 h-6" />
                  </div>
               </div>
            </div>

            {/* Error Message */}
            {error && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600"
               >
                 <AlertCircle size={18} className="shrink-0" />
                 <p className="text-[11px] font-bold leading-relaxed">{error}</p>
               </motion.div>
            )}

            {/* Footer Action */}
            <div className="pt-6">
               <button 
                 onClick={handleFinish}
                 disabled={isLoading}
                 className="w-full h-18 bg-mat-wine text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] shadow-xl shadow-mat-wine/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
               >
                  {isLoading ? 'Processing Access...' : (
                    <>
                      Enter Matriarch 
                      <ChevronRight size={20} />
                    </>
                  )}
               </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
