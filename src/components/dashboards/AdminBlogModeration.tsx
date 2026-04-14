import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestoService, type ManifestoSubmission } from '@/services/manifestoService';
import { CheckCircle, XCircle, Eye, Clock, User, Filter, RefreshCw, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const AdminBlogModeration: React.FC = () => {
  const [submissions, setSubmissions] = useState<ManifestoSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ManifestoSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'GRID' | 'CONTENT'>('GRID');

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await ManifestoService.getPendingQueue();
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    const success = await ManifestoService.moderate(id, status);
    if (success) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedSubmission(null);
      setViewMode('GRID');
    }
  };

  if (viewMode === 'CONTENT' && selectedSubmission) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setViewMode('GRID')}
            className="text-[10px] font-black uppercase tracking-widest text-mat-wine/40 hover:text-mat-wine transition-colors flex items-center gap-2"
          >
            ← Back to Queue
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'rejected')}
              className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
            >
              <XCircle size={14} /> Decline Manifesto
            </button>
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'approved')}
              className="px-8 py-2 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
            >
              <CheckCircle size={14} /> Publish to Journal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header className="space-y-4">
              <Badge variant="outline" className="text-[8px] tracking-[0.3em] uppercase border-mat-rose/20 text-mat-rose">Pending Protocol Review</Badge>
              <h1 className="text-5xl font-light text-mat-wine italic leading-tight">{selectedSubmission.title}</h1>
              <div className="flex items-center gap-4 py-4 border-y border-mat-rose/10">
                 <div className="w-10 h-10 rounded-full bg-mat-rose/10 border border-mat-rose/20 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author_id}`} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-mat-wine uppercase tracking-tight">{selectedSubmission.author_name}</p>
                    <p className="text-[10px] text-mat-slate/40 uppercase tracking-widest">Submitted on {new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
            </header>

            <div className="aspect-video rounded-[3rem] overflow-hidden border border-mat-rose/10 bg-mat-cream/40">
               <img 
                 src={selectedSubmission.image_url} 
                 className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" 
                 alt="Manifesto Hero"
               />
            </div>

            <article className="prose prose-mat max-w-none">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {selectedSubmission.content}
               </ReactMarkdown>
            </article>
          </div>

          <div className="space-y-8">
             <div className="mat-glass p-8 rounded-[2.5rem] border border-mat-rose/10 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-wine/40">Moderation Metrics</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-mat-slate/60">Character Count</span>
                      <span className="font-bold text-mat-wine">{selectedSubmission.content.length}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-mat-slate/60">Estimated Read Time</span>
                      <span className="font-bold text-mat-wine">{Math.ceil(selectedSubmission.content.length / 1000)} min</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-mat-slate/60">Image Hosting</span>
                      <span className="font-bold text-mat-rose uppercase text-[8px] tracking-widest">{selectedSubmission.image_url.includes('cloudinary') ? 'CloudinaryVault' : 'External'}</span>
                   </div>
                </div>
             </div>

             <div className="bg-mat-cream/40 p-8 rounded-[2.5rem] border border-dashed border-mat-rose/20 space-y-4 text-center">
                <Layers className="mx-auto text-mat-rose/30" size={32} strokeWidth={1} />
                <p className="text-[10px] leading-relaxed text-mat-slate/60 font-bold uppercase tracking-widest">
                  Upon approval, this manifesto will be interleaved into the public frequency of the Journal sanctuary.
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-light text-mat-wine italic">Manifesto <span className="text-mat-rose/50">Curation</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/40 flex items-center gap-2">
            <Filter size={10} /> Active Protocol Review Queue
          </p>
        </div>
        <button 
          onClick={loadSubmissions}
          className="p-3 bg-mat-wine/5 text-mat-wine rounded-full hover:bg-mat-wine/10 transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && submissions.length === 0 ? (
        <div className="h-64 flex items-center justify-center opacity-20">
          <RefreshCw className="animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 mat-glass-deep rounded-[3rem] border-dashed border-mat-rose/20 opacity-40">
          <Layers size={64} strokeWidth={0.5} />
          <p className="text-xs uppercase tracking-widest font-black">All Submissions Curated</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {submissions.map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedSubmission(s);
                  setViewMode('CONTENT');
                }}
                className="group mat-glass p-6 rounded-[2.5rem] border border-mat-rose/10 hover:border-mat-rose/40 hover:bg-white transition-all cursor-pointer space-y-6 shadow-sm flex flex-col"
              >
                <div className="aspect-[16/10] rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={s.image_url} className="w-full h-full object-cover" alt={s.title} />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                     <Badge variant="outline" className="text-[7px] tracking-widest uppercase border-mat-rose/10 text-mat-slate/40">Pending</Badge>
                     <div className="flex items-center gap-1 text-[8px] font-bold text-mat-slate/30 uppercase tracking-widest">
                        <Clock size={10} />
                        {new Date(s.created_at).toLocaleDateString()}
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-mat-wine leading-tight line-clamp-2 italic">{s.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-mat-rose/5">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-mat-rose/5 border border-mat-rose/10 flex items-center justify-center overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_id}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-mat-wine/60 uppercase tracking-tight">{s.author_name.split(' ')[0]}</span>
                   </div>
                   <button className="p-2 bg-mat-wine text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                      <Eye size={12} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
