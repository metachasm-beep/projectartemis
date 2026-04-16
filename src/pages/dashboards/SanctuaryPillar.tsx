import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshReflectorMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Pillar = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Base */}
      <mesh position={[0, -4, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.5, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* Column */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 8, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Decorative Rings */}
      {[ -2, 0, 2 ].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
           <torusGeometry args={[1.6, 0.05, 16, 100]} />
           <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* Top Capital */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[2.2, 1.5, 0.5, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>

      {/* Internal Glow */}
      <pointLight position={[0, 2, 0]} color="#ffffff" intensity={2} distance={10} />
      <pointLight position={[0, -2, 0]} color="#ffffff" intensity={2} distance={10} />
    </group>
  );
};

export const SanctuaryPillar: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
      <Canvas alpha dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Pillar />
        </Float>
        
        {/* Floor Reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={0.5}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default SanctuaryPillar;
