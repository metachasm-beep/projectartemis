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
        className="fixed inset-0 z-[400] bg-mat-obsidian/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative"
        >
           {/* Cell 1: Welcome Hero (Bento Span 8) */}
           <div className="md:col-span-8 mat-glass-deep p-10 md:p-16 rounded-[4rem] border border-mat-rose/10 flex flex-col justify-center space-y-8 bg-mat-cream/10">
              <div className="w-20 h-20 bg-mat-wine rounded-3xl flex items-center justify-center text-white shadow-mat-premium">
                 <Shield size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                 <h2 className="text-6xl font-black text-mat-wine italic leading-none">Sovereign <br />Identity.</h2>
                 <p className="text-xl text-mat-slate/50 leading-relaxed max-w-xl">
                    Establishing your statutory standing within the Matriarch Registry. {userEmail && <span className="text-mat-wine/40">[{userEmail}]</span>}
                 </p>
              </div>
           </div>

           {/* Cell 2: Age Gate (Bento Span 4) */}
           <div className="md:col-span-4 mat-glass-deep p-10 rounded-[4rem] border border-mat-rose/10 flex flex-col justify-between bg-white/5 group hover:border-mat-wine/30 transition-all">
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-mat-wine">
                    <Calendar size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Age Ritual</span>
                 </div>
                 <div className="space-y-4">
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-20 bg-mat-obsidian text-mat-gold border-none rounded-3xl px-8 font-black text-2xl focus:ring-4 focus:ring-mat-gold/20 outline-none transition-all shadow-inner"
                    />
                    <p className="text-[10px] text-mat-slate/40 font-bold uppercase tracking-widest leading-relaxed">Statutory Hard-Lock: <br />Minimum 18 CY required.</p>
                 </div>
              </div>
           </div>

           {/* Cell 3: Data Sovereignty (Bento Span 4) */}
           <div className="md:col-span-4 mat-glass-deep p-10 rounded-[4rem] border border-mat-rose/10 flex flex-col gap-8">
              <div className="flex items-center gap-3 text-mat-wine">
                 <Zap size={20} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Extraction Consent</span>
              </div>
              
              <div className="space-y-4">
                 <div 
                   onClick={() => setAnalytics(!analytics)}
                   className={`p-6 rounded-3xl cursor-pointer border transition-all flex flex-col gap-4 ${analytics ? 'bg-mat-wine text-white border-mat-wine shadow-lg scale-[1.02]' : 'bg-mat-cream/40 border-mat-rose/10 text-mat-wine'}`}
                 >
                    <p className="text-sm font-black uppercase tracking-widest">Analytics Flow</p>
                    <p className={`text-[10px] leading-relaxed ${analytics ? 'opacity-80' : 'opacity-40 font-medium'}`}>Synchronizes your resonance with optimized discovery algorithms.</p>
                 </div>

                 <div 
                   onClick={() => setAds(!ads)}
                   className={`p-6 rounded-3xl cursor-pointer border transition-all flex flex-col gap-4 ${ads ? 'bg-mat-wine text-white border-mat-wine shadow-lg scale-[1.02]' : 'bg-mat-cream/40 border-mat-rose/10 text-mat-wine'}`}
                 >
                    <p className="text-sm font-black uppercase tracking-widest">Visual Tethers</p>
                    <p className={`text-[10px] leading-relaxed ${ads ? 'opacity-80' : 'opacity-40 font-medium'}`}>Permits tailored media infusions based on your standing.</p>
                 </div>
              </div>
           </div>

           {/* Cell 4: Infrastructure (Bento Span 8) */}
           <div className="md:col-span-8 mat-glass-deep p-10 rounded-[4rem] border border-mat-rose/10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 h-full">
                 <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-3 text-mat-wine">
                       <CheckCircle2 size={20} />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Integrity</span>
                    </div>
                    <p className="text-2xl font-bold italic text-mat-wine leading-tight"> Platforms algorithms are immutable and active by default to maintain the sanctuary order. </p>
                 </div>

                 <button 
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="w-full md:w-64 h-32 bg-mat-wine text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group/btn relative overflow-hidden shadow-2xl hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-20"
                 >
                    <div className="absolute inset-0 bg-gradient-to-tr from-mat-rose to-transparent opacity-0 group-hover/btn:opacity-40 transition-opacity" />
                    {isLoading ? (
                      <span className="animate-pulse text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing...</span>
                    ) : (
                      <>
                        <span className="text-xl font-black italic">Enter Sanctuary</span>
                        <ChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
                      </>
                    )}
                 </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-10 right-10 flex items-center gap-4 text-red-600 bg-red-50/80 backdrop-blur-md p-4 rounded-2xl border border-red-100"
                >
                   <AlertCircle size={18} />
                   <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
