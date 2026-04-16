import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ConnectionPoints = ({ count = 40 }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
       p.push(new THREE.Vector3(
         (Math.random() - 0.5) * 10,
         (Math.random() - 0.5) * 10,
         (Math.random() - 0.5) * 10
       ));
    }
    return p;
  }, [count]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    // Create random connections between points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 4) {
          positions.push(points[i].x, points[i].y, points[i].z);
          positions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      ))}
      
      {/* Connections */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.15} />
      </lineSegments>

      {/* Glow Nodes */}
      {points.filter((_, i) => i % 5 === 0).map((p, i) => (
        <mesh key={`glow-${i}`} position={p}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
};

export const IdentityConstellation: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas alpha dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <ConnectionPoints count={60} />
        </Float>
      </Canvas>
    </div>
  );
};

export default IdentityConstellation;
