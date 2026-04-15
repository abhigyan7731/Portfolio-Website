import { useEffect, useRef, useState, useCallback } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HackerRoom3D from "./HackerRoom3D";

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    label: "Email",
    value: "abhigyankumar268@gmail.com",
    href: "mailto:abhigyankumar268@gmail.com",
    icon: "✉",
    gradient: "linear-gradient(135deg, #c2a4ff, #f093fb)",
    glow: "rgba(194, 164, 255, 0.3)",
    color: "#c2a4ff",
  },
  {
    label: "Phone",
    value: "+91 8987209472",
    href: "tel:+918987209472",
    icon: "📱",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    glow: "rgba(79, 172, 254, 0.3)",
    color: "#4facfe",
  },
  {
    label: "Github",
    value: "abhigyan7731",
    href: "https://github.com/abhigyan7731",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    glow: "rgba(67, 233, 123, 0.3)",
    color: "#43e97b",
  },
  {
    label: "LinkedIn",
    value: "abhigyan-kumar-gupta",
    href: "https://www.linkedin.com/in/abhigyan-kumar-gupta",
    icon: "🔗",
    gradient: "linear-gradient(135deg, #4facfe, #667eea)",
    glow: "rgba(102, 126, 234, 0.3)",
    color: "#667eea",
  },
  {
    label: "LeetCode",
    value: "Abhigyan007",
    href: "https://leetcode.com/u/Abhigyan007/",
    icon: "🧩",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    glow: "rgba(240, 147, 251, 0.3)",
    color: "#f093fb",
  },
  {
    label: "Resume",
    value: "View Resume",
    href: "/images/Abhigyan_Kumar_Gupta_ATS_Resume.pdf",
    icon: "📄",
    gradient: "linear-gradient(135deg, #FFD43B, #f093fb)",
    glow: "rgba(255, 212, 59, 0.3)",
    color: "#FFD43B",
  },
];

// Terminal typing lines
const terminalLines = [
  { type: "cmd", prompt: "$", text: "whoami" },
  { type: "output", text: "Abhigyan Kumar Gupta — Full Stack Developer & ML Engineer" },
  { type: "cmd", prompt: "$", text: "cat contact.json" },
  {
    type: "json",
    text: `{
  "email": "abhigyankumar268@gmail.com",
  "phone": "+91 8987209472",
  "github": "abhigyan7731",
  "status": "Open to work"
}`,
  },
  { type: "cmd", prompt: "$", text: "echo 'Ready to collaborate!'" },
  { type: "output", text: "Ready to collaborate! 🚀" },
];

// Data rain characters
const dataRainChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

const Contact = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const terminalRef = useRef(null);
  const dataRainRef = useRef(null);
  const [typedLines, setTypedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const typingStarted = useRef(false);

  // Data rain effect
  useEffect(() => {
    const canvas = dataRainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;
    let columns;
    let drops;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      columns = Math.floor(canvas.width / 18);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = dataRainChars[Math.floor(Math.random() * dataRainChars.length)];
        const x = i * 18;
        const y = drops[i] * 18;

        // Random color between cyan and purple
        const isHighlight = Math.random() > 0.95;
        if (isHighlight) {
          ctx.fillStyle = "rgba(0, 242, 254, 0.9)";
          ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(0, 242, 254, ${0.08 + Math.random() * 0.12})`;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Terminal typing animation
  useEffect(() => {
    if (!terminalVisible || typingStarted.current) return;
    typingStarted.current = true;
    setIsTyping(true);
  }, [terminalVisible]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIdx >= terminalLines.length) {
      setIsTyping(false);
      return;
    }

    const currentLine = terminalLines[currentLineIdx];
    const fullText = currentLine.text;

    if (currentLine.type === "cmd") {
      // Type command character by character
      if (currentCharIdx < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedLines((prev) => {
            const updated = [...prev];
            if (updated.length <= currentLineIdx) {
              updated.push({ ...currentLine, text: fullText[0] });
            } else {
              updated[currentLineIdx] = {
                ...currentLine,
                text: fullText.slice(0, currentCharIdx + 1),
              };
            }
            return updated;
          });
          setCurrentCharIdx((c) => c + 1);
        }, 50 + Math.random() * 60);
        return () => clearTimeout(timeout);
      } else {
        // Command fully typed, move to next line
        const timeout = setTimeout(() => {
          setCurrentLineIdx((l) => l + 1);
          setCurrentCharIdx(0);
        }, 400);
        return () => clearTimeout(timeout);
      }
    } else {
      // Output/JSON appears instantly after a short delay
      const timeout = setTimeout(() => {
        setTypedLines((prev) => [...prev, currentLine]);
        setCurrentLineIdx((l) => l + 1);
        setCurrentCharIdx(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, currentLineIdx, currentCharIdx]);

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Detect when terminal is in viewport to start typing
      ScrollTrigger.create({
        trigger: ".ct-terminal",
        start: "top 80%",
        onEnter: () => setTerminalVisible(true),
        once: true,
      });

      // Title glitch reveal
      gsap.from(".ct-title-char", {
        z: -800,
        rotateY: 90,
        rotateX: 20,
        opacity: 0,
        stagger: 0.04,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Subtitle slides up
      gsap.from(".ct-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
        },
      });



      // Contact cards cascade
      gsap.from(".ct-card", {
        y: 120,
        z: -300,
        rotateX: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ct-grid",
          start: "top 80%",
        },
      });

      // CTA pulsing entrance
      gsap.from(".ct-cta-box", {
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.6,
        ease: "elastic.out(1, 0.5)",
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
        y: "random(-40, 40)",
        x: "random(-30, 30)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.8 },
      });

      // Floating wireframe shapes
      gsap.to(".ct-wireframe", {
        rotateX: "random(0, 360)",
        rotateY: "random(0, 360)",
        rotateZ: "random(0, 360)",
        y: "random(-50, 50)",
        duration: "random(8, 15)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 1.5 },
      });

      // Signal rings on CTA
      gsap.to(".ct-signal-ring", {
        scale: 3,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        ease: "power1.out",
        stagger: { each: 0.8 },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  // Mouse parallax for entire section
  const handleSectionMouseMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".ct-parallax-deep", {
      x: x * 30,
      y: y * 30,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(".ct-parallax-mid", {
      x: x * 15,
      y: y * 15,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.to(".ct-parallax-shallow", {
      x: x * 8,
      y: y * 8,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  // 3D tilt on card hover
  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: y * -25,
      rotateY: x * 25,
      z: 40,
      duration: 0.3,
      ease: "power2.out",
    });

    const shine = card.querySelector(".ct-card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.2), transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
    });
    const shine = card.querySelector(".ct-card-shine");
    if (shine) shine.style.background = "transparent";
  };



  const titleText = "GET IN TOUCH";
  const titleChars = titleText.split("");

  // Render a terminal line
  const renderTerminalLine = (line, idx) => {
    if (line.type === "cmd") {
      return (
        <div className="ct-terminal-line" key={idx}>
          <span className="ct-terminal-prompt">{line.prompt}</span>
          <span className="ct-terminal-cmd">{line.text}</span>
          {idx === typedLines.length - 1 && isTyping && currentLineIdx === idx && (
            <span className="ct-terminal-cursor">▊</span>
          )}
        </div>
      );
    }
    if (line.type === "output") {
      return (
        <div className="ct-terminal-output ct-output-reveal" key={idx}>
          {line.text}
        </div>
      );
    }
    if (line.type === "json") {
      const jsonLines = line.text.split("\n");
      return (
        <div className="ct-terminal-json ct-output-reveal" key={idx}>
          {jsonLines.map((jl, jIdx) => {
            // Colorize JSON keys and values
            const keyMatch = jl.match(/"(\w+)"/);
            const valMatch = jl.match(/:\s*"([^"]+)"/);
            if (keyMatch && valMatch) {
              const isStatus = keyMatch[1] === "status";
              return (
                <div key={jIdx}>
                  &nbsp;&nbsp;
                  <span className="ct-json-key">&quot;{keyMatch[1]}&quot;</span>
                  :{" "}
                  <span className={isStatus ? "ct-json-status" : "ct-json-val"}>
                    &quot;{valMatch[1]}&quot;
                  </span>
                  {jl.trim().endsWith(",") ? "," : ""}
                </div>
              );
            }
            return <div key={jIdx}>{jl}</div>;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="ct-section"
      id="contact"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
    >

      {/* Floating Orbs */}
      <div className="ct-orb ct-orb-1 ct-parallax-deep" />
      <div className="ct-orb ct-orb-2 ct-parallax-mid" />
      <div className="ct-orb ct-orb-3 ct-parallax-deep" />
      <div className="ct-orb ct-orb-4 ct-parallax-mid" />

      {/* Floating Wireframe Shapes */}
      <div className="ct-wireframe ct-wireframe-1 ct-parallax-deep">
        <svg viewBox="0 0 100 100" fill="none" stroke="rgba(0,242,254,0.12)" strokeWidth="1">
          <polygon points="50,5 95,27 95,72 50,95 5,72 5,27" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="27" x2="95" y2="72" />
          <line x1="95" y1="27" x2="5" y2="72" />
        </svg>
      </div>
      <div className="ct-wireframe ct-wireframe-2 ct-parallax-mid">
        <svg viewBox="0 0 100 100" fill="none" stroke="rgba(194,164,255,0.1)" strokeWidth="1">
          <rect x="15" y="15" width="70" height="70" rx="2" />
          <rect x="30" y="30" width="40" height="40" rx="2" transform="rotate(45 50 50)" />
        </svg>
      </div>
      <div className="ct-wireframe ct-wireframe-3 ct-parallax-shallow">
        <svg viewBox="0 0 100 100" fill="none" stroke="rgba(240,147,251,0.08)" strokeWidth="1">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="25" />
          <circle cx="50" cy="50" r="10" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>
      </div>

      {/* Holographic Grid Floor */}
      <div className="ct-holo-grid ct-parallax-deep">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="ct-holo-line-h" key={`h${i}`} style={{ top: `${(i + 1) * 8}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="ct-holo-line-v" key={`v${i}`} style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Ghost text */}
      <div className="ct-ghost-text" aria-hidden="true">CONTACT</div>

      {/* Noise/grain overlay */}
      <div className="ct-noise" />

      {/* ===== Glitch Title ===== */}
      <div className="ct-title-wrapper ct-parallax-shallow">
        <div className="ct-title" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          {titleChars.map((char, i) => (
            <span
              className={`ct-title-char ${char === " " ? "ct-space" : ""}`}
              key={i}
              style={{ transformStyle: "preserve-3d" }}
              data-char={char === " " ? "\u00A0" : char}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
        {/* Glitch copies */}
        <div className="ct-title-glitch ct-glitch-r" aria-hidden="true">
          {titleText}
        </div>
        <div className="ct-title-glitch ct-glitch-b" aria-hidden="true">
          {titleText}
        </div>
      </div>

      <p className="ct-subtitle ct-parallax-shallow">
        <span className="ct-subtitle-line" />
        Have a project in mind? Let&apos;s build something amazing together.
        <span className="ct-subtitle-line" />
      </p>

      {/* 3D Terminal Box with live typing */}
      <div style={{ position: "relative", width: "100%", maxWidth: "900px", height: "550px", margin: "40px auto", zIndex: 10 }}>
       <HackerRoom3D>
        <div
          className="ct-terminal ct-parallax-mid"
          ref={terminalRef}
          style={{ width: "100%", height: "100%", margin: 0, transform: "none" }}
        >
        {/* Animated border gradient */}
        <div className="ct-terminal-border-glow" />

        {/* Terminal header */}
        <div className="ct-terminal-bar">
          <div className="ct-terminal-dots">
            <span className="ct-dot ct-dot-red" />
            <span className="ct-dot ct-dot-yellow" />
            <span className="ct-dot ct-dot-green" />
          </div>
          <span className="ct-terminal-title">abhigyan@portfolio ~ /contact</span>
          <div className="ct-terminal-status">
            <span className="ct-status-dot" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Terminal body with live typing */}
        <div className="ct-terminal-body">
          {typedLines.map((line, idx) => renderTerminalLine(line, idx))}

          {/* Show cursor at the end if still typing and on a new command line */}
          {isTyping && currentLineIdx < terminalLines.length && typedLines.length <= currentLineIdx && (
            <div className="ct-terminal-line">
              <span className="ct-terminal-prompt">$</span>
              <span className="ct-terminal-cursor">▊</span>
            </div>
          )}

          {/* Final cursor after all done */}
          {!isTyping && typedLines.length >= terminalLines.length && (
            <div className="ct-terminal-line">
              <span className="ct-terminal-prompt">$</span>
              <span className="ct-terminal-cursor ct-cursor-blink">▊</span>
            </div>
          )}
        </div>

        {/* Scanline */}
        <div className="ct-terminal-scanline" />

        {/* CRT flicker lines */}
        <div className="ct-terminal-crt" />
       </div>
      </HackerRoom3D>
     </div>

      {/* Contact cards grid */}
      <div className="ct-grid ct-parallax-shallow">
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
            style={{
              "--card-gradient": link.gradient,
              "--card-glow": link.glow,
              "--card-color": link.color,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Rotating gradient border */}
            <div className="ct-card-border-anim" />
            <div className="ct-card-inner">
              <div className="ct-card-shine" />
              <div className="ct-card-icon">{link.icon}</div>
              <div className="ct-card-content">
                <span className="ct-card-label">{link.label}</span>
                <span className="ct-card-value">
                  {link.value}
                  <MdArrowOutward className="ct-card-arrow" />
                </span>
              </div>
              {/* Hover line reveal */}
              <div className="ct-card-hover-line" />
            </div>
          </a>
        ))}
      </div>

      {/* Big CTA with signal rings */}
      <div className="ct-cta-box ct-parallax-shallow">
        <div className="ct-signal-rings">
          <div className="ct-signal-ring" />
          <div className="ct-signal-ring" />
          <div className="ct-signal-ring" />
        </div>
        <div className="ct-cta-glow" />
        <div className="ct-cta-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              className="ct-cta-particle"
              key={i}
              style={{
                "--delay": `${Math.random() * 5}s`,
                "--x": `${Math.random() * 100}%`,
                "--y": `${Math.random() * 100}%`,
                "--size": `${2 + Math.random() * 3}px`,
                "--duration": `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <h3 className="ct-cta-text">
          Let&apos;s create something <span>extraordinary</span>
        </h3>
        <a
          className="ct-cta-button"
          href="mailto:abhigyankumar268@gmail.com"
          data-cursor="disable"
        >
          <span className="ct-cta-btn-text">Send me an email</span>
          <MdArrowOutward className="ct-cta-btn-icon" />
          <div className="ct-cta-btn-shine" />
        </a>
        <div className="ct-cta-status">
          <span className="ct-cta-status-dot" />
          Available for freelance &amp; full-time opportunities
        </div>
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
