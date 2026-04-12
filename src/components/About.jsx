import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "8.88", label: "CGPA", suffix: "/10", icon: "🎓" },
  { value: "5", label: "Projects", suffix: "+", icon: "🚀" },
  { value: "98", label: "ML Accuracy", suffix: "%", icon: "🧠" },
];

const timelineEvents = [
  { year: "2023", title: "Started B.Tech CSE", desc: "SRM IST Ghaziabad", color: "#c2a4ff" },
  { year: "2024", title: "Full Stack Projects", desc: "React, Node.js, Supabase", color: "#4facfe" },
  { year: "2025", title: "ML & Deep Learning", desc: "98%+ Accuracy Models", color: "#43e97b" },
  { year: "2026", title: "Open to Opportunities", desc: "Building the future", color: "#f093fb" },
];

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [counters, setCounters] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title chars fly in from deep 3D
      gsap.from(".about-title-char", {
        z: -500,
        rotateY: 80,
        opacity: 0,
        stagger: 0.04,
        duration: 1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Main card emerges from the void
      gsap.from(".about-glass-card", {
        z: -400,
        rotateX: 25,
        rotateY: -10,
        opacity: 0,
        scale: 0.85,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // Terminal lines type in
      gsap.from(".about-term-line", {
        x: -30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-glass-card",
          start: "top 60%",
        },
      });

      // Timeline items cascade
      gsap.from(".about-timeline-item", {
        x: -80,
        z: -200,
        rotateY: -20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-timeline",
          start: "top 80%",
        },
      });

      // Stats fly in from 3D space
      gsap.from(".about-stat-card", {
        y: 100,
        z: -300,
        rotateX: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-stats-row",
          start: "top 85%",
          onEnter: () => {
            if (!hasAnimated.current) {
              hasAnimated.current = true;
              animateCounters();
            }
          },
        },
      });

      // Floating orbs
      gsap.to(".about-orb-1", { y: -30, x: 20, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".about-orb-2", { y: 25, x: -15, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".about-orb-3", { y: -20, x: -25, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Terminal cursor blink
      gsap.to(".about-cursor", { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const target = parseFloat(stat.value);
      const isDecimal = stat.value.includes(".");
      const duration = 2000;
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        setCounters((prev) => {
          const next = [...prev];
          next[index] = isDecimal ? parseFloat(current.toFixed(2)) : Math.floor(current);
          return next;
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  // 3D card tilt
  const handleCardMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateX: y * -12,
      rotateY: x * 15,
      z: 20,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleCardLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0, z: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const titleChars = "ABOUT ME".split("");

  return (
    <div className="about-section-v2" id="about" ref={sectionRef}>
      {/* Orbs */}
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />
      <div className="about-orb about-orb-3" />

      {/* Ghost text */}
      <div className="about-ghost-text" aria-hidden="true">ABOUT</div>

      {/* Holo grid */}
      <div className="about-holo-grid">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="about-holo-h" key={`h${i}`} style={{ top: `${(i + 1) * 10}%` }} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="about-holo-v" key={`v${i}`} style={{ left: `${(i + 1) * 16.6}%` }} />
        ))}
      </div>

      {/* Title */}
      <div className="about-title-row" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
        {titleChars.map((char, i) => (
          <span
            className={`about-title-char ${char === " " ? "about-space" : ""} ${i >= 6 ? "about-title-accent" : ""}`}
            key={i}
            style={{ transformStyle: "preserve-3d" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      {/* Main 3D Terminal Card */}
      <div
        className="about-glass-card"
        ref={cardRef}
        onMouseMove={handleCardMove}
        onMouseLeave={handleCardLeave}
      >
        {/* macOS-style header */}
        <div className="about-term-bar">
          <div className="about-term-dots">
            <span className="about-dot about-dot-r" />
            <span className="about-dot about-dot-y" />
            <span className="about-dot about-dot-g" />
          </div>
          <span className="about-term-title">abhigyan@portfolio ~ /about</span>
          <div style={{ width: 52 }} />
        </div>

        {/* Terminal body */}
        <div className="about-term-body">
          <div className="about-term-line">
            <span className="about-prompt">$</span>
            <span className="about-cmd">cat profile.md</span>
          </div>

          <div className="about-term-output">
            <div className="about-term-line about-badge-line">
              <span className="about-badge-dot" />
              <span className="about-badge-text">B.Tech CSE — SRM IST Ghaziabad</span>
            </div>
            <p className="about-term-para">
              I build <strong>scalable full-stack web applications</strong> and{" "}
              <strong>machine learning solutions</strong> that solve real problems.
            </p>
            <p className="about-term-para">
              From real-time expense trackers to e-commerce platforms with payment
              workflows and ML classifiers with 98%+ accuracy — I turn complex
              problems into <em>practical products</em>.
            </p>
          </div>

          <div className="about-term-line">
            <span className="about-prompt">$</span>
            <span className="about-cmd">ls skills/</span>
          </div>

          <div className="about-tech-chips">
            {["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Python", "Scikit-learn", "Three.js", "GSAP"].map((tech) => (
              <span className="about-chip" key={tech}>{tech}</span>
            ))}
          </div>

          <div className="about-term-line">
            <span className="about-prompt">$</span>
            <span className="about-cursor">▊</span>
          </div>
        </div>

        {/* Scanline */}
        <div className="about-scanline" />
        {/* Edge light */}
        <div className="about-card-edge-light" />
      </div>

      {/* Journey Timeline */}
      <div className="about-timeline">
        <h3 className="about-timeline-title">My Journey</h3>
        <div className="about-timeline-track">
          {timelineEvents.map((evt, i) => (
            <div className="about-timeline-item" key={i} style={{ "--tl-color": evt.color }}>
              <div className="about-tl-dot" />
              <div className="about-tl-year">{evt.year}</div>
              <div className="about-tl-content">
                <div className="about-tl-title">{evt.title}</div>
                <div className="about-tl-desc">{evt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Stats */}
      <div className="about-stats-row">
        {stats.map((stat, i) => (
          <div className="about-stat-card" key={i}>
            <div className="about-stat-icon">{stat.icon}</div>
            <div className="about-stat-value">
              {counters[i]}
              <span className="about-stat-suffix">{stat.suffix}</span>
            </div>
            <div className="about-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
