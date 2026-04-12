import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgressBar = () => {
  useEffect(() => {
    // We attach scroll progress to the entire body scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(".scroll-progress-indicator", {
      scaleX: 1,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="scroll-progress-container">
      <div className="scroll-progress-indicator" />
    </div>
  );
};

export default ScrollProgressBar;
