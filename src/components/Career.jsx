import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CareerTunnel3D from "./CareerTunnel3D";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: "2023 — 2027",
    title: "B.Tech, Computer Science and Engineering",
    institution: "SRM IST Ghaziabad",
    description:
      "Current CGPA: 8.88/10. Built multiple full-stack and machine learning projects, with strong focus on software engineering, data structures, and practical product development.",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #c2a4ff, #667eea)",
    glow: "rgba(194, 164, 255, 0.25)",
    status: "Current",
  },
  {
    year: "2022",
    title: "Class XII (PCM), CBSE",
    institution: "Kendriya Vidyalaya Kankarbagh No.1",
    description:
      "Completed higher secondary education with 79.3%, strengthening my foundation in mathematics, science, and problem-solving.",
    icon: "📚",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    glow: "rgba(79, 172, 254, 0.25)",
    status: null,
  },
  {
    year: "2020",
    title: "Class X, CBSE",
    institution: "Bradford International School",
    description:
      "Completed secondary education with 78.5% and developed strong interest in technology, computing, and engineering.",
    icon: "🏫",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    glow: "rgba(67, 233, 123, 0.25)",
    status: null,
  },
];

const Career = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title
      gsap.from(".cr-title-char", {
        y: 100,
        rotateX: -90,
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      gsap.from(".cr-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
        },
      });

      // Timeline cards stagger with 3D
      gsap.from(".cr-card", {
        x: -100,
        rotateY: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cr-timeline",
          start: "top 80%",
        },
      });

      // Timeline line grows
      gsap.from(".cr-timeline-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cr-timeline",
          start: "top 80%",
        },
      });

      // Year badges pop
      gsap.from(".cr-year-badge", {
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".cr-timeline",
          start: "top 75%",
        },
      });

      // Floating orbs
      gsap.to(".cr-orb", {
        y: "random(-25, 25)",
        x: "random(-15, 15)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.6 },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // 3D tilt on hover
  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 12}deg) translateY(-6px)`;
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  const titleChars = "CAREER & EXPERIENCE".split("");

  return (
    <div className="cr-section" ref={sectionRef} style={{ position: "relative" }}>
      <CareerTunnel3D />
      {/* Floating orbs */}
      <div className="cr-orb cr-orb-1" />
      <div className="cr-orb cr-orb-2" />

      {/* Title */}
      <div className="cr-title" style={{ perspective: "800px" }}>
        {titleChars.map((char, i) => (
          <span
            className={`cr-title-char ${char === " " ? "cr-space" : ""}`}
            key={i}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      <p className="cr-subtitle">My academic journey so far</p>

      {/* Timeline */}
      <div className="cr-timeline">
        <div className="cr-timeline-line">
          <div className="cr-timeline-glow" />
        </div>

        {experiences.map((exp, i) => (
          <div className="cr-timeline-item" key={i}>
            {/* Year badge on the timeline */}
            <div className="cr-year-badge" style={{ background: exp.gradient }}>
              <span>{exp.year}</span>
            </div>

            {/* Card */}
            <div
              className="cr-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseMove={(e) => handleCardMouseMove(e, i)}
              onMouseLeave={() => handleCardMouseLeave(i)}
              style={{ "--card-glow": exp.glow, "--card-gradient": exp.gradient }}
            >
              <div className="cr-card-shine" />
              <div className="cr-card-border" />

              <div className="cr-card-header">
                <div className="cr-card-icon">{exp.icon}</div>
                <div className="cr-card-meta">
                  <h3 className="cr-card-title">{exp.title}</h3>
                  <span className="cr-card-inst">{exp.institution}</span>
                </div>
                {exp.status && (
                  <span className="cr-card-status">{exp.status}</span>
                )}
              </div>

              <p className="cr-card-desc">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Career;
