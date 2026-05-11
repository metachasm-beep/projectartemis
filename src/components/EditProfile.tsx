import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Camera, 
  Check, 
  X, 
  Info, 
  User, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Sparkles,
  Save,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { MatriarchProfile } from '@/types';
import { turso, tursoHelpers } from '@/lib/turso';
import { compressImage } from '@/lib/image-utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { CameraCapture } from './CameraCapture';
import { sanitizeBio } from '@/utils/trumpData';

interface EditProfileProps {
  profile: MatriarchProfile;
  onUpdate: (updatedProfile: MatriarchProfile) => void;
  onCancel: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ profile, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<MatriarchProfile>({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // ─── DOSSIER EXCELLENCE CALCULATION ───
  const calculateCompletion = () => {
    let score = 0;
    const coreFields = [
      formData.full_name, formData.bio, formData.date_of_birth,
      formData.city, formData.occupation, formData.education,
      formData.religion, formData.mother_tongue
    ];
    coreFields.forEach(f => { if (f && f.toString().trim().length > 0) score += 7; });
    if (formData.bio && formData.bio.length > 100) score += 4;
    score += Math.min(30, (formData.photos?.length || 0) * 5);
    if (formData.is_verified) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();

  const PHOTO_LIMIT = 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const extractPublicId = (url: string) => {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return publicId;
    } catch (e) {
      return null;
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (profile.is_verified) {
      setError("IDENTITY LOCKED: Biometric verification seals your visual narrative. To update photos, a new verification cycle must be initiated.");
      return;
    }

    if ((formData.photos?.length || 0) >= PHOTO_LIMIT) {
      setError(`Maximum limit of ${PHOTO_LIMIT} photos reached.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const compressedBlob = await compressImage(file);
      const secureUrl = await uploadToCloudinary(compressedBlob);
      
      const newPhotos = [...(formData.photos || []), secureUrl];
      setFormData(prev => ({ ...prev, photos: newPhotos }));
    } catch (err: any) {
      console.error("Upload failed", err);
      setError("Failed to upload photo. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (profile.is_verified) {
      setError("IDENTITY LOCKED: Verified photos cannot be removed without re-authorizing your biometric identity.");
      return;
    }

    const photoUrl = formData.photos?.[index];
    if (!photoUrl) return;

    if ((formData.photos?.length || 0) <= 1) {
      setError("IDENTITY INTEGRITY: You cannot remove your final portrait. The Sanctuary requires at least one active visual anchor.");
      return;
    }

    if (!window.confirm("Remove this photo from your story?")) return;

    setLoading(true);
    try {
      const publicId = extractPublicId(photoUrl);
      if (publicId) {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        await fetch(`${apiUrl}/api/v1/media/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: publicId })
        }).catch(e => console.warn("Backend delete failed, continuing with DB update.", e));
      }

      const newPhotos = [...(formData.photos || [])];
      newPhotos.splice(index, 1);
      setFormData(prev => ({ ...prev, photos: newPhotos }));
    } catch (err) {
      console.error("Purge failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    const newPhotos = [...(formData.photos || [])];
    const [primary] = newPhotos.splice(index, 1);
    newPhotos.unshift(primary);
    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handleSave = async () => {
    if ((formData.photos?.length || 0) === 0) {
      setError("IDENTITY VOID: The Sanctuary requires a visual anchor. Please upload at least one high-resolution portrait.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updates = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        bio: formData.bio,
        city: formData.city,
        occupation: formData.occupation,
        education: formData.education,
        height: formData.height,
        religion: formData.religion,
        marital_status: formData.marital_status,
        mother_tongue: formData.mother_tongue,
        diet: formData.diet,
        smoking: formData.smoking ? 1 : 0,
        drinking: formData.drinking ? 1 : 0,
        photos: tursoHelpers.serialize(formData.photos),
        hobbies: tursoHelpers.serialize(formData.hobbies),
        updated_at: new Date().toISOString()
      };

      const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      
      await turso.execute(
        `UPDATE profiles SET ${sets} WHERE user_id = ?`,
        [...(Object.values(updates) as any[]), profile.user_id]
      );

      setSuccess(true);
      setTimeout(() => {
        onUpdate(formData);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error("Update failed", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-xl overflow-hidden"
    >
      <motion.div 
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#000000] rounded-[3.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] p-8 md:p-12 space-y-12 relative hide-scrollbar selection:bg-mat-rose-gold selection:text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-mat-noir via-transparent to-mat-wine/10 opacity-30 pointer-events-none" />
        
        <div className="relative z-10 flex justify-between items-end border-b border-white/10 pb-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Sparkles size={16} className="text-mat-rose-gold animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-rose-gold italic">Identity Enhancement Protocol</span>
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tight leading-tight" style={{fontFamily: 'var(--font-display)'}}>
                Refine Your <br /><span className="text-white/60">Sanctuary.</span>
              </h2>
           </div>
           <button onClick={onCancel} className="p-4 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X size={24} />
           </button>
        </div>

        {/* ─── DOSSIER EXCELLENCE BAR (Merit Board Parity) ─── */}
        <div className="relative z-10 px-2 space-y-6">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold italic">Dossier Excellence</span>
                 <p className="text-[8px] text-white/30 uppercase tracking-widest">Calibration Progress</p>
              </div>
              <span className="text-5xl font-display text-white italic leading-none">
                {completionPct}%
              </span>
           </div>
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${completionPct}%` }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-y-0 left-0 bg-mat-gold shadow-[0_0_25px_rgba(191,160,106,0.5)]" 
              />
           </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 gap-12">
          <section className="space-y-8">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <Tooltip>
                      <TooltipTrigger>
                         <Camera className="w-6 h-6 text-mat-rose-gold" strokeWidth={1} />
                      </TooltipTrigger>
                      <TooltipContent>Upload up to 6 photos</TooltipContent>
                   </Tooltip>
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Visual Narrative</h3>
                </div>
                {profile.is_verified ? (
                   <div className="flex items-center gap-2 px-3 py-1 bg-mat-gold/10 border border-mat-gold/20 rounded-full">
                      <ShieldCheck size={10} className="text-mat-gold" />
                      <span className="text-[8px] font-black text-mat-gold uppercase tracking-widest">Identity Sealed</span>
                   </div>
                ) : (
                   <span className="text-[9px] font-bold text-mat-rose/40 uppercase tracking-widest">
                      {(formData.photos?.length || 0)} / {PHOTO_LIMIT}
                   </span>
                )}
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos?.map((url, i) => (
                   <motion.div key={url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-mat-rose/10 shadow-sm">
                      <img src={url} alt="" className="w-full h-full object-cover transition-all duration-700" />
                      
                      {i === 0 && (
                         <div className="absolute top-3 left-3 px-3 py-1 bg-mat-gold text-mat-obsidian text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg z-10 flex items-center gap-1.5">
                            <Check size={10} strokeWidth={3} /> Primary
                         </div>
                      )}

                      <div className="absolute inset-0 bg-mat-wine/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                         {i !== 0 && (
                            <button 
                              onClick={() => handleMakePrimary(i)} 
                              className="w-10 h-10 bg-white text-mat-gold rounded-full flex items-center justify-center hover:bg-mat-gold hover:text-white transition-all shadow-xl"
                              title="Set as Primary"
                            >
                               <Sparkles size={16} />
                            </button>
                         )}
                         <button onClick={() => handleDeletePhoto(i)} className="w-10 h-10 bg-white text-mat-wine rounded-full flex items-center justify-center hover:bg-mat-rose transition-all shadow-xl">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </motion.div>
                ))}

                 {(formData.photos?.length || 0) < PHOTO_LIMIT && !profile.is_verified && (
                  <div className="grid grid-cols-1 gap-4">
                    <label className="aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mat-rose/20 bg-mat-rose/[0.02] hover:bg-mat-rose/5 transition-all cursor-pointer group">
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
                       <Plus size={24} className="text-mat-rose mb-2" />
                       <span className="text-[9px] font-bold text-mat-wine/40 uppercase tracking-widest">Upload</span>
                    </label>
                    <button onClick={() => setShowCamera(true)} className="aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mat-gold/20 bg-mat-gold/[0.02] hover:bg-mat-gold/5 transition-all group">
                       <Camera size={24} className="text-mat-gold mb-2" />
                       <span className="text-[9px] font-bold text-mat-wine/40 uppercase tracking-widest">Capture</span>
                    </button>
                  </div>
                )}
             </div>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <User className="w-6 h-6 text-mat-rose-gold" strokeWidth={1} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Foundational Roots</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 ml-4">Full Name</label>
                   <Input name="full_name" value={formData.full_name} onChange={handleChange} className="h-16 rounded-2xl bg-white/[0.06] border-white/30 text-white font-black text-lg px-6 focus:border-mat-rose-gold" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 ml-4">Bio</label>
                   <textarea name="bio" value={sanitizeBio(formData.bio) || ''} onChange={handleChange} rows={4} className="w-full p-6 rounded-2xl bg-white/[0.06] border border-white/30 text-white font-black text-lg focus:outline-none focus:border-mat-rose-gold transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 ml-4">Date of Birth</label>
                      <Input type="date" name="date_of_birth" value={formData.date_of_birth || ''} onChange={handleChange} className="h-16 rounded-2xl bg-white/[0.06] border-white/30 text-white font-black text-lg px-6 focus:border-mat-rose-gold" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 ml-4">City</label>
                      <Input name="city" value={formData.city || ''} onChange={handleChange} className="h-16 rounded-2xl bg-white/[0.06] border-white/30 text-white font-black text-lg px-6 focus:border-mat-rose-gold" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 ml-4">Vocation</label>
                   <Input name="occupation" value={formData.occupation || ''} onChange={handleChange} className="h-16 rounded-2xl bg-white/[0.06] border-white/30 text-white font-black text-lg px-6 focus:border-mat-rose-gold" />
                </div>
             </div>
          </section>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
             <Button disabled={loading || success} onClick={handleSave} className="flex-1 h-20 rounded-full bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] transition-all hover:bg-mat-rose-gold hover:text-white shadow-xl flex items-center justify-center gap-4">
                {loading ? "Syncing..." : success ? "Identity Sealed" : "Seal Changes"}
             </Button>
             <button onClick={onCancel} className="h-20 px-12 rounded-full border border-white/10 text-white/40 font-black uppercase tracking-[0.5em] text-[10px] hover:bg-white/5 transition-all">
                Retreat
             </button>
          </div>
        </div>

        <AnimatePresence>
           {showCamera && (
              <CameraCapture onCapture={(blob) => { handlePhotoUpload(new File([blob], `capture.jpg`, { type: 'image/jpeg' })); setShowCamera(false); }} onClose={() => setShowCamera(false)} />
           )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
