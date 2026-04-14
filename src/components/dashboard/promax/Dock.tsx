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

const DockIcon: React.FC<DockIconProps> = ({ icon: Icon, label, mouseX, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 64, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className="aspect-square rounded-full bg-white/80 border border-white flex items-center justify-center text-mat-slate/40 hover:text-mat-gold hover:bg-white transition-colors cursor-pointer relative group shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)]"
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-mat-ivory/90 backdrop-blur-md border border-mat-gold/20 rounded-lg text-[10px] text-mat-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none font-bold shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

interface DockProps {
  onShowFAQ?: () => void;
  onShowVerification?: () => void;
}

export const Dock: React.FC<DockProps> = ({ 
  onShowFAQ, 
  onShowVerification 
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.nav 
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-white/60 backdrop-blur-3xl border border-white shadow-[0_30px_60px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]"
    >
      <DockIcon icon={Settings} label="Settings" mouseX={mouseX} />
      
      <div className="w-px h-8 bg-mat-gold/10 mx-2" />
      
      <DockIcon icon={HelpCircle} label="Support" mouseX={mouseX} onClick={onShowFAQ} />
      {onShowVerification && (
        <DockIcon icon={ShieldCheck} label="Verification" mouseX={mouseX} onClick={onShowVerification} />
      )}
    </motion.nav>
  );
};

