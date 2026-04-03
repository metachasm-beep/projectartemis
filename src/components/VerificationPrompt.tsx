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
        className={`p-6 rounded-[2rem] border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          isMan 
            ? 'bg-mat-gold/5 border-mat-gold/20' 
            : 'bg-matriarch-violet/5 border-matriarch-violet/20'
        }`}
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isMan ? 'bg-mat-gold text-black' : 'bg-matriarch-violet text-white'
          }`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Trust is the Foundation</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">
              Verify your identity to unlock Discovery and connect with the Sanctuary.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)}
          className={`h-14 px-8 rounded-2xl font-black tracking-widest uppercase text-[10px] transition-all hover:scale-105 active:scale-95 ${
            isMan 
              ? 'bg-mat-gold text-black hover:bg-mat-gold/90 shadow-lg shadow-mat-gold/10' 
              : 'bg-matriarch-violet text-white hover:bg-matriarch-violet/90 shadow-lg shadow-matriarch-violet/10'
          }`}
        >
          Verify Now <ArrowRight size={14} className="ml-2" />
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>
              
              <div className="max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
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
