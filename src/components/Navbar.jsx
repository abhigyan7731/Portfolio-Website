import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "./utils/gsapStubs";

gsap.registerPlugin(ScrollTrigger);
export let smoother = null;

const Navbar = () => {
  const navRef = useRef(null);
  const cubeRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const magnetRefs = useRef([]);

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

    // Nav link smooth scrolling
    let links = document.querySelectorAll(".nav3d-links a");
    links.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        let section = elem.getAttribute("data-href");
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

    // Scroll detection for navbar morphing
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 3D Cube auto-rotation
  useEffect(() => {
    if (!cubeRef.current) return;
    const cube = cubeRef.current;
    let angle = 0;
    let rafId;
    const rotateCube = () => {
      angle += 0.3;
      cube.style.transform = `rotateY(${angle}deg) rotateX(${Math.sin(angle * 0.01) * 15}deg)`;
      rafId = requestAnimationFrame(rotateCube);
    };
    rafId = requestAnimationFrame(rotateCube);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Magnetic button effect
  const handleMagneticMove = (e, index) => {
    const btn = magnetRefs.current[index];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      rotateX: -y * 0.15,
      rotateY: x * 0.15,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = (index) => {
    const btn = magnetRefs.current[index];
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
    setActiveLink(null);
  };

  const navItems = [
    { text: "ABOUT", href: "#about", type: "glitch" },
    { text: "WORK", href: "#work", type: "holographic" },
    { text: "CONTACT", href: "#contact", type: "neon" },
    {
      text: "RESUME",
      href: "/images/Abhigyan_Kumar_Gupta_ATS_Resume.pdf",
      type: "magnetic",
      external: true,
    },
  ];

  return (
    <>
      <div className={`nav3d-bar nav3d-animate-in ${isScrolled ? "nav3d-bar--scrolled" : ""}`} ref={navRef}>
        {/* Animated border */}
        <div className="nav3d-border-glow" />

        {/* 3D Rotating Cube Logo */}
        <a href="/#" className="nav3d-logo nav3d-animate-logo" data-cursor="disable" aria-label="Home">
          <div className="nav3d-cube-wrap">
            <div className="nav3d-cube" ref={cubeRef}>
              <div className="nav3d-cube-face nav3d-cube-front">A</div>
              <div className="nav3d-cube-face nav3d-cube-back">G</div>
              <div className="nav3d-cube-face nav3d-cube-right">K</div>
              <div className="nav3d-cube-face nav3d-cube-left">.</div>
              <div className="nav3d-cube-face nav3d-cube-top">✦</div>
              <div className="nav3d-cube-face nav3d-cube-bottom">⟡</div>
            </div>
          </div>
          {/* Orbital rings */}
          <div className="nav3d-orbit nav3d-orbit-1" />
          <div className="nav3d-orbit nav3d-orbit-2" />
        </a>

        {/* Email - center */}
        <a
          href="mailto:abhigyankumar268@gmail.com"
          className="nav3d-email"
          data-cursor="disable"
        >
          <span className="nav3d-email-text">abhigyankumar268@gmail.com</span>
          <span className="nav3d-email-glow" />
        </a>

        {/* Navigation Links */}
        <nav className="nav3d-links">
          {navItems.map((item, i) => (
            <div
              key={item.text}
              className="nav3d-btn-wrap"
              style={{ animationDelay: `${0.8 + i * 0.12}s` }}
              onMouseMove={(e) => handleMagneticMove(e, i)}
              onMouseLeave={() => handleMagneticLeave(i)}
              onMouseEnter={() => setActiveLink(i)}
            >
              <a
                ref={(el) => (magnetRefs.current[i] = el)}
                data-href={item.external ? undefined : item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                data-cursor="disable"
                className={`nav3d-btn nav3d-btn--${item.type} ${activeLink === i ? "nav3d-btn--active" : ""}`}
              >
                {/* Button content layers */}
                <span className="nav3d-btn-bg" />
                <span className="nav3d-btn-shine" />
                <span className="nav3d-btn-text" data-text={item.text}>
                  {item.text}
                </span>
                {/* Glitch layers for glitch type */}
                {item.type === "glitch" && (
                  <>
                    <span className="nav3d-glitch-r" data-text={item.text} />
                    <span className="nav3d-glitch-b" data-text={item.text} />
                  </>
                )}
                {/* Holographic scanlines */}
                {item.type === "holographic" && <span className="nav3d-holo-scan" />}
                {/* Neon glow layers */}
                {item.type === "neon" && (
                  <>
                    <span className="nav3d-neon-glow" />
                    <span className="nav3d-neon-flicker" />
                  </>
                )}
                {/* Magnetic field lines */}
                {item.type === "magnetic" && (
                  <span className="nav3d-magnetic-field">
                    {[...Array(6)].map((_, j) => (
                      <span key={j} className="nav3d-field-line" />
                    ))}
                  </span>
                )}
                {/* Corner accents */}
                <span className="nav3d-corner nav3d-corner--tl" />
                <span className="nav3d-corner nav3d-corner--tr" />
                <span className="nav3d-corner nav3d-corner--bl" />
                <span className="nav3d-corner nav3d-corner--br" />
              </a>
            </div>
          ))}
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
