import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const Loading = ({ percent, setIsLoading }) => {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const canvasRef = useRef(null);
  const percentRef = useRef(percent);

  useEffect(() => {
    percentRef.current = percent;
  }, [percent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020f, 0.0015);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorA = new THREE.Color("#00f2fe"); // Neon Blue
    const colorB = new THREE.Color("#c2a4ff"); // Neon Purple

    for (let i = 0; i < particleCount; i++) {
        const t = Math.random() * Math.PI * 20; 
        const r = (Math.random() * 800) * (t / 20); 
        
        positions[i * 3] = Math.cos(t) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100 * (r / 200); 
        positions[i * 3 + 2] = Math.sin(t) * r;

        const mixRatio = Math.random();
        const mixedColor = colorA.clone().lerp(colorB, mixRatio);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPos.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, a * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const currentPercent = percentRef.current;
      
      material.uniforms.uTime.value = elapsed;

      const baseRotationSpeed = 0.002;
      const intenseMultiplier = 1 + (currentPercent / 100) * 15; 
      
      particles.rotation.y -= baseRotationSpeed * intenseMultiplier;
      particles.rotation.z -= baseRotationSpeed * (intenseMultiplier * 0.5);
      
      const tightness = Math.max(0.1, 1 - (currentPercent / 100) * 0.8);
      particles.scale.set(tightness, tightness, tightness);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener("resize", onResize);

    window._supernovaCamera = camera;

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
      setTimeout(() => {
        setClicked(true);
        if (window._supernovaCamera) {
          gsap.to(window._supernovaCamera.position, {
            z: -1000, 
            duration: 1.5,
            ease: "power3.in",
          });
        }
      }, 400);

      setTimeout(() => {
        import("./utils/initialFX").then((module) => {
          if (module.initialFX) {
            module.initialFX();
          }
          if (setIsLoading) {
            setIsLoading(false);
          }
        });
      }, 1600);
    }
  }, [percent, loaded, setIsLoading]);

  return (
    <div className={`loading-universe ${clicked ? "warp-drive" : ""}`}>
      <canvas ref={canvasRef} className="supernova-canvas" />
      <div className="supernova-percent" style={{
        textShadow: `0 0 ${percent}px #00f2fe`,
        opacity: clicked ? 0 : 1
      }}>
        {percent}%
      </div>
      <div className="loading-vignette"></div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading) => {
  let percent = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
