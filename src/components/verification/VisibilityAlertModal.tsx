import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, ShieldAlert, X, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisibilityAlertModalProps {
  isOpen: boolean;
  onClose: (neverShowAgain: boolean) => void;
}

export const VisibilityAlertModal: React.FC<VisibilityAlertModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(neverShowAgain)}
            className="absolute inset-0 bg-mat-obsidian/95 backdrop-blur-3xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-lg z-10"
          >
            <div className="bg-[#0F0F10] border border-white/10 rounded-[4rem] p-10 md:p-14 text-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-mat-rose/10 blur-[100px] rounded-full -z-10" />
              
              <div className="w-24 h-24 rounded-[2.5rem] bg-mat-rose/10 border border-mat-rose/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <EyeOff size={40} className="text-mat-rose" />
              </div>

              <h2 className="mat-text-fluid-large text-mat-bone mb-4">
                Invisible <br /> <span className="text-mat-rose">Presence.</span>
              </h2>
              
              <p className="text-[12px] uppercase tracking-[0.3em] text-white/40 font-bold mb-8 italic">
                The Sanctuary remains veiled to you.
              </p>

              <div className="space-y-6 mb-10 text-left bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex gap-4">
                  <div className="mt-1"><ShieldAlert size={16} className="text-mat-rose" /></div>
                  <p className="text-[11px] text-mat-bone/70 leading-relaxed uppercase tracking-widest">
                    Your profile is currently <span className="text-mat-rose font-bold">hidden</span> from the Discovery section of all Sovereigns.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><ArrowRight size={16} className="text-mat-gold" /></div>
                  <p className="text-[11px] text-mat-bone/70 leading-relaxed uppercase tracking-widest">
                    Only <span className="text-mat-gold font-bold">Identity-Sealed</span> members are visible to the community.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Button 
                  onClick={() => onClose(neverShowAgain)}
                  className="h-16 rounded-2xl bg-mat-rose text-white font-black tracking-[0.2em] uppercase text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-mat-rose"
                >
                  I Understand
                </Button>
                
                <div 
                  className="flex items-center justify-center gap-3 cursor-pointer group"
                  onClick={() => setNeverShowAgain(!neverShowAgain)}
                >
                  <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    neverShowAgain ? 'bg-mat-rose border-mat-rose' : 'border-white/20 group-hover:border-white/40'
                  }`}>
                    {neverShowAgain && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-all">
                    Don't show this again
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onClose(neverShowAgain)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-black/40 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
