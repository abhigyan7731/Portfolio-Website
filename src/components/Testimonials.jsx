import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Working with Abhigyan was a game-changer. He completely overhauled our backend infrastructure, ensuring we could handle scaling without any downtime. His ability to fuse ML models directly into production Node.js servers is extremely rare.",
    author: "Elena Rodriguez",
    role: "CTO, Finova Tech"
  },
  {
    quote: "I've never seen an engineer code with such pixel-perfect precision on the frontend while simultaneously optimizing complex SQL queries under the hood. Absolutely stellar full-stack delivery on our e-commerce platform.",
    author: "Marcus Chen",
    role: "Lead Architect, Nexus Retail"
  },
  {
    quote: "His predictive CKD classifier was not just numerically accurate—it was beautifully presented through a scalable Streamlit UI that stakeholders could actually understand. A true 10x developer.",
    author: "Dr. Sarah Jenkins",
    role: "Data Science Director, MedAI"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const wavesRef = useRef([]);

  // Audio wave visualizer math
  useEffect(() => {
    let animId;
    const animateWaves = () => {
      wavesRef.current.forEach((bar, i) => {
        if (!bar) return;
        // Mock audio frequencies using time and index
        const h = 10 + Math.abs(Math.sin(Date.now() / 200 + i) * 40) + Math.random() * 10;
        bar.style.height = `${h}px`;
      });
      animId = requestAnimationFrame(animateWaves);
    };
    animateWaves();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tm-comms-terminal", {
        z: -500,
        rotateX: 20,
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

  const changeTestimonial = (dir) => {
    // Glitch out
    gsap.to(textRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(5px)",
      duration: 0.3,
      onComplete: () => {
        setCurrentIndex((prev) => {
          let next = prev + dir;
          if (next < 0) next = testimonials.length - 1;
          if (next >= testimonials.length) next = 0;
          return next;
        });
        
        // Glitch in
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "back.out(1.5)"
        });
      }
    });
  };

  return (
    <div className="tm-section" ref={sectionRef} style={{ perspective: "1500px" }}>
      <div className="tm-title">
        <div className="tm-blip" />
        INCOMING TRANSMISSIONS
      </div>

      <div className="tm-comms-terminal" style={{ transformStyle: "preserve-3d" }}>
        <div className="tm-static-overlay" />
        
        {/* Mock Audio Visualizer */}
        <div className="tm-audio-wave">
          {Array.from({ length: 30 }).map((_, i) => (
            <div className="tm-bar" key={i} ref={el => wavesRef.current[i] = el} />
          ))}
        </div>

        {/* Content */}
        <div className="tm-content" ref={textRef}>
          <div className="tm-quote">"{testimonials[currentIndex].quote}"</div>
          <div className="tm-author">{testimonials[currentIndex].author}</div>
          <div className="tm-role">{'<'} {testimonials[currentIndex].role} {'>'}</div>
        </div>

        {/* Controls */}
        <div className="tm-controls">
          <button className="tm-control-btn" onClick={() => changeTestimonial(-1)}>&lt; PREV CHANNEL</button>
          <button className="tm-control-btn" onClick={() => changeTestimonial(1)}>NEXT CHANNEL &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
