import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Expense Tracker",
    category: "Full Stack Web Development",
    tools: "Next.js, React, Supabase, Clerk, Gemini AI, REST APIs",
    image: "/images/next2.webp",
    github: "https://github.com/abhigyan7731/ai-splitwise-clone",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#667eea",
    accentRgb: "102, 126, 234",
  },
  {
    title: "E-Commerce Website",
    category: "Full Stack Web Development",
    tools: "React, Next.js, Node.js, REST APIs, PostgreSQL, Prisma, JavaScript",
    image: "/images/react2.webp",
    github: "https://github.com/abhigyan7731/E-commerce-website",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    accent: "#f093fb",
    accentRgb: "240, 147, 251",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    tools: "React, Node.js, Three.js, GSAP, HTML, CSS",
    image: "/images/placeholder.webp",
    github: "https://github.com/abhigyan7731/Portfolio-Website",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    accent: "#4facfe",
    accentRgb: "79, 172, 254",
  },
  {
    title: "Predictive CKD Classifier",
    category: "Machine Learning",
    tools: "Python, Scikit-learn, SHAP, LIME, Flask, Streamlit",
    image: "/images/typescript.webp",
    github:
      "https://github.com/abhigyan7731/CKD-Stage-Prediction-and-Treatment-AI-Based",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    accent: "#43e97b",
    accentRgb: "67, 233, 123",
  },
];

const Work = () => {
  const cardsRef = useRef([]);
  const flexRef = useRef(null);

  useEffect(() => {
    // Mobile view fallback
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      gsap.from(".work-title-word", {
        y: 60, opacity: 0, stagger: 0.15, duration: 0.8,
        ease: "power3.out", scrollTrigger: { trigger: ".work-section", start: "top 80%" },
      });
      gsap.from(".work-box", {
        y: 60, opacity: 0, stagger: 0.15, duration: 0.8,
        ease: "power3.out", scrollTrigger: { trigger: ".work-flex", start: "top 85%" },
      });
      return;
    }

    // 3D Z-Axis Deep Dive Initialization
    const zOffset = 3000; 
    const zs = cardsRef.current.map((_, i) => i * -zOffset);

    // Initial setup of 3D stacked cards
    cardsRef.current.forEach((card, index) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        z: zs[index],
        opacity: 0,
      });
      // Pre-add active-3d to all of them so they look good, opacity will handle visibility
      card.classList.add("active-3d"); 
    });

    const startZ = -2500; // Start far back so the camera flies TOWARDS the first card
    const endZ = (projects.length - 1) * zOffset + 2000; // End flying far past the last card
    const totalZTravel = endZ - startZ;
    
    gsap.set(flexRef.current, { z: startZ });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${projects.length * 1000}`, 
        scrub: 0.5, 
        pin: true,
        id: "work-z",
      },
    });

    // 1. Physically drag the entire container forward through the 3D void
    timeline.to(flexRef.current, {
      z: endZ,
      ease: "none",
      duration: 1
    }, 0);

    // 2. Mathematically map opacity to spatial Z coordinates
    cardsRef.current.forEach((card, index) => {
      const peakZ = index * zOffset; // Container Z position where card is perfectly centered
      const fadeStartZ = peakZ - 2500; // Container Z position when card starts fading in
      const fadeOutZ = peakZ + 1000; // Container Z position when card finishes fading out behind camera
      
      const fadeInRatio = (fadeStartZ - startZ) / totalZTravel;
      const peakRatio = (peakZ - startZ) / totalZTravel;
      const fadeOutRatio = (fadeOutZ - startZ) / totalZTravel;

      // Fade In
      timeline.to(card, {
        opacity: 1,
        ease: "power2.out",
        duration: peakRatio - Math.max(0, fadeInRatio)
      }, Math.max(0, fadeInRatio));

      // Fade Out (Flies past)
      timeline.to(card, {
        opacity: 0,
        ease: "power2.in",
        duration: fadeOutRatio - peakRatio
      }, peakRatio);
    });

    // Title entrance
    gsap.from(".work-title-word", {
      y: 100, rotateX: -90, opacity: 0, stagger: 0.15, duration: 1, ease: "back.out(1.7)",
      scrollTrigger: { trigger: ".work-section", start: "top 80%" },
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work-z")?.kill();
    };
  }, []);

  const handleCardMouseMove = (e, index) => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) return;
    const card = cardsRef.current[index];
    if (!card || !card.classList.contains("active-3d")) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Use GSAP so it interpolates nicely alongside the timeline transforms
    gsap.to(card, {
      rotateX: y * -15,
      rotateY: x * 15,
      duration: 0.5,
      ease: "power2.out"
    });

    const shine = card.querySelector(".work-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.15), transparent 60%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) return;
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out"
    });

    const shine = card.querySelector(".work-card-shine");
    if (shine) {
      shine.style.background = "transparent";
    }
  };

  return (
    <div className="work-section" id="work">
      {/* Hyper-speed tunnel grid background */}
      <div className="work-tunnel-grid" />
      
      <div className="work-container section-container">
        <h2 className="work-section-title">
          <span className="work-title-overflow">
            <span className="work-title-word">My</span>
          </span>{" "}
          <span className="work-title-overflow">
            <span className="work-title-word work-title-accent">Work</span>
          </span>
        </h2>
        
        {/* 3D Depth Viewport */}
        <div className="work-3d-viewport">
          <div className="work-flex" ref={flexRef}>
            {projects.map((project, index) => (
              <div
                className="work-box"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.github, "_blank");
                }}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                style={{
                  cursor: "pointer",
                  "--card-accent": project.accent,
                  "--card-accent-rgb": project.accentRgb,
                  "--card-gradient": project.gradient,
                }}
              >
                <div className="work-card-shine" />

                {/* Animated holographic rays */}
                <div className="work-card-top-border" />
                <div className="work-card-bottom-border" />

                <div className="work-info">
                  <div className="work-title">
                    <h3 className="work-number">0{index + 1}</h3>
                    <div>
                      <h4 className="work-project-name">{project.title}</h4>
                      <p className="work-category">{project.category}</p>
                    </div>
                  </div>
                  <h4>Tools & Features</h4>
                  <div className="work-tools-chips">
                    {project.tools.split(", ").map((tool) => (
                      <span className="work-tool-chip" key={tool}>{tool}</span>
                    ))}
                  </div>
                  <p className="work-repo-cta">
                    <span className="work-cta-arrow">→</span> View Repository
                  </p>
                </div>
                <div className="work-image-wrapper">
                  <WorkImage image={project.image} alt={project.title} />
                  <div className="work-image-overlay" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
