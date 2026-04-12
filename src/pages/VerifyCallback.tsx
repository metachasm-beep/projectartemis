import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export const VerifyCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const sessionId = searchParams.get('verificationSessionId');
      const verificationStatus = searchParams.get('status');
      const isEmbedded = window.self !== window.top;

      console.log('Didit Callback Received:', { sessionId, verificationStatus, isEmbedded });

      if (verificationStatus === 'Approved') {
        try {
          // Send signal to parent if embedded in iframe
          if (isEmbedded) {
            window.parent.postMessage({ 
              type: 'DIDIT_COMPLETE', 
              status: 'Approved',
              sessionId 
            }, '*');
            setStatus('SUCCESS');
            return; // Stay on page to hold the message state
          }

          // Get the current user for top-level navigation
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setErrorMessage("Identity lost in transmission. Please sign in again.");
            setStatus('ERROR');
            return;
          }

          // Update profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_verified: true,
              is_active: true,
              onboarding_status: 'COMPLETED',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          setStatus('SUCCESS');
          
          // Auto-redirect after 3 seconds for top-level
          setTimeout(() => {
            navigate('/discovery');
          }, 3000);

        } catch (err: any) {
          console.error('Callback sync error:', err);
          if (isEmbedded) {
             window.parent.postMessage({ type: 'DIDIT_COMPLETE', status: 'Error', message: 'Handshake Sync Failed' }, '*');
          }
          setErrorMessage("The Sanctuary failed to sync your truth. Please contact the Matriarch.");
          setStatus('ERROR');
        }
      } else {
        if (isEmbedded) {
           window.parent.postMessage({ 
             type: 'DIDIT_COMPLETE', 
             status: 'Error', 
             message: verificationStatus === 'Declined' ? 'Identity Match Failed' : 'Handshake Interrupted' 
           }, '*');
        }
        setStatus('ERROR');
        setErrorMessage(
          verificationStatus === 'Declined' 
            ? "Identity match failed. Ensure your liveness and document match perfectly." 
            : "Verification interrupted. The circuit was closed prematurely."
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,99,255,0.05),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mat-panel-premium p-12 rounded-[3.5rem] bg-black/40 backdrop-blur-2xl border border-white/5 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-matriarch-violetBright to-transparent opacity-50" />

        {status === 'LOADING' && (
          <div className="space-y-6">
            <div className="relative flex justify-center">
              <Loader2 className="w-16 h-16 text-matriarch-violetBright animate-spin" />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-matriarch-violetBright/50" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-black text-white italic tracking-tight uppercase">Synchronizing Truth</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Validating Biometric Resonance...</p>
            </div>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Identity Secured</h2>
              <p className="text-[11px] text-green-400 font-bold uppercase tracking-[0.4em] animate-pulse">Welcome to the Inner Sanctuary</p>
              <p className="text-[10px] text-white/30 lowercase italic">Redirecting to Discovery feed in moments...</p>
            </div>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-black text-white italic tracking-tight uppercase">Handshake Failed</h2>
              <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">{errorMessage}</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full h-16 bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 font-black tracking-widest uppercase rounded-2xl flex gap-3"
            >
              Return to Dashboard <ArrowRight size={18} />
            </Button>
          </div>
        )}

        <div className="pt-8 border-t border-white/5">
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">Verification Protocol 2.4.7 • Secure Handshake</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCallback;
