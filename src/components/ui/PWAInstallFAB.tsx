import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Share, HelpCircle, Apple } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface PWAInstallFABProps {
  variant?: 'gold' | 'rose' | 'slate';
}

/**
 * 🛰️ PWAInstallFAB: Sovereign Induction Interface.
 * Floating Action Button for establishing home screen sanctuary presence.
 * Relocated to avoid overlap with Blog Editor tools.
 */
export const PWAInstallFAB: React.FC<PWAInstallFABProps> = ({ variant = 'rose' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed, don't show the FAB
  if (isInstalled) return null;

  // For Android/Desktop: only show if installable (deferredPrompt exists)
  // For iOS: show always (unless installed) because we can't detect installability, just guide them
  if (!isInstallable && !isIOS) return null;

  const colors = {
    rose: 'bg-rose-500 text-white shadow-rose-500/20',
    gold: 'bg-mat-gold text-black shadow-mat-gold/20',
    slate: 'bg-[#3C2F2F] text-white shadow-[#3C2F2F]/20'
  };

  return (
    <>
      <AnimatePresence>
      {(!isInstalled && (isInstallable || isIOS)) && (
        <div className="fixed bottom-24 right-8 md:bottom-32 md:right-12 z-[100] flex items-center gap-3">
          {/* Help Bubble - Now Next to the Install Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowGuide(true)}
            className={`w-14 h-14 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all ${
              variant === 'slate' 
                ? 'bg-[#3C2F2F]/10 border-[#3C2F2F]/20 text-[#3C2F2F]/40 hover:text-[#3C2F2F] hover:border-[#3C2F2F]/40' 
                : 'bg-white/10 border-white/20 text-white/40 hover:text-white hover:border-white/40'
            }`}
          >
            <HelpCircle size={22} />
          </motion.button>

          {/* Main Install Button - Icon Only on Mobile as requested */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isIOS ? () => setShowGuide(true) : install}
            className={`w-14 h-14 md:w-auto md:px-8 md:py-4 rounded-full shadow-2xl flex items-center justify-center md:justify-start gap-4 group relative overflow-hidden transition-all ${colors[variant]}`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
               <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.3em] leading-none">
                 Install App
               </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Induction Guidance Protocol */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-6 bg-[#0A0A0B]/90 backdrop-blur-2xl"
            onClick={() => setShowGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#FFFDF9] p-10 md:p-14 rounded-[3rem] border border-[#3C2F2F]/10 flex flex-col items-center text-center space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-rose-500/5 flex items-center justify-center text-rose-500 shadow-inner">
                {isIOS ? <Apple size={40} /> : <Smartphone size={40} />}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black italic text-[#3C2F2F] tracking-tighter">Sovereign Induction</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3C2F2F]/20">Mobile Sanctuary Protocol</p>
                </div>

                <p className="text-sm font-medium text-[#3C2F2F]/60 leading-relaxed max-w-sm mx-auto">
                  Establishing the Matriarch PWA provides a full-screen, native experience with biometric security and real-time resonance notifications.
                </p>

                <div className="space-y-4 pt-6 text-left max-w-xs mx-auto">
                   {isIOS ? (
                     <>
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-[#3C2F2F] text-white flex items-center justify-center text-xs font-black shadow-lg">1</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/60">Tap the <span className="text-rose-500 font-bold">Share</span> icon in Safari</p>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-[#3C2F2F] text-white flex items-center justify-center text-xs font-black shadow-lg">2</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/60">Select <span className="text-rose-500 font-bold">"Add to Home Screen"</span></p>
                        </div>
                     </>
                   ) : (
                     <>
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-[#3C2F2F] text-white flex items-center justify-center text-xs font-black shadow-lg">1</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/60">Click the <span className="text-rose-500 font-bold">"Install"</span> button above</p>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-[#3C2F2F] text-white flex items-center justify-center text-xs font-black shadow-lg">2</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/60">Acknowledge the browser prompt</p>
                        </div>
                     </>
                   )}
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowGuide(false);
                  if (!isIOS) install();
                }}
                className="w-full py-5 bg-rose-500 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-rose-500/30 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {isIOS ? 'Acknowledge Protocol' : 'Begin Induction'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
