import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const MeshCore = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const count = 100;
  const [positions, lineIndices] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const indices = [];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Create random connections
      if (i > 0 && Math.random() > 0.8) {
        indices.push(i, Math.floor(Math.random() * i));
      }
    }
    return [pos, new Uint16Array(indices)];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
      linesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#A855F7"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry>
           <bufferAttribute 
             attach="attributes-position"
             count={count}
             array={positions}
             itemSize={3}
           />
           <bufferAttribute 
             attach="index"
             count={lineIndices.length}
             array={lineIndices}
             itemSize={1}
           />
        </bufferGeometry>
        <lineBasicMaterial color="#06B6D4" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Pulsing Light */}
      <pointLight position={[0, 0, 0]} color="#A855F7" intensity={1} distance={20} />
    </group>
  );
};

export const SecurityMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas dpr={[1, 1.5]} powerPreference="high-performance">
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
        <MeshCore />
      </Canvas>
    </div>
  );
};

export default SecurityMesh;
