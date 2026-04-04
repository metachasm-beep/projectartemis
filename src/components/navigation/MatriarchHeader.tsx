import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogOut, 
  HelpCircle, 
  ShieldCheck, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { supabase } from "@/lib/supabase";

export const MatriarchHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'wisdom', label: 'Knowledge Base', desc: 'Frequently Asked Questions', icon: HelpCircle, action: () => {
      setIsOpen(false);
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }},
    { id: 'verification', label: 'Self Verification', desc: 'Secure Your Identity', icon: ShieldCheck, action: () => {
      setIsOpen(false);
    }},
    { id: 'settings', label: 'Preferences', desc: 'Privacy & Settings', icon: Settings, action: () => {
      setIsOpen(false);
    }},
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="mat-container h-16 flex items-center justify-between">
          <MatriarchLogo className="scale-75 origin-left" />
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/5 border border-black/5 text-black/60 hover:text-black transition-all"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-white px-8 flex flex-col pt-24"
          >
            <div className="flex justify-between items-center mb-16">
               <MatriarchLogo />
               <button 
                 onClick={() => setIsOpen(false)}
                 className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 border border-black/5 text-black/40"
               >
                 <X size={24} />
               </button>
            </div>

            <div className="space-y-4">
               {menuItems.map((item) => (
                 <motion.div
                   key={item.id}
                   whileTap={{ scale: 0.98 }}
                   onClick={item.action}
                   className="p-6 rounded-2xl bg-black/[0.02] border border-black/5 flex items-center justify-between group cursor-pointer"
                 >
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                        <item.icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                         <h4 className="mat-text-label-pro !text-black mb-1">{item.label}</h4>
                         <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-medium">{item.desc}</p>
                      </div>
                   </div>
                   <ChevronRight size={16} className="text-black/10 group-hover:text-black transition-colors" />
                 </motion.div>
               ))}
            </div>

            <div className="mt-auto pb-16 space-y-8">
               <button 
                 onClick={async () => {
                   await supabase.auth.signOut();
                   window.location.reload();
                 }}
                 className="w-full h-16 rounded-xl border border-red-500/10 bg-red-50/50 text-red-500 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-red-50 transition-colors"
               >
                  <LogOut size={16} />
                  Terminate Connection
               </button>
               
               <p className="text-center mat-text-label-pro opacity-20">
                 Matriarch Protocol v1.1.0 — Swiss Edition
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
