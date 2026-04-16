import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

const OrbCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <MeshDistortMaterial
          color="#ffffff"
          speed={1.5}
          distort={0.3}
          radius={1}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
};

export const LiquidOrb: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <OrbCore />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 pointer-events-none" />
    </div>
  );
};

export default LiquidOrb;
