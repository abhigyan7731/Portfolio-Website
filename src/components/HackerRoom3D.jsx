import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, PresentationControls, Float } from "@react-three/drei";
import * as THREE from "three";

const HackerMonitor = ({ children }) => {
  const monitorRef = useRef();

  useFrame((state) => {
    if (monitorRef.current) {
      // Gentle floating effect for the "hacker" monitor
      monitorRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={monitorRef} position={[0, -0.5, 0]}>
      {/* 3D Monitor Body */}
      <mesh position={[0, 0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 4.2, 0.4]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.8} />
      </mesh>
      
      {/* Monitor Stand */}
      <mesh position={[0, -2.5, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 1.5, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, -3.2, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 2]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* The Screen Surface */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[6, 3.8]} />
        <meshBasicMaterial color="#000" />
      </mesh>

      {/* Map DOM Elements onto the 3D screen using CSS3D */}
      <Html 
        transform 
        wrapperClass="hacker-screen-html"
        distanceFactor={1.8}
        position={[0, 0, 0.02]}
        rotation-x={0}
      >
        <div style={{
          width: "900px",    
          height: "600px",
          overflow: "hidden",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "scale(1)"
        }}>
          <div style={{ width: "95%", height: "95%" }}>
            {children}
          </div>
        </div>
      </Html>
    </group>
  );
};

const AmbientRoom = () => {
  return (
    <group>
      {/* Dark room walls */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>
      
      {/* Desk surface */}
      <mesh position={[0, -3.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Cyberpunk Neon Tube Light */}
      <mesh position={[0, 4, -2]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 16]} />
        <meshBasicMaterial color="#00f2fe" />
      </mesh>
      <pointLight position={[0, 4, -2]} intensity={2} color="#00f2fe" distance={10} />
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#c2a4ff" distance={8} />
    </group>
  );
};

const HackerRoom3D = ({ children }) => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "300px" });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 5 }}>
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance", alpha: true }}
          shadows
          frameloop={isVisible ? "always" : "demand"}
        >
          <ambientLight intensity={0.1} />
          <Environment preset="city" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0, 0]} 
            polar={[-0.1, 0.2]} 
            azimuth={[-0.3, 0.3]}
          >
            <Float rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
              <HackerMonitor>
                {children}
              </HackerMonitor>
            </Float>
            <AmbientRoom />
          </PresentationControls>
        </Canvas>
    </div>
  );
};

export default HackerRoom3D;
