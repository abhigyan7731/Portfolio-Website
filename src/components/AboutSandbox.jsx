import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Environment, Text, useCursor, Instance, Instances, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// Tech logos as physical blocks
const TECH_BLOCKS = [
  { text: "React", color: "#61dafb" },
  { text: "Node", color: "#8CC84B" },
  { text: "Next", color: "#ffffff" },
  { text: "TS", color: "#3178C6" },
  { text: "ML", color: "#ff8c00" },
  { text: "THREE", color: "#000000" },
];

const Block = ({ position, color, text }) => {
  const [hovered, setHover] = useState(false);
  const bodyRef = useRef();

  useCursor(hovered);

  const handleClick = (e) => {
    e.stopPropagation();
    if (bodyRef.current) {
      // Apply a playful kick
      bodyRef.current.applyImpulse({
        x: (Math.random() - 0.5) * 5,
        y: 8,
        z: (Math.random() - 0.5) * 5
      }, true);
      bodyRef.current.applyTorqueImpulse({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2
      }, true);
    }
  };

  return (
    <RigidBody 
      ref={bodyRef} 
      position={position} 
      restitution={0.8}
      friction={0.5}
    >
      <mesh 
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : "#000"} 
          emissiveIntensity={hovered ? 0.5 : 0} 
        />
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.3}
          color="#111"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </mesh>
    </RigidBody>
  );
};

const MouseInteractor = () => {
  const { mouse, viewport } = useThree();
  const bodyRef = useRef();

  useFrame(() => {
    if (bodyRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      // Kinematic body follows mouse to push blocks around
      bodyRef.current.setNextKinematicTranslation({ x, y, z: 0 });
    }
  });

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" colliders="ball">
      <mesh visible={false}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};

const ContainerBounds = () => {
  const { viewport } = useThree();
  const w = viewport.width / 2;
  const h = viewport.height / 2;
  
  return (
    <>
      <CuboidCollider position={[0, -h - 1, 0]} args={[w * 2, 1, 10]} />
      <CuboidCollider position={[0, h + 5, 0]} args={[w * 2, 1, 10]} />
      <CuboidCollider position={[-w - 1, 0, 0]} args={[1, h * 2, 10]} />
      <CuboidCollider position={[w + 1, 0, 0]} args={[1, h * 2, 10]} />
      <CuboidCollider position={[0, 0, -2]} args={[w * 2, h * 2, 1]} />
      <CuboidCollider position={[0, 0, 2]} args={[w * 2, h * 2, 1]} />
    </>
  );
};

// Intersection Observer Wrapper for Performance
const AboutSandbox = () => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "200px" });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.8, pointerEvents: "none" }}>
      {isVisible && (
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 50 }}
          style={{ pointerEvents: "auto" }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Environment preset="city" />
          
          <Physics gravity={[0, -15, 0]}>
            <MouseInteractor />
            <ContainerBounds />
            {TECH_BLOCKS.map((item, i) => (
              <Block 
                key={i} 
                position={[-2 + Math.random() * 4, 3 + i * 1.5, Math.random() - 0.5]}
                color={item.color}
                text={item.text}
              />
            ))}
          </Physics>
        </Canvas>
      )}
    </div>
  );
};

export default AboutSandbox;
