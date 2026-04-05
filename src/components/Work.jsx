import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

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
  },
  {
    title: "E-Commerce Website",
    category: "Full Stack Web Development",
    tools: "React, Next.js, Node.js, PostgreSQL, Prisma, JavaScript",
    image: "/images/react2.webp",
    github: "https://github.com/abhigyan7731/E-commerce-website",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    accent: "#f093fb",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    tools: "React, Next.js, Three.js, GSAP, CSS",
    image: "/images/placeholder.webp",
    github: "https://github.com/abhigyan7731/Portfolio-Website",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    accent: "#4facfe",
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
  },
];

const Work = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    let translateX = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box.length) return;
      const rectLeft = document
        .querySelector(".work-container")
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement.getBoundingClientRect().width;
      let padding = parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX =
        rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Animate title
    gsap.from(".work-title-word", {
      y: 100,
      rotateX: -90,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".work-section",
        start: "top 80%",
      },
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(1000px) rotateX(${y * -12}deg) rotateY(${x * 12}deg)`;

    const shine = card.querySelector(".work-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    const shine = card.querySelector(".work-card-shine");
    if (shine) {
      shine.style.background = "transparent";
    }
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          <span className="work-title-overflow">
            <span className="work-title-word">My</span>
          </span>{" "}
          <span className="work-title-overflow">
            <span className="work-title-word work-title-accent">Work</span>
          </span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <a
              className="work-box"
              key={index}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} GitHub repository`}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseMove={(e) => handleCardMouseMove(e, index)}
              onMouseLeave={() => handleCardMouseLeave(index)}
              style={{
                "--card-accent": project.accent,
                "--card-gradient": project.gradient,
              }}
            >
              <div className="work-card-shine" />

              {/* Animated gradient top border */}
              <div className="work-card-top-border" />

              <div className="work-info">
                <div className="work-title">
                  <h3 className="work-number">0{index + 1}</h3>
                  <div>
                    <h4 className="work-project-name">{project.title}</h4>
                    <p className="work-category">{project.category}</p>
                  </div>
                </div>
                <h4>Tools and Features</h4>
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
