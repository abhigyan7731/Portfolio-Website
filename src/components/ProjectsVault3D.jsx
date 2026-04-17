import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Text, Environment, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const projects = [
  {
    title: "Expense Tracker",
    category: "Full Stack Web Development",
    tools: "Next.js, React, Supabase",
    github: "https://github.com/abhigyan7731/ai-splitwise-clone",
    color: "#667eea",
  },
  {
    title: "E-Commerce",
    category: "Full Stack Web Development",
    tools: "React, Next.js, Node.js",
    github: "https://github.com/abhigyan7731/E-commerce-website",
    color: "#f093fb",
  },
  {
    title: "Portfolio",
    category: "Web Development",
    tools: "React, Three.js, GSAP",
    github: "https://github.com/abhigyan7731/Portfolio-Website",
    color: "#4facfe",
  },
  {
    title: "CKD Classifier",
    category: "Machine Learning",
    tools: "Python, Scikit-learn, Flask",
    github: "https://github.com/abhigyan7731/CKD-Stage-Prediction-and-Treatment-AI-Based",
    color: "#43e97b",
  },
];

const ProjectCube = ({ project, index, total, onClick, activeId }) => {
  const meshRef = useRef();
  const angle = (index / total) * Math.PI * 2;
  const radius = 6;
  const isActive = activeId === index;

  // Base position in a circle
  const baseX = Math.cos(angle) * radius;
  const baseZ = Math.sin(angle) * radius;

  // GSAP animation on select
  useEffect(() => {
    if (isActive && meshRef.current) {
      gsap.to(meshRef.current.position, { y: 2, duration: 1, ease: "back.out(1.5)" });
      gsap.to(meshRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1, ease: "power3.out" });
    } else if (meshRef.current) {
      gsap.to(meshRef.current.position, { y: 0, duration: 1, ease: "power3.out" });
      gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "power3.out" });
    }
  }, [isActive]);

  return (
    <Float speed={isActive ? 1 : 3} rotationIntensity={isActive ? 0 : 2} floatIntensity={isActive ? 0 : 2}>
      <group position={[baseX, 0, baseZ]} ref={meshRef}>
        <mesh 
          onClick={(e) => { e.stopPropagation(); onClick(index, baseX, baseZ); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <boxGeometry args={[1.5, 2, 0.2]} />
          <meshPhysicalMaterial 
            color={project.color} 
            transmission={0.9} 
            opacity={1} 
            metalness={0.8} 
            roughness={0.2} 
            ior={1.5} 
            thickness={2} 
          />
        </mesh>

        <Text position={[0, 0, 0.15]} fontSize={0.25} color="#fff" anchorY="bottom" anchorX="center" y={0.2}>
          {project.title}
        </Text>

        {isActive && (
          <Html position={[0, -1.2, 0]} center transform zIndexRange={[100, 0]}>
            <div style={{
              background: "rgba(10, 10, 15, 0.85)", 
              border: `1px solid ${project.color}`,
              backdropFilter: "blur(10px)",
              padding: "20px",
              borderRadius: "12px",
              width: "250px",
              color: "white",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: project.color }}>{project.category}</h3>
              <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#ccc" }}>{project.tools}</p>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  background: project.color,
                  color: "#000",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                Access Data
              </a>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

const VaultCamera = ({ targetPosition, isViewing }) => {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    if (isViewing && targetPosition) {
      // Position camera near the center, slightly elevated, looking outwards at the cube
      const camX = targetPosition.x * 0.3;
      const camZ = targetPosition.z * 0.3;
      
      gsap.to(camera.position, {
        x: camX, y: 4, z: camZ,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          if (controls) controls.target.set(targetPosition.x, 1, targetPosition.z);
        }
      });
    } else {
      // Return to overview
      gsap.to(camera.position, {
        x: 0, y: 8, z: 12,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          if (controls) controls.target.set(0, 0, 0);
        }
      });
    }
  }, [isViewing, targetPosition, camera, controls]);

  return <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isViewing} autoRotateSpeed={0.5} />;
};

const VaultCore = () => {
  const [activeId, setActiveId] = useState(null);
  const [targetPos, setTargetPos] = useState(null);

  const handleCubeClick = (index, x, z) => {
    if (activeId === index) {
      setActiveId(null); // Deselect
    } else {
      setActiveId(index);
      setTargetPos(new THREE.Vector3(x, 0, z));
    }
  };

  return (
    <>
      <VaultCamera isViewing={activeId !== null} targetPosition={targetPos} />
      
      {/* Central Core */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[2, 4, 1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.1, 32]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.5} />
      </mesh>

      <group onPointerMissed={() => setActiveId(null)}>
        {projects.map((proj, i) => (
          <ProjectCube 
            key={i} 
            index={i} 
            total={projects.length} 
            project={proj} 
            onClick={handleCubeClick}
            activeId={activeId}
          />
        ))}
      </group>
    </>
  );
};

const ProjectsVault3D = () => {
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
    <div ref={containerRef} style={{ width: "100%", height: "100vh", position: "relative", background: "none" }}>
      {isVisible && (
        <Canvas 
          camera={{ position: [0, 8, 12], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance", alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 5, 0]} intensity={2} color="#4facfe" />
          <Environment files="/models/char_enviorment.hdr" />
          <VaultCore />
        </Canvas>
      )}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", textAlign: "center", color: "white", pointerEvents: "none" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: 800, margin: 0, textShadow: "0 0 20px rgba(79, 172, 254, 0.5)" }}>DATA VAULT</h2>
        <p style={{ color: "#aaa", fontSize: "1rem", marginTop: "10px" }}>Click a holo-drive to extract project data.</p>
      </div>
    </div>
  );
};

export default ProjectsVault3D;
