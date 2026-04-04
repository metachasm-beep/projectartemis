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

type OnboardingStep = 'ROLE' | 'BASICS' | 'ARCHETYPE' | 'ROOTS' | 'LIFESTYLE' | 'PHOTO' | 'BIO_INTENT' | 'LEGAL';

const STEPS: OnboardingStep[] = ['ROLE', 'BASICS', 'ARCHETYPE', 'ROOTS', 'LIFESTYLE', 'PHOTO', 'BIO_INTENT', 'LEGAL'];

export const Onboarding: React.FC<OnboardingProps> = ({ 
  userId, 
  metadata,
  onComplete 
}) => {
  const [step, setStep] = useState<OnboardingStep>('ROLE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(10);

  const [formData, setFormData] = useState({
    full_name: metadata?.full_name || metadata?.name || '',
    role: '' as 'woman' | 'man' | '',
    date_of_birth: metadata?.birthday || '',
    bio: '',
    city: metadata?.locale?.split('_')?.[1] || '',
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
    if (formData.role) s += 10;
    if (formData.full_name) s += 10;
    if (formData.city) s += 10;
    if (formData.photos.length > 0) s += 25;
    if (formData.bio.length > 20) s += 20;
    if (formData.date_of_birth) s += 15;
    setStrength(Math.min(s, 95));
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
          full_name = excluded.full_name,
          date_of_birth = excluded.date_of_birth,
          bio = excluded.bio,
          city = excluded.city,
          intent = excluded.intent,
          occupation = excluded.occupation,
          education = excluded.education,
          height = excluded.height,
          religion = excluded.religion,
          marital_status = excluded.marital_status,
          mother_tongue = excluded.mother_tongue,
          hobbies = excluded.hobbies,
          diet = excluded.diet,
          smoking = excluded.smoking,
          drinking = excluded.drinking,
          photos = excluded.photos,
          profile_strength = excluded.profile_strength,
          onboarding_status = excluded.onboarding_status,
          updated_at = excluded.updated_at
      `;

      const args = [
        userId,
        formData.full_name,
        formData.date_of_birth,
        formData.bio,
        formData.city,
        formData.role,
        formData.intent,
        formData.occupation,
        formData.education,
        parseInt(formData.height) || null,
        formData.religion,
        formData.marital_status,
        formData.mother_tongue,
        tursoHelpers.serialize(formData.hobbies),
        formData.diet,
        formData.smoking ? 1 : 0,
        formData.drinking ? 1 : 0,
        tursoHelpers.serialize(formData.photos),
        strength,
        'COMPLETED',
        new Date().toISOString()
      ];

      await turso.execute(sql, args);

      localStorage.setItem(`MAT_OB_DONE_${userId}`, 'true');
      await new Promise(resolve => setTimeout(resolve, 600));
      onComplete();
    } catch (err: any) {
      console.error("MATRIARCH_TURSO: Profile update failed", err);
      setError('Could not save your profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Compress
      const compressedBlob = await compressImage(file);
      
      // 2. Upload to Cloudinary
      const secureUrl = await uploadToCloudinary(compressedBlob);
      
      // 3. Update State
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, secureUrl]
      }));
    } catch (err: any) {
      console.error("Media upload failed:", err);
      setError(err.message || "Failed to upload photo. Ensure you are connected.");
    } finally {
      setLoading(false);
    }
  };

  const [showCamera, setShowCamera] = useState(false);

  const next = (nextStep: OnboardingStep) => setStep(nextStep);
  const stepIndex = STEPS.indexOf(step);
  const progressPct = ((stepIndex) / (STEPS.length - 1)) * 100;

  const glowColor = formData.role === 'woman'
    ? 'rgba(201,160,154,0.15)'
    : 'rgba(191,160,106,0.12)';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FAF7F2 0%, #F5E6E4 50%, #EEE0DA 100%)' }}>

      {/* Ambient background glow based on role */}
      <AnimatePresence>
        {formData.role && (
          <motion.div
            key={formData.role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 40%, ${glowColor}, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      {/* Floating petals decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-mat-rose/10"
            initial={{ y: -40, x: `${15 + i * 15}%`, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 0.4, 0], rotate: 360 }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, delay: i * 2.5, ease: 'linear' }}
            style={{ fontSize: '1.5rem' }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-8">
        {/* Step progress */}
        <AnimatePresence>
          {step !== 'ROLE' && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center px-2"
            >
              <div className="flex flex-col gap-2 flex-1">
                <span style={{fontFamily:'Helvetica,sans-serif'}} className="text-[9px] font-bold text-mat-rose/60 uppercase tracking-[0.4em]">
                  Your Story — Step {stepIndex} of {STEPS.length - 1}
                </span>
                <div className="h-1 bg-mat-fog rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #C9A09A, #BFA06A)' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="ml-6 text-right">
                <span className="text-2xl font-bold text-mat-rose" style={{fontFamily:'"Playfair Display",serif', fontStyle:'italic'}}>
                  {Math.round(progressPct)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main card */}
        <div className="mat-glass-deep rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 20px 80px rgba(123,45,66,0.12)' }}>
          <div className="p-10 md:p-14">
            {error && (
              <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-[11px] font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* ── ROLE ─────────────────────────────────────────────────── */}
              {step === 'ROLE' && (
                <motion.div key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2"
                      style={{ background: 'linear-gradient(135deg, #C9A09A, #7B2D42)' }}>
                      <Heart className="w-8 h-8 text-white" strokeWidth={1.5} fill="rgba(255,255,255,0.3)" />
                    </div>
                    <h2 style={{fontFamily:'"Playfair Display",Georgia,serif'}}
                      className="text-4xl md:text-5xl font-bold text-mat-wine leading-tight italic">
                      Welcome to <br />Matriarch
                    </h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-sm leading-relaxed">
                      A sanctuary for meaningful connections. Tell us who you are.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { role: 'woman' as const, label: 'I am a Woman', sub: 'Seeking meaningful connection', emoji: '🌸' },
                      { role: 'man' as const, label: 'I am a Man', sub: 'Aspiring to be chosen', emoji: '🌿' },
                    ].map(({ role, label, sub, emoji }) => (
                      <button
                        key={role}
                        onClick={() => setFormData({ ...formData, role })}
                        className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                          formData.role === role
                            ? 'border-mat-rose bg-mat-petal shadow-lg scale-[1.02]'
                            : 'border-mat-fog bg-white/40 hover:border-mat-rose/40 hover:bg-mat-petal/50'
                        }`}
                      >
                        <span className="text-4xl">{emoji}</span>
                        <div>
                          <span style={{fontFamily:'"Playfair Display",serif'}} className="block font-bold text-mat-wine text-lg italic">{label}</span>
                          <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] text-mat-slate uppercase tracking-[0.3em]">{sub}</p>
                        </div>
                        {formData.role === role && (
                          <span className="w-6 h-6 rounded-full bg-mat-rose flex items-center justify-center">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!formData.role}
                    onClick={() => next('BASICS')}
                    className="w-full h-16 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'white',
                      boxShadow: '0 8px 24px rgba(123,45,66,0.25)' }}
                  >
                    Begin Your Story <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* ── BASICS ───────────────────────────────────────────────── */}
              {step === 'BASICS' && (
                <motion.div key="basics" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-10">
                  <div className="text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-mat-gold mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">
                      Tell Us About You
                    </h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">Your identity, your city, your beginning</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Your Name</label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                        className="h-14 bg-white/60 border-mat-fog focus:border-mat-rose rounded-2xl text-mat-wine px-5 focus:ring-mat-rose/20 focus:ring-4 transition-all"
                        style={{fontFamily:'Helvetica,sans-serif'}}
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Your City</label>
                      <CitySelector
                        value={formData.city}
                        onChange={(city: string) => setFormData({ ...formData, city })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Date of Birth</label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="h-14 bg-white/60 border-mat-fog focus:border-mat-rose rounded-2xl text-mat-wine px-5 [color-scheme:light] focus:ring-mat-rose/20 focus:ring-4 transition-all"
                      />
                      <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[11px] text-mat-slate ml-1 italic">We use this only for age verification — never displayed publicly.</p>
                    </div>
                  </div>

                  <button
                    disabled={!formData.full_name || !formData.city || !formData.date_of_birth}
                    onClick={() => next('ARCHETYPE')}
                    className="w-full h-14 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm transition-all disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'white', fontFamily: 'Helvetica,sans-serif' }}
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* ── ARCHETYPE ────────────────────────────────────────────── */}
              {step === 'ARCHETYPE' && (
                <motion.div key="archetype" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-10">
                  <div className="text-center space-y-2">
                    <User className="w-8 h-8 text-mat-gold mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">Professional Path</h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">Your calling and standing</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Occupation</label>
                      <Input
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="e.g. Software Architect, Artist, Physician"
                        className="h-14 bg-white/60 border-mat-fog rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Education</label>
                      <Input
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="e.g. MBA from IIM, PhD in Physics"
                        className="h-14 bg-white/60 border-mat-fog rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Height (cm)</label>
                      <Input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="e.g. 175"
                        className="h-14 bg-white/60 border-mat-fog rounded-2xl"
                      />
                    </div>
                  </div>

                  <button
                    disabled={!formData.occupation || !formData.education || !formData.height}
                    onClick={() => next('ROOTS')}
                    className="w-full h-14 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm transition-all shadow-md"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'white' }}
                  >
                    Next Step
                  </button>
                </motion.div>
              )}

              {/* ── ROOTS ────────────────────────────────────────────────── */}
              {step === 'ROOTS' && (
                <motion.div key="roots" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-10">
                  <div className="text-center space-y-2">
                    <Globe className="w-8 h-8 text-mat-gold mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">Your Heritage</h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">Origins and values</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Religion</label>
                        <Input
                          value={formData.religion}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          placeholder="Religion"
                          className="h-14 bg-white/60 rounded-2xl"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Mother Tongue</label>
                        <Input
                          value={formData.mother_tongue}
                          onChange={(e) => setFormData({ ...formData, mother_tongue: e.target.value })}
                          placeholder="Language"
                          className="h-14 bg-white/60 rounded-2xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Marital Status</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['NEVER_MARRIED', 'DIVORCED', 'WIDOWED'].map(status => (
                          <button
                            key={status}
                            onClick={() => setFormData({...formData, marital_status: status})}
                            className={`h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                              formData.marital_status === status 
                                ? 'border-mat-wine bg-mat-wine text-mat-cream' 
                                : 'border-mat-fog bg-white/40 text-mat-wine/40'
                            }`}
                          >
                            {status.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!formData.religion || !formData.mother_tongue}
                    onClick={() => next('LIFESTYLE')}
                    className="w-full h-14 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm transition-all shadow-md"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'var(--color-mat-cream)' }}
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* ── LIFESTYLE ────────────────────────────────────────────── */}
              {step === 'LIFESTYLE' && (
                <motion.div key="lifestyle" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-10">
                  <div className="text-center space-y-2">
                    <Utensils className="w-8 h-8 text-mat-gold mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">Life & Habits</h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">Day-to-day rhythm</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] ml-1">Diet Preference</label>
                      <div className="flex gap-3">
                        {['VEG', 'NON_VEG', 'VEGAN'].map(d => (
                          <button
                            key={d}
                            onClick={() => setFormData({...formData, diet: d})}
                            className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase border-2 transition-all ${
                              formData.diet === d ? 'border-mat-wine bg-mat-wine text-mat-cream' : 'border-mat-fog bg-white/40 text-mat-wine/40'
                            }`}
                          >
                            {d.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <button 
                        onClick={() => setFormData({...formData, smoking: !formData.smoking})}
                        className={`p-6 rounded-2xl border-2 flex items-center justify-between group transition-all ${formData.smoking ? 'border-red-200 bg-red-50' : 'border-mat-fog bg-white/40'}`}
                      >
                         <div className="text-left">
                           <span className="block text-[10px] font-bold text-mat-wine uppercase tracking-widest">Smoking</span>
                           <span className="text-[9px] text-mat-slate uppercase">{formData.smoking ? 'Yes' : 'No'}</span>
                         </div>
                         <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.smoking ? 'bg-red-500' : 'bg-mat-fog'}`}>
                           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.smoking ? 'left-5' : 'left-1'}`} />
                         </div>
                      </button>

                      <button 
                        onClick={() => setFormData({...formData, drinking: !formData.drinking})}
                        className={`p-6 rounded-2xl border-2 flex items-center justify-between group transition-all ${formData.drinking ? 'border-mat-rose/20 bg-mat-petal/30' : 'border-mat-fog bg-white/40'}`}
                      >
                         <div className="text-left">
                           <span className="block text-[10px] font-bold text-mat-wine uppercase tracking-widest">Alcohol</span>
                           <span className="text-[9px] text-mat-slate uppercase">{formData.drinking ? 'Socially' : 'No'}</span>
                         </div>
                         <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.drinking ? 'bg-mat-rose' : 'bg-mat-fog'}`}>
                           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.drinking ? 'left-5' : 'left-1'}`} />
                         </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => next('PHOTO')}
                    className="w-full h-14 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm transition-all shadow-md"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'var(--color-mat-cream)' }}
                  >
                    Continue to Portraits
                  </button>
                </motion.div>
              )}

              {/* ── PHOTO ────────────────────────────────────────────────── */}
              {step === 'PHOTO' && (
                <motion.div key="photo" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 text-center">
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-mat-rose mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">Your Portraits</h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">Share your radiance (Up to 6)</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {formData.photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setFormData(prev => ({...prev, photos: prev.photos.filter((_, i) => i !== idx)}))}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {formData.photos.length < 6 && (
                      <div className="aspect-square bg-white/40 border-2 border-dashed border-mat-rose/30 rounded-2xl flex flex-col items-center justify-center gap-2 relative cursor-pointer hover:bg-mat-petal/20 transition-all">
                        <Plus className="w-6 h-6 text-mat-rose/40" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Camera Action */}
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-mat-ivory border-2 border-mat-rose/10 rounded-2xl text-mat-wine text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                  >
                    <Camera size={18} /> Open Camera
                  </button>

                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={() => next('BIO_INTENT')}
                      className="flex-1 h-12 rounded-xl border border-mat-fog text-mat-slate/50 text-xs uppercase tracking-widest"
                    >
                      Skip for now
                    </button>
                    <button
                      disabled={formData.photos.length === 0 || loading}
                      onClick={() => next('BIO_INTENT')}
                      className="flex-2 flex-grow h-12 rounded-xl font-bold tracking-[0.2em] uppercase text-xs shadow-mat-premium"
                      style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'var(--color-mat-cream)' }}
                    >
                      {loading ? 'Optimizing...' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Camera Portal */}
              <AnimatePresence>
                {showCamera && (
                  <CameraCapture 
                    onCapture={(file) => handlePhotoUpload(file)}
                    onClose={() => setShowCamera(false)}
                  />
                )}
              </AnimatePresence>

              {/* ── BIO + INTENT ──────────────────────────────────────────── */}
              {step === 'BIO_INTENT' && (
                <motion.div key="bio" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -40 }} className="space-y-10">
                  <div className="text-center space-y-2">
                    <Star className="w-8 h-8 text-mat-gold mx-auto" strokeWidth={1.5} />
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-3xl md:text-4xl font-bold text-mat-wine italic">Your Story</h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-xs uppercase tracking-[0.3em]">What makes you, you?</p>
                  </div>

                  <div className="space-y-6">
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Share a bit about yourself — your passions, what you're looking for..."
                      className="w-full h-40 p-5 bg-white/60 border border-mat-fog focus:border-mat-rose rounded-3xl text-mat-wine text-sm leading-relaxed outline-none resize-none transition-all focus:ring-4 focus:ring-mat-rose/15"
                      style={{fontFamily:'Helvetica,sans-serif'}}
                    />
                    <div>
                      <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.4em] mb-3 ml-1">I'm looking for…</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(['LONG_TERM', 'EXPLORATION'] as const).map(intent => (
                          <button
                            key={intent}
                            onClick={() => setFormData({ ...formData, intent })}
                            className={`h-14 rounded-2xl border-2 transition-all text-[11px] font-bold uppercase tracking-[0.2em] ${
                              formData.intent === intent
                                ? 'border-mat-wine bg-mat-wine text-white'
                                : 'border-mat-fog bg-white/40 text-mat-slate/50 hover:border-mat-rose/40'
                            }`}
                            style={{fontFamily:'Helvetica,sans-serif'}}
                          >
                            {intent === 'LONG_TERM' ? '💍 Long-term' : '🌱 Open to explore'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!formData.bio}
                    onClick={() => next('LEGAL')}
                    className="w-full h-14 rounded-2xl font-bold tracking-[0.3em] uppercase text-sm transition-all disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg, #7B2D42, #96404F)', color: 'white', fontFamily: 'Helvetica,sans-serif' }}
                  >
                    Almost There
                  </button>
                </motion.div>
              )}

              {/* ── LEGAL ────────────────────────────────────────────────── */}
              {step === 'LEGAL' && (
                <motion.div key="legal" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #C9A09A 0%, #7B2D42 100%)' }}>
                      <Heart className="w-9 h-9 text-white" strokeWidth={1.5} fill="rgba(255,255,255,0.3)" />
                    </div>
                    <h2 style={{fontFamily:'"Playfair Display",serif'}} className="text-4xl font-bold text-mat-wine italic leading-tight">
                      A Sacred Promise
                    </h2>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-mat-slate text-sm leading-relaxed max-w-sm mx-auto">
                      By entering Matriarch, you pledge to treat every soul with sincerity, respect, and genuine intention.
                    </p>
                  </div>

                  {/* Profile Strength Summary */}
                  <div className="p-6 rounded-2xl border border-mat-fog/50 bg-white/40 space-y-4">
                    <div className="flex justify-between items-center">
                      <span style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] font-bold text-mat-wine uppercase tracking-[0.3em]">Profile Strength</span>
                      <span style={{fontFamily:'"Playfair Display",serif'}} className="text-2xl font-bold text-mat-wine italic">{strength}%</span>
                    </div>
                    <div className="h-2 bg-mat-fog rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${strength}%`, background: 'linear-gradient(90deg, #C9A09A, #BFA06A)' }} />
                    </div>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[11px] text-mat-slate italic text-center">You can always complete your profile later.</p>
                  </div>

                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="w-full h-16 font-bold tracking-[0.3em] uppercase rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-sm"
                    style={{
                      background: formData.role === 'woman'
                        ? 'linear-gradient(135deg, #C9A09A 0%, #7B2D42 100%)'
                        : 'linear-gradient(135deg, #BFA06A 0%, #8C6F3A 100%)',
                      color: 'white',
                      boxShadow: '0 12px 40px rgba(123,45,66,0.3)',
                      fontFamily: 'Helvetica,sans-serif'
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    ) : (
                      <span className="flex items-center gap-3">
                        Enter the Sanctuary <Heart size={20} fill="rgba(255,255,255,0.4)" />
                      </span>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center">
          <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] text-mat-rose/20 font-bold tracking-[1.5em] uppercase">
            Matriarch · Connection, by intention
          </p>
        </div>
      </div>
    </div>
  );
};
