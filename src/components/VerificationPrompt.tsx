import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AadhaarVerification } from './AadhaarVerification';

interface VerificationPromptProps {
  userId: string;
  role: 'man' | 'woman';
  onVerified: () => void;
}

export const VerificationPrompt: React.FC<VerificationPromptProps> = ({ userId, role, onVerified }) => {
  const [showModal, setShowModal] = useState(false);

  const isMan = role === 'man';

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-[2.5rem] border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 ${
          isMan 
            ? 'bg-mat-gold/5 border-mat-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]' 
            : 'bg-matriarch-violetBright/5 border-matriarch-violetBright/20 shadow-[0_0_50px_rgba(138,99,255,0.05)]'
        }`}
      >
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
            isMan ? 'bg-mat-gold text-black' : 'bg-matriarch-violetBright text-white'
          }`}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="mat-text-label-pro !text-[11px] text-white not-italic mb-1">A Sanctuary Built on Truth</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-medium leading-relaxed italic">
              Let us know you are real, so you can truly be found in our Sanctuary.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)}
          className={`h-14 px-10 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition-all hover:scale-105 active:scale-95 ${
            isMan 
              ? 'bg-mat-gold text-black hover:bg-mat-gold/90 shadow-mat-gold' 
              : 'bg-matriarch-violetBright text-white hover:bg-matriarch-violetBright/90 shadow-[0_0_30px_rgba(138,99,255,0.3)]'
          }`}
        >
          Reveal Your Truth <ArrowRight size={14} className="ml-3" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute -top-6 -right-6 w-12 h-12 bg-black/40 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all z-20"
              >
                <X size={24} />
              </button>
              
              <div className="max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-[#0F0F10] border border-white/10">
                <AadhaarVerification 
                  userId={userId} 
                  onVerified={() => {
                    onVerified();
                    setShowModal(false);
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
