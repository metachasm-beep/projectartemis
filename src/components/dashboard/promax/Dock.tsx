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
      className="aspect-square rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-indigo-400 hover:bg-white/10 transition-colors cursor-pointer relative group"
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none font-bold">
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
      className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl"
    >
      <DockIcon icon={Settings} label="Settings" mouseX={mouseX} />
      
      <div className="w-px h-8 bg-white/10 mx-2" />
      
      <DockIcon icon={HelpCircle} label="Support" mouseX={mouseX} onClick={onShowFAQ} />
      {onShowVerification && (
        <DockIcon icon={ShieldCheck} label="Verification" mouseX={mouseX} onClick={onShowVerification} />
      )}
    </motion.nav>
  );
};

