import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

// Floating code snippets that orbit around
const codeSnippets = [
  { text: "const app = express();", lang: "js" },
  { text: "npm run deploy", lang: "bash" },
  { text: "git push origin main", lang: "git" },
  { text: "<Canvas shadows />", lang: "jsx" },
  { text: "model.fit(X, y)", lang: "py" },
  { text: "SELECT * FROM users", lang: "sql" },
];

// Status bar items
const statusItems = [
  { icon: "◉", label: "SYSTEM", value: "ONLINE", color: "#43e97b" },
  { icon: "⚡", label: "POWER", value: "100%", color: "#00f2fe" },
  { icon: "◈", label: "MODE", value: "CREATIVE", color: "#c2a4ff" },
];

const Landing = ({ children }) => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // Particle field on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.5 ? "0, 242, 254" : "194, 164, 255",
        });
      }
    };

    resize();
    createParticles();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.parentElement?.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Bounds wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color}, ${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.parentElement?.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Massive name reveal — slides up from below with 3D rotation
      tl.from(".l3d-hero-name", {
        y: 200,
        z: -500,
        rotateX: 45,
        opacity: 0,
        duration: 1.6,
        ease: "power4.out",
      });

      tl.from(".l3d-hero-lastname", {
        y: 200,
        z: -300,
        rotateX: 30,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      }, "-=1.0");

      // Status bar fades in
      tl.from(".l3d-status-bar", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.8");

      // Holographic decorative lines
      tl.from(".l3d-holo-line", {
        scaleX: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.6");

      // Bottom bar slides up
      tl.from(".l3d-bottom-bar", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6");

      // Role items stagger in
      tl.from(".l3d-role-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.5");

      // Kicker
      tl.from(".l3d-top-kicker", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.8");

      // Code snippets float in
      tl.from(".l3d-code-snippet", {
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "back.out(1.5)",
      }, "-=0.8");

      // Scroll indicator
      tl.from(".l3d-scroll-cue", {
        opacity: 0,
        duration: 1,
      }, "-=0.3");

      // Corner decorations
      tl.from(".l3d-corner-deco", {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=1");

      // Continuous subtle float for the name
      gsap.to(".l3d-hero-name", {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".l3d-hero-lastname", {
        y: 5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Floating code snippets orbit
      gsap.to(".l3d-code-snippet", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-3, 3)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.5 },
      });

      // Wireframe shapes rotate
      gsap.to(".l3d-wireframe-shape", {
        rotateX: "random(0, 360)",
        rotateY: "random(0, 360)",
        rotateZ: "random(0, 360)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 2 },
      });

      // Scan line animation
      gsap.to(".l3d-scanline", {
        top: "100%",
        duration: 6,
        repeat: -1,
        ease: "none",
      });

    }, section);

    // Mouse parallax for name depth + decorations
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".l3d-hero-name", {
        rotateY: x * 6,
        rotateX: -y * 4,
        x: x * 20,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(".l3d-hero-lastname", {
        rotateY: x * 8,
        rotateX: -y * 5,
        x: x * 30,
        duration: 1.5,
        ease: "power2.out",
      });

      // Parallax layers
      gsap.to(".l3d-parallax-deep", {
        x: x * 40,
        y: y * 40,
        duration: 1.8,
        ease: "power2.out",
      });

      gsap.to(".l3d-parallax-mid", {
        x: x * 20,
        y: y * 20,
        duration: 1.4,
        ease: "power2.out",
      });

      gsap.to(".l3d-parallax-shallow", {
        x: x * 10,
        y: y * 10,
        duration: 1,
        ease: "power2.out",
      });
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv" ref={sectionRef}>
        {/* Interactive particle canvas */}
        <canvas className="l3d-particle-canvas" ref={canvasRef} />

        {/* Aurora gradient background */}
        <div className="l3d-aurora">
          <div className="l3d-aurora-band l3d-aurora-1" />
          <div className="l3d-aurora-band l3d-aurora-2" />
          <div className="l3d-aurora-band l3d-aurora-3" />
        </div>

        {/* Holographic scanline */}
        <div className="l3d-scanline" />

        {/* Ambient background orbs */}
        <div className="l3d-bg-orb l3d-bg-orb-1 l3d-parallax-deep" />
        <div className="l3d-bg-orb l3d-bg-orb-2 l3d-parallax-mid" />
        <div className="l3d-bg-orb l3d-bg-orb-3 l3d-parallax-deep" />

        {/* Floating wireframe shapes */}
        <div className="l3d-wireframe-shape l3d-wf-1 l3d-parallax-deep">
          <svg viewBox="0 0 100 100" fill="none" stroke="rgba(0,242,254,0.1)" strokeWidth="0.8">
            <polygon points="50,5 95,27 95,72 50,95 5,72 5,27" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="5" y1="27" x2="95" y2="72" />
            <line x1="95" y1="27" x2="5" y2="72" />
          </svg>
        </div>
        <div className="l3d-wireframe-shape l3d-wf-2 l3d-parallax-mid">
          <svg viewBox="0 0 100 100" fill="none" stroke="rgba(194,164,255,0.08)" strokeWidth="0.8">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="25" />
            <circle cx="50" cy="50" r="10" />
            <line x1="10" y1="50" x2="90" y2="50" />
            <line x1="50" y1="10" x2="50" y2="90" />
          </svg>
        </div>
        <div className="l3d-wireframe-shape l3d-wf-3 l3d-parallax-shallow">
          <svg viewBox="0 0 100 100" fill="none" stroke="rgba(240,147,251,0.07)" strokeWidth="0.8">
            <rect x="20" y="20" width="60" height="60" rx="3" />
            <rect x="30" y="30" width="40" height="40" rx="2" transform="rotate(45 50 50)" />
          </svg>
        </div>

        {/* Corner decorations - cyberpunk brackets */}
        <div className="l3d-corner-deco l3d-corner-tl">
          <svg viewBox="0 0 60 60" fill="none" stroke="rgba(0,242,254,0.3)" strokeWidth="1.5">
            <path d="M 0 20 L 0 0 L 20 0" />
          </svg>
        </div>
        <div className="l3d-corner-deco l3d-corner-tr">
          <svg viewBox="0 0 60 60" fill="none" stroke="rgba(194,164,255,0.3)" strokeWidth="1.5">
            <path d="M 40 0 L 60 0 L 60 20" />
          </svg>
        </div>
        <div className="l3d-corner-deco l3d-corner-bl">
          <svg viewBox="0 0 60 60" fill="none" stroke="rgba(240,147,251,0.2)" strokeWidth="1.5">
            <path d="M 0 40 L 0 60 L 20 60" />
          </svg>
        </div>
        <div className="l3d-corner-deco l3d-corner-br">
          <svg viewBox="0 0 60 60" fill="none" stroke="rgba(67,233,123,0.2)" strokeWidth="1.5">
            <path d="M 40 60 L 60 60 L 60 40" />
          </svg>
        </div>

        {/* Holographic decorative lines */}
        <div className="l3d-holo-line l3d-holo-line-1" />
        <div className="l3d-holo-line l3d-holo-line-2" />

        {/* Status bar - top right HUD */}
        <div className="l3d-status-bar">
          {statusItems.map((item, i) => (
            <div className="l3d-status-item" key={i}>
              <span className="l3d-status-icon" style={{ color: item.color, textShadow: `0 0 8px ${item.color}` }}>
                {item.icon}
              </span>
              <div className="l3d-status-info">
                <span className="l3d-status-label">{item.label}</span>
                <span className="l3d-status-value" style={{ color: item.color }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top kicker */}
        <div className="l3d-top-kicker">
          <span className="l3d-kicker-line" />
          <span className="l3d-kicker-badge">
            <span className="l3d-kicker-dot" />
            B.Tech CSE — SRM IST
          </span>
          <span className="l3d-kicker-line" />
        </div>

        {/* Floating code snippets */}
        <div className="l3d-code-snippets-container">
          {codeSnippets.map((snippet, i) => (
            <div
              className={`l3d-code-snippet l3d-code-snippet-${i + 1}`}
              key={i}
            >
              <span className="l3d-code-lang">{snippet.lang}</span>
              <code>{snippet.text}</code>
            </div>
          ))}
        </div>

        {/* HUGE name text sitting BEHIND the character */}
        <div className="l3d-name-backdrop" style={{ perspective: "1200px" }}>
          {/* Glitch copies */}
          <div className="l3d-name-glitch l3d-glitch-cyan" aria-hidden="true">
            ABHIGYAN
          </div>
          <div className="l3d-name-glitch l3d-glitch-pink" aria-hidden="true">
            ABHIGYAN
          </div>
          <h1 className="l3d-hero-name">ABHIGYAN</h1>
          <h1 className="l3d-hero-lastname">KUMAR GUPTA</h1>
          {/* Dynamic subtitle under the name */}
          <div className="l3d-hero-tagline">
            <span className="l3d-tagline-bracket">[</span>
            <span className="l3d-tagline-text">FULL STACK DEVELOPER</span>
            <span className="l3d-tagline-sep">•</span>
            <span className="l3d-tagline-text l3d-tagline-alt">ML ENGINEER</span>
            <span className="l3d-tagline-bracket">]</span>
          </div>
        </div>

        {/* Holographic grid floor behind character */}
        <div className="l3d-grid-floor">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="l3d-grid-h" key={`h${i}`} style={{ top: `${(i + 1) * 12}%` }} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="l3d-grid-v" key={`v${i}`} style={{ left: `${(i + 1) * 16.66}%` }} />
          ))}
        </div>

        {/* Bottom info bar */}
        <div className="l3d-bottom-bar">
          <div className="l3d-roles-row">
            <div className="l3d-role-item">
              <span className="l3d-role-num">01</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">FULL STACK</span>
                <strong className="l3d-role-value">Developer</strong>
              </div>
            </div>

            <div className="l3d-divider" />

            <div className="l3d-role-item">
              <span className="l3d-role-num">02</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">MACHINE LEARNING</span>
                <strong className="l3d-role-value l3d-role-value-alt">Engineer</strong>
              </div>
            </div>

            <div className="l3d-divider" />

            <div className="l3d-role-item">
              <span className="l3d-role-num">03</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">FRONTEND</span>
                <strong className="l3d-role-value l3d-role-value-green">Architect</strong>
              </div>
            </div>

            <div className="l3d-divider l3d-divider-hide-mobile" />

            <div className="l3d-role-item l3d-role-hide-mobile">
              <span className="l3d-role-num">04</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">BACKEND</span>
                <strong className="l3d-role-value l3d-role-value-pink">Builder</strong>
              </div>
            </div>
          </div>


        </div>

        {/* Scroll cue - enhanced */}
        <div className="l3d-scroll-cue">
          <div className="l3d-scroll-line" />
          <div className="l3d-scroll-dot" />
          <span>SCROLL</span>
        </div>

        {/* Noise grain overlay */}
        <div className="l3d-noise-overlay" />

        {children}
      </div>
    </>
  );
};

export default Landing;
