import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshGradientMaterial } from '@react-three/drei';
import * as THREE from 'three';

const HeartShape: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom shader uniforms for that "Luxury" feel
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#E11D48') }, // Matriarch Rose
    uGlowColor: { value: new THREE.Color('#FB7185') },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      
      // Update uniforms if we were using a custom shader material
      // uniforms.uTime.value = t;
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={0.5}
    >
      <mesh ref={meshRef}>
        {/* We use a distorted sphere to create an organic, morphing "heart-like" core */}
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#000000"
            emissive="#E11D48"
            emissiveIntensity={1.5}
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Outer Glow / Aura */}
        <Sphere args={[1.3, 32, 32]}>
          <meshBasicMaterial 
            color="#E11D48" 
            transparent 
            opacity={0.1} 
            wireframe
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

const HeartPulse: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#E11D48" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FB7185" />
        
        <HeartShape />
        
        {/* Post-processing-like glow using standard Three.js fog and lights */}
        <fog attach="fog" args={['#030303', 5, 15]} />
      </Canvas>
      
      {/* Handshake: Notify system that the local 3D app is ready */}
      <script dangerouslySetInnerHTML={{ __html: `
        setTimeout(() => {
          window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
        }, 500);
      `}} />
    </div>
  );
};

export default HeartPulse;
