import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgressBar = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const valueRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    gsap.from(containerRef.current, {
      x: 100,
      opacity: 0,
      duration: 1.5,
      delay: 1.5,
      ease: "power4.out"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const perc = Math.round(progress * 100);
          
          if (valueRef.current) {
            // Pad with zeroes for a tech aesthetic: 05%, 45%, 99%
            const formattedPerc = perc.toString().padStart(2, '0');
            valueRef.current.innerHTML = `${formattedPerc}<span style="font-size: 10px; color: rgba(255,255,255,0.4)">%</span>`;
          }
          
          if (thumbRef.current && trackRef.current) {
            // The thumb moves exactly down the height of the track
            // e.g. track height is 250px
            const trackHeight = trackRef.current.offsetHeight;
            const thumbOffset = progress * trackHeight;
            gsap.set(thumbRef.current, { y: thumbOffset });
          }

          if (fillRef.current) {
             gsap.set(fillRef.current, { scaleY: progress });
          }
        }
      },
    });

    tl.to({}, { duration: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="scroll-v-slider-wrapper" ref={containerRef}>
      {/* Percentage Readout above the track */}
      <div className="scroll-v-readout">
        SCROLL // <span className="scroll-v-value" ref={valueRef}>00<span style={{fontSize: "10px", color: "rgba(255,255,255,0.4)"}}>%</span></span>
      </div>

      {/* The physical track line */}
      <div className="scroll-v-track-container">
        <div className="scroll-v-track" ref={trackRef}>
          {/* Active fill line */}
          <div className="scroll-v-fill" ref={fillRef} />
          
          {/* The moving mechanical thumb */}
          <div className="scroll-v-thumb" ref={thumbRef}>
            <div className="scroll-v-thumb-core" />
            <div className="scroll-v-thumb-flare" />
          </div>
        </div>
        
        {/* Decorative tick marks alongside the track */}
        <div className="scroll-v-ticks">
           <div className="scroll-v-tick" />
           <div className="scroll-v-tick" />
           <div className="scroll-v-tick" />
           <div className="scroll-v-tick" />
           <div className="scroll-v-tick" />
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
