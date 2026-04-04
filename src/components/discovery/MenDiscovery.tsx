import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Heart, MapPin, BadgeCheck, Search, Filter } from 'lucide-react';
import { Button, Card, CardContent, Chip, Input } from "@heroui/react";
import Masonry from '@/components/ui/Masonry';
import type { MasonryItem } from '@/components/ui/Masonry';
import { DUMMY_ASPIRANTS } from '@/data/dummyProfiles';
import type { AspirantProfile } from '@/data/dummyProfiles';

interface MenDiscoveryProps {
  onClose: () => void;
}

const MenDiscovery: React.FC<MenDiscoveryProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map AspirantProfile to MasonryItem
  const masonryItems: MasonryItem[] = useMemo(() => {
    return DUMMY_ASPIRANTS.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.city.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(a => ({
      id: a.id,
      img: a.img,
      url: '#', // We handle clicks via the card actions
      height: a.height || 1500
    }));
  }, [searchQuery]);

  const renderProfileCard = (item: MasonryItem) => {
    const profile = DUMMY_ASPIRANTS.find(a => a.id === item.id) as AspirantProfile;
    if (!profile) return null;

    return (
      <Card 
        className="w-full h-full border-none bg-transparent group overflow-hidden" 
      >
        <CardContent className="p-0 relative">
          <img 
            src={profile.img} 
            alt={profile.name} 
            className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Status Badge Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <Chip 
              size="sm" 
              variant="soft" 
              className={`backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[8px] rounded-full
                ${profile.status === 'Imperial' ? 'bg-mat-gold/40' : 
                  profile.status === 'Vanguard' ? 'bg-mat-rose-deep/40' : 
                  'bg-black/40'}`}
            >
              <div className="flex items-center h-4">
                 {profile.status}
              </div>
            </Chip>
          </div>

          {/* Grace/Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-[2rem]" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h3 className="text-xl font-bold text-white italic">{profile.name}, {profile.age}</h3>
                   {profile.status === 'Imperial' && <BadgeCheck size={16} className="text-mat-gold" />}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] font-medium uppercase tracking-widest">
                   <MapPin size={10} />
                   {profile.city} • {profile.rank}
                </div>
             </div>

             <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <Button size="sm" className="bg-mat-rose text-white rounded-full font-black text-[9px] uppercase px-4 h-9 grow border-none">
                   <div className="flex items-center justify-center">Enter Pulse</div>
                </Button>
                <Button size="sm" isIconOnly className="bg-white/10 backdrop-blur-md text-white rounded-full w-9 h-9 border border-white/10 p-0 flex items-center justify-center">
                  <Heart size={14} />
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-mat-cream overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500">
      
      {/* Sovereign Header */}
      <header className="sticky top-0 left-0 w-full z-[110] px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-mat-cream/80 backdrop-blur-xl border-b border-mat-rose/5">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <Button 
            onPress={onClose} 
            variant="ghost" 
            isIconOnly
            className="rounded-full hover:bg-mat-rose/5 p-0 flex items-center justify-center border-mat-rose/10"
          >
            <ArrowLeft size={24} className="text-mat-wine" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-mat-wine italic tracking-tight">The Aspirant Directory</h2>
            <div className="flex items-center gap-2 mt-1">
               <ShieldCheck size={12} className="text-mat-rose" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-mat-slate/40">Sovereign Observer Protocol Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input 
            size="sm"
            placeholder="Search by name or essence..." 
            className="max-w-xs"
            startContent={<Search size={16} className="text-mat-rose/40" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            classNames={{
               inputWrapper: "bg-white/50 border-mat-rose/10 rounded-full h-12 shadow-inner"
            }}
          />
          <Button isIconOnly className="bg-mat-wine text-mat-cream rounded-full w-12 h-12 p-0 flex items-center justify-center border-none">
            <Filter size={18} />
          </Button>
        </div>
      </header>

      {/* The Infinite Masonry Stream */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pt-12 pb-32 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto px-8">
           <div className="flex items-center gap-3 mb-12 px-4">
              <Sparkles size={16} className="text-mat-gold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-wine/40">Curating Highest Strata</span>
           </div>
           
           <Masonry 
             items={masonryItems} 
             animateFrom="bottom" 
             stagger={0.08}
             renderItem={renderProfileCard}
             hoverScale={1.02}
           />

           {/* Infinite Scroll Load Trigger Simulation */}
           <div className="w-full py-24 flex flex-col items-center justify-center space-y-6">
              <div className="w-px h-16 bg-gradient-to-b from-mat-rose/20 to-transparent" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-wine/20">Awaiting further resonance</p>
           </div>
        </div>
      </main>

      {/* Mystical Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-mat-cream to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MenDiscovery;
