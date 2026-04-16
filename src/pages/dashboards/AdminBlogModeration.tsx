import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestoService, type ManifestoSubmission } from '@/services/manifestoService';
import { CheckCircle, XCircle, Eye, RefreshCw, Terminal, ArrowRight, BookOpen, Clock, Activity } from 'lucide-react';
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-32 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-6 rounded-2xl border border-white/5">
          <button 
            onClick={() => setViewMode('GRID')}
            className="flex items-center gap-4 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30 hover:text-white transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all">
               <ArrowRight size={14} className="rotate-180" />
            </div>
            RETURN_TO_QUEUE_MATRIX
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'rejected')}
              className="px-8 py-4 bg-black text-red-500 border border-red-500/20 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.25em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 shadow-lg active:scale-95"
            >
              <XCircle size={16} /> REJECT_PAYLOAD
            </button>
            <button 
              onClick={() => handleModerate(selectedSubmission.id, 'approved')}
              className="px-10 py-4 bg-purple-600 text-white border border-purple-400/40 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.25em] hover:bg-black hover:text-purple-500 hover:border-purple-500 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] active:scale-95"
            >
              <CheckCircle size={16} /> AUTHENTICATE_SYNC
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <header className="space-y-6">
              <Badge variant="outline" className="text-[8px] font-mono font-black tracking-[0.4em] uppercase border-purple-500/40 text-purple-500 bg-purple-500/5 px-4 py-1.5 animate-pulse">PROTOCOL_PENDING_REVIEW</Badge>
              <h1 className="text-5xl font-black text-white uppercase italic leading-[1.1] tracking-tighter">{selectedSubmission.title}</h1>
              <div className="flex items-center gap-8 py-6 border-y border-white/5">
                 <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-xl p-0.5">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author_id}`} className="w-full h-full object-cover rounded-[0.5rem]" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-white uppercase tracking-tighter italic">{selectedSubmission.author_name}</p>
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] font-medium">UPLINK_STAMP: {new Date(selectedSubmission.created_at).toLocaleDateString()} :: {new Date(selectedSubmission.created_at).toLocaleTimeString([], { hour12: false })}</p>
                 </div>
              </div>
            </header>

            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl relative group">
               <img 
                 src={selectedSubmission.image_url} 
                 className="w-full h-full object-cover grayscale opacity-60 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100" 
                 alt="Manifesto Hero"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               <div className="absolute top-0 right-0 p-8">
                  <Terminal size={32} className="text-purple-500/20" />
               </div>
            </div>

            <article className="prose prose-invert prose-purple max-w-none font-mono text-sm leading-relaxed text-white/80 selection:bg-purple-500 selection:text-white">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {selectedSubmission.content}
               </ReactMarkdown>
            </article>
          </div>

          <div className="space-y-8">
             <div className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                   <BookOpen size={100} className="text-purple-500" />
                </div>
                
                <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.5em] text-cyan-500/40 italic flex items-center gap-2"><Activity size={12} /> PROTOCOL_METRICS</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase tracking-[0.2em]">
                      <span className="text-white/20">Data_Load</span>
                      <span className="text-white">~{Math.ceil(selectedSubmission.content.split(' ').length)} Tokens</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase tracking-[0.2em]">
                      <span className="text-white/20">Sync_Rank</span>
                      <span className="text-purple-500">PRIME_MANIFESTO</span>
                   </div>
                   <div className="w-full h-px bg-white/5" />
                   <div className="space-y-4">
                      <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest leading-relaxed italic">
                        Verify packet integrity. Submissions must resonate with the Sanctuary's intellectual frequency. Avoid redundancy.
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
    <div className="space-y-12 pb-32 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-white/5 pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7] animate-pulse" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                   MANIFESTO <span className="text-purple-500">INBOUND_QUEUE</span>
                </h2>
             </div>
             <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Clock size={12} className="text-cyan-500" /> SECURE_DATA_INGESTION_STREAM
             </p>
          </div>
          <button 
            onClick={loadSubmissions} 
            className="w-14 h-14 rounded-xl bg-black border border-white/10 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <AnimatePresence>
            {submissions.map((s, i) => (
               <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedSubmission(s);
                    setViewMode('CONTENT');
                  }}
                  className="group cursor-pointer"
               >
                  <div className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] transition-all duration-700 flex flex-col h-full shadow-2xl group relative">
                     {/* Hover Glow */}
                     <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                     
                     <div className="aspect-[16/10] relative overflow-hidden bg-black">
                        <img src={s.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
                        <div className="absolute top-4 right-4 animate-in fade-in duration-1000">
                           <Badge className="bg-black/80 text-purple-500 border border-purple-500/30 text-[7px] font-mono font-black uppercase tracking-widest px-3 py-1 backdrop-blur-md">STATUS: PENDING</Badge>
                        </div>
                     </div>
                     <div className="p-8 space-y-6 flex-1 flex flex-col justify-between relative z-10">
                        <div className="space-y-3">
                           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter line-clamp-2 leading-none group-hover:text-purple-400 transition-colors">{s.title}</h3>
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_id}`} className="w-full h-full object-cover rounded-md" />
                              </div>
                              <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.2em]">{s.author_name}</span>
                           </div>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                           <span className="text-[8px] font-mono font-black text-cyan-500/40 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                             <Terminal size={10} /> TX_{new Date(s.created_at).toLocaleDateString()}
                           </span>
                           <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner border border-purple-500/20">
                              <Eye size={16} />
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>

         {submissions.length === 0 && !loading && (
            <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <Activity size={48} className="text-purple-500/40 animate-pulse" strokeWidth={1} />
                <p className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.5em] italic">ALL_PACKETS_MANIFESTED_IN_JOURNAL</p>
            </div>
         )}
      </div>
    </div>
  );
};
