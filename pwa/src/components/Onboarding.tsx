import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, MapPin, Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    role: '' as 'woman' | 'man' | '',
    date_of_birth: '',
    bio: '',
    city: '',
    referral_code: '',
  });

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          bio: formData.bio,
          city: formData.city,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update user role if needed (simplified here)
      if (formData.role) {
         await supabase.from('users').update({ role: formData.role }).eq('id', userId);
      }

      // Handle Invitation/Referral Code
      const inviteCode = formData.referral_code || localStorage.getItem('pending_invite_code');
      if (inviteCode) {
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/auth/consume-invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: inviteCode, user_id: userId }),
        });
        localStorage.removeItem('pending_invite_code');
      }

      onComplete();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to save protocol profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-matriarch-bg relative overflow-hidden">
      {/* Decorative background elements consistent with Landing */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-matriarch-violet/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-matriarch-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-lg mat-panel-premium border-none shadow-premium relative z-10 overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mat-gold via-mat-violet to-mat-gold" />
        
        <CardContent className="p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mat-gold/10 border border-mat-gold/20 mb-4">
                    <Sparkles className="text-mat-gold w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Protocol Identity</h2>
                  <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Select your role within the Matriarch</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, role: 'woman' })}
                    className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                      formData.role === 'woman' 
                        ? 'bg-matriarch-violet/20 border-matriarch-violet shadow-mat-violet/20 shadow-lg' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      formData.role === 'woman' ? 'bg-matriarch-violet text-white' : 'bg-white/5 text-matriarch-violet'
                    }`}>
                      <User size={24} strokeWidth={2} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-white">The Matriarch</span>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, role: 'man' })}
                    className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                      formData.role === 'man' 
                        ? 'bg-mat-gold/10 border-mat-gold shadow-mat-gold/20 shadow-lg' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      formData.role === 'man' ? 'bg-mat-gold text-black' : 'bg-white/5 text-mat-gold'
                    }`}>
                      <User size={24} strokeWidth={2} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-white">The Petitioner</span>
                  </button>
                </div>

                <Button 
                  disabled={!formData.role}
                  onClick={nextStep}
                  className="w-full h-16 bg-white text-black hover:bg-neutral-200 font-black tracking-widest uppercase rounded-2xl group flex gap-3"
                >
                  Confirm Matriarchty <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">Basic Intelligence</h2>
                  <p className="text-[10px] text-matriarch-textSoft uppercase tracking-[0.4em] font-bold">Your public transmission data</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest ml-1">Full Designation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-mat-gold">
                        <User size={16} />
                      </div>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="NAME / ALIAS"
                        className="h-16 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/10 uppercase font-mono tracking-widest focus:ring-mat-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest ml-1">Origins (Location)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-mat-gold">
                        <MapPin size={16} />
                      </div>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="CITY, STATE"
                        className="h-16 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/10 uppercase font-mono tracking-widest focus:ring-mat-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest ml-1">Temporal Origin (DOB)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-mat-gold">
                        <Calendar size={16} />
                      </div>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="h-16 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/10 uppercase font-mono tracking-widest focus:ring-mat-gold [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={!formData.full_name || !formData.date_of_birth || !formData.city}
                  onClick={nextStep}
                  className="w-full h-16 bg-white text-black hover:bg-neutral-200 font-black tracking-widest uppercase rounded-2xl"
                >
                  Next Protocol
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest ml-1">Invitation Code (Optional)</label>
                    <Input
                      value={formData.referral_code}
                      onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                      placeholder="ENTER MATRIARCH CODE"
                      className="h-16 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/10 uppercase font-mono tracking-widest focus:ring-mat-gold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest ml-1">Matriarch Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="DESCRIBE YOUR ESSENCE..."
                      className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/10 uppercase font-mono tracking-widest focus:border-mat-gold outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <Button 
                  disabled={!formData.bio || loading}
                  onClick={updateProfile}
                  className="w-full h-20 bg-mat-gold text-black hover:bg-mat-gold/90 font-black tracking-widest uppercase rounded-2xl shadow-mat-gold/20 shadow-2xl flex gap-3"
                >
                  {loading ? "TRANSMITTING..." : (
                    <>Initialize Protocol <Check size={20} /></>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};
