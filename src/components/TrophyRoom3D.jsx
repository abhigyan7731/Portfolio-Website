import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

const trophies = [
  {
    id: "cgpa",
    title: "Academic Excellence",
    value: "8.88 CGPA",
    subtitle: "B.Tech CSE - SRM IST",
    color: "#4facfe"
  },
  {
    id: "ml",
    title: "AI Perfection",
    value: "98% Accuracy",
    subtitle: "Predictive CKD Classifier",
    color: "#43e97b"
  },
  {
    id: "projects",
    title: "Architect",
    value: "10+ Projects",
    subtitle: "Full Stack & Deep Learning",
    color: "#c2a4ff"
  }
];

const TrophyPedestal = ({ data, position, rotationY }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base Pedestal */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.5, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing ring */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.05, 32]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
      
      {/* Laser beam */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 16]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.3} />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshPhysicalMaterial 
            color="#0a0a0a" 
            metalness={0.9} 
            roughness={0.1} 
            transmission={0.8} 
            thickness={0.5} 
            ior={1.5} 
          />
        </mesh>
        
        {/* Hologram CSS Data */}
        <Html transform distanceFactor={1.5} position={[0, 0.5, 0.06]}>
          <div style={{
            width: "250px", 
            height: "350px", 
            border: `2px solid ${data.color}`, 
            boxShadow: `0 0 20px ${data.color}40 inset`,
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
            color: "white",
            fontFamily: "monospace",
            boxSizing: "border-box"
          }}>
            <div style={{ fontSize: "12px", color: "#aaa", letterSpacing: "2px", marginBottom: "auto" }}>[ RECORD FOUND ]</div>
            <h2 style={{ fontSize: "28px", fontWeight: "900", color: data.color, margin: "10px 0", textShadow: `0 0 15px ${data.color}` }}>
              {data.value}
            </h2>
            <h3 style={{ fontSize: "16px", letterSpacing: "1px", margin: "5px 0" }}>{data.title}</h3>
            <p style={{ fontSize: "12px", color: "#ccc", marginTop: "auto" }}>{data.subtitle}</p>
          </div>
        </Html>
      </Float>
    </group>
  );
};

const TrophyRoom3D = () => {
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
    <div className="tr-section" ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#020202", overflow: "hidden" }}>
      {/* Title overlay */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <h2 style={{ fontSize: "3.5rem", fontWeight: 900, color: "white", margin: 0, textShadow: "0 0 30px rgba(79,172,254,0.5)" }}>ARCHIVE</h2>
        <p style={{ color: "#aaa", letterSpacing: "3px", textTransform: "uppercase", fontSize: "0.9rem" }}>Hall of Achievements</p>
      </div>

      <Canvas 
        camera={{ position: [0, 1, 9], fov: 45 }} 
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", alpha: false }}
        frameloop={isVisible ? "always" : "demand"}
      >
        <color attach="background" args={["#020202"]} />
        <fog attach="fog" args={["#020202", 5, 20]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#4facfe" />
        <Environment preset="city" />

        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0, 0]} 
          polar={[-0.1, 0.2]} 
          azimuth={[-0.5, 0.5]}
        >
          {/* Floor grid */}
          <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#050505" roughness={0.8} />
          </mesh>

          <TrophyPedestal data={trophies[0]} position={[-3.5, 0, -2]} rotationY={Math.PI / 6} />
          <TrophyPedestal data={trophies[1]} position={[0, 0, 0]} rotationY={0} />
          <TrophyPedestal data={trophies[2]} position={[3.5, 0, -2]} rotationY={-Math.PI / 6} />

          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={10} />
        </PresentationControls>
      </Canvas>
    </div>
  );
};

export default TrophyRoom3D;
