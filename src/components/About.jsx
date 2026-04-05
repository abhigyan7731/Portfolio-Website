import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "8.88", label: "CGPA", suffix: "/10" },
  { value: "5", label: "Projects", suffix: "+" },
  { value: "98", label: "ML Accuracy", suffix: "%" },
];

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [counters, setCounters] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger in title words
      gsap.from(".about-title-word", {
        y: 120,
        rotateX: -90,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Slide in the glass card
      gsap.from(".about-glass-card", {
        y: 80,
        opacity: 0,
        rotateY: 15,
        scale: 0.9,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      // Animate stats
      gsap.from(".about-stat-item", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-stats-row",
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            if (!hasAnimated.current) {
              hasAnimated.current = true;
              animateCounters();
            }
          },
        },
      });

      // Floating orbs
      gsap.to(".about-orb-1", {
        y: -30,
        x: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".about-orb-2", {
        y: 25,
        x: -15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".about-orb-3", {
        y: -20,
        x: -25,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Paragraph lines
      gsap.from(".about-para-line", {
        x: -40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-glass-card",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });
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
          next[index] = isDecimal
            ? parseFloat(current.toFixed(2))
            : Math.floor(current);
          return next;
        });

        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -20, y: x * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="about-section-v2" id="about" ref={sectionRef}>
      {/* Floating orbs */}
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />
      <div className="about-orb about-orb-3" />

      {/* Section title */}
      <div className="about-title-row">
        <div className="about-title-overflow">
          <span className="about-title-word">ABOUT</span>
        </div>
        <div className="about-title-overflow">
          <span className="about-title-word about-title-accent">ME</span>
        </div>
      </div>

      {/* Glassmorphic main card */}
      <div
        className="about-glass-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="about-card-glow" />
        <div className="about-card-content">
          <div className="about-badge">
            <span className="about-badge-dot" />
            B.Tech CSE — SRM IST Ghaziabad
          </div>
          <p className="about-para-line">
            I build <strong>scalable full-stack web applications</strong> and{" "}
            <strong>machine learning solutions</strong> that solve real problems.
          </p>
          <p className="about-para-line">
            From real-time expense trackers to e-commerce platforms with payment
            workflows and ML classifiers with 98%+ accuracy — I turn complex
            problems into <em>practical products</em>.
          </p>
          <div className="about-tech-chips">
            {[
              "React",
              "Next.js",
              "Node.js",
              "PostgreSQL",
              "Supabase",
              "Python",
              "Scikit-learn",
            ].map((tech) => (
              <span className="about-chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Edge light effect */}
        <div className="about-card-edge-light" />
      </div>

      {/* 3D Stats */}
      <div className="about-stats-row">
        {stats.map((stat, i) => (
          <div className="about-stat-item" key={i}>
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
