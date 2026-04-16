import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestoService, type ManifestoSubmission } from '@/services/manifestoService';
import { CheckCircle, XCircle, Eye, Clock, RefreshCw, Terminal, ArrowRight, BookOpen } from 'lucide-react';
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
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <button 
            onClick={() => setViewMode('GRID')}
            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-all group"
          >
            <div className="p-3 bg-[#D4AF37]/5 rounded-xl group-hover:bg-[#D4AF37]/10 transition-all">
               <ArrowRight size={14} className="rotate-180" />
            </div>
            Back to Queue Matrix
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'rejected')}
              className="px-10 py-5 bg-white text-red-400 border border-red-100 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
            >
              <XCircle size={18} /> Decline Manifesto
            </button>
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'approved')}
              className="px-12 py-5 bg-[#D4AF37] text-white border border-[#D4AF37]/20 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#BFA06A] transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <CheckCircle size={18} /> Authenticate & Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <header className="space-y-8">
              <Badge variant="outline" className="text-[9px] font-black tracking-[0.4em] uppercase border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 px-5 py-2">Pending Protocol Review</Badge>
              <h1 className="text-6xl font-display font-black text-[#1A1A1A] uppercase italic leading-[1.1] tracking-tighter">{selectedSubmission.title}</h1>
              <div className="flex items-center gap-8 py-8 border-y border-[#D4AF37]/10">
                 <div className="w-16 h-16 rounded-[1.8rem] bg-[#D4AF37]/5 border border-[#D4AF37]/20 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author_id}`} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-sm font-display font-black text-[#1A1A1A] uppercase tracking-tighter italic">{selectedSubmission.author_name}</p>
                    <p className="text-[10px] text-[#D4AF37]/40 uppercase tracking-[0.3em] font-medium">Submission Logged: {new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
            </header>

            <div className="aspect-video rounded-[4rem] overflow-hidden border border-[#D4AF37]/10 bg-white shadow-2xl relative group">
               <img 
                 src={selectedSubmission.image_url} 
                 className="w-full h-full object-cover grayscale transition-all duration-1500 group-hover:grayscale-0 group-hover:scale-105" 
                 alt="Manifesto Hero"
               />
               <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none mix-blend-overlay" />
            </div>

            <article className="prose prose-mat max-w-none font-body text-lg leading-relaxed text-[#1A1A1A]/80 selection:bg-[#D4AF37] selection:text-white">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {selectedSubmission.content}
               </ReactMarkdown>
            </article>
          </div>

          <div className="space-y-10">
             <div className="bg-white p-12 rounded-[3.5rem] border border-[#D4AF37]/10 space-y-10 relative overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <BookOpen size={120} className="text-[#D4AF37]" />
                </div>
                
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/40 italic">Moderation Metrics</h4>
                <div className="space-y-8">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                      <span className="text-[#1A1A1A]/20">Word Complexity</span>
                      <span className="text-[#1A1A1A]">~{Math.ceil(selectedSubmission.content.split(' ').length)} Tokens</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                      <span className="text-[#1A1A1A]/20">Exposure Rank</span>
                      <span className="text-[#D4AF37]">Global Prime</span>
                   </div>
                   <div className="w-full h-px bg-[#D4AF37]/10" />
                   <div className="space-y-6">
                      <p className="text-[10px] font-medium text-[#1A1A1A]/40 uppercase tracking-widest leading-relaxed italic">
                        Verify that the manifesto maintains the Sanctuary's intellectual elevation and avoids redundant noise.
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
    <div className="space-y-16 pb-32 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-[#D4AF37]/10 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#D4AF37]" />
                <h2 className="text-4xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter">
                   Manifesto <span className="text-[#D4AF37]">Queue</span>
                </h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/30 flex items-center gap-2 italic">
                <Clock size={12} className="text-[#D4AF37]" /> Spectral Processing for Global Journal
             </p>
          </div>
          <button 
            onClick={loadSubmissions} 
            className="p-5 rounded-full bg-white border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
         <AnimatePresence>
            {submissions.map((s, i) => (
               <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedSubmission(s);
                    setViewMode('CONTENT');
                  }}
                  className="group cursor-pointer"
               >
                  <div className="bg-white border border-[#D4AF37]/10 rounded-[4rem] overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-[0_40px_100px_rgba(212,175,55,0.1)] transition-all duration-1000 flex flex-col h-full shadow-sm">
                     <div className="aspect-[4/3] relative overflow-hidden bg-[#fdfcfb]">
                        <img src={s.image_url} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1500" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
                        <div className="absolute top-6 right-6">
                           <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-white/50 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 backdrop-blur-md">PENDING</Badge>
                        </div>
                     </div>
                     <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                           <h3 className="text-2xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter line-clamp-2 leading-none group-hover:text-[#D4AF37] transition-colors">{s.title}</h3>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 overflow-hidden">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_id}`} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[10px] font-black text-[#1A1A1A]/20 uppercase tracking-[0.3em] font-medium">{s.author_name}</span>
                           </div>
                        </div>
                        <div className="pt-8 border-t border-[#D4AF37]/10 flex justify-between items-center">
                           <span className="text-[9px] font-black text-[#D4AF37]/60 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                             <Clock size={12} /> {new Date(s.created_at).toLocaleDateString()}
                           </span>
                           <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all shadow-sm">
                              <Eye size={18} />
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>

         {submissions.length === 0 && !loading && (
            <div className="col-span-full py-48 border-2 border-dashed border-[#D4AF37]/10 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 opacity-60">
                <BookOpen size={64} className="text-[#D4AF37]/40" strokeWidth={0.5} />
                <p className="text-[11px] uppercase tracking-[0.5em] font-black text-[#1A1A1A]/40 italic">The Archive Queue is Current</p>
            </div>
         )}
      </div>
    </div>
  );
};
