import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const quotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
];

const QuoteSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    // Select randomized quote on refresh/mount
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const ctx = gsap.context(() => {
      gsap.from(".quote-content", {
        opacity: 0,
        y: 80,
        rotateX: -20,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".quote-section",
          start: "top 85%",
        },
      });

      gsap.from(".quote-author", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".quote-section",
          start: "top 85%",
        },
      });
      // Infinite float effect applied to the container, not the tilting card
      gsap.to(".quote-glass-wrapper", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || typeof window !== "undefined" && window.innerWidth <= 900) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // True physical 3D tilt tracking user's mouse
    gsap.to(cardRef.current, {
      rotateX: -y * 25,
      rotateY: x * 35,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <div className="quote-section" ref={sectionRef}>
      <div className="quote-glass-wrapper">
        <div 
          className="quote-glass-card" 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Holographic glowing scanline */}
          <div className="quote-hologram-sweep" />
          
          <h2 className="quote-content">
            <span className="quote-mark">“</span>
            {quote.text}
            <span className="quote-mark">”</span>
          </h2>
          <p className="quote-author">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteSection;
