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
  ShieldCheck
} from 'lucide-react';

interface DockIconProps {
  icon: React.ElementType;
  label: string;
  mouseX: any;
  onClick?: () => void;
}

/**
 * 🫧 DockIcon: Reactive Floating Utility
 */
const DockIcon: React.FC<DockIconProps> = ({ icon: Icon, label, mouseX, onClick }) => {
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
      className="aspect-square mat-glass-prismatic flex items-center justify-center text-mat-black/40 hover:text-mat-accent-blue hover:bg-white/40 hover:border-mat-accent-blue/30 transition-all cursor-pointer relative group rounded-3xl"
    >
      <Icon size={20} strokeWidth={1.5} />
      
      {/* 🎭 Refractive Tooltip */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/40 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-2xl shadow-xl">
         <span className="mat-text-editorial italic text-xs text-mat-black leading-none mb-0.5 whitespace-nowrap">{label.split('.')[0]}</span>
         <span className="mat-text-label-pro text-[7px] text-mat-accent-blue whitespace-nowrap">{label.split('.')[1]}</span>
      </div>
    </motion.div>
  );
};

interface DockProps {
  onShowFAQ?: () => void;
  onShowVerification?: () => void;
}

/**
 * 🚀 Dock: High-Fidelity Refractive Navigation
 */
export const Dock: React.FC<DockProps> = ({ 
  onShowFAQ, 
  onShowVerification 
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.nav 
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-2xl"
    >
      <DockIcon icon={Settings} label="System.Settings" mouseX={mouseX} />
      
      <div className="w-[1px] h-8 bg-mat-black/5 mx-1" />
      
      <DockIcon icon={HelpCircle} label="Technical.Queries" mouseX={mouseX} onClick={onShowFAQ} />
      {onShowVerification && (
        <DockIcon icon={ShieldCheck} label="Identity.Seal" mouseX={mouseX} onClick={onShowVerification} />
      )}
      
      <div className="w-[1px] h-8 bg-mat-black/5 mx-1" />
      
      <DockIcon icon={LogOut} label="Session.Egress" mouseX={mouseX} onClick={() => window.location.href = '/signin'} />
    </motion.nav>
  );
};

