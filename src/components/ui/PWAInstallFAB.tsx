import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Share } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface PWAInstallFABProps {
  variant?: 'gold' | 'rose' | 'slate';
}

/**
 * 🛰️ PWAInstallFAB: Sovereign Induction Interface.
 * Floating Action Button for establishing home screen sanctuary presence.
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
    rose: 'bg-mat-rose text-white shadow-mat-rose',
    gold: 'bg-mat-gold text-black shadow-mat-gold',
    slate: 'bg-mat-wine text-white shadow-mat-wine'
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[999]">
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isIOS ? () => setShowGuide(true) : install}
          className={`p-5 rounded-full shadow-2xl flex items-center gap-3 group overflow-hidden transition-all ${colors[variant]}`}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative flex items-center gap-3">
             <Smartphone size={24} className="group-hover:rotate-12 transition-transform" />
             <span className="max-w-0 group-hover:max-w-[200px] overflow-hidden whitespace-nowrap transition-all duration-500 text-[10px] font-black uppercase tracking-widest leading-none">
               Establish Sanctuary
             </span>
          </div>
        </motion.button>
      </div>

      {/* iOS Guidance Protocol */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-6 bg-mat-obsidian/80 backdrop-blur-xl"
            onClick={() => setShowGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm mat-glass p-10 rounded-[3rem] border-mat-gold/20 flex flex-col items-center text-center space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-[2rem] bg-mat-gold/10 flex items-center justify-center text-mat-gold">
                <Share size={32} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold italic text-mat-wine">Induction Guide</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/60 leading-relaxed">
                  To establish the Matriarch Sanctuary on your iOS device:
                </p>
                <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-4 text-left">
                     <div className="w-8 h-8 rounded-full bg-mat-wine text-white flex items-center justify-center text-[10px] font-black">1</div>
                     <p className="text-[9px] font-black uppercase tracking-widest">Tap the <span className="text-mat-rose">Share</span> icon in Safari</p>
                   </div>
                   <div className="flex items-center gap-4 text-left">
                     <div className="w-8 h-8 rounded-full bg-mat-wine text-white flex items-center justify-center text-[10px] font-black">2</div>
                     <p className="text-[9px] font-black uppercase tracking-widest">Select <span className="text-mat-rose">"Add to Home Screen"</span></p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setShowGuide(false)}
                className="w-full py-4 bg-mat-wine text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
