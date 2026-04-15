import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "./utils/gsapStubs";

gsap.registerPlugin(ScrollTrigger);
export let smoother = null;

const navItems = [
  { text: "ABOUT", href: "#about", glowIndex: 2 }, // 'O'
  { text: "STATS", href: "#statistics", glowIndex: 3 }, // 'T'
  { text: "CONTACT", href: "#contact", glowIndex: 4 }, // 'A'
  { text: "RESUME", href: "/images/Abhigyan_Kumar_Gupta_ATS_Resume.pdf", external: true, glowIndex: 1 }, // 'E'
];

const Navbar = () => {
  const wrapperRef = useRef(null);
  const magneticBoardRef = useRef(null);
  const svgLogoRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverIndicator, setHoverIndicator] = useState({ opacity: 0, left: 0, width: 0 });

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });
    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".spatial-nav-link:not([target='_blank'])");
    links.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        let section = elem.getAttribute("href");
        if (window.innerWidth > 1024) {
          if (section) {
            e.preventDefault();
            smoother.scrollTo(section, true, "top top");
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Logo rotation effect
    gsap.to(".tech-logo-svg", {
      rotationZ: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBoardMove = (e) => {
    if (!magneticBoardRef.current) return;
    const rect = magneticBoardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(magneticBoardRef.current, {
      rotateX: -y * 25, 
      rotateY: x * 25,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 1200
    });

    // 3D Text Shadow Parallax
    gsap.to(".spatial-text", {
      textShadow: `${x * -20}px ${y * -20}px 15px rgba(194, 164, 255, 0.6)`,
      duration: 0.4
    });
  };

  const handleBoardLeave = () => {
    if (!magneticBoardRef.current) return;
    gsap.to(magneticBoardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
    });
    gsap.to(".spatial-text", {
      textShadow: `0px 0px 0px transparent`,
      duration: 0.4
    });
    setHoverIndicator(prev => ({ ...prev, opacity: 0 }));
  };

  const handleLinkEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const boardRect = magneticBoardRef.current.getBoundingClientRect();
    setHoverIndicator({
      opacity: 1,
      left: rect.left - boardRect.left,
      width: rect.width
    });
  };


  return (
    <div className={`spatial-wrapper ${isScrolled ? "spatial-scrolled" : ""}`} ref={wrapperRef}>
      <div 
        className="spatial-board" 
        ref={magneticBoardRef}
        onMouseMove={handleBoardMove}
        onMouseLeave={handleBoardLeave}
      >
        {/* Dynamic Sweeping Rainbow Edge */}
        <div className="spatial-edge-sweep" />

        {/* Dynamic sliding glass bubble with Liquid Effect */}
        <div 
          className="spatial-indicator" 
          style={{ 
            opacity: hoverIndicator.opacity, 
            left: `${hoverIndicator.left}px`, 
            width: `${hoverIndicator.width}px` 
          }} 
        >
          <div className="spatial-liquid-glow" />
        </div>

        {/* Brand New Geometric Isometric Logo */}
        <a href="/#" className="spatial-logo-wrapper">
          <svg viewBox="0 0 100 100" className="tech-logo-svg" ref={svgLogoRef}>
            {/* Hexagon Outer Frame */}
            <polygon points="50 5, 95 25, 95 75, 50 95, 5 75, 5 25" fill="none" stroke="url(#cyanPink)" strokeWidth="6" strokeLinejoin="round" className="logo-hex" />
            {/* Inner Isometric Cube lines */}
            <polyline points="50 5, 50 50, 95 75" fill="none" stroke="url(#cyanPink)" strokeWidth="4" strokeLinejoin="round" className="logo-line-1" />
            <polyline points="5 25, 50 50, 5 75" fill="none" stroke="url(#cyanPink)" strokeWidth="4" strokeLinejoin="round" className="logo-line-2" />
            {/* Center Core Dot */}
            <circle cx="50" cy="50" r="6" fill="#fff" className="logo-core" />
            
            <defs>
              <linearGradient id="cyanPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4facfe" />
                <stop offset="50%" stopColor="#c2a4ff" />
                <stop offset="100%" stopColor="#f093fb" />
              </linearGradient>
            </defs>
          </svg>
          <span className="spatial-logo-text">AG</span>
        </a>

        {/* Separator */}
        <div className="spatial-divider" />

        {/* Links */}
        <nav className="spatial-links">
          {navItems.map((item) => (
            <a
              key={item.text}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`spatial-nav-link ${item.external ? "spatial-accent" : ""}`}
              onMouseEnter={handleLinkEnter}
            >
              <span className="spatial-text">
                {item.text.split("").map((char, charIdx) => (
                  <span 
                    key={charIdx} 
                    className={charIdx === item.glowIndex ? "spatial-letter-glow" : ""}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </a>
          ))}
          

        </nav>
      </div>
    </div>
  );
};

export default Navbar;
