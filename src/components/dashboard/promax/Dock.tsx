import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  HelpCircle,
  ShieldCheck,
  Star,
  Activity,
  Compass,
  TrendingUp,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';

interface DockIconProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  mouseX: any;
  onClick?: () => void;
}

/**
 * 🫧 DockIcon: Reactive Floating Utility
 */
const DockIcon: React.FC<DockIconProps> = ({ icon: Icon, label, isActive, mouseX, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className={`aspect-square mat-glass-prismatic flex items-center justify-center transition-all cursor-pointer relative group rounded-3xl ${
        isActive 
          ? 'bg-mat-gold/20 text-mat-gold border border-mat-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
          : 'text-mat-bone/40 hover:text-mat-gold hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
      
      {/* 🎭 Refractive Tooltip */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/20 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-2xl shadow-xl z-50">
         <span className="mat-text-editorial italic text-xs text-mat-bone leading-none mb-0.5 whitespace-nowrap">{label.split('.')[0]}</span>
         <span className="mat-text-label-pro text-[7px] text-mat-gold whitespace-nowrap">{label.split('.')[1] || ''}</span>
      </div>
    </motion.div>
  );
};

interface FoldOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DockProps {
  folds?: FoldOption[];
  activeFold?: string;
  onSelectFold?: (id: string) => void;
  onShowFAQ?: () => void;
  onShowVerification?: () => void;
  handleLogout?: () => void;
  hideLogout?: boolean;
}

/**
 * 🚀 Dock: High-Fidelity Refractive Navigation (Fold Switcher)
 */
export const Dock: React.FC<DockProps> = ({ 
  folds = [],
  activeFold,
  onSelectFold,
  onShowFAQ, 
  onShowVerification,
  handleLogout,
  hideLogout = false
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.nav 
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-2xl"
    >
      {folds.map((fold) => (
        <DockIcon 
          key={fold.id} 
          icon={fold.icon} 
          label={fold.label} 
          isActive={activeFold === fold.id}
          mouseX={mouseX} 
          onClick={() => onSelectFold?.(fold.id)} 
        />
      ))}

      {folds.length > 0 && <div className="w-[1px] h-8 bg-white/10 mx-1" />}

      {onShowFAQ && (
        <DockIcon icon={HelpCircle} label="Technical.Queries" mouseX={mouseX} onClick={onShowFAQ} />
      )}
      {onShowVerification && (
        <DockIcon icon={ShieldCheck} label="Identity.Seal" mouseX={mouseX} onClick={onShowVerification} />
      )}
      
      {!hideLogout && (
        <>
          <div className="w-[1px] h-8 bg-white/10 mx-1" />
          <DockIcon icon={LogOut} label="Session.Egress" mouseX={mouseX} onClick={handleLogout || (() => window.location.href = '/signin')} />
        </>
      )}
    </motion.nav>
  );
};
