import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, ArrowRight, Camera, ShieldCheck, Trophy } from 'lucide-react';

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

type OnboardingStep = 'ROLE' | 'BASICS' | 'PHOTO' | 'BIO_INTENT' | 'LEGAL';

export const Onboarding: React.FC<OnboardingProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('ROLE');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(10);
  const [formData, setFormData] = useState({
    full_name: '',
    role: '' as 'woman' | 'man' | '',
    date_of_birth: '',
    bio: '',
    city: '',
    intent: 'LONG_TERM',
    photos: [] as string[],
  });

  // Strength calculation logic (Gamify.txt)
  useEffect(() => {
    let s = 10;
    if (formData.role) s += 10;
    if (formData.full_name) s += 10;
    if (formData.city) s += 10;
    if (formData.photos.length > 0) s += 25;
    if (formData.bio.length > 20) s += 15;
    setStrength(Math.min(s, 90)); // Max 90 before Aadhaar
  }, [formData]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          display_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          bio: formData.bio,
          city: formData.city,
          role: formData.role,
          intent: formData.intent,
          profile_strength: strength,
          onboarding_status: 'COMPLETED',
          is_verified: false,
          is_active: false, // Dormant until Aadhaar
          rank_score: formData.role === 'man' ? 500 : 0, // Initial seed rank
          rank_tier: formData.role === 'man' ? 'BRONZE' : 'OBSERVER',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error("Error updates profile:", err);
      alert("Protocol synchronization failed. Re-attempting...");
    } finally {
      setLoading(false);
    }
  };

  const next = (nextStep: OnboardingStep) => setStep(nextStep);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-hidden">
      {/* Dynamic Background Glow based on Role */}
      <AnimatePresence>
        {formData.role === 'woman' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-matriarch-violet blur-[160px] rounded-full pointer-events-none" 
          />
        )}
        {formData.role === 'man' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mat-gold blur-[160px] rounded-full pointer-events-none" 
          />
        )}
      </AnimatePresence>

      {/* Progress / Strength Meter for Men */}
      {formData.role === 'man' && step !== 'ROLE' && (
         <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-12 w-full max-w-md px-8 z-50">
            <div className="flex justify-between items-end mb-2">
               <span className="text-[10px] font-black text-mat-gold tracking-widest uppercase">Petitioner Strength</span>
               <span className="text-xl font-mono text-white italic">{strength}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
               <motion.div 
                  className="h-full bg-gradient-to-r from-mat-gold to-mat-gold/40"
                  animate={{ width: `${strength}%` }}
               />
            </div>
         </motion.div>
      )}

      <Card className="w-full max-w-lg mat-panel-premium border-none shadow-premium relative z-10 overflow-hidden rounded-[2.5rem]">
        <div className={`absolute top-0 left-0 w-full h-1 ${
           formData.role === 'woman' ? 'bg-matriarch-violet' : 'bg-mat-gold'
        }`} />
        
        <CardContent className="p-12">
          <AnimatePresence mode="wait">
            {step === 'ROLE' && (
              <motion.div key="role" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-display font-black text-white italic tracking-tight uppercase">Enter the Matriarch</h2>
                  <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Declare your position</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormData({ ...formData, role: 'woman' })} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${formData.role === 'woman' ? 'bg-matriarch-violet/20 border-matriarch-violet' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${formData.role === 'woman' ? 'bg-matriarch-violet text-white' : 'bg-white/5 text-matriarch-violet'}`}><User size={28} /></div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-white">The Matriarch</span>
                  </button>
                  <button onClick={() => setFormData({ ...formData, role: 'man' })} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${formData.role === 'man' ? 'bg-mat-gold/10 border-mat-gold' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${formData.role === 'man' ? 'bg-mat-gold text-black' : 'bg-white/5 text-mat-gold'}`}><User size={28} /></div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-white">The Petitioner</span>
                  </button>
                </div>

                <Button disabled={!formData.role} onClick={() => next('BASICS')} className="w-full h-20 bg-white text-black hover:bg-neutral-200 font-black tracking-widest uppercase rounded-2xl group flex gap-3">
                  Initiate Sequence <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 'BASICS' && (
              <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase tracking-widest">Base Identity</h2>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                     <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="DESIGNATION" className="h-16 bg-white/5 border-white/10 rounded-2xl text-white uppercase font-mono tracking-widest" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">City Hub</label>
                     <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="LOCATION CODE" className="h-16 bg-white/5 border-white/10 rounded-2xl text-white uppercase font-mono tracking-widest" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Temporal Origin (DOB)</label>
                     <Input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="h-16 bg-white/5 border-white/10 rounded-2xl text-white [color-scheme:dark]" />
                   </div>
                </div>
                <Button disabled={!formData.full_name || !formData.city || !formData.date_of_birth} onClick={() => next('PHOTO')} className="w-full h-20 bg-white text-black font-black tracking-widest uppercase rounded-2xl">Confirm Basics</Button>
              </motion.div>
            )}

            {step === 'PHOTO' && (
              <motion.div key="photo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Visual Verification</h2>
                  <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Transmit your high-fidelity image</p>
                </div>
                <div className="aspect-[3/4] w-full max-w-[240px] mx-auto bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 relative overflow-hidden group cursor-pointer hover:border-mat-gold/30 transition-all">
                   {formData.photos.length > 0 ? (
                      <img src={formData.photos[0]} className="absolute inset-0 w-full h-full object-cover" alt="Profile" />
                   ) : (
                      <>
                        <Camera className="text-white/20 w-12 h-12 group-hover:text-mat-gold transition-colors" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-mat-gold">Upload Probe</span>
                      </>
                   )}
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      if (e.target.files) setFormData({ ...formData, photos: [URL.createObjectURL(e.target.files[0])] });
                   }} />
                </div>
                <Button disabled={formData.photos.length === 0} onClick={() => next('BIO_INTENT')} className="w-full h-20 bg-white text-black font-black tracking-widest uppercase rounded-2xl">Verify Transmission</Button>
              </motion.div>
            )}

            {step === 'BIO_INTENT' && (
               <motion.div key="bio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Neural Matrix</h2>
                    <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Describe your resonance</p>
                  </div>
                  <div className="space-y-6">
                    <textarea 
                      value={formData.bio} 
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                      placeholder="CORE ESSENCE..." 
                      className="w-full h-40 p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white uppercase font-mono tracking-widest focus:border-mat-gold outline-none resize-none" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                       {['LONG_TERM', 'EXPLORATION'].map(intent => (
                          <button key={intent} onClick={() => setFormData({ ...formData, intent })} className={`p-4 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${formData.intent === intent ? 'bg-white/10 border-white/40 text-white' : 'bg-white/5 border-transparent text-white/20'}`}>
                             {intent.replace('_', ' ')}
                          </button>
                       ))}
                    </div>
                  </div>
                  <Button disabled={!formData.bio} onClick={() => next('LEGAL')} className="w-full h-20 bg-white text-black font-black tracking-widest uppercase rounded-2xl">Neural Sync</Button>
               </motion.div>
            )}

            {step === 'LEGAL' && (
              <motion.div key="legal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-green-400/10 border border-green-400/20">
                    <ShieldCheck className="text-green-400 w-10 h-10" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase leading-tight">Matriarch Command Accepted</h2>
                    <p className="text-[11px] text-matriarch-textSoft leading-relaxed font-mono px-4">
                       I AGREE TO THE PROTOCOLS OF CONDUCT, DATA RETENTION, AND IDENTITY VERIFICATION WITHIN THE MATRIARCH NETWORK.
                    </p>
                 </div>
                 <div className="space-y-4 pt-4">
                    <Button onClick={updateProfile} disabled={loading} className={`w-full h-24 font-black tracking-widest uppercase rounded-2xl shadow-2xl transition-all scale-105 active:scale-100 ${
                       formData.role === 'woman' ? 'bg-matriarch-violet text-white hover:bg-matriarch-violet/90' : 'bg-mat-gold text-black hover:bg-mat-gold/90 shadow-mat-gold/20'
                    }`}>
                       {loading ? "INITIALIZING..." : (
                          <span className="flex items-center gap-3 text-lg">ENTER SYSTEM <Trophy size={20} /></span>
                       )}
                    </Button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <p className="fixed bottom-12 text-[8px] text-white/10 font-black tracking-[0.8em] uppercase">Protocol: Deep Recovery v1.0.2</p>
    </div>
  );
};
