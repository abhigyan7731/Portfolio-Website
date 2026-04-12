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
  const terminalRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title characters fly in from deep 3D space
      gsap.from(".ct-title-char", {
        z: -600,
        rotateY: 90,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Subtitle slides up
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

      // Terminal box rotates in from deep 3D space
      gsap.from(".ct-terminal", {
        rotateX: 45,
        rotateY: -15,
        z: -300,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ct-terminal",
          start: "top 80%",
        },
      });

      // Contact cards cascade from different 3D angles
      gsap.from(".ct-card", {
        y: 100,
        z: -200,
        rotateX: 25,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ct-grid",
          start: "top 80%",
        },
      });

      // CTA floats in from below
      gsap.from(".ct-cta-box", {
        y: 80,
        opacity: 0,
        scale: 0.85,
        duration: 1.4,
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

      // Orbs float
      gsap.to(".ct-orb", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.8 },
      });

      // Terminal typing cursor blink
      gsap.to(".ct-terminal-cursor", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
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

    gsap.to(card, {
      rotateX: y * -20,
      rotateY: x * 20,
      z: 30,
      duration: 0.3,
      ease: "power2.out",
    });

    const shine = card.querySelector(".ct-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.15), transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    const shine = card.querySelector(".ct-card-shine");
    if (shine) shine.style.background = "transparent";
  };

  // Terminal 3D tilt for the whole terminal box
  const handleTerminalMove = (e) => {
    const el = terminalRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateX: y * -8,
      rotateY: x * 12,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleTerminalLeave = () => {
    gsap.to(terminalRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)",
    });
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

      {/* Holographic 3D Grid Floor */}
      <div className="ct-holo-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="ct-holo-line-h" key={`h${i}`} style={{ top: `${(i + 1) * 8}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="ct-holo-line-v" key={`v${i}`} style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Title with 3D perspective */}
      <div className="ct-title" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
        {titleChars.map((char, i) => (
          <span
            className={`ct-title-char ${char === " " ? "ct-space" : ""}`}
            key={i}
            style={{ transformStyle: "preserve-3d" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      <p className="ct-subtitle">
        Have a project in mind? Let&apos;s build something amazing together.
      </p>

      {/* 3D Terminal Box */}
      <div
        className="ct-terminal"
        ref={terminalRef}
        onMouseMove={handleTerminalMove}
        onMouseLeave={handleTerminalLeave}
      >
        {/* Terminal header bar */}
        <div className="ct-terminal-bar">
          <div className="ct-terminal-dots">
            <span className="ct-dot ct-dot-red" />
            <span className="ct-dot ct-dot-yellow" />
            <span className="ct-dot ct-dot-green" />
          </div>
          <span className="ct-terminal-title">abhigyan@portfolio ~ /contact</span>
          <div style={{ width: 52 }} />
        </div>

        {/* Terminal body with typing lines */}
        <div className="ct-terminal-body">
          <div className="ct-terminal-line">
            <span className="ct-terminal-prompt">$</span>
            <span className="ct-terminal-cmd">whoami</span>
          </div>
          <div className="ct-terminal-output">Abhigyan Kumar Gupta — Full Stack Developer & ML Engineer</div>

          <div className="ct-terminal-line">
            <span className="ct-terminal-prompt">$</span>
            <span className="ct-terminal-cmd">cat contact.json</span>
          </div>
          <div className="ct-terminal-json">
            {'{'}<br />
            &nbsp;&nbsp;<span className="ct-json-key">&quot;email&quot;</span>: <span className="ct-json-val">&quot;abhigyankumar268@gmail.com&quot;</span>,<br />
            &nbsp;&nbsp;<span className="ct-json-key">&quot;phone&quot;</span>: <span className="ct-json-val">&quot;+91 8987209472&quot;</span>,<br />
            &nbsp;&nbsp;<span className="ct-json-key">&quot;github&quot;</span>: <span className="ct-json-val">&quot;abhigyan7731&quot;</span>,<br />
            &nbsp;&nbsp;<span className="ct-json-key">&quot;status&quot;</span>: <span className="ct-json-status">&quot;Open to work&quot;</span><br />
            {'}'}
          </div>

          <div className="ct-terminal-line">
            <span className="ct-terminal-prompt">$</span>
            <span className="ct-terminal-cursor">▊</span>
          </div>
        </div>

        {/* Holographic scanline */}
        <div className="ct-terminal-scanline" />
      </div>

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
            style={{ "--card-gradient": link.gradient, "--card-glow": link.glow, transformStyle: "preserve-3d" }}
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
          className="ct-cta-button"
          href="mailto:abhigyankumar268@gmail.com"
          data-cursor="disable"
        >
          <span>Send me an email</span>
          <MdArrowOutward />
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
