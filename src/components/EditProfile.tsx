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
import { Tooltip } from '@/components/ui/tooltip';
import type { MatriarchProfile } from '../App';
import { turso, tursoHelpers } from '@/lib/turso';
import { compressImage } from '@/lib/image-utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { CameraCapture } from './CameraCapture';

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

  const PHOTO_LIMIT = 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const extractPublicId = (url: string) => {
    try {
      // https://res.cloudinary.com/cloud_name/image/upload/v12345/public_id.jpg
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return publicId;
    } catch (e) {
      return null;
    }
  };

  const handlePhotoUpload = async (file: File) => {
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
    const photoUrl = formData.photos?.[index];
    if (!photoUrl) return;

    if (!window.confirm("Remove this photo from your story?")) return;

    setLoading(true);
    try {
      const publicId = extractPublicId(photoUrl);
      if (publicId) {
        // Call backend to delete from Cloudinary
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

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Prepare data for Turso
      const updates = {
        full_name: formData.full_name,
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
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 space-y-12 pb-32">
       {/* Header */}
       <div className="flex justify-between items-end border-b border-mat-rose/10 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-mat-rose animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-rose italic">Identity Enhancement</span>
             </div>
             <h2 className="text-5xl font-bold text-mat-wine italic leading-tight" style={{fontFamily: '"Playfair Display", serif'}}>
               Refine Your <br /><span className="text-mat-rose/30">Sanctuary.</span>
             </h2>
          </div>
          <button onClick={onCancel} className="p-4 rounded-2xl bg-mat-rose/5 text-mat-wine/40 hover:text-mat-wine transition-all">
             <X size={20} />
          </button>
       </div>

       {/* Form Sections */}
       <div className="grid grid-cols-1 gap-12">
          
          {/* Photos Manager */}
          <section className="space-y-8">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <Tooltip content="Upload up to 6 high-quality photos to tell your story.">
                      <Camera className="w-6 h-6 text-mat-wine" strokeWidth={1.5} />
                   </Tooltip>
                   <h3 className="text-[11px] font-bold uppercase tracking-widest text-mat-wine">Visual Narrative</h3>
                </div>
                <span className="text-[9px] font-bold text-mat-rose/40 uppercase tracking-widest">
                   {(formData.photos?.length || 0)} / {PHOTO_LIMIT} Photos
                </span>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos?.map((url, i) => (
                  <motion.div 
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-mat-rose/10 shadow-sm"
                  >
                     <img src={url} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:sepia-[0.3]" />
                     <div className="absolute inset-0 bg-mat-wine/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleDeletePhoto(i)}
                          className="w-12 h-12 bg-white text-mat-wine rounded-full flex items-center justify-center hover:bg-mat-rose hover:text-white transition-all shadow-xl"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </motion.div>
                ))}

                {(formData.photos?.length || 0) < PHOTO_LIMIT && (
                  <div className="grid grid-cols-1 gap-4">
                    <Tooltip content="Add a new photo from your device.">
                       <label className="aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mat-rose/20 bg-mat-rose/[0.02] hover:bg-mat-rose/5 transition-all cursor-pointer group">
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
                          <div className="w-12 h-12 bg-mat-cream rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                             <Plus className="text-mat-rose w-6 h-6" />
                          </div>
                          <span className="text-[9px] font-bold text-mat-wine/40 uppercase tracking-[0.2em]">Upload</span>
                       </label>
                    </Tooltip>
                    
                    <Tooltip content="Capture a new photo with your camera.">
                       <button 
                         onClick={() => setShowCamera(true)}
                         className="aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mat-gold/20 bg-mat-gold/[0.02] hover:bg-mat-gold/5 transition-all group"
                       >
                          <div className="w-12 h-12 bg-mat-cream rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                             <Camera className="text-mat-gold w-6 h-6" />
                          </div>
                          <span className="text-[9px] font-bold text-mat-wine/40 uppercase tracking-[0.2em]">Capture</span>
                       </button>
                    </Tooltip>
                  </div>
                )}
             </div>
          </section>

          {/* Basic Information */}
          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <Tooltip content="Share the core details of your life.">
                   <User className="w-6 h-6 text-mat-wine" strokeWidth={1.5} />
                </Tooltip>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-mat-wine">Foundational Roots</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4 flex items-center gap-2">
                      Full Name
                      <Tooltip content="How you will be addressed within the sanctuary.">
                         <Info size={12} className="opacity-40" />
                      </Tooltip>
                   </label>
                   <Input 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="h-16 rounded-2xl bg-mat-cream border-mat-rose/20 text-mat-wine font-bold text-sm tracking-tight px-6 focus:border-mat-wine transition-all" 
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4 flex items-center gap-2">
                      Your Bio
                      <Tooltip content="A poetic summary of who you are and what you seek.">
                         <Info size={12} className="opacity-40" />
                      </Tooltip>
                   </label>
                   <textarea 
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-6 rounded-2xl bg-mat-cream border border-mat-rose/20 text-mat-wine font-bold text-sm tracking-tight focus:outline-none focus:border-mat-wine transition-all placeholder:text-mat-slate/20"
                      placeholder="TELL YOUR STORY..."
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4 flex items-center gap-2">
                         Location
                         <MapPin size={12} className="opacity-40" />
                      </label>
                      <Input 
                         name="city"
                         value={formData.city || ''}
                         onChange={handleChange}
                         className="h-16 rounded-2xl bg-mat-cream border-mat-rose/20 text-mat-wine font-bold text-sm tracking-tight px-6" 
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4 flex items-center gap-2">
                         Occupation
                         <Briefcase size={12} className="opacity-40" />
                      </label>
                      <Input 
                         name="occupation"
                         value={formData.occupation || ''}
                         onChange={handleChange}
                         className="h-16 rounded-2xl bg-mat-cream border-mat-rose/20 text-mat-wine font-bold text-sm tracking-tight px-6" 
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* Secondary Details */}
          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <BookOpen className="w-6 h-6 text-mat-wine" strokeWidth={1.5} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-mat-wine">Soul Characteristics</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4">Education</label>
                   <Input 
                      name="education"
                      value={formData.education || ''}
                      onChange={handleChange}
                      className="h-16 rounded-2xl bg-mat-cream border-mat-rose/20 text-mat-wine font-bold text-sm px-6" 
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mat-rose/60 ml-4">Religion</label>
                   <Input 
                      name="religion"
                      value={formData.religion || ''}
                      onChange={handleChange}
                      className="h-16 rounded-2xl bg-mat-cream border-mat-rose/20 text-mat-wine font-bold text-sm px-6" 
                   />
                </div>
             </div>
          </section>

          {/* Role Status (Locked Warning) */}
          <section className="p-8 rounded-[2rem] bg-mat-wine/5 border border-mat-wine/10 space-y-6">
             <div className="flex items-center gap-4">
                <Tooltip content="Your role and verification status determine your standing in the sanctuary.">
                  <ShieldCheck size={20} className="text-mat-wine" />
                </Tooltip>
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-mat-wine/40 uppercase tracking-widest">Sanctuary Standing</span>
                   <p className="text-sm font-bold text-mat-wine uppercase">Status: {profile.is_verified ? 'Verified Soul' : 'Awaiting Gaze'}</p>
                </div>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-medium text-mat-wine/40 italic leading-relaxed uppercase tracking-[0.2em]">
                   * To ensure collective safety, unverified stories are ranked below verified initiates. Complete the Didit Protocol to elevate your resonance.
                </p>
                <p className="text-[10px] font-medium text-mat-wine/40 italic leading-relaxed uppercase tracking-widest">
                   * Role and verification status are permanently indexed. Contact architect for elite status overrides.
                </p>
             </div>
          </section>

          {/* Action Footer */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
             <Button 
                disabled={loading || success}
                onClick={handleSave}
                className="flex-1 h-20 rounded-[2.5rem] bg-mat-wine text-mat-cream font-bold uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-mat-wine-soft shadow-mat-premium flex items-center justify-center gap-4"
             >
                {loading ? (
                  <div className="flex gap-2">
                     {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-mat-cream rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                  </div>
                ) : success ? (
                  <>
                     <Check size={20} />
                     IDENTITY SEALED
                  </>
                ) : (
                  <>
                     <Save size={18} />
                     SEAL CHANGES
                  </>
                )}
             </Button>
             
             <button 
                onClick={onCancel}
                className="h-20 px-12 rounded-[2.5rem] border border-mat-rose/20 text-mat-wine font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-mat-rose/5 transition-all"
             >
                Retreat
             </button>
          </div>

          {error && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-6 bg-red-50 border border-red-100 rounded-3xl"
             >
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{error}</p>
             </motion.div>
          )}

       </div>

       {/* Camera Overlay */}
       <AnimatePresence>
          {showCamera && (
             <CameraCapture 
                onCapture={(blob) => {
                   const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
                   handlePhotoUpload(file);
                   setShowCamera(false);
                }}
                onClose={() => setShowCamera(false)}
             />
          )}
       </AnimatePresence>
    </div>
  );
};
