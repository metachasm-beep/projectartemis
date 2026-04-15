import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ImageService } from '@/services/imageService';
import { ManifestoService } from '@/services/manifestoService';
import { useAuth } from '@/hooks/useAuth';

interface ManifestoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ManifestoEditor: React.FC<ManifestoEditorProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const url = await ImageService.uploadManifestoImage(file);
      if (url) {
        setImageUrl(url);
      } else {
        setError("Failed to upload image. Please check Cloudinary settings.");
      }
    } catch (err) {
      setError("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("Title and content are required to initiate a manifesto.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const success = await ManifestoService.submit({
        id: `manifesto_${Date.now()}`,
        author_id: user?.id || 'anonymous',
        author_name: user?.full_name || 'Sanctuary Aspirant',
        title,
        content,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Default space-themed image
      });

      if (success) {
        onSuccess();
        onClose();
      } else {
        setError("Transmission failed. The sanctuary registry is currently unreachable.");
      }
    } catch (err) {
      setError("A critical error occurred during submission.");
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#FFFDF9] backdrop-blur-none"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl bg-[#FFFDF9] border border-[#3C2F2F]/10 rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl shadow-[#3C2F2F]/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#3C2F2F]/10 flex justify-between items-center bg-[#3C2F2F]/[0.03]">
              <div>
                <h2 className="text-3xl font-black text-[#3C2F2F] tracking-tighter italic">New <span className="text-rose-500">Manifesto</span></h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#3C2F2F]/40 font-bold mt-1">Adding your frequency to the sanctuary</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full hover:bg-[#3C2F2F]/5 transition-all text-[#3C2F2F]/40 hover:text-[#3C2F2F]"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              {/* Title Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/40">Manifesto Title</label>
                <input 
                  type="text"
                  placeholder="The Architecture of..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-none text-5xl md:text-6xl font-black text-[#3C2F2F] placeholder:text-[#3C2F2F]/25 focus:ring-0 selection:bg-rose-500/10 selection:text-rose-500 p-0 outline-none leading-none tracking-tighter"
                />
              </div>

              {/* Image Upload Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-[2rem] border-2 border-dashed border-[#3C2F2F]/10 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 group"
                >
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Upload" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white">
                            <Upload size={24} />
                         </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#3C2F2F]/5 flex items-center justify-center text-[#3C2F2F]/20 group-hover:text-rose-500 group-hover:bg-rose-500/10 transition-all">
                        {isUploading ? <Loader2 className="animate-spin" size={32} /> : <ImageIcon size={32} />}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-[#3C2F2F]/50 group-hover:text-[#3C2F2F] transition-colors">Hero Image</p>
                        <p className="text-[10px] text-[#3C2F2F]/30 mt-1 uppercase tracking-tighter">Click to upload to CloudinaryVault</p>
                      </div>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>

                <div className="bg-[#3C2F2F]/[0.02] rounded-[2rem] p-8 border border-[#3C2F2F]/5 space-y-4 flex flex-col justify-center">
                  <h4 className="text-[#3C2F2F] font-black italic tracking-tight text-xl">Visual Resonance</h4>
                  <p className="text-sm text-[#3C2F2F]/50 leading-relaxed font-medium">
                    Select a high-fidelity image that reflects the tone of your entry. Your image will be securely hosted on the Matriarch Cloudinary cluster.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500/60">
                    <CheckCircle size={14} />
                    Auto-Optimized for PWA
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#3C2F2F]/30">The Reflection (Markdown Supported)</label>
                <textarea 
                  placeholder="In the silence of the sanctuary..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#3C2F2F]/[0.02] border border-[#3C2F2F]/5 rounded-[2rem] p-8 min-h-[400px] text-[#3C2F2F]/80 text-lg leading-relaxed font-medium focus:bg-[#3C2F2F]/[0.04] focus:border-[#3C2F2F]/10 transition-all outline-none resize-none selection:bg-rose-500/10 selection:text-rose-500"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#3C2F2F]/10 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#3C2F2F]/[0.03]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3C2F2F]/10 overflow-hidden bg-rose-500/5">
                   <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[#3C2F2F] text-xs font-bold leading-none">{user?.full_name || 'Sanctuary Aspirant'}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#3C2F2F]/30 mt-1">Verified Identity Protocol</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-[#3C2F2F]/40 hover:text-[#3C2F2F] transition-all"
                >
                  Save Draft
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className="flex-1 md:flex-none py-4 px-12 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-rose-500/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Submit for Review
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManifestoEditor;
