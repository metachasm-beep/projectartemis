import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DOCUMENT_CONTENT } from '@/components/layout/LegalArchiveOverlay';
import { SEOProvider } from '@/components/SEOProvider';
import { ArrowLeft, Award, RefreshCcw } from 'lucide-react';

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? DOCUMENT_CONTENT[slug] : null;

  if (!doc) {
    return <Navigate to="/" replace />;
  }

  const Icon = doc.icon;

  return (
    <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
      <SEOProvider 
        title={`${doc.title} | Matriarch`}
        description={`Legal documentation and policies regarding ${doc.title.toLowerCase()} for the Matriarch platform.`}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-mat-wine/60 hover:text-mat-wine mb-12 transition-colors">
          <ArrowLeft size={14} /> Return to Sanctuary
        </Link>

        <div className="bg-mat-cream/10 border border-mat-rose/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 relative z-10">
            <div className="w-20 h-20 bg-mat-wine text-white rounded-3xl flex items-center justify-center shadow-mat-premium flex-shrink-0">
              {Icon && <Icon size={40} strokeWidth={1.5} />}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-mat-wine italic leading-tight">{doc.title}</h1>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Sanctuary Registry</span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-gold">Protocol // {slug?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Compliance Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-mat-obsidian/5 rounded-full border border-mat-rose/10 text-mat-wine mb-12 relative z-10">
            <Award size={16} className="text-mat-gold" />
            <span className="text-[9px] font-black uppercase tracking-widest">Statutory Compliance</span>
          </div>

          {/* Content */}
          <div className="prose prose-sm md:prose-base prose-headings:font-display prose-headings:text-mat-wine prose-p:text-mat-slate/70 prose-li:text-mat-slate/70 max-w-none text-mat-wine relative z-10">
            {doc.content}
          </div>
          
          {/* Footer Metadata */}
          <div className="mt-16 pt-8 border-t border-mat-rose/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
             <div className="flex items-center gap-4">
                <RefreshCcw size={16} className="text-mat-gold" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-mat-wine/60">Registry state is persistent.</p>
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-slate/40">Matriarch © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
