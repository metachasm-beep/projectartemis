import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { Sparkles, PenTool, Hash, RefreshCw, X, ShieldAlert, Lock, Fingerprint } from 'lucide-react';
import { ForumService } from '@/lib/forumService';
import { ForumPost } from './ForumPost';
import type { PostProps } from './ForumPost';
import { MarkdownEditor } from './MarkdownEditor';
import type { MatriarchProfile } from '@/types';

const CATEGORIES = ["Safety", "Health", "Career", "Dating Advice", "General"];

/**
 * 🔒 Protocol Denied Overlay: High-fidelity interference for unverified access.
 */
const ProtocolDeniedOverlay: React.FC<{ onClose: () => void; isUnverified: boolean }> = ({ onClose, isUnverified }) => (
   <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="fixed inset-0 z-[200] bg-mat-obsidian/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center"
   >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md w-full space-y-8"
      >
         <div className="relative inline-block">
            <div className="absolute -inset-4 bg-mat-rose/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 bg-white/5 border border-mat-rose/30 rounded-full flex items-center justify-center mx-auto shadow-2xl">
               <ShieldAlert size={40} className="text-mat-rose animate-bounce" />
            </div>
         </div>

         <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-mat-cream font-['Impact']">Protocol Denied</h2>
            <div className="h-px w-24 bg-mat-gold/30 mx-auto" />
            <p className="text-sm text-mat-cream/60 leading-relaxed uppercase tracking-widest font-medium">
               {isUnverified 
                 ? "ENTRY DENIED: This sovereign conduit is reserved for Verified Matriarchs. Biometric Synchronization is required to access the Coven."
                 : "ACCESS RESTRICTED: Your current identification tier is insufficient to resonate within this exclusive sanctuary."}
            </p>
         </div>

         <div className="flex flex-col gap-4 pt-8">
            {isUnverified && (
               <Button 
                  className="h-16 bg-mat-gold text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3"
                  onPress={() => { window.dispatchEvent(new CustomEvent('OPEN_VERIFICATION')); onClose(); }}
               >
                  <Fingerprint size={18} />
                  Establish Identity Sync
               </Button>
            )}
            <Button 
               variant="ghost"
               className="h-14 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 uppercase tracking-widest text-[9px] font-bold rounded-2xl transition-all"
               onPress={onClose}
            >
               Retreat to Sanctuary
            </Button>
         </div>

         <div className="pt-12">
            <div className="flex items-center justify-center gap-2 text-mat-gold/20">
               <Lock size={10} />
               <span className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Handshake Protocol v1.0.4</span>
            </div>
         </div>
      </motion.div>
   </motion.div>
);

export const SanctuaryForum: React.FC<{ profile: MatriarchProfile; onClose: () => void; isInline?: boolean }> = ({ profile, onClose, isInline }) => {
  const [topics, setTopics] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [composerTitle, setComposerTitle] = useState("");
  const [composerCategory, setComposerCategory] = useState("Safety");

  const isWoman = profile.role === 'woman';
  const isVerifiedWoman = isWoman && profile.is_verified;

  const loadTopics = async () => {
     if (!isWoman) return;
     setLoading(true);
     try {
        const data = await ForumService.getTopics();
        setTopics(data as unknown as PostProps[]);
     } catch (err) {
        console.error(err);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     loadTopics();
     if (isWoman) {
        const pollId = setInterval(loadTopics, 15000);
        return () => clearInterval(pollId);
     }
  }, [isWoman]);

  const handleComposeSubmit = async (content: string) => {
     try {
       await ForumService.createTopic(composerCategory, composerTitle, content);
       setIsComposing(false);
       setComposerTitle("");
       loadTopics();
     } catch(e) {
       console.error("Compose fail", e);
     }
  };

  // 🛡️ Access Gating Logic
  if (!isWoman) {
     return (
       <div className={isInline ? "relative w-full min-h-[400px]" : ""}>
         <ProtocolDeniedOverlay onClose={onClose} isUnverified={false} />
       </div>
     );
  }

  return (
    <div className={isInline ? "relative w-full bg-[#050505] flex flex-col pt-12" : "fixed inset-0 z-[150] bg-mat-obsidian overflow-y-auto flex flex-col"}>
       {/* HEADER */}
       <div className={`${isInline ? "relative" : "sticky top-0 z-50"} bg-[#111]/80 backdrop-blur-2xl border-b border-mat-gold/20 px-6 py-4 flex items-center justify-between shadow-2xl`}>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-mat-gold">
                <Sparkles size={16} className="animate-pulse" />
                <h2 className="text-xl font-black italic tracking-widest uppercase font-['Impact']">The Coven</h2>
             </div>
             <p className="text-[9px] uppercase tracking-[0.4em] text-white/40">Exclusive Sovereign Forum</p>
          </div>
          <div className="flex items-center gap-4">
             <Button 
                onPress={() => {
                  if (isVerifiedWoman) setIsComposing(true);
                  else alert("IDENTITY SYNC REQUIRED: You must seal your truth (verify) to contribute to the Coven. Observation is currently read-only.");
                }} 
                className={`${isVerifiedWoman ? 'bg-mat-rose' : 'bg-mat-rose/20 text-white/40 cursor-not-allowed'} text-white font-black uppercase tracking-widest text-[9px] h-9 px-4 rounded-full shadow-lg hover:shadow-mat-rose/30 flex items-center justify-center gap-1`}
             >
                {!isVerifiedWoman && <Lock size={12} className="mr-1" />}
                <PenTool size={14} className="mr-1"/>
                <span className="hidden xs:inline">Draft</span> Protocol
             </Button>
             {!isInline && (
                <Button isIconOnly variant="ghost" onPress={onClose} className="text-white/40 hover:text-white rounded-full">
                   <X size={20} />
                </Button>
             )}
          </div>
       </div>

       {/* FEED */}
       <div className={`${isInline ? "" : "flex-1"} container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl`}>
          {loading && topics.length === 0 ? (
             <div className="flex items-center justify-center py-32 text-mat-gold/50 animate-spin">
                <RefreshCw size={32} />
             </div>
          ) : (
             <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {topics.map(topic => (
                   <motion.div 
                     layout
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     transition={{ duration: 0.4 }}
                     key={topic.id}
                   >
                     <ForumPost post={topic} onReply={() => {}} />
                   </motion.div>
                ))}
             </div>
          )}
       </div>

       {/* COMPOSER MODAL */}
       <AnimatePresence>
          {isComposing && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex justify-center items-end md:items-center p-0 md:p-6"
             >
                <motion.div 
                   initial={{ y: "100%" }}
                   animate={{ y: 0 }}
                   exit={{ y: "100%" }}
                   className="w-full md:max-w-2xl bg-[#1a1a1a] border border-mat-gold/30 rounded-t-3xl md:rounded-3xl flex flex-col max-h-[90vh]"
                >
                   <div className="flex justify-between items-center p-6 border-b border-white/5">
                      <div className="flex items-center gap-3 text-mat-cream">
                         <PenTool size={18} className="text-mat-rose" />
                         <span className="font-black uppercase tracking-widest italic font-['Impact'] text-xl">Draft Protocol</span>
                      </div>
                      <Button isIconOnly variant="ghost" onPress={() => setIsComposing(false)} className="text-white/40 hover:text-mat-rose rounded-full">
                         <X size={20} />
                      </Button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="col-span-1 flex flex-col justify-end pb-1">
                            <select 
                               value={composerCategory}
                               onChange={(e) => setComposerCategory(e.target.value)}
                               className="h-14 bg-white/5 border-2 border-white/10 text-white rounded-xl px-4 outline-none focus:border-mat-rose transition-all text-sm w-full font-medium"
                            >
                               {CATEGORIES.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                            </select>
                         </div>
                         <div className="col-span-1 md:col-span-2 flex flex-col justify-end pb-1">
                            <label className="text-[10px] text-white/50 mb-1 ml-1 px-1">Title</label>
                            <input 
                               value={composerTitle}
                               onChange={(e) => setComposerTitle(e.target.value)}
                               placeholder="Summon the Council..."
                               className="h-14 bg-white/5 border-2 border-white/10 text-white rounded-xl px-4 outline-none focus:border-mat-rose transition-all text-sm w-full placeholder:text-white/20 font-medium"
                            />
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2 mb-2">
                            <Hash size={12}/> Manuscript (Markdown Supported)
                         </label>
                         <MarkdownEditor onSubmit={handleComposeSubmit} />
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
