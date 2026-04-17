import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: "🚀",
    title: "Full Stack Web Development",
    description:
      "End-to-end web apps with React, Next.js, Node.js, and modern databases. Scalable, performant, production-ready.",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    glow: "rgba(102, 126, 234, 0.4)",
  },
  {
    icon: "⚡",
    title: "REST API & Backend",
    description:
      "Robust RESTful APIs with authentication, rate limiting, and real-time capabilities. Built for scale.",
    tags: ["Express", "Prisma", "Supabase", "JWT"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    glow: "rgba(240, 147, 251, 0.4)",
  },
  {
    icon: "🧠",
    title: "Machine Learning",
    description:
      "Predictive models, classifiers, and data pipelines. From EDA to deployment with interpretable results.",
    tags: ["Python", "Scikit-learn", "SHAP", "Flask"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    glow: "rgba(79, 172, 254, 0.4)",
  },
  {
    icon: "📊",
    title: "Data & Visualization",
    description:
      "Turning raw data into actionable insights with beautiful, interactive dashboards and reports.",
    tags: ["Pandas", "Matplotlib", "Streamlit", "D3.js"],
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    glow: "rgba(67, 233, 123, 0.4)",
  },
];

const WhatIDo = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".whatido-title-char", {
        y: 100,
        rotateX: -90,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Cards stagger in with 3D rotation
      gsap.from(".whatido-card-wrapper", {
        y: 100,
        rotateY: -30,
        rotateX: 10,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".whatido-grid",
          start: "top 80%",
        },
      });

      // Background grid lines
      gsap.from(".whatido-grid-line", {
        scaleX: 0,
        stagger: 0.05,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -15}deg) rotateY(${x * 15}deg) scale(1.05)`;
    // Move the glow
    const shine = card.querySelector(".whatido-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.15), transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    const shine = card.querySelector(".whatido-card-shine");
    if (shine) {
      shine.style.background = "transparent";
    }
  };

  const titleChars = "WHAT I DO".split("");

  return (
    <div className="whatido-section-v2" ref={sectionRef}>
      {/* Perspective grid background */}
      <div className="whatido-perspective-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="whatido-grid-line" key={i} />
        ))}
      </div>

      {/* Section title */}
      <div className="whatido-title">
        {titleChars.map((char, i) => (
          <span
            className={`whatido-title-char ${char === " " ? "whatido-space" : ""}`}
            key={i}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      <p className="whatido-subtitle">
        Turning ideas into production-ready digital experiences
      </p>

      {/* Cards grid */}
      <div className="whatido-grid">
        {services.map((service, index) => (
          <div className="whatido-card-wrapper" key={index}>
            <div
              className={`whatido-card ${flippedIndex === index ? "whatido-card-flipped" : ""}`}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseMove={(e) => handleCardMouseMove(e, index)}
              onMouseLeave={() => handleCardMouseLeave(index)}
              onClick={() =>
                setFlippedIndex(flippedIndex === index ? null : index)
              }
              style={{ "--card-glow": service.glow }}
            >
              <div className="whatido-card-shine" />

              {/* Front face */}
              <div className="whatido-card-front">
                <div
                  className="whatido-card-icon"
                  style={{ background: service.gradient }}
                >
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="whatido-card-tags">
                  {service.tags.map((tag) => (
                    <span className="whatido-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="whatido-card-number">
                  0{index + 1}
                </div>
              </div>

              {/* Animated border */}
              <div className="whatido-card-border" style={{ background: service.gradient }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIDo;
