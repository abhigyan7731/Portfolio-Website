import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data = {
  fs: {
    color: "#4facfe",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "Node.js / Express", level: 90 },
      { name: "PostgreSQL / Supabase", level: 85 },
      { name: "Three.js / GSAP", level: 80 },
    ],
    chips: ["Prisma", "TailwindCSS", "REST APIs", "Clerk Auth", "Vite", "Zustand"]
  },
  ml: {
    color: "#43e97b",
    skills: [
      { name: "Python", level: 95 },
      { name: "Scikit-learn", level: 90 },
      { name: "TensorFlow / PyTorch", level: 80 },
      { name: "Pandas / NumPy", level: 92 },
    ],
    chips: ["SHAP", "LIME", "Flask", "Streamlit", "XGBoost", "Data Analysis"]
  }
};

const SkillMatrix = () => {
  const [mode, setMode] = useState("fs");
  const sectionRef = useRef(null);
  const barsRef = useRef([]);

  const currentData = data[mode];

  useEffect(() => {
    // Initial entrance anim
    const ctx = gsap.context(() => {
      gsap.from(".sm-header", { y: -50, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
      gsap.from(".sm-panel", { y: 100, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".sm-dashboard", start: "top 75%" } });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // Animate bars when mode changes
  useEffect(() => {
    barsRef.current.forEach((bar, idx) => {
      if (!bar) return;
      // Reset width first
      gsap.killTweensOf(bar);
      gsap.set(bar, { width: 0 });
      gsap.to(bar, {
        width: `${currentData.skills[idx].level}%`,
        duration: 1.5,
        ease: "power3.out",
        delay: idx * 0.1
      });
    });
    
    // Animate chips
    gsap.fromTo(".sm-tech-chip", 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)" }
    );
  }, [mode, currentData]);

  return (
    <div className="sm-section" ref={sectionRef} style={{ "--theme-color": currentData.color }}>
      <div className="sm-bg-grid" />
      <div className="sm-flare" />
      
      <div className="sm-header">
        <h2 className="sm-title">Skill Matrix</h2>
        <div className="sm-subtitle">Select operational core</div>
      </div>

      <div className="sm-controls">
        <button 
          className={`sm-btn fs ${mode === "fs" ? "active" : ""}`}
          onClick={() => setMode("fs")}
        >
          Full Stack Core
        </button>
        <button 
          className={`sm-btn ml ${mode === "ml" ? "active" : ""}`}
          onClick={() => setMode("ml")}
        >
          Machine Learning Core
        </button>
      </div>

      <div className="sm-dashboard">
        {/* Core Proficiency Panel */}
        <div className="sm-panel">
          <h3 style={{ marginTop: 0, fontSize: "1.2rem", letterSpacing: "1px", textTransform: "uppercase" }}>Core Proficiency</h3>
          <div style={{ marginTop: "30px" }}>
            {currentData.skills.map((skill, idx) => (
              <div className="sm-stat-row" key={`${mode}-${skill.name}`}>
                <div className="sm-stat-header">
                  <span className="sm-stat-name">{skill.name}</span>
                  <span className="sm-stat-val">{skill.level}%</span>
                </div>
                <div className="sm-bar-bg">
                  <div className="sm-bar-fill" ref={el => barsRef.current[idx] = el} style={{ backgroundColor: currentData.color, boxShadow: `0 0 10px ${currentData.color}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extended Toolkit Panel */}
        <div className="sm-panel">
          <h3 style={{ marginTop: 0, fontSize: "1.2rem", letterSpacing: "1px", textTransform: "uppercase" }}>Extended Toolkit</h3>
          <div className="sm-tech-grid" style={{ marginTop: "30px" }}>
            {currentData.chips.map((chip) => (
              <span className="sm-tech-chip" key={`${mode}-${chip}`} style={{ borderColor: `${currentData.color}40`, color: "white" }}>
                {chip}
              </span>
            ))}
          </div>
          
          <div style={{ marginTop: "50px", padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", borderLeft: `4px solid ${currentData.color}` }}>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", lineHeight: "1.6" }}>
              {mode === "fs" 
                ? "Specialized in building end-to-end architectures, robust APIs, and interactive highly-performant frontend interfaces (WebGL & DOM)."
                : "Focused on deploying predictive algorithms, improving model generalizability, and utilizing XAI (Explainable AI) frameworks."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
