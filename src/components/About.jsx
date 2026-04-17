import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  { year: "2023", title: "Started B.Tech CSE", desc: "SRM IST Ghaziabad", color: "#c2a4ff" },
  { year: "2024", title: "Full Stack Projects", desc: "React, Node.js, Supabase", color: "#4facfe" },
  { year: "2025", title: "ML & Deep Learning", desc: "98%+ Accuracy Models", color: "#43e97b" },
  { year: "2026", title: "Open to Opportunities", desc: "Building the future", color: "#f093fb" },
];

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

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
      gsap.from(".about-cyber-card", {
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

      // HUD rows slide in sequentially
      gsap.from(".cyber-reveal-item", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-cyber-card",
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

      // Floating orbs
      gsap.to(".about-orb-1", { y: -30, x: 20, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".about-orb-2", { y: 25, x: -15, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".about-orb-3", { y: -20, x: -25, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

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

      {/* Cybernetic Profile ID HUD */}
      <div
        className="about-cyber-card"
        ref={cardRef}
        onMouseMove={handleCardMove}
        onMouseLeave={handleCardLeave}
      >
        <div className="cyber-corner-top-left"></div>
        <div className="cyber-corner-bottom-right"></div>
        <div className="cyber-border-accent"></div>

        {/* HUD Header */}
        <div className="cyber-header">
          <div className="cyber-status-pulse">
            <span className="cyber-dot"></span>
            ACTIVE
          </div>
          <span className="cyber-clearance">[ CLEARANCE: LEVEL 09 ]</span>
          <span className="cyber-id">ID: ag8998</span>
        </div>

        {/* HUD Body */}
        <div className="cyber-body">
          <div className="cyber-profile-grid">
            <div className="cyber-avatar-box cyber-reveal-item">
              <div className="cyber-avatar-glitch">AG</div>
            </div>
            
            <div className="cyber-specs">
              <div className="cyber-spec-row cyber-reveal-item">
                <span className="cyber-spec-label">ROLE</span>
                <span className="cyber-spec-value">Full-Stack Engineer</span>
              </div>
              <div className="cyber-spec-row cyber-reveal-item">
                <span className="cyber-spec-label">FOCUS</span>
                <span className="cyber-spec-value highlight">Machine Learning</span>
              </div>
              <div className="cyber-spec-row cyber-reveal-item">
                <span className="cyber-spec-label">SECTOR</span>
                <span className="cyber-spec-value">SRM IST Ghaziabad</span>
              </div>
              <div className="cyber-spec-row cyber-reveal-item">
                <span className="cyber-spec-label">BASE</span>
                <span className="cyber-spec-value">Patna // Bihar</span>
              </div>
            </div>
          </div>

          <div className="cyber-divider cyber-reveal-item"></div>

          <div className="cyber-desc cyber-reveal-item">
            <p>
              I am a Computer Science student at <strong>SRM IST-Ghaziabad</strong> with a passion for building <strong>scalable full-stack applications</strong> and high-impact <strong>machine learning models</strong>. With proficiency across the Next.js and Supabase stack, I’ve developed real-world solutions like a multi-user expense tracker and a full-featured e-commerce platform.
            </p>
            <p>
              Beyond development, I am deeply interested in <span>AI-driven healthcare</span>, specifically in using ML for early disease detection. My project on Chronic Kidney Disease (CKD) prediction achieved over <span>98% accuracy</span> and utilized XAI tools like <strong>SHAP and LIME</strong> to ensure model transparency. I thrive at the intersection of clean code and data-driven insights, always looking for ways to bridge the gap between complex algorithms and user-centric design.
            </p>
          </div>

          <div className="cyber-divider cyber-reveal-item"></div>

          <div className="cyber-skills-header cyber-reveal-item">/// ACTIVE_SUBSYSTEMS_ENGAGED</div>
          
          <div className="cyber-skills-grid cyber-reveal-item">
            {["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Python", "Scikit", "Three.js", "GSAP"].map((tech) => (
              <span className="cyber-skill-node" key={tech}>
                <span className="cyber-tech-dot"></span>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Holographic Scanline */}
        <div className="cyber-scanline"></div>
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

    </div>
  );
};

export default About;
