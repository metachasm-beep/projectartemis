import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, DragControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 💎 SovereignGem: The Interactive Core
 */
const SovereignGem = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1.0}
    >
      <dodecahedronGeometry args={[1.5, 0]} />
      <MeshDistortMaterial
        color={hovered ? "#CA8A04" : "#722f37"}
        speed={2}
        distort={0.4}
        radius={1}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

/**
 * ⚡ ThreeAnchor: High-Density Interactive Space
 */
export const ThreeAnchor: React.FC<{ quality?: 'high' | 'low' }> = ({ quality = 'high' }) => {
  if (quality === 'low') return null;

  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <DragControls>
            <SovereignGem />
          </DragControls>
        </Float>
      </Canvas>
    </div>
  );
};
