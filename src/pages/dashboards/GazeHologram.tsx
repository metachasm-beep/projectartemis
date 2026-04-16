import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Html, 
  OrbitControls, 
  PerspectiveCamera, 
  Grid,
  Text,
  MeshWobbleMaterial,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, Trash2, BadgeCheck, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  profile: any;
  position: [number, number, number];
  rotation: [number, number, number];
  onVerify: (id: string, current: boolean) => void;
  onMessage: (p: {id: string, name: string}) => void;
  onDelete: (id: string) => void;
  onPaymentApprove?: (id: string) => void;
  onPaymentReject?: (id: string) => void;
}

const ProfileCard3D: React.FC<ProfileCardProps> = ({ 
  profile, 
  position, 
  rotation,
  onVerify,
  onMessage,
  onDelete,
  onPaymentApprove,
  onPaymentReject
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[3.2, 4.5]} />
          <MeshDistortMaterial 
            color={hovered ? "#f1f5f9" : "#ffffff"} 
            speed={2} 
            distort={0.15} 
            radius={1} 
            transparent 
            opacity={0.9}
          />
          
          <lineSegments>
             <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 4.5)]} />
             <lineBasicMaterial color={hovered ? "#cbd5e1" : "#e2e8f0"} opacity={0.3} transparent />
          </lineSegments>

          <Html
            transform
            distanceFactor={4}
            position={[0, 0, 0.05]}
            className="pointer-events-none select-none"
          >
            <div className={`w-[320px] h-[450px] p-6 flex flex-col justify-between transition-all duration-500 scale-[0.25] ${hovered ? 'bg-mat-rose/[0.02]' : ''}`}>
               <div className="space-y-6">
                  <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-mat-cream/10 border border-mat-rose/20">
                     <img 
                       src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name || profile.user_id}`} 
                       className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                     />
                     {profile.is_verified && (
                        <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                           <BadgeCheck size={20} fill="white" stroke="blue" />
                        </div>
                     )}
                  </div>

                  <div className="space-y-1">
                     <h3 className="text-3xl font-bold text-slate-900 italic tracking-tighter">
                        {profile.full_name.split(' ')[0]} <br/>
                        <span className="text-slate-400 opacity-80 uppercase text-[9px] tracking-[0.4em] font-bold">{profile.role}</span>
                     </h3>
                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        <Globe size={10} strokeWidth={2} /> {profile.city || 'UNDEFINED'}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-mat-gold uppercase tracking-widest">Aura Balance</span>
                        <span className="text-lg font-mono font-black text-white">{(profile.tokens || 0).toLocaleString()}</span>
                     </div>
                     <div className={`w-3 h-3 rounded-full ${profile.payment_status === 'APPROVED' ? 'bg-green-500' : 'bg-mat-rose'} shadow-[0_0_10px_currentColor]`} />
                  </div>

                  <div className="flex gap-2 pointer-events-auto">
                     <button 
                       onClick={(e) => { e.stopPropagation(); onMessage({id: profile.user_id, name: profile.full_name}); }}
                       className="flex-1 h-12 bg-white text-mat-obsidian rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-mat-gold transition-colors"
                     >
                        <MessageSquare size={14} /> Gaze
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); onVerify(profile.user_id, !!profile.is_verified); }}
                       className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${profile.is_verified ? 'border-blue-500/40 bg-blue-500/10 text-blue-500' : 'border-white/10 bg-white/5 text-white/40'}`}
                     >
                        <Shield size={16} />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); onDelete(profile.user_id); }}
                       className="w-12 h-12 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 flex items-center justify-center"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  
                  {profile.payment_status === 'PENDING' && (
                     <div className="flex gap-2 pt-2 pointer-events-auto">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onPaymentApprove?.(profile.user_id); }}
                          className="flex-1 py-2 bg-green-500/20 text-green-500 border border-green-500/40 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                        >Approve Tithe</button>
                     </div>
                  )}
               </div>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
};

interface GazeHologramProps {
  profiles: any[];
  onVerify: (id: string, current: boolean) => void;
  onMessage: (p: {id: string, name: string}) => void;
  onDelete: (id: string) => void;
  onPaymentApprove?: (id: string) => void;
  onPaymentReject?: (id: string) => void;
}

const Scene: React.FC<GazeHologramProps> = ({ profiles, ...handlers }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow, ambient rotation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  const radius = useMemo(() => Math.max(8, profiles.length * 0.8), [profiles.length]);

  return (
    <group ref={groupRef}>
      {profiles.map((p, i) => {
        const angle = (i / profiles.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <ProfileCard3D 
            key={p.user_id} 
            profile={p} 
            position={[x, 0, z]} 
            rotation={[0, -angle + Math.PI / 2, 0]}
            {...handlers}
          />
        );
      })}
    </group>
  );
};

const GazeHologram: React.FC<GazeHologramProps> = ({ profiles, ...handlers }) => {
  return (
    <div className="w-full h-[70vh] relative mt-8 rounded-[3rem] overflow-hidden mat-glass-deep border border-mat-rose/10 bg-mat-obsidian">
      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 p-12 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div className="space-y-1">
               <span className="text-[10px] font-black text-mat-gold tracking-[0.5em] uppercase">Tactical HUD // Archive 0.1</span>
               <div className="h-px w-32 bg-mat-gold/20" />
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-mat-wine/40 tracking-[0.3em] uppercase">Active Neural Links: {profiles.length}</span>
            </div>
         </div>
         
         <div className="flex justify-center text-center">
             <p className="text-[8px] font-bold text-mat-slate/40 uppercase tracking-[0.8em] animate-pulse">Drag to Navigate the Matrix // Click Node to Focus</p>
         </div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={25}
          autoRotate={false}
          rotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#BFA06A" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D41243" />

        <Grid
          infiniteGrid
          fadeDistance={30}
          fadeStrength={5}
          cellSize={1}
          sectionSize={5}
          sectionColor="#BFA06A"
          sectionThickness={1.5}
          cellColor="#D41243"
          cellThickness={0.5}
          position={[0, -5, 0]}
        />

        <Scene profiles={profiles} {...handlers} />
        
        {/* Background Particles/Noise */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default GazeHologram;
