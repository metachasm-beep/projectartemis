import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const HeartShape: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  const { mouse } = useThree();
  
  // Smooth mouse movement (lerping)
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (meshRef.current && outerGlowRef.current) {
      const t = state.clock.getElapsedTime();
      
      // 💓 Biologically-accurate "Lub-Dub" Heartbeat Formula
      // Two quick pulses followed by a pause
      const bpm = 60;
      const bps = bpm / 60;
      const cycleTime = t * bps * Math.PI * 2;
      
      // The "Lub" (first beat) and "Dub" (second beat)
      const lub = Math.pow(Math.sin(cycleTime), 10) * 0.15;
      const dub = Math.pow(Math.sin(cycleTime - 0.5), 10) * 0.1;
      const heartbeat = lub + dub;
      
      const baseScale = 1.2;
      const currentScale = baseScale + heartbeat;
      
      meshRef.current.scale.set(currentScale, currentScale, currentScale);
      outerGlowRef.current.scale.set(currentScale * 1.05, currentScale * 1.05, currentScale * 1.05);

      // ✨ Dynamic Glow Intensity sync with heartbeat
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = 1.0 + heartbeat * 8;
      }

      // 🖱️ Mouse Reactive Tilt (Lerped)
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouse.x * 0.4, delta * 4);
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, -mouse.y * 0.4, delta * 4);
      
      meshRef.current.rotation.y = targetRotation.current.y + t * 0.1; // Add subtle constant spin
      meshRef.current.rotation.x = targetRotation.current.x;
    }
  });

  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.4}
    >
      <mesh ref={meshRef}>
        <Sphere args={[1, 128, 128]}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#050505"
            emissive="#E11D48"
            emissiveIntensity={1.2}
            distort={0.35}
            speed={2}
            roughness={0.05}
            metalness={0.9}
          />
        </Sphere>
        
        {/* Outer Aura Glow */}
        <mesh ref={outerGlowRef}>
          <Sphere args={[1, 32, 32]}>
            <meshBasicMaterial 
              color="#E11D48" 
              transparent 
              opacity={0.08} 
              wireframe
            />
          </Sphere>
        </mesh>
      </mesh>
    </Float>
  );
};

const HeartPulse: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#E11D48" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FB7185" />
        
        <HeartShape />
        
        <fog attach="fog" args={['#030303', 4, 12]} />
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
