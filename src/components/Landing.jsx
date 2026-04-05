import { useEffect, useRef } from "react";
import gsap from "gsap";

const Landing = ({ children }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Massive name reveal — slides up from below
      tl.from(".l3d-hero-name", {
        y: 200,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      });

      tl.from(".l3d-hero-lastname", {
        y: 200,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      }, "-=1.0");

      // Bottom bar slides up
      tl.from(".l3d-bottom-bar", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6");

      // Role items stagger in
      tl.from(".l3d-role-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.5");

      // Kicker
      tl.from(".l3d-top-kicker", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.8");

      // Scroll indicator
      tl.from(".l3d-scroll-cue", {
        opacity: 0,
        duration: 1,
      }, "-=0.3");

      // Continuous subtle float for the name
      gsap.to(".l3d-hero-name", {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".l3d-hero-lastname", {
        y: 5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

    }, section);

    // Mouse parallax for name depth
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".l3d-hero-name", {
        rotateY: x * 4,
        rotateX: -y * 3,
        x: x * 15,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(".l3d-hero-lastname", {
        rotateY: x * 6,
        rotateX: -y * 4,
        x: x * 25,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv" ref={sectionRef}>
        {/* Ambient background orbs */}
        <div className="l3d-bg-orb l3d-bg-orb-1" />
        <div className="l3d-bg-orb l3d-bg-orb-2" />

        {/* Top kicker */}
        <div className="l3d-top-kicker">
          <span className="l3d-kicker-line" />
          <span>B.Tech CSE — SRM IST</span>
          <span className="l3d-kicker-line" />
        </div>

        {/* HUGE name text sitting BEHIND the character */}
        <div className="l3d-name-backdrop" style={{ perspective: "1000px" }}>
          <h1 className="l3d-hero-name">ABHIGYAN</h1>
          <h1 className="l3d-hero-lastname">KUMAR GUPTA</h1>
        </div>

        {/* Bottom info bar — sits at the very bottom */}
        <div className="l3d-bottom-bar">
          <div className="l3d-roles-row">
            <div className="l3d-role-item">
              <span className="l3d-role-num">01</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">FULL STACK</span>
                <strong className="l3d-role-value">Developer</strong>
              </div>
            </div>

            <div className="l3d-divider" />

            <div className="l3d-role-item">
              <span className="l3d-role-num">02</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">MACHINE LEARNING</span>
                <strong className="l3d-role-value l3d-role-value-alt">Engineer</strong>
              </div>
            </div>

            <div className="l3d-divider" />

            <div className="l3d-role-item">
              <span className="l3d-role-num">03</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">FRONTEND</span>
                <strong className="l3d-role-value l3d-role-value-green">Architect</strong>
              </div>
            </div>

            <div className="l3d-divider l3d-divider-hide-mobile" />

            <div className="l3d-role-item l3d-role-hide-mobile">
              <span className="l3d-role-num">04</span>
              <div className="l3d-role-info">
                <span className="l3d-role-label">BACKEND</span>
                <strong className="l3d-role-value l3d-role-value-pink">Builder</strong>
              </div>
            </div>
          </div>

          {/* Tech stack strip */}
          <div className="l3d-tech-strip">
            {["React", "Next.js", "Node.js", "Python", "PostgreSQL", "Three.js", "Supabase", "GSAP"].map((t) => (
              <span className="l3d-tech-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="l3d-scroll-cue">
          <div className="l3d-scroll-dot" />
          <span>SCROLL</span>
        </div>

        {children}
      </div>
    </>
  );
};

export default Landing;
