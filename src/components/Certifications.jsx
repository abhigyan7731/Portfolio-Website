import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle University",
    date: "March 2026",
    id: "103435083OCI25AICFA",
    desc: "Validates proficiency in AI/ML concepts, cloud computing principles, and Oracle Cloud Infrastructure.",
    color: "#f80000",
    shadow: "rgba(248, 0, 0, 0.4)",
  },
  {
    title: "Introduction to Front-End Development",
    issuer: "Meta (Coursera)",
    date: "March 2025",
    id: "6IQHRSJ2QCI7",
    desc: "Validates command over HTML, CSS, React, and responsive UI development.",
    color: "#0668E1",
    shadow: "rgba(6, 104, 225, 0.4)",
  },
  {
    title: "Introduction to the Internet of Things and Embedded Systems",
    issuer: "UCI (Coursera)",
    date: "March 2025",
    id: "H81SD3F7FTAS",
    desc: "Validates knowledge of IoT architecture and embedded systems.",
    color: "#FFD200",
    shadow: "rgba(255, 210, 0, 0.4)",
  },
  {
    title: "What is Data Science?",
    issuer: "IBM (Coursera)",
    date: "Feb 2025",
    id: "FB8SW74RKHFG",
    desc: "Validates foundational knowledge of Data Science concepts, methodologies, and real-world applications.",
    color: "#0F62FE",
    shadow: "rgba(15, 98, 254, 0.4)",
  }
];

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cert-holo-console", {
        z: -600,
        rotateX: 25,
        rotateY: -10,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  const changeCert = (dir) => {
    // Glitch animation out
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      rotateX: dir * 15,
      filter: "blur(10px)",
      duration: 0.3,
      onComplete: () => {
        setCurrentIndex((prev) => {
          let next = prev + dir;
          if (next < 0) next = certifications.length - 1;
          if (next >= certifications.length) next = 0;
          return next;
        });
        
        // Setup before coming back
        gsap.set(cardRef.current, {
          rotateX: dir * -15,
        });

        // Glitch in
        gsap.to(cardRef.current, {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "back.out(1.5)"
        });
      }
    });
  };

  const activeCert = certifications[currentIndex];

  return (
    <div className="cert-section" ref={sectionRef} id="certifications">
      <div className="cert-title-container">
        <div className="cert-pulse-dot" />
        <h2 className="cert-title">CERTIFICATION ARCHIVE</h2>
      </div>

      <div className="cert-holo-console">
        {/* Decorative Grid Lines */}
        <div className="cert-grid-bg" />

        {/* Certificate Card Content */}
        <div 
          className="cert-card" 
          ref={cardRef} 
          style={{ "--cert-color": activeCert.color, "--cert-shadow": activeCert.shadow }}
        >
          {/* Neon Top Bar */}
          <div className="cert-top-bar" />
          
          <div className="cert-card-header">
            <span className="cert-issuer">{activeCert.issuer}</span>
            <span className="cert-date">{activeCert.date}</span>
          </div>

          <h3 className="cert-name">{activeCert.title}</h3>
          
          <div className="cert-id-tag">
            <span>CREDENTIAL ID:</span> {activeCert.id}
          </div>

          <p className="cert-desc">{activeCert.desc}</p>
          
          <div className="cert-badge-glow" />
        </div>

        {/* Console Controls */}
        <div className="cert-controls">
          <button className="cert-control-btn" onClick={() => changeCert(-1)}>
            <span className="cert-arrow">&lt;</span> PREV RECORD
          </button>
          
          <div className="cert-indicators">
            {certifications.map((_, idx) => (
              <div 
                key={idx} 
                className={`cert-indicator-dot ${idx === currentIndex ? 'active' : ''}`} 
                style={{ backgroundColor: idx === currentIndex ? activeCert.color : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>

          <button className="cert-control-btn" onClick={() => changeCert(1)}>
            NEXT RECORD <span className="cert-arrow">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
