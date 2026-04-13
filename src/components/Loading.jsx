import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// Sub-system counters that animate alongside main percentage
const subSystems = [
  { label: 'ASSETS', total: 24, color: '#00f2fe' },
  { label: 'MODULES', total: 12, color: '#c2a4ff' },
  { label: 'SHADERS', total: 8, color: '#43e97b' },
  { label: 'TEXTURES', total: 16, color: '#f093fb' },
];

const RING_RADIUS = 72;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Generate data streams deterministically (seeded) to avoid SSR hydration mismatch
const generateDataStreams = () =>
  Array.from({ length: 8 }).map((_, i) => ({
    left: `${5 + i * 13}%`,
    duration: `${10 + i * 1.5}s`,
    delay: `${-i * 1.2}s`,
    chars: Array.from({ length: 30 }).map((_, j) =>
      (i * 30 + j) % 3 === 0 ? '1' : '0'
    ),
    opacities: Array.from({ length: 30 }).map((_, j) =>
      0.04 + ((i * 30 + j) % 7) * 0.02
    ),
  }));

const dataStreams = generateDataStreams();

// ===== SCRAMBLE TEXT COMPONENT =====
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/";
const TARGET_TEXT = "ABHIGYAN";

const ScrambleText = ({ started }) => {
  const [chars, setChars] = useState(() => 
    TARGET_TEXT.split("").map((c, i) => String.fromCharCode(65 + i))
  );
  const [revealed, setRevealed] = useState(() => new Array(TARGET_TEXT.length).fill(false));
  const intervalRef = useRef(null);
  const revealedCount = useRef(0);

  useEffect(() => {
    if (!started) return;

    // Start the scramble animation
    intervalRef.current = setInterval(() => {
      setChars(prev => prev.map((c, i) => {
        if (revealed[i]) return TARGET_TEXT[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }));
    }, 50);

    // Progressively reveal characters
    const revealTimers = TARGET_TEXT.split("").map((_, i) => {
      return setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        revealedCount.current++;
        if (revealedCount.current >= TARGET_TEXT.length) {
          clearInterval(intervalRef.current);
        }
      }, 400 + i * 250 + Math.random() * 100);
    });

    return () => {
      clearInterval(intervalRef.current);
      revealTimers.forEach(t => clearTimeout(t));
    };
  }, [started]);

  return (
    <div className="ld-scramble-text">
      {chars.map((char, i) => (
        <span
          key={i}
          className={`ld-scramble-char ${revealed[i] ? "ld-char-revealed" : "ld-char-scrambling"}`}
        >
          {revealed[i] ? TARGET_TEXT[i] : char}
        </span>
      ))}
    </div>
  );
};

// ===== TERMINAL LOG LINES =====
const terminalLines = [
  { text: "> Initializing portfolio engine...", delay: 200 },
  { text: "> Loading 3D assets & shaders", delay: 600 },
  { text: "> Compiling visual pipeline", delay: 1100 },
  { text: "> Decrypting identity...", delay: 1600 },
  { text: "> READY", delay: 2800, accent: true },
];

const Loading = ({ percent, setIsLoading }) => {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [scrambleStarted, setScrambleStarted] = useState(false);
  const [visibleLines, setVisibleLines] = useState([]);
  const screenRef = useRef(null);
  const wrapRef = useRef(null);
  const pillRef = useRef(null);
  const canvasRef = useRef(null);

  // Track mouse for the glow hover effect on pill
  const handleMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // Start scramble shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => setScrambleStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Terminal lines appear staggered
  useEffect(() => {
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // When percent hits 100, mark as loaded
  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
    }
  }, [percent, loaded]);

  // When loaded, auto-dismiss with cinematic exit
  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      setClicked(true);

      // Fade out the entire screen with slight zoom
      if (screenRef.current) {
        gsap.to(screenRef.current, {
          opacity: 0,
          scale: 1.08,
          duration: 0.8,
          ease: "power3.in",
        });
      }

      // After transition, fire initialFX and unmount
      setTimeout(() => {
        import("./utils/initialFX").then((module) => {
          if (module.initialFX) module.initialFX();
          if (setIsLoading) setIsLoading(false);
        });
      }, 600);
    }, 500);

    return () => clearTimeout(timer);
  }, [loaded, setIsLoading]);

  // Orbiting particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const W = 300, H = 300;
    canvas.width = W;
    canvas.height = H;

    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        angle: (Math.PI * 2 / count) * i + Math.random() * 0.5,
        radius: 78 + Math.random() * 35,
        speed: 0.002 + Math.random() * 0.006,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '0, 242, 254' : '194, 164, 255',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;

      for (const p of particles) {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        // Particle dot
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        // Trailing line
        const tx = cx + Math.cos(p.angle - 0.2) * p.radius;
        const ty = cy + Math.sin(p.angle - 0.2) * p.radius;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(${p.color}, ${p.opacity * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Grid floor fades in
      tl.from(".ld-grid-floor", { opacity: 0, duration: 1.2, ease: "power2.out" });

      // Hexagon spins in
      tl.from(".ld-hexagon-frame", {
        scale: 0,
        opacity: 0,
        rotation: -180,
        duration: 1,
        ease: "back.out(1.5)",
      }, "-=0.8");

      // Scramble text fades in
      tl.from(".ld-scramble-text", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5");

      // Counter ring scales in
      tl.from(".ld-ring-container", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)",
      }, "-=0.3");

      // Canvas particles fade in
      tl.from(".ld-orbit-canvas", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.6");

      // Pill bar slides up
      tl.from(".loading-pill-wrap", {
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.3");

      // Terminal lines
      tl.from(".ld-terminal-container", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2");

      // Sub-system counters stagger in
      tl.from(".ld-sub-stat", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2");

      // Subtitle
      tl.from(".ld-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2");

      // Data streams fade in
      tl.from(".ld-data-stream", {
        opacity: 0,
        stagger: 0.06,
        duration: 0.4,
      }, "-=0.8");

      // ===== CONTINUOUS ANIMATIONS =====

      // Hexagon slow rotation
      gsap.to(".ld-hexagon-frame", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      // Scan line sweep
      gsap.to(".ld-scanline", {
        top: "100%",
        duration: 4,
        repeat: -1,
        ease: "none",
      });

      // Scramble text subtle 3D float
      gsap.to(".ld-scramble-text", {
        rotateX: 3,
        y: -4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, screen);

    return () => ctx.revert();
  }, []);

  const displayPercent = Math.min(percent, 100);
  const getSubValue = (total) => Math.floor((displayPercent / 100) * total);
  const ringOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * displayPercent / 100);

  return (
    <div className="loading-pill-screen" ref={screenRef}>
      {/* 3D Perspective Grid Floor */}
      <div className="ld-grid-floor">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="ld-grid-h" key={`h${i}`} style={{ top: `${(i + 1) * 10}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="ld-grid-v" key={`v${i}`} style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Holographic Scan Line */}
      <div className="ld-scanline" />

      {/* CRT Noise Overlay */}
      <div className="ld-noise-overlay" />

      {/* Binary Data Streams (Matrix-style falling) */}
      <div className="ld-data-streams">
        {dataStreams.map((stream, i) => (
          <div
            className="ld-data-stream"
            key={i}
            style={{
              left: stream.left,
              animationDuration: stream.duration,
              animationDelay: stream.delay,
            }}
          >
            {stream.chars.map((char, j) => (
              <span key={j} style={{ opacity: stream.opacities[j] }}>{char}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Ambient background orbs */}
      <div className="pill-bg-orb pill-bg-orb-1" />
      <div className="pill-bg-orb pill-bg-orb-2" />
      <div className="pill-bg-orb pill-bg-orb-3" />

      {/* Scramble decode area — replaces old WELCOME */}
      <div className="ld-welcome-area">
        <svg className="ld-hexagon-frame" viewBox="0 0 200 200" fill="none">
          <polygon
            points="100,10 178,55 178,145 100,190 22,145 22,55"
            stroke="rgba(0,242,254,0.12)"
            strokeWidth="1"
          />
          <polygon
            points="100,30 160,62 160,138 100,170 40,138 40,62"
            stroke="rgba(194,164,255,0.08)"
            strokeWidth="0.8"
          />
          <polygon
            points="100,50 142,70 142,130 100,150 58,130 58,70"
            stroke="rgba(0,242,254,0.05)"
            strokeWidth="0.5"
          />
          <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,242,254,0.04)" strokeWidth="0.5" />
          <line x1="22" y1="55" x2="178" y2="145" stroke="rgba(194,164,255,0.03)" strokeWidth="0.5" />
          <line x1="178" y1="55" x2="22" y2="145" stroke="rgba(0,242,254,0.03)" strokeWidth="0.5" />
        </svg>

        <div className="ld-scramble-area" style={{ opacity: clicked ? 0 : 1 }}>
          <div className="ld-scramble-label">IDENTIFYING</div>
          <ScrambleText started={scrambleStarted} />
          <div className="ld-scramble-underline" />
        </div>
      </div>

      {/* Terminal Log */}
      <div className="ld-terminal-container" style={{ opacity: clicked ? 0 : 1 }}>
        {terminalLines.map((line, i) => (
          <div
            className={`ld-terminal-line ${visibleLines.includes(i) ? "ld-terminal-visible" : ""} ${line.accent ? "ld-terminal-accent" : ""}`}
            key={i}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Main Counter Area — Holographic Ring + Orbiting Particles */}
      <div className="ld-counter-area" style={{ opacity: clicked ? 0 : 1 }}>
        <canvas className="ld-orbit-canvas" ref={canvasRef} />

        <div className="ld-ring-container">
          <svg className="ld-ring-svg" viewBox="0 0 160 160">
            {/* Background ring track */}
            <circle
              cx="80" cy="80" r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="3"
            />
            {/* Animated fill ring */}
            <circle
              className="ld-ring-fill"
              cx="80" cy="80" r={RING_RADIUS}
              fill="none"
              stroke="url(#ldRingGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
            />
            {/* Gradient for the ring stroke */}
            <defs>
              <linearGradient id="ldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="50%" stopColor="#c2a4ff" />
                <stop offset="100%" stopColor="#f093fb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Big percentage in center of ring */}
          <div className="ld-ring-percent">
            <span className="ld-percent-digits">{displayPercent}</span>
            <span className="ld-percent-symbol">%</span>
          </div>
        </div>
      </div>

      {/* The Progress Pill Bar */}
      <div
        className={`loading-pill-wrap ${loaded ? "pill-complete" : ""} ${clicked ? "pill-clicked" : ""}`}
        ref={wrapRef}
        onMouseMove={handleMouseMove}
      >
        <div className="pill-hover-glow" />
        <div className="loading-pill" ref={pillRef}>
          <div className="pill-progress-fill" style={{ width: `${displayPercent}%` }} />
          <div className="pill-content">
            <span className="pill-label">INITIALIZING</span>
            <span className="pill-percent">{displayPercent}%</span>
            <div className="pill-cursor-blink" />
          </div>
        </div>
      </div>

      {/* Sub-system Stats Counter Row */}
      <div className="ld-sub-stats-row" style={{ opacity: clicked ? 0 : 1 }}>
        {subSystems.map((sys, i) => (
          <div className="ld-sub-stat" key={i}>
            <span className="ld-sub-stat-label">{sys.label}</span>
            <span
              className="ld-sub-stat-value"
              style={{
                color: sys.color,
                textShadow: `0 0 8px ${sys.color}40`,
              }}
            >
              {String(getSubValue(sys.total)).padStart(2, '0')}
              <span className="ld-sub-stat-total">/{sys.total}</span>
            </span>
            <div className="ld-sub-stat-bar">
              <div
                className="ld-sub-stat-bar-fill"
                style={{
                  width: `${displayPercent}%`,
                  background: `linear-gradient(90deg, ${sys.color}, transparent)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Subtitle */}
      <div className="ld-subtitle" style={{ opacity: clicked ? 0 : 1 }}>
        PORTFOLIO • 2026
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading) => {
  let percent = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 8) + 2; // faster jumps
      percent = Math.min(percent + rand, 100);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(percent + Math.round(Math.random() * 3) + 1, 100);
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 200);
    }
  }, 60);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent += 2; // double tick speed
          percent = Math.min(percent, 100);
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
