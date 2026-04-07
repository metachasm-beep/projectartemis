import React, { useState } from 'react';
import { ShieldAlert, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafetyModal from './SafetyModal';

interface SafetyActionsProps {
  userId: string;
  userName?: string;
  variant?: 'minimal' | 'full' | 'icon';
  onActionComplete?: (action: 'report' | 'block') => void;
  className?: string;
}

const SafetyActions: React.FC<SafetyActionsProps> = ({ 
  userId, 
  userName, 
  variant = 'full', 
  onActionComplete,
  className = "" 
}) => {
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const handleActionComplete = (action: 'report' | 'block') => {
    if (onActionComplete) onActionComplete(action);
  };

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {variant === 'full' && (
          <Button 
            onPress={() => setShowSafetyModal(true)}
            variant="ghost" 
            className="rounded-full bg-white/5 border border-white/10 hover:bg-mat-wine/10 text-white/40 hover:text-mat-rose transition-all h-10 px-6 gap-2"
          >
            <ShieldAlert size={14} />
            <span className="text-[9px] uppercase tracking-widest font-black">Safety Protocol</span>
          </Button>
        )}

        {variant === 'minimal' && (
          <button 
            onClick={() => setShowSafetyModal(true)}
            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-mat-slate/30 hover:text-mat-rose transition-colors"
          >
            <ShieldAlert size={12} />
            Report / Block
          </button>
        )}

        {variant === 'icon' && (
          <Button 
            isIconOnly 
            onPress={() => setShowSafetyModal(true)}
            variant="light"
            className="text-mat-slate/30 hover:text-mat-rose rounded-full"
          >
            <ShieldAlert size={20} />
          </Button>
        )}
      </div>

      <SafetyModal 
         isOpen={showSafetyModal}
         onClose={() => setShowSafetyModal(false)}
         targetUserId={userId}
         targetUserName={userName}
         onActionComplete={handleActionComplete}
      />
    </>
  );
};

export default SafetyActions;
