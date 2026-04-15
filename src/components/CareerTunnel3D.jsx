import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TunnelGeometry = () => {
  const meshRef = useRef();
  
  // Creates an endless wireframe tube
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <cylinderGeometry args={[5, 5, 200, 32, 32, true]} />
      <meshBasicMaterial 
        color="#c2a4ff" 
        wireframe 
        transparent 
        opacity={0.15} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

const TunnelLightRing = ({ zOffset, color }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      // Small pulsing effect
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + zOffset) * 0.05);
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, zOffset]}>
      <torusGeometry args={[4.9, 0.05, 16, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};

const CameraController = ({ scrollTriggerClass }) => {
  useFrame((state) => {
    // We map scroll progress to the camera Z position
    // Career component needs to update a global or we use a ref
    state.camera.position.z = window.__careerScrollProgress ? -(window.__careerScrollProgress * 150) : 0;
    
    // Add a slight wiggle to the camera for "flight" feeling
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.5;
    state.camera.lookAt(
      state.camera.position.x * 0.5, 
      state.camera.position.y * 0.5, 
      state.camera.position.z - 20
    );
  });
  return null;
};

const CareerTunnel3D = () => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "500px" });
    observer.observe(containerRef.current);

    // Setup GSAP trigger to update global progress variable
    const trigger = ScrollTrigger.create({
      trigger: ".cr-section",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        window.__careerScrollProgress = self.progress;
      }
    });

    return () => {
      observer.disconnect();
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.8, pointerEvents: "none" }}>
      {isVisible && (
        <Canvas 
          camera={{ position: [0, 0, 0], fov: 60 }}
          style={{ pointerEvents: "none" }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <fog attach="fog" args={["#0a0a0a", 5, 40]} />
          <CameraController />
          <TunnelGeometry />
          {/* Timeline markers in the tunnel */}
          <TunnelLightRing zOffset={-30} color="#c2a4ff" />
          <TunnelLightRing zOffset={-70} color="#4facfe" />
          <TunnelLightRing zOffset={-110} color="#43e97b" />
        </Canvas>
      )}
      <div className="cr-tunnel-vignette" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, transparent 30%, #0a0a0a 100%)",
        zIndex: 1
      }}/>
    </div>
  );
};

export default CareerTunnel3D;
