import { DEFAULT_IMAGES } from '@/components/landing/HeroFold';
import { Trash2, Plus, Image as ImageIcon, ExternalLink, ShieldCheck, Upload, Loader2, CheckSquare, Square, X } from 'lucide-react';

export const AdminHeroGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
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

  const handleBulkRemove = async () => {
    if (!window.confirm(`Permanently archive ${selectedIds.length} selected visuals?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => AdminService.removeHeroImage(id)));
      setSelectedIds([]);
      setIsSelectMode(false);
      await loadImages();
    } catch (err) {
      console.error("Bulk archive failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateDefaults = async () => {
    if (!window.confirm("This will import the system's default cinematic visuals into your active gallery. Proceed?")) return;
    setLoading(true);
    try {
      await Promise.all(DEFAULT_IMAGES.map(url => AdminService.addHeroImage(url)));
      await loadImages();
    } catch (err) {
      console.error("Default activation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
          
          <div className="flex gap-2">
            {!isSelectMode ? (
              <>
                <button 
                  onClick={() => setIsSelectMode(true)}
                  disabled={images.length === 0}
                  className="h-14 px-6 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <CheckSquare className="w-4 h-4" /> Selection Mode
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  UPLOAD
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setIsSelectMode(false); setSelectedIds([]); }}
                  className="h-14 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  onClick={handleBulkRemove}
                  disabled={selectedIds.length === 0 || loading}
                  className="h-14 px-8 bg-rose-500 text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-rose-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Trash2 className="w-4 h-4" /> Archive Selected ({selectedIds.length})
                </button>
              </>
            )}
          </div>

          {!isSelectMode && (
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {images.map((img) => {
            const isSelected = selectedIds.includes(img.id);
            return (
              <motion.div 
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => isSelectMode && toggleSelect(img.id)}
                className={`group relative bg-white rounded-[2.5rem] border ${isSelected ? 'border-slate-900 ring-4 ring-slate-100' : 'border-black/[0.03]'} overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 h-[400px] cursor-pointer`}
              >
                <img 
                  src={img.url} 
                  className={`w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100 ${!isSelected && !isSelectMode ? 'grayscale group-hover:grayscale-0' : ''}`} 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-500 ${isSelectMode ? 'opacity-40' : 'opacity-0 group-hover:opacity-100'}`} />
                
                {isSelectMode && (
                  <div className="absolute top-6 right-6">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white/20 border-white text-transparent'}`}>
                      <CheckSquare size={16} />
                    </div>
                  </div>
                )}

                {!isSelectMode && (
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); window.open(img.url, '_blank'); }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <ExternalLink size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemove(img.id); }}
                      className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold text-[9px] tracking-widest uppercase flex items-center gap-2 hover:bg-rose-600 transition-colors shadow-lg"
                    >
                        <Trash2 size={12} /> Archive
                    </button>
                  </div>
                )}

                <div className="absolute top-6 left-6">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
                      <span className="text-[7px] font-black text-white/60 tracking-widest uppercase">ID_{img.id.slice(-4)}</span>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {images.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-8 bg-white rounded-[4rem] border border-black/[0.02] border-dashed">
             <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                <ImageIcon size={32} strokeWidth={1} />
             </div>
             <div className="text-center space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">The Zenith remains uncurated</p>
                  <p className="text-slate-300 text-[9px] font-medium tracking-widest uppercase italic">Manifest visual assets or activate the cinematic default set</p>
                </div>
                
                <button 
                  onClick={handleActivateDefaults}
                  disabled={loading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 mx-auto"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck size={14} />}
                  Activate Default Sanctuary Set
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
