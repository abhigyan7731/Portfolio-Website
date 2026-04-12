import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QuoteSection = () => {
  const quoteRef = useRef(null);

  useEffect(() => {
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
      
      // Infinite float effect for the quote card
      gsap.to(".quote-glass-card", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, quoteRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="quote-section" ref={quoteRef}>
      <div className="quote-glass-card">
        <h2 className="quote-content">
          <span className="quote-mark">“</span>
          Talk is cheap. Show me the code.
          <span className="quote-mark">”</span>
        </h2>
        <p className="quote-author">— Linus Torvalds</p>
      </div>
    </div>
  );
};

export default QuoteSection;
