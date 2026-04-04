import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShieldCheck, Search, Filter } from 'lucide-react';
import { Button, Input } from "@heroui/react";
import CircularGallery from '@/components/animations/CircularGallery';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';

interface MenDiscoveryProps {
  onClose: () => void;
}

const MenDiscovery: React.FC<MenDiscoveryProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map AspirantProfile to CircularGallery Items
  const galleryItems = useMemo(() => {
    return DUMMY_ASPIRANTS.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.city.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(a => ({
      image: a.img,
      text: `${a.name}, ${a.age} | ${a.city}`
    }));
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 z-[100] bg-mat-obsidian overflow-hidden flex flex-col animate-in fade-in duration-700">
      
      {/* Sovereign Header - Dark Themed for 3D Experience */}
      <header className="absolute top-0 left-0 w-full z-[110] px-8 py-10 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-mat-obsidian to-transparent pointer-events-none">
        <div className="flex items-center gap-6 mb-4 md:mb-0 pointer-events-auto">
          <Button 
            onPress={onClose} 
            variant="ghost" 
            isIconOnly
            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 p-0 flex items-center justify-center h-14 w-14"
          >
            <ArrowLeft size={24} className="text-white" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">The Aspirant Directory</h2>
            <div className="flex items-center gap-2 mt-1">
               <ShieldCheck size={12} className="text-mat-gold" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Sovereign Discovery Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto pointer-events-auto">
          <Input 
            size="sm"
            placeholder="Search by name or city..." 
            className="max-w-xs"
            startContent={<Search size={16} className="text-white/40" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            classNames={{
               inputWrapper: "bg-white/10 border-white/10 rounded-full h-14 shadow-inner text-white group-data-[focus=true]:bg-white/20"
            }}
          />
          <Button isIconOnly className="bg-mat-wine text-mat-cream rounded-full w-14 h-14 p-0 flex items-center justify-center border-none shadow-xl">
            <Filter size={18} />
          </Button>
        </div>
      </header>

      {/* The 3D Infinite Stream (WebGL Gallery) */}
      <main className="flex-1 w-full h-full relative">
        <CircularGallery 
          items={galleryItems}
          bend={0}
          borderRadius={0.09}
          scrollSpeed={2.9}
          scrollEase={0.11}
        />
        
        {/* Interaction Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[110] pointer-events-none">
           <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30 animate-pulse">Drag to Navigate</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
           </div>
        </div>
      </main>

      {/* Subtle Mystical Overlays */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-mat-obsidian to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-mat-obsidian to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MenDiscovery;
