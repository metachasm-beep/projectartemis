import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestoService, type ManifestoSubmission } from '@/services/manifestoService';
import { CheckCircle, XCircle, Eye, RefreshCw, BookOpen, Clock, Activity, ArrowRight, Fingerprint } from 'lucide-react';
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
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <button 
            onClick={() => setViewMode('GRID')}
            className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.5em] text-slate-300 hover:text-slate-900 transition-all group"
          >
            <div className="p-3 bg-white rounded-2xl border border-black/[0.03] group-hover:bg-slate-50 transition-all shadow-sm">
               <ArrowRight size={14} className="rotate-180" strokeWidth={1.5} />
            </div>
            BACK_TO_MANIFESTO_MATRIX
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'rejected')}
              className="px-10 py-5 bg-white text-rose-300 border border-rose-50 rounded-[1.75rem] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center gap-3 shadow-sm active:scale-95"
            >
              <XCircle size={18} strokeWidth={1.5} /> DECLINE_PAYLOAD
            </button>
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'approved')}
              className="px-12 py-5 bg-slate-900 text-white border border-slate-800 rounded-[1.75rem] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <CheckCircle size={18} strokeWidth={1.5} /> AUTHENTICATE_SYNC
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-16">
            <header className="space-y-8">
              <Badge variant="outline" className="text-[9px] font-bold tracking-[0.4em] uppercase border-slate-100 text-slate-400 bg-slate-50 px-5 py-2">PROTOCOL_PENDING_REVIEW</Badge>
              <h1 className="text-6xl font-bold text-slate-900 uppercase italic leading-[1.1] tracking-tighter">{selectedSubmission.title}</h1>
              <div className="flex items-center gap-10 py-10 border-y border-black/[0.02]">
                 <div className="w-16 h-16 rounded-[2rem] bg-slate-50 border border-black/[0.02] overflow-hidden shadow-sm p-0.5">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author_id}`} className="w-full h-full object-cover rounded-[1.8rem]" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter italic">{selectedSubmission.author_name}</p>
                    <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-medium">UPLINK_STAMP: {new Date(selectedSubmission.created_at).toLocaleDateString()} // {new Date(selectedSubmission.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
              </div>
            </header>

            <div className="aspect-video rounded-[4rem] overflow-hidden border border-black/[0.02] bg-slate-50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] relative group">
               <img 
                 src={selectedSubmission.image_url} 
                 className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1500 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100" 
                 alt="Manifesto Hero"
               />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/80 to-transparent" />
               <div className="absolute top-8 right-8 text-slate-200">
                  <Fingerprint size={48} strokeWidth={1} />
               </div>
            </div>

            <article className="prose prose-slate max-w-none font-sans text-lg leading-relaxed text-slate-700 selection:bg-slate-900 selection:text-white">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {selectedSubmission.content}
               </ReactMarkdown>
            </article>
          </div>

          <div className="space-y-12">
             <div className="bg-white p-12 rounded-[4rem] border border-black/[0.02] space-y-10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                   <BookOpen size={120} className="text-slate-900" strokeWidth={1} />
                </div>
                
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300 italic flex items-center gap-2"><Activity size={12} strokeWidth={2} /> PROTOCOL_LOGS</h4>
                <div className="space-y-8">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em]">
                      <span className="text-slate-300">Data_Mass</span>
                      <span className="text-slate-900">~{Math.ceil(selectedSubmission.content.split(' ').length)} Tokens</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em]">
                      <span className="text-slate-300">Resonance</span>
                      <span className="text-slate-900">PRIME_INTEL</span>
                   </div>
                   <div className="w-full h-px bg-black/[0.02]" />
                   <div className="space-y-6">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed italic">
                        Evaluate payload for high-fidelity alignment with the Sanctuary's intellectual frequency. Synchronize only essential intellectual shifts.
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
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-black/[0.03] pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <h2 className="text-3xl font-bold text-slate-900 uppercase italic tracking-tighter">
                   MANIFESTO <span className="font-light text-slate-400">INDEX</span>
                </h2>
             </div>
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Clock size={12} className="text-slate-400" /> Secure Intellectual Ingestion Queue
             </p>
          </div>
          <button 
            onClick={loadSubmissions} 
            className="w-14 h-14 rounded-[2rem] bg-white border border-black/[0.03] text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
         <AnimatePresence>
            {submissions.map((s, i) => (
               <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedSubmission(s);
                    setViewMode('CONTENT');
                  }}
                  className="group cursor-pointer"
               >
                  <div className="bg-white border border-black/[0.01] rounded-[4rem] overflow-hidden hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-1000 flex flex-col h-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] relative">
                     <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                        <img src={s.image_url} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
                        <div className="absolute top-6 right-6">
                           <Badge className="bg-white/80 text-slate-400 border border-black/[0.05] text-[7px] font-bold uppercase tracking-widest px-4 py-1.5 backdrop-blur-md">STATUS: QUEUED</Badge>
                        </div>
                     </div>
                     <div className="p-10 space-y-10 flex-1 flex flex-col justify-between relative z-10">
                        <div className="space-y-4">
                           <h3 className="text-2xl font-bold text-slate-900 uppercase italic tracking-tighter line-clamp-2 leading-none group-hover:text-slate-900 transition-colors">{s.title}</h3>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-black/[0.02] overflow-hidden p-0.5">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_id}`} className="w-full h-full object-cover rounded-[0.8rem]" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{s.author_name}</span>
                           </div>
                        </div>
                        <div className="pt-8 border-t border-black/[0.02] flex justify-between items-center">
                           <span className="text-[9px] font-bold text-slate-200 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                             <Clock size={12} strokeWidth={2} /> TX_{new Date(s.created_at).toLocaleDateString()}
                           </span>
                           <div className="w-12 h-12 rounded-[1.5rem] bg-white border border-black/[0.03] flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                              <Eye size={20} strokeWidth={1.5} />
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>

         {submissions.length === 0 && !loading && (
            <div className="col-span-full py-48 border-2 border-dashed border-black/[0.02] rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 opacity-30">
                <Fingerprint size={64} className="text-slate-200" strokeWidth={1} />
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-300 italic">MANIFESTO_FEED_SYNCHRONIZED</p>
            </div>
         )}
      </div>
    </div>
  );
};
