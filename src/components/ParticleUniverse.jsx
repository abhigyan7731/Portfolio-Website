import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 3000;
const SHAPE_NAMES = ["TORUS KNOT", "GALAXY", "DNA HELIX", "SPHERE"];

// Shape generators
function torusKnotPositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 4;
    const p = 2, q = 3, r = 2.8;
    const x = (r + 1.0 * Math.cos(q * t)) * Math.cos(p * t);
    const y = (r + 1.0 * Math.cos(q * t)) * Math.sin(p * t);
    const z = 1.0 * Math.sin(q * t);
    positions.push(x, y, z);
  }
  return new Float32Array(positions);
}

function galaxySpiralPositions(count) {
  const positions = [];
  const arms = 4;
  for (let i = 0; i < count; i++) {
    const armIndex = i % arms;
    const t = (i / count) * 6;
    const angle = armIndex * (Math.PI * 2 / arms) + t * 1.2;
    const radius = t * 0.8 + (Math.random() - 0.5) * 0.6;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 0.3 * (1 / (t + 0.5));
    const z = Math.sin(angle) * radius;
    positions.push(x, y, z);
  }
  return new Float32Array(positions);
}

function dnaHelixPositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 8;
    const strand = i % 2 === 0 ? 1 : -1;
    const yPos = (i / count) * 8 - 4;
    const x = Math.cos(t) * 1.8 * strand;
    const z = Math.sin(t) * 1.8 * strand;
    if (i % 20 < 3) {
      const lerpFactor = (i % 20) / 2;
      positions.push(x * (1 - lerpFactor), yPos, z * (1 - lerpFactor));
    } else {
      positions.push(x, yPos, z);
    }
  }
  return new Float32Array(positions);
}

function spherePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 3.2 + (Math.random() - 0.5) * 0.3;
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  return new Float32Array(positions);
}

const ParticleUniverse = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const morphFnRef = useRef(null);

  const handleShapeClick = useCallback((index) => {
    if (morphFnRef.current) {
      morphFnRef.current(index);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5, 0.4, 0.2
    );
    composer.addPass(bloomPass);

    // All shapes
    const shapes = [
      torusKnotPositions(PARTICLE_COUNT),
      galaxySpiralPositions(PARTICLE_COUNT),
      dnaHelixPositions(PARTICLE_COUNT),
      spherePositions(PARTICLE_COUNT),
    ];

    // Particle arrays
    const currentPos = new Float32Array(PARTICLE_COUNT * 3);
    const targetPos = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colorArr = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      currentPos[i] = (Math.random() - 0.5) * 20;
      targetPos[i] = shapes[0][i];
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = Math.random() * 3 + 1;
      randoms[i] = Math.random() * Math.PI * 2;
      const t = i / PARTICLE_COUNT;
      const color = new THREE.Color();
      if (t < 0.33) color.setHSL(0.75, 0.9, 0.6 + Math.random() * 0.2);
      else if (t < 0.66) color.setHSL(0.55, 0.95, 0.6 + Math.random() * 0.2);
      else color.setHSL(0.85, 0.85, 0.6 + Math.random() * 0.15);
      colorArr[i * 3] = color.r;
      colorArr[i * 3 + 1] = color.g;
      colorArr[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aRandom;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Organic breathing motion
          pos.x += sin(uTime * 0.5 + aRandom * 6.28) * 0.06;
          pos.y += cos(uTime * 0.4 + aRandom * 4.0) * 0.06;
          pos.z += sin(uTime * 0.3 + aRandom * 5.0) * 0.04;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Mouse repulsion
          vec2 screenPos = mvPosition.xy / -mvPosition.z;
          vec2 mouseDir = screenPos - uMouse * 0.5;
          float mouseDist = length(mouseDir);
          float mouseForce = smoothstep(1.5, 0.0, mouseDist) * 0.5;
          mvPosition.xy += normalize(mouseDir + 0.001) * mouseForce;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = max(aSize * uPixelRatio * 4.0 * (1.0 / -mvPosition.z), 1.0);
          
          vAlpha = smoothstep(50.0, 5.0, -mvPosition.z);
          vAlpha *= 0.5 + 0.5 * sin(uTime * 2.0 + aRandom * 6.28);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist);
          alpha *= alpha;
          float core = smoothstep(0.15, 0.0, dist);
          vec3 color = mix(vColor, vec3(1.0), core * 0.6);
          
          gl_FragColor = vec4(color, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connection lines
    const maxLines = 400;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", onMouseMove);

    // Morphing state
    let currentShapeIdx = 0;
    let morphProg = { value: 0 };
    let isAnimating = false;
    let autoRotSpeed = { value: 0.15 };

    function morphToShape(index) {
      if (isAnimating && index === currentShapeIdx) return;
      isAnimating = true;
      currentShapeIdx = index % shapes.length;
      const next = shapes[currentShapeIdx];
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        targetPos[i] = next[i];
      }
      morphProg.value = 0;
      gsap.to(morphProg, {
        value: 1,
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => { isAnimating = false; },
      });

      // Update label
      const label = document.querySelector(".pu-shape-label");
      if (label) {
        gsap.to(label, {
          opacity: 0, y: -20, duration: 0.3,
          onComplete: () => {
            label.textContent = SHAPE_NAMES[currentShapeIdx];
            gsap.to(label, { opacity: 1, y: 0, duration: 0.5, delay: 0.15 });
          },
        });
      }

      // Highlight active button
      document.querySelectorAll(".pu-shape-btn").forEach((btn, i) => {
        btn.classList.toggle("pu-shape-btn-active", i === currentShapeIdx);
      });
    }

    // Expose morph function
    morphFnRef.current = morphToShape;

    // ScrollTrigger
    const scrollTrig = ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      id: "particle-universe",
      onEnter: () => gsap.to(autoRotSpeed, { value: 0.3, duration: 1 }),
      onLeave: () => gsap.to(autoRotSpeed, { value: 0.08, duration: 1 }),
      onEnterBack: () => gsap.to(autoRotSpeed, { value: 0.3, duration: 1 }),
    });

    // Auto-morph
    let morphTimer = setInterval(() => {
      morphToShape((currentShapeIdx + 1) % shapes.length);
    }, 5000);

    // Resize
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener("resize", onResize);

    // Animate
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Morph particles
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        currentPos[i] += (targetPos[i] - currentPos[i]) * 0.04;
      }
      posAttr.needsUpdate = true;

      // Update lines
      let lineIdx = 0;
      const lp = lineGeometry.attributes.position.array;
      const lc = lineGeometry.attributes.color.array;
      const connDist = 0.8;
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < maxLines; i += 8) {
        for (let j = i + 8; j < PARTICLE_COUNT && lineIdx < maxLines; j += 8) {
          const dx = currentPos[i * 3] - currentPos[j * 3];
          const dy = currentPos[i * 3 + 1] - currentPos[j * 3 + 1];
          const dz = currentPos[i * 3 + 2] - currentPos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < connDist) {
            const alpha = 1 - dist / connDist;
            const idx = lineIdx * 6;
            lp[idx] = currentPos[i * 3];
            lp[idx + 1] = currentPos[i * 3 + 1];
            lp[idx + 2] = currentPos[i * 3 + 2];
            lp[idx + 3] = currentPos[j * 3];
            lp[idx + 4] = currentPos[j * 3 + 1];
            lp[idx + 5] = currentPos[j * 3 + 2];
            lc[idx] = colorArr[i * 3] * alpha;
            lc[idx + 1] = colorArr[i * 3 + 1] * alpha;
            lc[idx + 2] = colorArr[i * 3 + 2] * alpha;
            lc[idx + 3] = colorArr[j * 3] * alpha;
            lc[idx + 4] = colorArr[j * 3 + 1] * alpha;
            lc[idx + 5] = colorArr[j * 3 + 2] * alpha;
            lineIdx++;
          }
        }
      }
      for (let i = lineIdx * 6; i < maxLines * 6; i++) {
        lp[i] = 0;
        lc[i] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIdx * 2);

      // Rotate
      particles.rotation.y += autoRotSpeed.value * 0.01;
      particles.rotation.x += autoRotSpeed.value * 0.003;
      particles.rotation.x += (mouse.y * 0.3 - particles.rotation.x) * 0.01;
      particles.rotation.y += (mouse.x * 0.5 - particles.rotation.y) * 0.008;
      lines.rotation.copy(particles.rotation);

      composer.render();
    };
    animate();

    // Entrance
    gsap.from(camera.position, { z: 20, duration: 2.5, ease: "power3.out", delay: 0.3 });

    // GSAP reveal
    const ctx = gsap.context(() => {
      gsap.from(".pu-title-char", {
        y: 80, rotateX: -90, opacity: 0,
        stagger: 0.04, duration: 0.8, ease: "back.out(1.7)",
        scrollTrigger: { trigger: container, start: "top 70%" },
      });
      gsap.from(".pu-subtitle", {
        y: 30, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: container, start: "top 65%" },
      });
      gsap.from(".pu-shape-label", {
        scale: 0, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: container, start: "top 60%" },
      });
      gsap.from(".pu-shape-btn", {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: container, start: "top 55%" },
      });
      gsap.from(".pu-hint", {
        opacity: 0, duration: 1.5, delay: 1,
        scrollTrigger: { trigger: container, start: "top 60%" },
      });
    }, container);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(morphTimer);
      ctx.revert();
      scrollTrig.kill();
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  const titleChars = "PARTICLE UNIVERSE".split("");

  return (
    <div className="pu-section" ref={containerRef} id="particle-universe">
      <canvas ref={canvasRef} className="pu-canvas" />
      <div className="pu-vignette" />

      <div className="pu-content">
        <div className="pu-title">
          {titleChars.map((char, i) => (
            <span
              className={`pu-title-char ${char === " " ? "pu-space" : ""}`}
              key={i}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
        <p className="pu-subtitle">
          Interactive 3D morphing particle system — move your mouse to interact
        </p>

        <div className="pu-shape-label">TORUS KNOT</div>

        <div className="pu-shape-btns">
          {["Torus Knot", "Galaxy", "DNA Helix", "Sphere"].map((name, i) => (
            <button
              key={name}
              className={`pu-shape-btn ${i === 0 ? "pu-shape-btn-active" : ""}`}
              onClick={() => handleShapeClick(i)}
              data-cursor="disable"
            >
              <span className="pu-btn-index">0{i + 1}</span>
              {name}
            </button>
          ))}
        </div>

        <p className="pu-hint">
          <span className="pu-hint-dot" />
          Auto-morphs every 5s • Hover to distort • Click shapes to transform
        </p>
      </div>

      <div className="pu-grid-bg">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="pu-grid-line-h" key={`h${i}`} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="pu-grid-line-v" key={`v${i}`} />
        ))}
      </div>
    </div>
  );
};

export default ParticleUniverse;
