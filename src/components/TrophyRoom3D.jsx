import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, PresentationControls, Grid } from "@react-three/drei";
import * as THREE from "three";

const stats = [
  {
    id: "cgpa",
    title: "CGPA",
    value: "8.88",
    suffix: "/10",
    color: "#4facfe"
  },
  {
    id: "projects",
    title: "PROJECTS",
    value: "4",
    suffix: "+",
    color: "#c2a4ff"
  },
  {
    id: "ml",
    title: "ML ACCURACY",
    value: "98",
    suffix: "%",
    color: "#43e97b"
  }
];

const StatNode = ({ data, position, delay = 0 }) => {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const innerCoreRef = useRef();
  const baseRingRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Entrance animation logic
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScale(1);
    }, delay * 1000 + 500); // Wait for intersection + delay
    return () => clearTimeout(timer);
  }, [delay]);

  // Use useFrame to animate the rotation and hover dynamics
  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    
    // Smoothly scale up on init
    if (outerRingRef.current && outerRingRef.current.scale.x < scale) {
      const newScale = THREE.MathUtils.lerp(outerRingRef.current.scale.x, scale, 0.1);
      outerRingRef.current.scale.set(newScale, newScale, newScale);
      innerRingRef.current.scale.set(newScale, newScale, newScale);
      innerCoreRef.current.scale.set(newScale, newScale, newScale);
    }

    // Outer gyro ring
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.5;
      outerRingRef.current.rotation.y += delta * 0.8;
      outerRingRef.current.rotation.z += delta * 0.2;
    }
    
    // Inner gyro ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * 0.4;
      innerRingRef.current.rotation.y -= delta * 0.7;
    }

    // Core Crystal hover mechanics
    if (innerCoreRef.current) {
      // Very fast spin if hovered
      innerCoreRef.current.rotation.y -= delta * (hovered ? 3 : 0.8);
      innerCoreRef.current.rotation.x += delta * (hovered ? 2 : 0.4);
      
      // Floating bounce effect
      innerCoreRef.current.position.y = Math.sin(elapsed * 2.5 + delay) * 0.3;

      // Pulse size if hovered
      const targetScale = hovered ? 1.4 : 1.0;
      innerCoreRef.current.scale.x = THREE.MathUtils.lerp(innerCoreRef.current.scale.x, scale * targetScale, 0.05);
      innerCoreRef.current.scale.y = THREE.MathUtils.lerp(innerCoreRef.current.scale.y, scale * targetScale, 0.05);
      innerCoreRef.current.scale.z = THREE.MathUtils.lerp(innerCoreRef.current.scale.z, scale * targetScale, 0.05);
    }

    // Base ring pulse
    if (baseRingRef.current) {
      baseRingRef.current.scale.x = 1 + (hovered ? Math.sin(elapsed * 8) * 0.1 : 0);
      baseRingRef.current.scale.y = 1 + (hovered ? Math.sin(elapsed * 8) * 0.1 : 0);
    }
  });

  return (
    <group 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Holographic Track (Gyro ring 1) */}
      <mesh ref={outerRingRef} scale={[0,0,0]}>
        <torusGeometry args={[1.8, 0.04, 16, 100]} />
        <meshBasicMaterial color={data.color} transparent opacity={hovered ? 0.8 : 0.3} wireframe={!hovered} />
      </mesh>

      {/* Inner Holographic Track (Gyro ring 2) */}
      <mesh ref={innerRingRef} scale={[0,0,0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 16, 100]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.5} />
      </mesh>

      {/* Glowing Inner Core (Data Crystal / Icosahedron) */}
      <mesh ref={innerCoreRef} scale={[0,0,0]}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color} 
          emissiveIntensity={hovered ? 2.5 : 1.0}
          wireframe={!hovered}
        />
      </mesh>
      
      {/* Interactive Light Beam Floor Ring */}
      <mesh ref={baseRingRef} position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 64]} />
        <meshBasicMaterial color={data.color} transparent opacity={hovered ? 0.9 : 0.2} />
      </mesh>

      {/* Volumetric laser beam connecting base and crystal */}
      {hovered && (
        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 2.5, 32, 1, true]} />
          <meshBasicMaterial 
            color={data.color} 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* High-Fidelity Holographic Text hovering above */}
      <Html 
        position={[0, 1.4, 0]} 
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
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: hovered ? "scale(1.2) translateY(-5px)" : "scale(1)"
        }}>
          <h2 style={{ fontSize: "50px", fontWeight: "900", margin: 0, lineHeight: 1, letterSpacing: "2px" }}>
            {data.value}<span style={{ fontSize: "24px", color: data.color }}>{data.suffix}</span>
          </h2>
          <div style={{ 
            fontSize: "14px", 
            fontWeight: "inline: 600", 
            letterSpacing: "4px", 
            color: hovered ? "#fff" : "#ccc", 
            marginTop: "10px",
            transition: "color 0.3s ease"
          }}>
            {data.title}
          </div>
        </div>
      </Html>
    </group>
  );
};

const TrophyRoom3D = () => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Add slight delay to start entering animation
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { rootMargin: "0px" });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tr-section" ref={containerRef} id="statistics" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", zIndex: 12 }}>
      
      {/* Title block */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "900", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "4px" }}>STATISTICS</h2>
        <p style={{ color: "#777", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", marginTop: "10px" }}>Performance Metrics Matrix</p>
      </div>

      <Canvas 
        camera={{ position: [0, 2, typeof window !== "undefined" && window.innerWidth < 768 ? 22 : 12], fov: 45 }} 
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 1.5]}
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
          config={{ mass: 1, tension: 300, friction: 20 }} 
          snap={{ mass: 1, tension: 300, friction: 20 }} 
          rotation={[0.1, 0, 0]} 
          polar={[-0.2, 0.2]} 
          azimuth={[-0.4, 0.4]} 
        >
          {/* Base Grid for the Holograms */}
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

          {/* Render the 3 Holographic Data Cores only when visible */}
          {isVisible && (
            <group position={[0, 0.5, 0]}>
              <StatNode data={stats[0]} position={[-4.5, 0, 0]} delay={0} />
              <StatNode data={stats[1]} position={[0, 0, 0]} delay={0.2} />
              <StatNode data={stats[2]} position={[4.5, 0, 0]} delay={0.4} />
            </group>
          )}
        </PresentationControls>
      </Canvas>
      
      {/* Edge Blur / Cinematic Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 40%, rgba(2,2,2,0.9) 100%)", zIndex: 6, pointerEvents: "none" }} />
    </div>
  );
};

export default TrophyRoom3D;
