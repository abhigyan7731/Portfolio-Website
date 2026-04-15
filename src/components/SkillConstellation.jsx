import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "React", color: "#61DAFB", size: 1.2 },
  { name: "Next.js", color: "#ffffff", size: 1.1 },
  { name: "Node.js", color: "#68A063", size: 1.0 },
  { name: "Python", color: "#FFD43B", size: 1.1 },
  { name: "PostgreSQL", color: "#336791", size: 0.9 },
  { name: "Supabase", color: "#3ECF8E", size: 0.95 },
  { name: "Three.js", color: "#049EF4", size: 0.85 },
  { name: "GSAP", color: "#88CE02", size: 0.8 },
  { name: "Scikit-learn", color: "#F7931E", size: 0.9 },
  { name: "JavaScript", color: "#F7DF1E", size: 1.15 },
  { name: "TypeScript", color: "#3178C6", size: 1.0 },
  { name: "CSS", color: "#264DE4", size: 0.85 },
  { name: "Git", color: "#F05032", size: 0.8 },
  { name: "Flask", color: "#ffffff", size: 0.75 },
  { name: "Prisma", color: "#2D3748", size: 0.85 },
  { name: "REST APIs", color: "#FF6B6B", size: 0.9 },
];

// Place skills in a 3D sphere arrangement
function generateSkillPositions(skills) {
  const positions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < skills.length; i++) {
    const y = 1 - (i / (skills.length - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const scale = 4.5;
    positions.push(
      new THREE.Vector3(
        Math.cos(theta) * radius * scale,
        y * scale * 0.7,
        Math.sin(theta) * radius * scale
      )
    );
  }
  return positions;
}

const SkillConstellation = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene setup
    const isMobileInit = width < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(0, 2.5, isMobileInit ? 22 : 12);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileInit ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Bloom — massively reduced internal resolution (25%) to prevent GPU overload on Vercel
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width / 4, height / 4),
      1.2,
      0.6,
      0.3
    );
    composer.addPass(bloomPass);

    // OrbitControls for true tactile 3D interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Prevents scroll hijacking
    controls.enablePan = false; 
    controls.autoRotate = true; // Slowly rotate when user isn't holding it
    controls.autoRotateSpeed = 1.0;

    // Master group
    const masterGroup = new THREE.Group();
    // Shift the globe physically downwards so it doesn't overlap with the top text
    masterGroup.position.y = -1.2;
    scene.add(masterGroup);

    // Generate positions
    const skillPositions = generateSkillPositions(SKILLS);

    // Node spheres with custom shader
    const nodeGroup = new THREE.Group();
    masterGroup.add(nodeGroup);
    const nodeMeshes = [];
    const nodeGlows = [];

    const nodeGeo = new THREE.IcosahedronGeometry(0.18, 3);

    SKILLS.forEach((skill, i) => {
      const color = new THREE.Color(skill.color);
      const pos = skillPositions[i];

      // Core sphere
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(skill.size);
      mesh.userData = { index: i, baseScale: skill.size, skill };
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Outer glow ring
      const ringGeo = new THREE.RingGeometry(0.28 * skill.size, 0.42 * skill.size, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(camera.position);
      nodeGroup.add(ring);
      nodeGlows.push(ring);

      // Orbiting particles around each node
      const orbitCount = 12;
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPos = new Float32Array(orbitCount * 3);
      for (let j = 0; j < orbitCount; j++) {
        const angle = (j / orbitCount) * Math.PI * 2;
        const r = 0.35 * skill.size;
        orbitPos[j * 3] = Math.cos(angle) * r;
        orbitPos[j * 3 + 1] = Math.sin(angle) * r;
        orbitPos[j * 3 + 2] = 0;
      }
      orbitGeo.setAttribute("position", new THREE.BufferAttribute(orbitPos, 3));
      const orbitMat = new THREE.PointsMaterial({
        color: color,
        size: 2.5,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const orbitPoints = new THREE.Points(orbitGeo, orbitMat);
      orbitPoints.position.copy(pos);
      nodeGroup.add(orbitPoints);
    });

    // Connection lines (neural network style)
    const connectionThreshold = 5.5;
    const connections = [];
    for (let i = 0; i < SKILLS.length; i++) {
      for (let j = i + 1; j < SKILLS.length; j++) {
        const dist = skillPositions[i].distanceTo(skillPositions[j]);
        if (dist < connectionThreshold) {
          connections.push({ from: i, to: j, dist });
        }
      }
    }

    // Line geometry
    const linePositions = new Float32Array(connections.length * 6);
    const lineColors = new Float32Array(connections.length * 6);
    connections.forEach((conn, idx) => {
      const from = skillPositions[conn.from];
      const to = skillPositions[conn.to];
      const ci = new THREE.Color(SKILLS[conn.from].color);
      const cj = new THREE.Color(SKILLS[conn.to].color);
      const base = idx * 6;
      linePositions[base] = from.x;
      linePositions[base + 1] = from.y;
      linePositions[base + 2] = from.z;
      linePositions[base + 3] = to.x;
      linePositions[base + 4] = to.y;
      linePositions[base + 5] = to.z;
      lineColors[base] = ci.r;
      lineColors[base + 1] = ci.g;
      lineColors[base + 2] = ci.b;
      lineColors[base + 3] = cj.r;
      lineColors[base + 4] = cj.g;
      lineColors[base + 5] = cj.b;
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    masterGroup.add(linesMesh);

    // Background star field — fewer on mobile for performance
    const starCount = isMobileInit ? 500 : 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      starSizes[i] = Math.random() * 1.5 + 0.5;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = max(aSize * uPixelRatio * 2.0 * (1.0 / -mvPos.z), 1.0);
          vAlpha = 0.3 + 0.7 * sin(uTime * 1.5 + position.x * 10.0 + position.y * 7.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(0.7, 0.8, 1.0, a * vAlpha * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Energy wave ring — a pulsing ring that expands outward periodically
    const waveRingCount = 3;
    const waveRings = [];
    for (let i = 0; i < waveRingCount; i++) {
      const ringGeo = new THREE.RingGeometry(0.1, 0.15, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#c2a4ff"),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      masterGroup.add(ring);
      waveRings.push({ mesh: ring, phase: (i / waveRingCount) * Math.PI * 2 });
    }

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    let hoveredNode = -1;

    const onMouseMove = (e) => {
      // Don't update coordinates if dragging (OrbitControls is active)
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseVec.set(mouse.targetX, mouse.targetY);

      // Raycast to nodes
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const newHovered = intersects[0].object.userData.index;
        if (newHovered !== hoveredNode) {
          hoveredNode = newHovered;
          updateHoverLabel(hoveredNode);
        }
      } else {
        if (hoveredNode !== -1) {
          hoveredNode = -1;
          updateHoverLabel(-1);
        }
      }
    };
    container.addEventListener("mousemove", onMouseMove);

    // Hover label update
    function updateHoverLabel(index) {
      const label = container.querySelector(".sc-hover-label");
      if (!label) return;
      if (index === -1) {
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.3 });
      } else {
        label.textContent = SKILLS[index].name;
        label.style.color = SKILLS[index].color;
        label.style.textShadow = `0 0 20px ${SKILLS[index].color}, 0 0 40px ${SKILLS[index].color}40`;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
      }
    }

    // Scroll-based visibility
    const visibility = { value: 0 };
    const scrollTrig = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      end: "bottom 20%",
      id: "skill-constellation",
      onEnter: () =>
        gsap.to(visibility, { value: 1, duration: 1.5, ease: "power2.out" }),
      onLeave: () =>
        gsap.to(visibility, { value: 0.3, duration: 1, ease: "power2.out" }),
      onEnterBack: () =>
        gsap.to(visibility, { value: 1, duration: 1, ease: "power2.out" }),
      onLeaveBack: () =>
        gsap.to(visibility, { value: 0, duration: 1, ease: "power2.out" }),
    });

    // Entrance animation
    masterGroup.scale.setScalar(0);
    masterGroup.rotation.y = -Math.PI;

    const ctx = gsap.context(() => {
      gsap.to(masterGroup.scale, {
        x: 1, y: 1, z: 1,
        duration: 2,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: { trigger: container, start: "top 70%" },
      });
      gsap.to(masterGroup.rotation, {
        y: 0,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: { trigger: container, start: "top 70%" },
      });

      // Title chars
      gsap.from(".sc-title-char", {
        y: 80,
        rotateX: -90,
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: container, start: "top 70%" },
      });

      gsap.from(".sc-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: container, start: "top 65%" },
      });

      gsap.from(".sc-skill-chip", {
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".sc-chips-row", start: "top 85%" },
      });
    }, container);

    // Resize
    const onResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      const isMobileNow = width < 768;
      
      camera.aspect = width / height;
      camera.position.z = isMobileNow ? 22 : 12;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      composer.setSize(width, height);
      starMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, isMobileNow ? 1 : 2);
    };
    window.addEventListener("resize", onResize);

    // Pre-allocate reusable Vector3 for lerp (avoids GC churn)
    const _tempVec3 = new THREE.Vector3();

    // Pre-cache colors for connections (avoid allocating in animation loop)
    const connectionColors = connections.map(conn => ({
      ci: new THREE.Color(SKILLS[conn.from].color),
      cj: new THREE.Color(SKILLS[conn.to].color),
    }));

    // Animation loop
    const clock = new THREE.Clock();
    let frameId;

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.0, rootMargin: "300px" }
    );
    observer.observe(container);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Star time
      starMat.uniforms.uTime.value = elapsed;

      // Make glow rings always face camera
      nodeGlows.forEach((ring) => ring.lookAt(camera.position));

      // Animate nodes — breathing + hover effects
      nodeMeshes.forEach((mesh, i) => {
        const baseScale = mesh.userData.baseScale;
        const breathe = 1 + Math.sin(elapsed * 1.5 + i * 0.8) * 0.08;
        const isHovered = hoveredNode === i;
        const targetScale = isHovered ? baseScale * 2.0 : baseScale * breathe;
        _tempVec3.set(targetScale, targetScale, targetScale);
        mesh.scale.lerp(_tempVec3, 0.1);
        mesh.material.opacity = isHovered ? 1.0 : 0.85;

        // Corresponding glow ring
        const glow = nodeGlows[i];
        glow.material.opacity = isHovered ? 0.5 : 0.1 + Math.sin(elapsed * 2 + i) * 0.05;
        const glowScale = isHovered ? 2.5 : 1 + Math.sin(elapsed * 1.2 + i) * 0.15;
        _tempVec3.set(glowScale, glowScale, glowScale);
        glow.scale.lerp(_tempVec3, 0.1);
      });

      // Animate connection lines opacity based on hover — using pre-cached colors
      const lineOpacities = lineGeo.attributes.color.array;
      connections.forEach((conn, idx) => {
        const base = idx * 6;
        const { ci, cj } = connectionColors[idx];
        const isActive = hoveredNode === conn.from || hoveredNode === conn.to;
        const intensity = isActive ? 1.0 : 0.15;
        lineOpacities[base] = ci.r * intensity;
        lineOpacities[base + 1] = ci.g * intensity;
        lineOpacities[base + 2] = ci.b * intensity;
        lineOpacities[base + 3] = cj.r * intensity;
        lineOpacities[base + 4] = cj.g * intensity;
        lineOpacities[base + 5] = cj.b * intensity;
      });
      lineGeo.attributes.color.needsUpdate = true;
      lineMat.opacity = 0.08 + (hoveredNode >= 0 ? 0.25 : 0);

      // Wave rings
      waveRings.forEach(({ mesh: ring, phase }) => {
        const t = ((elapsed * 0.5 + phase) % (Math.PI * 2)) / (Math.PI * 2);
        const scale = 1 + t * 12;
        ring.scale.set(scale, scale, scale);
        ring.material.opacity = (1 - t) * 0.15;
      });

      controls.update();

      // Overall visibility
      const v = visibility.value;
      nodeGroup.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = Math.min(child.material.opacity, v);
        }
      });

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ctx.revert();
      scrollTrig.kill();
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      // Dispose all geometries and materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      composer.dispose();
      observer.disconnect();
    };
  }, []);

  const titleChars = "SKILL CONSTELLATION".split("");

  return (
    <div className="sc-section" ref={containerRef} id="skill-constellation">
      <canvas ref={canvasRef} className="sc-canvas" />
      <div className="sc-vignette" />

      <div className="sc-content">
        <div className="sc-top-group">
          <div className="sc-title">
            {titleChars.map((char, i) => (
              <span
                className={`sc-title-char ${char === " " ? "sc-space" : ""}`}
                key={i}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          <p className="sc-subtitle">
            My technical universe — hover over the nodes to explore
          </p>
        </div>

        <div className="sc-bottom-group">
          <div className="sc-hover-label" />

          <div className="sc-chips-row">
            {SKILLS.map((skill) => (
              <span
                className="sc-skill-chip"
                key={skill.name}
                style={{
                  "--chip-color": skill.color,
                }}
              >
                <span className="sc-chip-dot" style={{ background: skill.color }} />
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient grid overlay */}
      <div className="sc-grid-bg">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sc-grid-line-h" key={`h${i}`} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sc-grid-line-v" key={`v${i}`} />
        ))}
      </div>
    </div>
  );
};

export default SkillConstellation;
