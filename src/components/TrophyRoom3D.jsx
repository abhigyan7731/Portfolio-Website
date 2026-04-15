import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, PresentationControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const stats = [
  {
    id: "cgpa",
    title: "CGPA",
    value: "8.88",
    suffix: "/10",
    fillLevel: 0.888, // 88.8%
    color: "#4facfe"
  },
  {
    id: "projects",
    title: "PROJECTS",
    value: "10",
    suffix: "+",
    fillLevel: 0.95, // Visual filling
    color: "#c2a4ff"
  },
  {
    id: "ml",
    title: "ML ACCURACY",
    value: "98",
    suffix: "%",
    fillLevel: 0.98, // 98%
    color: "#43e97b"
  }
];

const StatBar = ({ data, position, delay = 0 }) => {
  const fillRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  const barHeight = 4.5;
  const targetScaleY = data.fillLevel * barHeight;

  // Animate the fill growing when mounted
  useEffect(() => {
    if (!fillRef.current) return;
    
    // Start at 0 height
    fillRef.current.scale.y = 0;
    fillRef.current.position.y = 0;
    
    gsap.to(fillRef.current.scale, {
      y: targetScaleY,
      duration: 1.5,
      delay: delay + 0.5,
      ease: "power3.out"
    });
    
    gsap.to(fillRef.current.position, {
      y: targetScaleY / 2,
      duration: 1.5,
      delay: delay + 0.5,
      ease: "power3.out"
    });
  }, [targetScaleY, delay]);

  // Hover animations
  useFrame(() => {
    if (fillRef.current) {
      const pulse = hovered ? Math.sin(Date.now() * 0.005) * 0.1 : 0;
      fillRef.current.scale.x = THREE.MathUtils.lerp(fillRef.current.scale.x, 1 + pulse, 0.1);
      fillRef.current.scale.z = THREE.MathUtils.lerp(fillRef.current.scale.z, 1 + pulse, 0.1);
    }
  });

  return (
    <group 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* The glass outer shell (fixed height) */}
      <mesh position={[0, barHeight / 2, 0]} castShadow>
        <boxGeometry args={[1.2, barHeight, 1.2]} />
        <meshPhysicalMaterial 
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>

      {/* The glowing inner liquid/energy (animated height) */}
      <mesh position={[0, 0, 0]} ref={fillRef} castShadow>
        {/* We center the box geometry so that scaling Y from 0 scales it upwards, 
            Wait, if centered, scale.y scales in both directions. 
            We must translate the geometry's vertices so its origin is at the bottom! */}
        <boxGeometry args={[1.0, 1, 1.0]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color} 
          emissiveIntensity={hovered ? 2.5 : 1.5} 
          toneMapped={false}
        />
      </mesh>
      
      {/* 3D Floating Base Ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 32]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.5} />
      </mesh>

      {/* Holographic Text using standard CSS above the pillar */}
      <Html 
        position={[0, barHeight + 0.8, 0]} 
        center 
        transform 
        distanceFactor={2.5}
        zIndexRange={[100, 0]}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: `0 0 20px ${data.color}`,
          pointerEvents: "none",
          transition: "transform 0.3s ease",
          transform: hovered ? "scale(1.1) translateY(-10px)" : "scale(1)"
        }}>
          <h2 style={{ fontSize: "50px", fontWeight: "900", margin: 0, lineHeight: 1, letterSpacing: "2px" }}>
            {data.value}<span style={{ fontSize: "24px", color: data.color }}>{data.suffix}</span>
          </h2>
          <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "4px", color: "#ccc", marginTop: "10px" }}>
            {data.title}
          </div>
        </div>
      </Html>
    </group>
  );
};

// Fix the geometry origin for the fill bar so it scales from the bottom upwards
const fixGeometryOrigin = () => {
  // We do this inside the component physically by translating the geometry
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

  // Globally shift the box geometry origin so scale.y acts like a vertical growth bar
  useEffect(() => {
    // This is a global trick, but cleaner is to use <mesh position={[0, height/2, 0]}> 
    // inside the useFrame. Let's handle it natively in the component.
  }, []);

  return (
    <div className="tr-section" ref={containerRef} id="statistics" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", zIndex: 12 }}>
      
      {/* Title */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "900", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "4px" }}>STATISTICS</h2>
        <p style={{ color: "#777", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", marginTop: "10px" }}>Performance Metrics Matrix</p>
      </div>

      <Canvas 
        camera={{ position: [0, 4, 12], fov: 45 }} 
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", alpha: true, antialias: true }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}
        frameloop={isVisible ? "always" : "demand"}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={1} color="#c2a4ff" />
        <Environment preset="city" />

        <PresentationControls 
          global 
          config={{ mass: 1, tension: 500, friction: 30 }} 
          snap={{ mass: 1, tension: 500, friction: 30 }} 
          rotation={[0.1, 0, 0]} 
          polar={[-0.1, 0.2]} 
          azimuth={[-0.5, 0.5]} 
        >
          {/* Cyberpunk Grid Floor */}
          <Grid 
            position={[0, -2.5, 0]} 
            args={[30, 30]} 
            cellSize={1} 
            cellThickness={0.5} 
            cellColor="#4facfe" 
            sectionSize={3} 
            sectionThickness={1} 
            sectionColor="#c2a4ff" 
            fadeDistance={25} 
            fadeStrength={2} 
          />

          {/* Wrapper to align the bases to the floor */}
          <group position={[0, -2.5, 0]}>
            <StatBar data={stats[0]} position={[-3.5, 0, 0]} delay={0} />
            <StatBar data={stats[1]} position={[0, 0, 0]} delay={0.2} />
            <StatBar data={stats[2]} position={[3.5, 0, 0]} delay={0.4} />
          </group>
        </PresentationControls>
      </Canvas>
      
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 40%, rgba(2,2,2,0.9) 100%)", zIndex: 6, pointerEvents: "none" }} />
    </div>
  );
};

export default TrophyRoom3D;
