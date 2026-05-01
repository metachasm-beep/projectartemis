import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Trash2, Plus, Image as ImageIcon, ExternalLink, ShieldCheck, Upload, Loader2 } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { Input } from '@/components/ui/input';

export const AdminHeroGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const res = await AdminService.getHeroImages();
    setImages(res);
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setLoading(true);
    const ok = await AdminService.addHeroImage(newUrl.trim());
    if (ok) {
      setNewUrl('');
      await loadImages();
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file, 'hero_slideshow');
      const ok = await AdminService.addHeroImage(url);
      if (ok) await loadImages();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Manifestation failed: Sovereign vault is temporarily sealed.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm("Archiving this visual will remove it from the Sanctuary's entry. Proceed?")) return;
    const ok = await AdminService.removeHeroImage(id);
    if (ok) {
      await loadImages();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <ImageIcon size={16} strokeWidth={1.5} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Hero Gallery</h2>
          </div>
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase italic">Curate the Visual Identity of the Zenith Stage</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            LOCAL / DRIVE UPLOAD
          </button>

          <div className="flex gap-2 flex-1 md:flex-none">
            <Input 
              placeholder="OR INSERT IMAGE URL..." 
              className="h-14 px-6 bg-white border-black/[0.03] rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-200 shadow-sm md:w-80" 
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button 
              onClick={handleAdd}
              disabled={loading || !newUrl}
              className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
            >
              <Plus size={14} /> Manifest
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.div 
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white rounded-[2.5rem] border border-black/[0.03] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 h-[400px]"
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
                 <button 
                   onClick={() => window.open(img.url, '_blank')}
                   className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                 >
                    <ExternalLink size={16} />
                 </button>
                 <button 
                   onClick={() => handleRemove(img.id)}
                   className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold text-[9px] tracking-widest uppercase flex items-center gap-2 hover:bg-rose-600 transition-colors shadow-lg"
                 >
                    <Trash2 size={12} /> Archive
                 </button>
              </div>

              <div className="absolute top-6 left-6">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
                    <span className="text-[7px] font-black text-white/60 tracking-widest uppercase">ID_{img.id.slice(-4)}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 bg-white rounded-[4rem] border border-black/[0.02] border-dashed">
             <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                <ImageIcon size={32} strokeWidth={1} />
             </div>
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">The Zenith remains uncurated</p>
                <p className="text-slate-300 text-[9px] font-medium tracking-widest uppercase italic">Manifest visual assets to activate the Hero Slideshow</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
