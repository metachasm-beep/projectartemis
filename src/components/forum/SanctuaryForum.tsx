import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { Sparkles, PenTool, Hash, RefreshCw, X } from 'lucide-react';
import { ForumService } from '@/lib/forumService';
import { ForumPost, PostProps } from './ForumPost';
import { MarkdownEditor } from './MarkdownEditor';

const CATEGORIES = ["Safety", "Health", "Career", "Dating Advice", "General"];

export const SanctuaryForum: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [topics, setTopics] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [composerTitle, setComposerTitle] = useState("");
  const [composerCategory, setComposerCategory] = useState("Safety");

  const loadTopics = async () => {
     setLoading(true);
     try {
        const data = await ForumService.getTopics();
        setTopics(data as PostProps[]);
     } catch (err) {
        console.error(err);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     loadTopics();
     // Fast Poll for demo purposes (Task 3: Real-time via polling)
     const pollId = setInterval(loadTopics, 15000);
     return () => clearInterval(pollId);
  }, []);

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

  return (
    <div className="fixed inset-0 z-[150] bg-mat-obsidian overflow-y-auto flex flex-col">
       {/* HEADER */}
       <div className="sticky top-0 z-50 bg-[#111]/80 backdrop-blur-2xl border-b border-mat-gold/20 px-6 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-mat-gold">
                <Sparkles size={16} className="animate-pulse" />
                <h2 className="text-xl font-black italic tracking-widest uppercase font-['Impact']">The Coven</h2>
             </div>
             <p className="text-[9px] uppercase tracking-[0.4em] text-white/40">Exclusive Sovereign Forum</p>
          </div>
          <div className="flex items-center gap-4">
             <Button 
                onPress={() => setIsComposing(true)} 
                startContent={<PenTool size={14}/>} 
                className="bg-mat-rose text-white font-black uppercase tracking-widest text-[9px] h-9 px-4 rounded-full shadow-lg hover:shadow-mat-rose/30"
             >
                <span className="hidden xs:inline">Draft</span> Protocol
             </Button>
             <Button isIconOnly variant="ghost" onPress={onClose} className="text-white/40 hover:text-white rounded-full">
                <X size={20} />
             </Button>
          </div>
       </div>

       {/* FEED */}
       <div className="flex-1 container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
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
                         <Select 
                           label="Category" 
                           variant="faded"
                           selectedKeys={[composerCategory]}
                           onChange={(e) => setComposerCategory(e.target.value)}
                           className="col-span-1"
                           classNames={{ trigger: "bg-white/5 border-white/10" }}
                         >
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                         </Select>
                         <Input 
                           label="Title"
                           variant="faded"
                           value={composerTitle}
                           onValueChange={setComposerTitle}
                           className="col-span-1 md:col-span-2"
                           classNames={{ inputWrapper: "bg-white/5 border-white/10 text-white" }}
                         />
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
