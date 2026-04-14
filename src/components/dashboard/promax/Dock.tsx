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

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className="aspect-square bg-white/10 border border-white/20 flex items-center justify-center text-white/40 hover:text-[#D81E05] hover:bg-white hover:border-[#D81E05] transition-all cursor-pointer relative group"
    >
      <Icon size={22} strokeWidth={2} />
      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#0A0A0A] border border-white/20 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-[0.4em] pointer-events-none font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
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
      className="flex items-center gap-2 p-2 bg-[#0A0A0A] border-4 border-[#0A0A0A] shadow-none"
    >
      <DockIcon icon={Settings} label="System.Settings" mouseX={mouseX} />
      
      <div className="w-px h-10 bg-white/10 mx-2" />
      
      <DockIcon icon={HelpCircle} label="Technical.Support" mouseX={mouseX} onClick={onShowFAQ} />
      {onShowVerification && (
        <DockIcon icon={ShieldCheck} label="Identity.Verification" mouseX={mouseX} onClick={onShowVerification} />
      )}
    </motion.nav>
  );
};

