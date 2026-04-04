import React from 'react';
import { motion } from 'framer-motion';
import { Home, User, MessageCircle, LogOut } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

interface MatriarchToolbarProps {
  activeTab: 'discovery' | 'profile' | 'messages';
  setActiveTab: (tab: 'discovery' | 'profile' | 'messages') => void;
  onLogout: () => void;
}

export const MatriarchToolbar: React.FC<MatriarchToolbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout 
}) => {
  const navItems = [
    { id: 'discovery', label: 'My Home', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ] as const;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl px-6 py-4 rounded-[2rem] bg-mat-wine shadow-mat-premium border border-mat-rose/20 flex items-center justify-between">
      {/* Navigation Group */}
      <div className="flex items-center gap-2 md:gap-6">
        {navItems.map((item) => (
          <Tooltip key={item.id} content={item.label}>
            <button
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-mat-cream text-mat-wine shadow-mat-rose' 
                : 'text-mat-cream/40 hover:text-mat-cream hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block ${activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Symmetrical Divider/Aesthetic Gap */}
      <div className="hidden lg:block w-px h-8 bg-mat-cream/10" />

      {/* Action Group */}
      <Tooltip content="Dissolve Session">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-mat-rose text-mat-cream transition-all hover:bg-mat-rose-deep shadow-mat-rose group"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">LOGOUT</span>
        </button>
      </Tooltip>
    </div>
  );
};
