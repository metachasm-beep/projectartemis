import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestoService, type ManifestoSubmission } from '@/services/manifestoService';
import { CheckCircle, XCircle, Eye, Clock, RefreshCw, Terminal, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DecryptedText from '@/components/ui/cyber/DecryptedText';

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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-10">
          <button 
            onClick={() => setViewMode('GRID')}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 hover:text-emerald-500 transition-all group"
          >
            <div className="p-2 bg-emerald-500/5 rounded-lg group-hover:bg-emerald-500/20 transition-all">
               <ArrowRight size={14} className="rotate-180" />
            </div>
            Back to Queue Matrix
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'rejected')}
              className="px-8 py-4 bg-red-500/5 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 active:scale-95"
            >
              <XCircle size={16} /> Decline Manifesto
            </button>
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'approved')}
              className="px-10 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95"
            >
              <CheckCircle size={16} /> Authenticate & Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-10">
          <div className="lg:col-span-2 space-y-10">
            <header className="space-y-6">
              <Badge variant="outline" className="text-[9px] font-black tracking-[0.4em] uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-4 py-1.5">Pending Protocol Review</Badge>
              <h1 className="text-5xl font-black text-white uppercase italic leading-tight tracking-tighter">{selectedSubmission.title}</h1>
              <div className="flex items-center gap-6 py-6 border-y border-emerald-500/10">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author_id}`} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-white uppercase tracking-tighter italic">{selectedSubmission.author_name}</p>
                    <p className="text-[9px] text-emerald-500/40 uppercase tracking-[0.3em]">Submission Logged: {new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
            </header>

            <div className="aspect-video rounded-[3rem] overflow-hidden border border-emerald-500/10 bg-slate-900 shadow-2xl relative group">
               <img 
                 src={selectedSubmission.image_url} 
                 className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                 alt="Manifesto Hero"
               />
               <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none mix-blend-overlay" />
            </div>

            <article className="prose prose-invert prose-emerald max-w-none font-mono text-sm leading-relaxed text-slate-300">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {selectedSubmission.content}
               </ReactMarkdown>
            </article>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-emerald-500/10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Terminal size={100} className="text-emerald-500" />
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40 italic">Moderation Metrics</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Character Entropy</span>
                      <span className="text-white">{selectedSubmission.content.length}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Read Probability</span>
                      <span className="text-white">~{Math.ceil(selectedSubmission.content.length / 1000)}m</span>
                   </div>
                   <div className="w-full h-px bg-emerald-500/10" />
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-emerald-500/20 uppercase tracking-widest leading-relaxed italic">
                        Guideline: Ensure the manifesto aligns with Sanctuary intellectual tones and protocol standards.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center px-10">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-emerald-500/40" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                   Manifesto <span className="text-emerald-500/50">Queue</span>
                </h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/40 flex items-center gap-2 italic">
                <Clock size={10} className="text-emerald-500" /> Moderation Protocol for Global Journal
             </p>
          </div>
          <button 
            onClick={loadSubmissions} 
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all active:scale-90"
          >
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
         <AnimatePresence>
            {submissions.map((s, i) => (
               <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedSubmission(s);
                    setViewMode('CONTENT');
                  }}
                  className="group cursor-pointer"
               >
                  <div className="bg-slate-900/40 border border-emerald-500/10 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 flex flex-col h-full shadow-2xl">
                     <div className="aspect-video relative overflow-hidden bg-slate-950">
                        <img src={s.image_url} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
                        <div className="absolute top-4 right-4">
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-white/10 text-[8px] font-black uppercase tracking-widest px-3">PENDING</Badge>
                        </div>
                     </div>
                     <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter line-clamp-2 leading-tight">{s.title}</h3>
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/20 overflow-hidden">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_id}`} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.author_name}</span>
                           </div>
                        </div>
                        <div className="pt-6 border-t border-emerald-500/5 flex justify-between items-center">
                           <span className="text-[8px] font-black text-emerald-500/30 uppercase tracking-[0.4em] flex items-center gap-2">
                             <Clock size={10} /> {new Date(s.created_at).toLocaleDateString()}
                           </span>
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                              <Eye size={14} />
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>

         {submissions.length === 0 && !loading && (
            <div className="col-span-full py-40 border-2 border-dashed border-emerald-500/10 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <Terminal size={48} className="text-emerald-500/40" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-500/40">Moderation Queue Clear</p>
            </div>
         )}
      </div>
    </div>
  );
};
