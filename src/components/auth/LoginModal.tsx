import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Modal, Button, useOverlayState } from '@heroui/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LoginModal - A premium authentication gateway for the Matriarch Sanctuary.
 * Redesigned using HeroUI v3 and Matriarch editorial design tokens.
 */
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manage modal state using HeroUI's overlay hook
  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    }
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to initiate secure entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal.Root state={state}>
      {/* Cinematic Backdrop with heavy blur */}
      <Modal.Backdrop className="bg-mat-noir/80 backdrop-blur-2xl" />
      
      <Modal.Container>
        <Modal.Dialog className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/20 p-0 mat-perspective-1000">
          
          {/* Sovereign Header */}
          <Modal.Header className="p-10 pb-0 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-mat-gold/5 text-mat-gold rounded-full flex items-center justify-center mb-8 shadow-[inset_0_2px_10px_rgba(212,175,55,0.1)] border border-mat-gold/10">
                <ShieldCheck size={40} className="animate-pulse" />
             </div>
             <Modal.Heading className="text-4xl font-display text-mat-noir mb-3 italic tracking-tight">
                Sanctuary Gate
             </Modal.Heading>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-noir/30">
                Identity Verification Protocol
             </p>
          </Modal.Header>

          {/* Authentication Body */}
          <Modal.Body className="p-10 md:p-14 pt-10">
             <div className="space-y-8">
                <Button 
                  onPress={handleGoogleLogin}
                  isPending={loading}
                  className="w-full h-20 rounded-3xl bg-mat-noir text-white flex items-center justify-center gap-6 hover:bg-[#2A2A2A] transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(0,0,0,0.3)] group border border-white/5 relative overflow-hidden"
                >
                   {/* Iridescent shimmer effect on hover */}
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[mat-shimmer_2s_infinite] pointer-events-none" />
                   
                   <svg width="24" height="24" viewBox="0 0 24 24" className="grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                   </svg>
                   <span className="text-[14px] font-black uppercase tracking-[0.25em] text-white/90">
                      {loading ? 'Accessing...' : 'Enter with Google'}
                   </span>
                </Button>

                {error && (
                  <div className="flex items-center gap-4 p-5 bg-red-50/50 rounded-2xl border border-red-100/50 mt-6 animate-in slide-in-from-bottom-2 duration-500">
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                    <p className="text-[10px] text-red-600/80 font-bold uppercase tracking-widest leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}
             </div>

             <div className="mt-16 text-center border-t border-mat-noir/5 pt-10">
                <p className="text-[10px] text-mat-noir/30 max-w-[280px] mx-auto leading-relaxed italic font-medium">
                   Powered by Supabase Sovereign Identity. Your digital essence remains protected within our sanctuary.
                </p>
             </div>
          </Modal.Body>

          {/* Discreet Close Trigger */}
          <Modal.CloseTrigger className="absolute top-10 right-10 p-3 rounded-full bg-mat-noir/5 text-mat-noir/30 hover:bg-mat-noir/10 hover:text-mat-noir transition-all z-10 border-none outline-none focus:ring-2 focus:ring-mat-gold/20" />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Root>
  );
};

export default LoginModal;
