import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// Use a single shared scroll value updated outside of useFrame
let cachedScrollY = 0;
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    cachedScrollY = window.scrollY;
  }, { passive: true });
}

const FloatingObjects = () => {
  const group = useRef();

  // Pre-create geometries via useMemo
  useFrame((_, delta) => {
    const g = group.current;
    g.rotation.y += 0.0008 * delta * 60;
    g.rotation.x += 0.0004 * delta * 60;
    g.position.y = cachedScrollY * 0.002;
  });

  return (
    <group ref={group}>
      <mesh position={[8, 3, -15]}>
        <octahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#00f2fe" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[-7, -4, -18]}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color="#8a2be2" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[5, -8, -12]}>
        <torusGeometry args={[1.5, 0.4, 8, 32]} />
        <meshBasicMaterial color="#ff007f" wireframe opacity={0.1} transparent />
      </mesh>
      <mesh position={[-5, 7, -20]}>
        <dodecahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial color="#00ff88" wireframe opacity={0.12} transparent />
      </mesh>
    </group>
  );
};

const CustomParticles = () => {
  const group = useRef();

  useFrame((_, delta) => {
    group.current.rotation.x -= delta / 50;
    group.current.rotation.y -= delta / 60;
    group.current.position.y = cachedScrollY * 0.003;
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={0.8} />
    </group>
  );
};

const GlobalBackground = () => {
  return (
    <div className="global-3d-bg">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={0.3} />
        <FloatingObjects />
        <CustomParticles />
      </Canvas>
      <div className="global-3d-overlay" />
    </div>
  );
};

export default GlobalBackground;
