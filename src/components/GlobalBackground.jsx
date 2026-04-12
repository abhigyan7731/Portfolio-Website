import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from 'three';

const FloatingObjects = () => {
  const group = useRef();
  
  useFrame(() => {
    // Continuous inner rotation
    group.current.rotation.y += 0.0015;
    group.current.rotation.x += 0.0008;
    
    // Tie to scroll position for extra parallax
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    group.current.position.y = scrollY * 0.002; 
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <mesh position={[8, 3, -15]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#00f2fe" wireframe opacity={0.3} transparent />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={3} floatIntensity={2}>
        <mesh position={[-7, -4, -18]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial color="#8a2be2" wireframe opacity={0.3} transparent />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[5, -8, -12]}>
          <torusGeometry args={[1.5, 0.4, 16, 100]} />
          <meshStandardMaterial color="#ff007f" wireframe opacity={0.2} transparent />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={3}>
        <mesh position={[-5, 7, -20]}>
          <dodecahedronGeometry args={[2.2, 0]} />
          <meshStandardMaterial color="#00ff88" wireframe opacity={0.25} transparent />
        </mesh>
      </Float>
    </group>
  );
};

const CustomParticles = () => {
  const group = useRef();
  
  useFrame((state, delta) => {
    group.current.rotation.x -= delta / 30;
    group.current.rotation.y -= delta / 40;
    
    // Particle parallax based on scroll
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    group.current.position.y = scrollY * 0.005; 
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
    </group>
  );
};

const GlobalBackground = () => {
  return (
    <div className="global-3d-bg">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <FloatingObjects />
        <CustomParticles />
      </Canvas>
      <div className="global-3d-overlay" />
    </div>
  );
};

export default GlobalBackground;
