import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  BrainCircuit, 
  Lightbulb, 
  Briefcase, 
  Code, 
  PenTool, 
  LineChart,
  Scale,
  Stethoscope,
  Globe,
  Camera,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchetypeBadgeProps {
  occupation?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ArchetypeDefinition {
  label: string;
  icon: React.ElementType;
  description: string;
  keywords: string[];
}

const ARCHETYPE_DATABASE: ArchetypeDefinition[] = [
  {
    label: 'The Architect',
    icon: Building2,
    description: 'Designer of foundational structures.',
    keywords: ['architect', 'engineer', 'developer', 'builder', 'construction', 'creator']
  },
  {
    label: 'The Strategist',
    icon: BrainCircuit,
    description: 'Master of systemic resonance.',
    keywords: ['strategist', 'founder', 'ceo', 'director', 'manager', 'executive', 'consultant']
  },
  {
    label: 'The Artisan',
    icon: PenTool,
    description: 'Crafter of high-fidelity aesthetics.',
    keywords: ['designer', 'artist', 'creative', 'writer', 'creator']
  },
  {
    label: 'The Oracle',
    icon: LineChart,
    description: 'Forecaster of market truths.',
    keywords: ['analyst', 'finance', 'trader', 'investor', 'banker', 'economist']
  },
  {
    label: 'The Healer',
    icon: Stethoscope,
    description: 'Restorer of biological vitality.',
    keywords: ['doctor', 'surgeon', 'physician', 'therapist', 'medical', 'health']
  },
  {
    label: 'The Sentinel',
    icon: Scale,
    description: 'Enforcer of ethical sovereignty.',
    keywords: ['lawyer', 'attorney', 'legal', 'judge', 'partner']
  },
  {
    label: 'The Explorer',
    icon: Globe,
    description: 'Navigator of the unknown.',
    keywords: ['pilot', 'traveler', 'researcher', 'scientist']
  },
  {
    label: 'The Lens',
    icon: Camera,
    description: 'Capturer of ephemeral moments.',
    keywords: ['photographer', 'videographer', 'director', 'film']
  },
  {
    label: 'The Composer',
    icon: Music,
    description: 'Orchestrator of auditory harmony.',
    keywords: ['musician', 'producer', 'dj', 'audio']
  },
  {
    label: 'The Coder',
    icon: Code,
    description: 'Architect of the digital frontier.',
    keywords: ['engineer', 'developer', 'programmer', 'software', 'cto']
  },
  {
    label: 'The Aspirant',
    icon: Lightbulb,
    description: 'Seeker of higher sovereignty.',
    keywords: [] // Fallback
  }
];

export const ArchetypeBadge: React.FC<ArchetypeBadgeProps> = ({ 
  occupation, 
  className,
  size = 'md' 
}) => {
  const archetype = useMemo(() => {
    if (!occupation) return ARCHETYPE_DATABASE.find(a => a.label === 'The Aspirant')!;
    
    const occupationLower = occupation.toLowerCase();
    
    for (const def of ARCHETYPE_DATABASE) {
      if (def.keywords.some(kw => occupationLower.includes(kw))) {
        return def;
      }
    }
    
    return ARCHETYPE_DATABASE.find(a => a.label === 'The Aspirant')!;
  }, [occupation]);

  const Icon = archetype.icon;

  const sizeStyles = {
    sm: 'p-1.5 text-[8px] gap-1.5 rounded-lg',
    md: 'p-2 px-3 text-[10px] gap-2 rounded-xl',
    lg: 'p-3 px-4 text-xs gap-3 rounded-2xl'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div className="relative group inline-block">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center uppercase tracking-widest font-black transition-all duration-300",
          "border border-white/10 bg-white/5 backdrop-blur-md",
          "hover:border-mat-gold/30 hover:bg-mat-gold/10 hover:shadow-mat-premium",
          "text-white/60 hover:text-mat-gold",
          sizeStyles[size],
          className
        )}
      >
        <Icon size={iconSizes[size]} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
        <span className="truncate max-w-[120px] sm:max-w-none">{archetype.label}</span>
      </motion.div>

      {/* Tooltip Hover Area */}
      <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-50 flex items-center">
         <div className="bg-black/90 p-4 rounded-2xl border border-mat-gold/20 shadow-2xl min-w-[200px] backdrop-blur-xl">
             <div className="flex items-center gap-2 mb-2">
                 <Icon size={14} className="text-mat-gold" />
                 <span className="text-xs font-black uppercase tracking-widest text-mat-gold">{archetype.label}</span>
             </div>
             <p className="text-[10px] text-white/50 leading-relaxed italic">
                {archetype.description}
             </p>
         </div>
      </div>
    </div>
  );
};
