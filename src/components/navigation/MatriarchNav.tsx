import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  ShieldAlert,
  Compass
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface MatriarchNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  role?: 'woman' | 'man' | 'admin';
}

export const MatriarchNav: React.FC<MatriarchNavProps> = ({ 
  activeTab, 
  setActiveTab,
  role 
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'discovery', label: 'Discovery', icon: Compass },
    { id: 'profile', label: 'You', icon: User },
  ];

  if (role === 'admin') {
    tabs.splice(2, 0, { id: 'admin', label: 'Command', icon: ShieldAlert });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] pb-safe">
      <div className="mx-auto max-w-md px-6 pb-8">
        <div className="flex items-center justify-around p-2 bg-[#0F0F10]/80 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[2.5rem]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center py-3 px-6 transition-all group"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-black scale-110" : "text-white/40 group-hover:text-white/60"
                    )} 
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span className={cn(
                    "mat-text-label-pro !tracking-[0.2em] !text-[7px]",
                    isActive ? "!text-black" : "!text-white/20"
                  )}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
