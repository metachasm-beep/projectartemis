import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ShieldAlert, Clock, User } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { Badge } from '@/components/ui/badge';

interface AdminUserChatsModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export const AdminUserChatsModal: React.FC<AdminUserChatsModalProps> = ({ userId, userName, onClose }) => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const data = await AdminService.getUserChats(userId);
        setChats(data || []);
        if (data && data.length > 0) {
          setSelectedChat(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch user chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [userId]);

  return createPortal(
    <div className="fixed inset-0 z-[100005] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl animate-in fade-in duration-700">
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white rounded-[4rem] max-w-6xl w-full border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row h-[90vh]"
      >
        {/* Left Sidebar: List of Chats */}
        <div className="w-full md:w-1/3 border-r border-black/[0.03] bg-[#f8fafc] flex flex-col h-1/3 md:h-full">
          <div className="p-8 border-b border-black/[0.03] flex justify-between items-center bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle size={18} className="text-slate-900" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Communications Audit</h3>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">{userName}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              title="Close Audit"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-black/[0.02] custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                Retrieving Dialogue Registry...
              </div>
            ) : chats.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full text-slate-400">
                <ShieldAlert size={36} className="mb-4 opacity-40" />
                <p className="text-xs font-bold uppercase tracking-widest italic">No Active Dialogues</p>
                <p className="text-[10px] text-slate-400 mt-1">This identity has not engaged in any Sanctuary communications.</p>
              </div>
            ) : (
              chats.map((c) => {
                const isSelected = selectedChat?.resonance_id === c.resonance_id;
                const partnerName = c.woman_id === userId ? c.man_name : c.woman_name;
                const partnerRole = c.woman_id === userId ? 'Aspirant (Man)' : 'Sovereign (Woman)';

                return (
                  <button
                    key={c.resonance_id}
                    onClick={() => setSelectedChat(c)}
                    className={`w-full p-6 text-left transition-all flex flex-col justify-between relative ${
                      isSelected ? 'bg-white shadow-sm border-l-4 border-slate-900' : 'hover:bg-black/[0.01]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-base italic tracking-tight">{partnerName || 'Unknown Identity'}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{partnerRole}</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border-slate-200">
                        {c.comm_mode}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium pt-2 border-t border-black/[0.02]">
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(c.updated_at).toLocaleDateString()}</span>
                      <span className="capitalize italic">{c.status}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section: Message History */}
        <div className="flex-1 flex flex-col h-2/3 md:h-full bg-white relative">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-8 border-b border-black/[0.03] flex justify-between items-center bg-white shadow-sm z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-black/[0.03]">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 italic tracking-tight">
                      {selectedChat.woman_id === userId ? selectedChat.man_name : selectedChat.woman_name || 'Sanctuary Dialogue'}
                    </h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Resonance ID: {selectedChat.resonance_id}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm"
                  title="Close Audit"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/50">
                {selectedChat.messages && selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((m: any) => {
                    const isTargetUser = m.sender_id === userId;
                    return (
                      <div 
                        key={m.id} 
                        className={`flex flex-col ${isTargetUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                            {m.sender_name || (isTargetUser ? userName : 'Partner')}
                          </span>
                          <span className="text-[8px] text-slate-400 font-medium">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div 
                          className={`max-w-md p-5 rounded-3xl text-xs md:text-sm leading-relaxed shadow-sm ${
                            isTargetUser 
                              ? 'bg-slate-900 text-white rounded-br-none' 
                              : 'bg-white text-slate-900 border border-black/[0.03] rounded-bl-none'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <MessageCircle size={36} className="mb-4 opacity-40" />
                    <p className="text-xs font-bold uppercase tracking-widest italic">No Messages Transmitted</p>
                    <p className="text-[10px] text-slate-400 mt-1">This resonance path is currently silent.</p>
                  </div>
                )}
              </div>

              {/* Chat Footer / Audit Tag */}
              <div className="p-6 border-t border-black/[0.03] bg-white flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                <span>Mode: {selectedChat.comm_mode}</span>
                <span>Matriarch Council Auditing View</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <MessageCircle size={48} className="mb-4 opacity-30 animate-bounce" />
              <p className="text-base font-bold uppercase tracking-widest italic text-slate-600">Select a Dialogue</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">Choose a resonance path from the left sidebar to audit the complete transmission history.</p>
              <button 
                onClick={onClose} 
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase shadow-xl hover:bg-slate-800 transition-all"
              >
                Close Audit
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
