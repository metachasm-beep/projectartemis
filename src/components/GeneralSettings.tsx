import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Shield, 
  LogOut, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  User,
  Zap,
  Eye,
  Smartphone
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface GeneralSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onLogout: () => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  isOpen, 
  onClose, 
  profile,
  onLogout 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 backdrop-blur-3xl bg-white"
        >
          <div className="w-full h-full flex flex-col relative bg-white overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-12 right-12 w-16 h-16 bg-black text-white hover:bg-mat-rose-gold transition-all z-20 flex items-center justify-center"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-24 py-32">
              <div className="max-w-4xl mx-auto space-y-24">
                
                {/* Header */}
                <div className="space-y-8">
                  <span className="text-[12px] uppercase font-black tracking-[0.6em] opacity-20">Sanctuary Governance</span>
                  <h2 className="font-serif italic text-7xl md:text-9xl tracking-tighter leading-[0.85] text-black">
                    Protocol <br /><span className="opacity-30">Settings.</span>
                  </h2>
                </div>

                <div className="w-full h-px bg-black/10" />

                {/* Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                  
                  {/* Left Column: Intelligence & Security */}
                  <div className="space-y-16">
                    <section className="space-y-8">
                      <div className="flex items-center gap-4 text-black/40">
                        <Bell size={20} />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.4em]">Push Intelligence</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 border border-black/5 hover:border-black/20 transition-all rounded-2xl group">
                          <div className="space-y-1">
                            <p className="font-bold text-black group-hover:italic transition-all">Gaze Notifications</p>
                            <p className="text-[11px] text-black/40 uppercase tracking-widest font-medium">Alert when your story is viewed</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-black" />
                        </div>

                        <div className="flex items-center justify-between p-6 border border-black/5 hover:border-black/20 transition-all rounded-2xl group">
                          <div className="space-y-1">
                            <p className="font-bold text-black group-hover:italic transition-all">Resonance Signals</p>
                            <p className="text-[11px] text-black/40 uppercase tracking-widest font-medium">New matches & deep connections</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-black" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-8">
                      <div className="flex items-center gap-4 text-black/40">
                        <Shield size={20} />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.4em]">Biometric Shield</h3>
                      </div>
                      
                      <div className="p-8 bg-black/5 rounded-3xl space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                            <ShieldCheck size={24} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="font-black text-black text-sm uppercase tracking-tight">Status: {profile?.is_verified ? 'Sovereign Verified' : 'Awaiting Audit'}</p>
                            <p className="text-[10px] text-black/40 font-medium uppercase tracking-widest mt-0.5">Linked to Aadhaar Protocol</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full h-14 border-black/20 text-black hover:bg-black hover:text-white rounded-full font-black uppercase tracking-widest text-[10px]">
                          Initiate Identity Re-Scan
                        </Button>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Account & Data */}
                  <div className="space-y-16">
                    <section className="space-y-8">
                      <div className="flex items-center gap-4 text-black/40">
                        <User size={20} />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.4em]">Identity Index</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-6 border-b border-black/5">
                          <span className="text-[11px] font-black text-black/40 uppercase tracking-widest">Sanctuary UID</span>
                          <span className="font-mono text-sm text-black">{profile?.user_id?.substring(0, 8)}...</span>
                        </div>
                        <div className="flex items-center justify-between py-6 border-b border-black/5">
                          <span className="text-[11px] font-black text-black/40 uppercase tracking-widest">Designation</span>
                          <span className="font-bold text-black uppercase tracking-tight">{profile?.role || 'Aspirant'}</span>
                        </div>
                        <div className="flex items-center justify-between py-6 border-b border-black/5">
                          <span className="text-[11px] font-black text-black/40 uppercase tracking-widest">Aura Harvested</span>
                          <span className="font-bold text-black italic">Rank #{profile?.absolute_rank || '--'}</span>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-8">
                      <div className="flex items-center gap-4 text-black/40">
                        <LogOut size={20} />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.4em]">Danger Zone</h3>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <Button 
                          onClick={onLogout}
                          className="w-full h-16 bg-black text-white hover:bg-mat-rose transition-all rounded-full font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4"
                        >
                          <LogOut size={18} />
                          Sever Connection (Logout)
                        </Button>
                        <button className="w-full h-16 border border-red-500/20 text-red-500/40 hover:text-red-600 hover:border-red-500 hover:bg-red-50 transition-all rounded-full font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-4">
                          <Trash2 size={16} />
                          Narrative Purge (Delete Account)
                        </button>
                      </div>
                    </section>
                  </div>

                </div>

                {/* Footer Copy */}
                <div className="flex flex-col items-center justify-center space-y-4 pt-24 opacity-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black">Matriarch Governance Protocol v5.0.1</p>
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black italic">Matriarch is a trademark of METACHASM (OPC) PRIVATE LIMITED.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
