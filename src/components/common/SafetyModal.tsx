import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Ban, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName?: string;
  onActionComplete: (action: 'report' | 'block') => void;
}

const REASONS = [
  { id: 'harassment', label: 'Harassment or Bullying', icon: ShieldAlert },
  { id: 'fake', label: 'Fake Profile / Catfishing', icon: Info },
  { id: 'illegal', label: 'Illegal or Harmful Content', icon: AlertTriangle },
  { id: 'underage', label: 'Underage (Less than 18)', icon: Info },
  { id: 'other', label: 'Other Protocol Violations', icon: AlertTriangle }
];

const SafetyModal: React.FC<SafetyModalProps> = ({ 
  isOpen, 
  onClose, 
  targetUserId, 
  targetUserName = 'this user',
  onActionComplete 
}) => {
  const [step, setStep] = useState<'choice' | 'reporting' | 'blocking' | 'success'>('choice');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    try {
      // Logic for /api/safety/report
      console.log(`REPORTING USER ${targetUserId} for ${reason}`);
      await new Promise(r => setTimeout(r, 1500)); // Mock API delay
      setStep('success');
      onActionComplete('report');
    } catch (err) {
       console.error("Safety action failed", err);
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleBlock = async () => {
    setIsSubmitting(true);
    try {
      // Logic for /api/safety/block
      console.log(`BLOCKING USER ${targetUserId}`);
      await new Promise(r => setTimeout(r, 1000)); // Mock API delay
      setStep('success');
      onActionComplete('block');
    } catch (err) {
       console.error("Safety action failed", err);
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-mat-obsidian/60 backdrop-blur-md"
           onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
           <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
              style={{ border: '1px solid rgba(123,45,66,0.1)' }}
           >
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-mat-wine/5 text-mat-wine/40 hover:text-mat-wine transition-all"
              >
                <X size={20} />
              </button>

              {step === 'choice' && (
                 <div className="space-y-8">
                    <div className="text-center space-y-4">
                       <ShieldAlert className="w-16 h-16 text-mat-rose mx-auto" strokeWidth={1} />
                       <h2 className="text-3xl font-black text-mat-wine uppercase tracking-tighter">Sovereign Guard</h2>
                       <p className="text-xs text-mat-slate/50 leading-relaxed uppercase tracking-widest font-bold">Protect your sanctuary. Report or block <span className="text-mat-wine">{targetUserName}</span>.</p>
                    </div>

                    <div className="space-y-3">
                       <Button 
                         onPress={() => setStep('reporting')}
                         className="w-full h-16 bg-mat-wine/5 border border-mat-rose/20 text-mat-wine rounded-2xl flex items-center justify-between px-6 hover:bg-mat-wine/10"
                       >
                          <span className="font-black uppercase tracking-widest text-[10px]">Report Policy Violation</span>
                          <ShieldAlert size={18} />
                       </Button>
                       <Button 
                         onPress={() => setStep('blocking')}
                         className="w-full h-16 bg-mat-obsidian text-white rounded-2xl flex items-center justify-between px-6 hover:bg-black"
                       >
                          <span className="font-black uppercase tracking-widest text-[10px]">Immediate Block</span>
                          <Ban size={18} />
                       </Button>
                    </div>
                 </div>
              )}

              {step === 'reporting' && (
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold italic text-mat-wine">Select Violation Reason</h3>
                    <div className="space-y-2">
                       {REASONS.map(r => (
                          <button 
                            key={r.id}
                            onClick={() => setReason(r.id)}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${reason === r.id ? 'bg-mat-wine text-white border-mat-wine shadow-lg' : 'bg-white border-mat-wine/10 text-mat-slate/60 hover:bg-mat-wine/5'}`}
                          >
                             <r.icon size={18} />
                             <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                          </button>
                       ))}
                    </div>
                    <Button 
                       disabled={!reason || isSubmitting}
                       onPress={handleReport}
                       className="w-full h-16 bg-mat-wine text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-mat-rose-deep"
                    >
                       {isSubmitting ? 'Submitting Forensic Report...' : 'Submit Violation Report'}
                    </Button>
                 </div>
              )}

              {step === 'blocking' && (
                 <div className="space-y-8 text-center pt-4">
                    <Ban size={48} className="text-mat-obsidian mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-mat-wine uppercase tracking-tight italic leading-tight">Confirm Immediate <br />Protocol Block?</h3>
                    <p className="text-xs text-mat-slate/50 leading-relaxed font-medium uppercase tracking-[0.05em]">
                       This will permanently restrict any communication or discovery between you and this user. 
                       <br /><br />
                       Actions are immediate and strictly governed by the Protocol.
                    </p>
                    <div className="flex gap-4 pt-4">
                       <Button onPress={() => setStep('choice')} variant="ghost" className="flex-1 h-14 rounded-xl text-mat-slate/40 uppercase tracking-widest text-[9px] font-black border border-mat-wine/5">Cancel</Button>
                       <Button 
                         onPress={handleBlock} 
                         disabled={isSubmitting}
                         className="flex-1 h-14 bg-mat-obsidian text-white rounded-xl uppercase tracking-widest text-[9px] font-black shadow-lg"
                       >
                         {isSubmitting ? 'Restricting...' : 'Confirm Block'}
                       </Button>
                    </div>
                 </div>
              )}

              {step === 'success' && (
                 <div className="text-center space-y-8 py-10">
                    <CheckCircle2 size={64} className="text-[#00FF41] mx-auto animate-in zoom-in duration-500" />
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-mat-wine uppercase tracking-tighter italic">Sanctuary Restored</h3>
                       <p className="text-xs text-mat-slate/50 uppercase tracking-widest font-black">Your guard has been enforced.</p>
                    </div>
                    <Button onPress={onClose} className="w-full h-14 bg-mat-wine text-white rounded-xl uppercase tracking-widest text-[9px] font-black">Close Protocol Guard</Button>
                 </div>
              )}

           </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SafetyModal;
