import { useEffect, useRef } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    label: "Email",
    value: "abhigyankumar268@gmail.com",
    href: "mailto:abhigyankumar268@gmail.com",
    icon: "✉",
    gradient: "linear-gradient(135deg, #c2a4ff, #f093fb)",
    glow: "rgba(194, 164, 255, 0.3)",
  },
  {
    label: "Phone",
    value: "+91 8987209472",
    href: "tel:+918987209472",
    icon: "📱",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    glow: "rgba(79, 172, 254, 0.3)",
  },
  {
    label: "Github",
    value: "abhigyan7731",
    href: "https://github.com/abhigyan7731",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    glow: "rgba(67, 233, 123, 0.3)",
  },
  {
    label: "LinkedIn",
    value: "abhigyan-kumar-gupta",
    href: "https://www.linkedin.com/in/abhigyan-kumar-gupta",
    icon: "🔗",
    gradient: "linear-gradient(135deg, #4facfe, #667eea)",
    glow: "rgba(102, 126, 234, 0.3)",
  },
  {
    label: "LeetCode",
    value: "Abhigyan007",
    href: "https://leetcode.com/u/Abhigyan007/",
    icon: "🧩",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    glow: "rgba(240, 147, 251, 0.3)",
  },
  {
    label: "Resume",
    value: "View Resume",
    href: "/images/Abhigyan_Kumar_Gupta_ATS_Resume.pdf",
    icon: "📄",
    gradient: "linear-gradient(135deg, #FFD43B, #f093fb)",
    glow: "rgba(255, 212, 59, 0.3)",
  },
];

const Contact = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaBtnRef = useRef(null);
  const shardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title characters
      gsap.from(".ct-title-char", {
        y: 100,
        rotateX: -90,
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Subtitle
      gsap.from(".ct-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
        },
      });

      // Contact cards stagger in with 3D rotation
      gsap.from(".ct-card", {
        y: 80,
        rotateY: -20,
        rotateX: 10,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ct-grid",
          start: "top 80%",
        },
      });

      // CTA box
      gsap.from(".ct-cta-box", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: ".ct-cta-box",
          start: "top 85%",
        },
      });

      // Footer
      gsap.from(".ct-footer", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ct-footer",
          start: "top 95%",
        },
      });

      // Floating orbs
      gsap.to(".ct-orb", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.8 },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  // 3D tilt on hover
  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -15}deg) rotateY(${x * 15}deg) translateY(-8px) scale(1.03)`;

    const shine = card.querySelector(".ct-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    const shine = card.querySelector(".ct-card-shine");
    if (shine) {
      shine.style.background = "transparent";
    }
  };

  const handleExplode = (e) => {
    e.preventDefault();
    const btn = ctaBtnRef.current;
    if (!btn) return;

    // Trigger physical shatter on the shards
    gsap.to(shardsRef.current, {
      x: () => (Math.random() - 0.5) * 400,
      y: () => (Math.random() - 0.5) * 400,
      z: () => Math.random() * 200,
      rotationX: () => Math.random() * 720 - 360,
      rotationY: () => Math.random() * 720 - 360,
      rotationZ: () => Math.random() * 720 - 360,
      opacity: 0,
      scale: () => Math.random() * 2 + 0.5,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.02,
    });

    // Shrink and fade the real button text
    gsap.to(btn.querySelectorAll(".ct-cta-btn-text, svg"), {
      opacity: 0,
      scale: 0,
      duration: 0.3,
    });

    // Wait for the shrapnel to spread, then execute the link action
    setTimeout(() => {
      window.open("mailto:abhigyankumar268@gmail.com", "_blank");
      
      // Cleanup: Reassemble the button gracefully after it opened
      gsap.to(btn.querySelectorAll(".ct-cta-btn-text, svg"), {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 1
      });
      gsap.to(shardsRef.current, {
        x: 0, y: 0, z: 0,
        rotationX: 0, rotationY: 0, rotationZ: 0,
        opacity: 0,
        scale: 1,
        duration: 0
      });
    }, 600);
  };

  const titleChars = "GET IN TOUCH".split("");

  return (
    <div className="ct-section" id="contact" ref={sectionRef}>
      {/* Background orbs */}
      <div className="ct-orb ct-orb-1" />
      <div className="ct-orb ct-orb-2" />
      <div className="ct-orb ct-orb-3" />

      {/* Large ghost text */}
      <div className="ct-ghost-text" aria-hidden="true">CONTACT</div>

      {/* Perspective grid */}
      <div className="ct-perspective-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="ct-grid-line" key={i} />
        ))}
      </div>

      {/* Title */}
      <div className="ct-title" style={{ perspective: "800px" }}>
        {titleChars.map((char, i) => (
          <span
            className={`ct-title-char ${char === " " ? "ct-space" : ""}`}
            key={i}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      <p className="ct-subtitle">
        Have a project in mind? Let&apos;s build something amazing together.
      </p>

      {/* Contact cards grid */}
      <div className="ct-grid">
        {contactLinks.map((link, i) => (
          <a
            className="ct-card"
            key={i}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            data-cursor="disable"
            ref={(el) => (cardsRef.current[i] = el)}
            onMouseMove={(e) => handleCardMouseMove(e, i)}
            onMouseLeave={() => handleCardMouseLeave(i)}
            style={{ "--card-gradient": link.gradient, "--card-glow": link.glow }}
          >
            <div className="ct-card-shine" />
            <div className="ct-card-border" />
            <div className="ct-card-icon">{link.icon}</div>
            <div className="ct-card-content">
              <span className="ct-card-label">{link.label}</span>
              <span className="ct-card-value">
                {link.value}
                <MdArrowOutward className="ct-card-arrow" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Big CTA */}
      <div className="ct-cta-box">
        <div className="ct-cta-glow" />
        <h3 className="ct-cta-text">
          Let&apos;s create something <span>extraordinary</span>
        </h3>
        <a
          className="ct-cta-button explode-btn"
          href="mailto:abhigyankumar268@gmail.com"
          data-cursor="disable"
          ref={ctaBtnRef}
          onClick={handleExplode}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Explosive geometry shards stored inside the button */}
          <div className="explode-shards-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                ref={el => shardsRef.current[i] = el}
                style={{
                  position: 'absolute',
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  background: `linear-gradient(135deg, rgba(0,242,254,0.8), rgba(194,164,255,0.8))`,
                  clipPath: `polygon(${Math.random()*100}% 0%, 100% ${Math.random()*100}%, ${Math.random()*100}% 100%, 0% ${Math.random()*100}%)`,
                  opacity: 0,
                  transform: 'translateZ(0px)',
                  boxShadow: '0 0 10px rgba(0,242,254,0.5)'
                }}
              />
            ))}
          </div>

          <span className="ct-cta-btn-text" style={{ position: 'relative', zIndex: 2 }}>Send me an email</span>
          <MdArrowOutward style={{ position: 'relative', zIndex: 2 }} />
        </a>
      </div>

      {/* Footer */}
      <div className="ct-footer">
        <div className="ct-footer-line" />
        <div className="ct-footer-content">
          <span className="ct-footer-credit">
            Designed & Developed by <strong>Abhigyan Kumar Gupta</strong>
          </span>
          <span className="ct-footer-copy">
            <MdCopyright /> 2026 All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
