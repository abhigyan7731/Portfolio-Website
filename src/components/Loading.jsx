import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const FingerprintSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" width="160" height="160">
    <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3"></path>
    <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6"></path>
    <path d="M12 11v2a14 14 0 0 0 2.5 8"></path>
    <path d="M8 15a18 18 0 0 0 1.8 6"></path>
    <path d="M4.9 19a22 22 0 0 1-.9-7v-1a8 8 0 0 1 12-6.9"></path>
    <path d="M12 4a8 8 0 0 1 6.3 3"></path>
    <path d="M12 7a5 5 0 0 1 4 2"></path>
    <path d="M5.5 8.5A8.5 8.5 0 0 0 4 12"></path>
    <path d="M8 7.5A5.5 5.5 0 0 0 7 10"></path>
    <path d="M4.5 15A11 11 0 0 0 6 18"></path>
  </svg>
);

const Loading = ({ percent, setIsLoading }) => {
  const [clicked, setClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const screenRef = useRef(null);

  const displayPercent = Math.min(percent, 100);
  const isLoaded = displayPercent === 100;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ld-bio-center", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });
      gsap.to(".ld-fingerprint-scanline", {
        top: "100%",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleAuthorize = () => {
    if (!isLoaded || clicked) return;
    setClicked(true);

    if (screenRef.current) {
        // Glitch shatter effect on status text
        gsap.to(".ld-bio-status", { opacity: 0, duration: 0.2, y: -20 });
        gsap.to(".ld-bio-data", { opacity: 0, duration: 0.4 });
        
        // Massive fingerprint burst
        gsap.to(".ld-fingerprint-container", {
            scale: 3,
            opacity: 0,
            duration: 0.9,
            ease: "back.in(1.5)",
            filter: "blur(20px) drop-shadow(0 0 100px #43e97b)"
        });

      gsap.to(screenRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        delay: 0.6,
        ease: "power4.in",
        onComplete: () => {
          import("./utils/initialFX").then((module) => {
            if (module.initialFX) module.initialFX();
            if (setIsLoading) setIsLoading(false);
          });
        }
      });
    }
  };

  return (
    <div className="ld-bio-screen" ref={screenRef}>
      <div className="ld-bio-crt" />
      <div className="ld-bio-vignette" />
      
      <div className={`ld-bio-center ${isLoaded ? 'is-loaded' : ''} ${clicked ? 'is-granted' : ''}`}>
      
        <div 
            className="ld-fingerprint-container"
            onClick={handleAuthorize}
            onMouseEnter={() => isLoaded && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="ld-fingerprint-svg-wrapper">
                <FingerprintSVG />
            </div>
            
            {!clicked && <div className="ld-fingerprint-scanline" />}
            
            <div className="ld-bio-ring ld-bio-ring-1" />
            <div className="ld-bio-ring ld-bio-ring-2" />
            <div className="ld-bio-ring ld-bio-ring-3" />
        </div>
        
        <div className="ld-bio-data">
            <div className={`ld-bio-status ${clicked ? 'text-green' : (isLoaded ? 'text-cyan' : 'text-red')}`}>
              {clicked ? "ACCESS GRANTED" : (isLoaded ? (isHovering ? "CLICK TO AUTHENTICATE" : "AWAITING CLEARANCE") : "ESTABLISHING SECURE LINK")}
            </div>
            <div className="ld-bio-bar-wrapper">
                <div className={`ld-bio-bar ${isLoaded ? 'bg-cyan' : 'bg-red'}`} style={{ width: `${displayPercent}%` }} />
            </div>
            <div className="ld-bio-percent">
                SYS.CORE // <span style={{color: isLoaded ? "#00f2fe" : "#ff4b4b"}}>{displayPercent.toString().padStart(3, '0')}%</span>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading) => {
  let percent = 0;

  let interval = setInterval(() => {
    if (percent <= 60) {
      let rand = Math.round(Math.random() * 12) + 2; 
      percent = Math.min(percent + rand, 100);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(percent + Math.round(Math.random() * 4) + 1, 100);
        setLoading(percent);
        if (percent >= 96) {
          clearInterval(interval);
          interval = setInterval(() => {
             percent = Math.min(percent + 1, 100);
             setLoading(percent);
             if (percent >= 100) clearInterval(interval);
          }, 350); // Slow dramatic finish
        }
      }, 100);
    }
  }, 40);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    // Resolve immediately for React context, but DO NOT call setIsLoading(false).
    // The component handles the unmount strictly upon click.
    return new Promise((resolve) => {
        resolve();
    });
  }
  return { loaded, percent, clear };
};
