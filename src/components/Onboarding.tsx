import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Heart, ArrowRight, Camera, ShieldCheck, Sparkles, Star, Plus, Trash2, User, Globe, Utensils } from 'lucide-react';
import { CitySelector } from './CitySelector';
import { CameraCapture } from './CameraCapture';
import { compressImage } from '@/lib/image-utils';
import { turso, tursoHelpers } from '@/lib/turso';
import { uploadToCloudinary } from '@/lib/cloudinary';

export interface OnboardingProps {
  userId: string;
  metadata: any;
  onComplete: () => void;
}

// 🏛️ Progressive UI: Reducing friction to the minimum viable ritual.
type OnboardingStep = 'ROLE' | 'BASICS' | 'PHOTO' | 'LEGAL';
const STEPS: OnboardingStep[] = ['ROLE', 'BASICS', 'PHOTO', 'LEGAL'];

export const Onboarding: React.FC<OnboardingProps> = ({ 
  userId, 
  metadata,
  onComplete 
}) => {
  const [step, setStep] = useState<OnboardingStep>('ROLE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(10);

  // 🏹 Google Auth Pre-fill logic correctly injected here.
  const [formData, setFormData] = useState({
    full_name: metadata?.full_name || metadata?.name || '',
    role: '' as 'woman' | 'man' | '',
    date_of_birth: metadata?.birthday || '',
    bio: '',
    city: '',
    intent: 'LONG_TERM',
    occupation: '',
    education: '',
    height: '',
    religion: '',
    marital_status: 'NEVER_MARRIED',
    mother_tongue: '',
    hobbies: [] as string[],
    diet: 'VEG',
    smoking: false,
    drinking: false,
    photos: metadata?.avatar_url ? [metadata.avatar_url] : metadata?.picture ? [metadata.picture] : [] as string[],
  });

  useEffect(() => {
    let s = 10;
    if (formData.role) s += 20;
    if (formData.full_name) s += 20;
    if (formData.city) s += 10;
    if (formData.photos.length > 0) s += 30;
    setStrength(Math.min(s, 100));
  }, [formData]);

  const updateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const sql = `
        INSERT INTO profiles (
          user_id, full_name, date_of_birth, bio, city, role, intent,
          occupation, education, height, religion, marital_status,
          mother_tongue, hobbies, diet, smoking, drinking, photos,
          profile_strength, onboarding_status, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          full_name = excluded.full_name, onboarding_status = excluded.onboarding_status, updated_at = excluded.updated_at,
          role = excluded.role, city = excluded.city, date_of_birth = excluded.date_of_birth, photos = excluded.photos
      `;

      const args = [
        userId, formData.full_name, formData.date_of_birth || '1990-01-01', formData.bio, formData.city,
        formData.role, formData.intent, formData.occupation, formData.education, 
        parseInt(formData.height) || null, formData.religion, formData.marital_status,
        formData.mother_tongue, tursoHelpers.serialize(formData.hobbies), formData.diet,
        formData.smoking ? 1 : 0, formData.drinking ? 1 : 0, tursoHelpers.serialize(formData.photos),
        strength, 'COMPLETED', new Date().toISOString()
      ];

      await turso.execute(sql, args);
      // Wait for the state to settle briefly before signaling completion
      await new Promise(r => setTimeout(r, 400));
      onComplete();
    } catch (err: any) {
      console.error("Sanctuary Error:", err);
      setError('Connection with the archive was interrupted. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setLoading(true);
    try {
      const compressedBlob = await compressImage(file);
      const secureUrl = await uploadToCloudinary(compressedBlob);
      setFormData(prev => ({ ...prev, photos: [...prev.photos, secureUrl] }));
    } catch (err: any) {
      setError("Image resonance failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-mat-cream">
       {/* Premium Ambient Background */}
       <div className="absolute inset-0 bg-gradient-to-br from-mat-rose/5 to-mat-gold/5 pointer-events-none" />
       
       <div className="w-full max-w-xl relative z-10 space-y-12">
          {/* Progress Indication */}
          <div className="flex flex-col gap-3 px-4">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-wine/40">Resonance Ritual</span>
                <span className="text-sm font-bold text-mat-wine italic">Step {STEPS.indexOf(step) + 1} of {STEPS.length}</span>
             </div>
             <div className="h-1 bg-mat-fog rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(STEPS.indexOf(step) + 1) / STEPS.length * 100}%` }} className="h-full bg-mat-wine" />
             </div>
          </div>

          <div className="mat-glass-deep rounded-[3rem] p-12 md:p-16 shadow-mat-premium border-mat-rose/10">
             <AnimatePresence mode="wait">
                {step === 'ROLE' && (
                  <motion.div key="role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                     <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-mat-wine text-mat-cream rounded-full mx-auto flex items-center justify-center shadow-mat-premium"><Heart size={32} /></div>
                        <h2 className="text-5xl font-bold text-mat-wine italic leading-tight">Welcome to <br />Matriarch</h2>
                        <p className="text-mat-slate text-sm italic">Identify your essence to enter the sanctuary.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[{r:'woman', l:'I am a Woman', e:'🌸'}, {r:'man', l:'I am a Man', e:'🌿'}].map(item => (
                           <button key={item.r} onClick={() => setFormData({...formData, role: item.r as any})} className={`p-10 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${formData.role === item.r ? 'border-mat-wine bg-mat-wine/5 shadow-lg scale-105' : 'border-mat-fog hover:border-mat-rose/20'}`}>
                              <span className="text-4xl">{item.e}</span>
                              <span className="text-lg font-bold text-mat-wine italic">{item.l}</span>
                           </button>
                        ))}
                     </div>
                     <button disabled={!formData.role} onClick={next} className="w-full h-16 bg-mat-wine text-mat-cream rounded-2xl font-black uppercase tracking-widest text-[11px] disabled:opacity-20 shadow-mat-premium transition-all">Begin Ritual</button>
                  </motion.div>
                )}

                {step === 'BASICS' && (
                  <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                     <div className="text-center space-y-4"><h2 className="text-4xl font-bold text-mat-wine italic">Your Identifier</h2><p className="text-[10px] font-black uppercase tracking-widest text-mat-slate/40">The beginning of your narrative</p></div>
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-mat-wine/60 ml-2">Display Name</label>
                           <Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="h-16 rounded-2xl bg-white/40 border-mat-fog px-6 focus:border-mat-wine italic font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-mat-wine/60 ml-2">Current Sanctuary (City)</label>
                           <CitySelector value={formData.city} onChange={city => setFormData({...formData, city})} />
                        </div>
                     </div>
                     <button disabled={!formData.full_name || !formData.city} onClick={next} className="w-full h-16 bg-mat-wine text-mat-cream rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-mat-premium">Continue Resonance</button>
                  </motion.div>
                )}

                {step === 'PHOTO' && (
                   <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10 text-center">
                      <div className="space-y-4"><Camera className="mx-auto text-mat-rose" size={40} /><h2 className="text-4xl font-bold text-mat-wine italic">Your Portrait</h2><p className="text-mat-slate text-sm italic">Let the sanctuary perceive your radiance.</p></div>
                      <div className="grid grid-cols-3 gap-4">
                         {formData.photos.map((url, i) => (
                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-mat-rose/10 group relative shadow-md"><img src={url} className="w-full h-full object-cover" /><button onClick={() => setFormData(p => ({...p, photos: p.photos.filter((_, idx)=>idx!==i)}))} className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={10} /></button></div>
                         ))}
                         {formData.photos.length < 6 && (
                            <div className="aspect-square border-2 border-dashed border-mat-rose/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-mat-rose/5 relative cursor-pointer"><Plus className="text-mat-rose/40" /><input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} /></div>
                         )}
                      </div>
                      <button disabled={loading || formData.photos.length === 0} onClick={next} className="w-full h-16 bg-mat-wine text-mat-cream rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-mat-premium">{loading ? 'Synthesizing...' : 'Continue'}</button>
                   </motion.div>
                )}

                {step === 'LEGAL' && (
                   <motion.div key="legal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
                      <div className="space-y-6"><div className="w-20 h-20 bg-mat-wine text-mat-cream rounded-full mx-auto flex items-center justify-center shadow-mat-premium"><ShieldCheck size={40} /></div><h2 className="text-4xl font-bold text-mat-wine italic">The Sovereign Covenant</h2><p className="text-mat-slate text-sm leading-relaxed max-w-sm mx-auto italic">By entering, you pledge to interact with sincerity, respect, and intention.</p></div>
                      <div className="p-8 rounded-[2rem] bg-mat-wine/5 border border-mat-rose/10 space-y-4">
                         <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-mat-wine">Aura Potential</span><span className="text-2xl font-bold text-mat-wine italic">{strength}%</span></div>
                         <div className="h-2 bg-mat-fog rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${strength}%` }} className="h-full bg-mat-gold shadow-sm" /></div>
                      </div>
                      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
                      <button onClick={updateProfile} disabled={loading} className="w-full h-18 bg-mat-wine text-mat-cream rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-mat-rose hover:scale-[1.02] transition-transform">{loading ? 'Opening Portal...' : 'Enter Sanctuary'}</button>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};
