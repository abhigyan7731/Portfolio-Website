import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Shared scroll tracker outside of React render lifecycle
let cachedScrollY = 0;
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    cachedScrollY = window.scrollY;
  }, { passive: true });
}

/* 
  Endless Cyberpunk/Synthwave Terrain 
  Distorts a flat plane into mountains/valleys using Math, 
  and loops its Z position on scroll to create an infinite forward drive.
*/
const CyberTerrain = () => {
  const meshRef = useRef();
  const geomRef = useRef();

  // Create mountainous terrain once on load
  useEffect(() => {
    if (!geomRef.current) return;
    const positions = geomRef.current.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      // Generate synthetic valleys (center is flatter for the "road")
      const distanceToCenter = Math.abs(x);
      const heightBase = Math.sin(x / 6) * Math.cos(y / 6) * 5;
      // Exponentially increase height further from the center
      const heightMultiplier = Math.max(0, distanceToCenter - 10) * 0.4;
      
      positions[i + 2] = heightBase + heightMultiplier;
    }
    geomRef.current.attributes.position.needsUpdate = true;
    geomRef.current.computeVertexNormals();
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Base speed + huge speed boost from scroll position 
    // Modulo 20 allows it to seamlessly tile indefinitely (depends on geometry segments)
    const baseSpeed = state.clock.getElapsedTime() * 2;
    const scrollSpeed = cachedScrollY * 0.015;
    
    // Animate forward endlessly
    meshRef.current.position.z = ((baseSpeed + scrollSpeed) % 20) - 20;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, -40]}>
      {/* 100x100 units, divided into 50x50 squares */}
      <planeGeometry ref={geomRef} args={[200, 200, 80, 80]} />
      <meshStandardMaterial 
        color="#c2a4ff" 
        emissive="#1a0b2e"
        wireframe 
        transparent 
        opacity={0.4} 
      />
    </mesh>
  );
};

/* Massive glowing geometric monoliths floating in the deep distance */
const Obelisks = () => {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        child.rotation.y += delta * (idx % 2 === 0 ? 0.2 : -0.2);
        child.rotation.x += delta * 0.1;
      });
      // Gently parallax the monoliths based on scroll
      groupRef.current.position.y = cachedScrollY * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-25, 10, -80]}>
        <octahedronGeometry args={[8, 0]} />
        <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[25, 15, -90]}>
        <octahedronGeometry args={[12, 0]} />
        <meshBasicMaterial color="#4facfe" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 25, -100]}>
        <icosahedronGeometry args={[15, 0]} />
        <meshBasicMaterial color="#f093fb" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

/* Deep Space and Starfield */
const DeepSpaceParticles = () => {
  const group = useRef();

  useFrame((_, delta) => {
    if (group.current) {
      // Rotate the entire starfield slowly
      group.current.rotation.y -= delta * 0.05;
      group.current.rotation.x -= delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      <Stars radius={150} depth={100} count={3000} factor={6} saturation={0.5} fade speed={1.5} />
    </group>
  );
};

const GlobalBackground = () => {
  return (
    <div 
      className="global-3d-bg" 
      style={{ 
        position: "fixed", 
        top: 0, left: 0, 
        width: "100%", height: "100%", 
        zIndex: -1, 
        background: "linear-gradient(to bottom, #03010b 0%, #0a0414 50%, #050212 100%)",
        overflow: "hidden" 
      }}
    >
      <Canvas
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop="always" // Needs to constantly render for the endless driving effect
      >
        <PerspectiveCamera makeDefault position={[0, 2, 0]} fov={70} />
        
        <color attach="background" args={["#03010b"]} />
        <ambientLight intensity={0.5} />
        
        {/* Lights to reflect off the wireframe lines */}
        <directionalLight position={[0, 20, -50]} intensity={2} color="#f093fb" />
        <directionalLight position={[0, -20, 50]} intensity={1} color="#00f2fe" />

        {/* The vast grid landscape */}
        <CyberTerrain />
        
        {/* Floating sky anomalies */}
        <Obelisks />

        {/* Starfield */}
        <DeepSpaceParticles />

        {/* Heavy fog to make the terrain fade smoothly into black distance */}
        <fog attach="fog" args={["#03010b", 20, 80]} />
      </Canvas>
      
      {/* Cinematic Overlays to blend UI layers cleanly */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          background: "radial-gradient(circle at center, transparent 0%, rgba(3, 1, 11, 0.8) 100%)", 
          pointerEvents: "none" 
        }} 
      />
    </div>
  );
};

export default GlobalBackground;
