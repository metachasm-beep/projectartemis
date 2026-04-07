import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@heroui/react';
import { Bold, Italic, List, Send, Eye, Edit2 } from 'lucide-react';

interface MarkdownEditorProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isSubmitting?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  onSubmit, 
  placeholder = "Share your thoughts...",
  isSubmitting = false
}) => {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    // A simplified desktop-like insertion. On mobile, appending works safely.
    setContent(prev => `${prev}${prefix}${suffix}`);
  };

  return (
    <div className="w-full flex flex-col gap-3 bg-[#111] rounded-2xl border border-mat-gold/20 p-4 shadow-xl">
       {/* TOOLBAR */}
       <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex gap-2">
             <Button isIconOnly variant="ghost" size="sm" onPress={() => insertFormatting('**', '**')} className="text-white/60 hover:text-white">
                <Bold size={16} />
             </Button>
             <Button isIconOnly variant="ghost" size="sm" onPress={() => insertFormatting('*', '*')} className="text-white/60 hover:text-white">
                <Italic size={16} />
             </Button>
             <Button isIconOnly variant="ghost" size="sm" onPress={() => insertFormatting('\n- ')} className="text-white/60 hover:text-white">
                <List size={16} />
             </Button>
          </div>
          <div className="flex gap-2">
             <Button 
                size="sm" 
                variant="ghost" 
                onPress={() => setIsPreview(!isPreview)}
                className={`text-[10px] font-bold uppercase tracking-widest ${isPreview ? 'bg-mat-gold text-black' : 'bg-white/10 text-white'}`}
             >
                {isPreview ? <><Edit2 size={12} className="mr-1"/> Edit</> : <><Eye size={12} className="mr-1"/> Preview</>}
             </Button>
          </div>
       </div>

       {/* EDITOR AREA */}
       {isPreview ? (
          <div className="min-h-[120px] max-h-[300px] overflow-y-auto prose prose-invert prose-p:text-sm prose-li:text-sm prose-a:text-mat-gold p-2 bg-black/30 rounded-xl">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Nothing to preview...*'}
             </ReactMarkdown>
          </div>
       ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[120px] max-h-[300px] bg-transparent text-mat-cream resize-y outline-none placeholder:text-white/20 text-sm leading-relaxed"
          />
       )}

       {/* FOOTER */}
       <div className="flex justify-end pt-2">
          <Button 
             isDisabled={content.trim().length === 0}
             onPress={() => {
                onSubmit(content).then(() => setContent(''));
             }}
             className="bg-mat-rose text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl hover:shadow-[0_0_15px_rgba(230,57,70,0.5)] transition-all"
          >
             <Send size={14} className="mr-2" /> Publish
          </Button>
       </div>
    </div>
  );
};
