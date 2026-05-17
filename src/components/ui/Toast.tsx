import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  senderName?: string;
}

export const Toast: React.FC<ToastProps> = ({ show, onClose, title, message, senderName }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          className="fixed top-24 left-1/2 z-[2000] w-[90%] max-w-md"
        >
          <div className="bg-mat-obsidian/90 backdrop-blur-2xl border border-mat-gold/20 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-mat-gold flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-mat-wine" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-gold mb-1">
                {title}
              </h4>
              <p className="text-[12px] text-mat-bone font-medium truncate">
                <span className="text-mat-gold font-bold">{senderName}: </span>
                {message}
              </p>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
