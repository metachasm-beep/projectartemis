import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, X, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerificationRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVerification: () => void;
  role: 'man' | 'woman' | 'admin';
}

export const VerificationRequirementModal: React.FC<VerificationRequirementModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartVerification,
  role
}) => {
  const isMan = role === 'man';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-mat-gold/10 blur-[100px] rounded-full -z-10" />
              
              <div className="w-24 h-24 rounded-[2.5rem] bg-mat-gold/10 border border-mat-gold/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <ShieldCheck size={40} className="text-mat-gold animate-pulse" />
              </div>

              <h2 className="mat-text-fluid-large text-mat-bone mb-4">
                Sovereign <br /> <span className="text-mat-gold">Validation.</span>
              </h2>
              
              <p className="text-[12px] uppercase tracking-[0.3em] text-white/40 font-bold mb-8 italic">
                Trust is the bedrock of our Sanctuary.
              </p>

              <div className="space-y-6 mb-10 text-left bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex gap-4">
                  <div className="mt-1"><Lock size={16} className="text-mat-gold" /></div>
                  <p className="text-[11px] text-mat-bone/70 leading-relaxed uppercase tracking-widest">
                    Messaging and Discovery are restricted to <span className="text-mat-gold font-bold">Identity-Sealed</span> members only.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><UserCheck size={16} className="text-mat-gold" /></div>
                  <p className="text-[11px] text-mat-bone/70 leading-relaxed uppercase tracking-widest">
                    This ensures a community of genuine intent and unparalleled safety.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={onStartVerification}
                  className="h-16 rounded-2xl bg-mat-gold text-mat-wine font-black tracking-[0.2em] uppercase text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-mat-gold"
                >
                  Apply Identity Seal <ArrowRight size={16} className="ml-3" />
                </Button>
                
                <button 
                  onClick={onClose}
                  className="py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all italic"
                >
                  Continue Browsing Profile
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
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
