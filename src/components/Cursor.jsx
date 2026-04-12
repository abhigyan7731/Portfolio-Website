import { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;
    const ctx = canvas.getContext("2d");
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const colors = ["#00f2fe", "#4facfe", "#c2a4ff", "#f093fb"];
    
    const mouse = { x: width / 2, y: height / 2 };
    const lastMouse = { x: width / 2, y: height / 2 };
    const smoothMouse = { x: width / 2, y: height / 2 };

    // GSAP quickTo for magnetic snapping on dot & ring
    const dotX = gsap.quickTo(dot, "left", { duration: 0.15, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "top", { duration: 0.15, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "left", { duration: 0.4, ease: "power2.out" });
    const ringY = gsap.quickTo(ring, "top", { duration: 0.4, ease: "power2.out" });

    // Magnetic attraction targets
    const magneticSelector = "a, button, .nav-btn, .l3d-tech-tag, .l3d-role-item, .character-hover";
    let isHovering = false;

    const addMagnetics = () => {
      document.querySelectorAll(magneticSelector).forEach((el) => {
        el.addEventListener("mouseenter", () => {
          isHovering = true;
          gsap.to(ring, { scale: 2.5, borderColor: "#00f2fe", duration: 0.3 });
          gsap.to(dot, { scale: 0.5, duration: 0.3 });
        });
        el.addEventListener("mouseleave", () => {
          isHovering = false;
          gsap.to(ring, { scale: 1, borderColor: "rgba(194,164,255,0.5)", duration: 0.3 });
          gsap.to(dot, { scale: 1, duration: 0.3 });
        });
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.3;
          const dy = (e.clientY - cy) * 0.3;
          gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", (e) => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        });
      });
    };

    // Attach magnetics after a brief delay so DOM is ready
    const magnetTimer = setTimeout(addMagnetics, 2000);

    const onMouseMove = (e) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Move cursor elements
      dotX(mouse.x);
      dotY(mouse.y);
      ringX(mouse.x);
      ringY(mouse.y);
      
      // Spawn trail particles
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spawnRate = Math.min(dist * 0.4, 8);
      for (let i = 0; i < spawnRate; i++) {
        const ix = lastMouse.x + dx * (i / spawnRate);
        const iy = lastMouse.y + dy * (i / spawnRate);
        spawnParticle(ix, iy, dx, dy);
      }
    };
    
    const onTouchMove = (e) => {
      if(e.touches.length > 0) onMouseMove(e.touches[0]);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    function spawnParticle(x, y, dx, dy) {
      const radius = Math.random() * 6 + 1.5; 
      const vx = (Math.random() - 0.5) * 1.5 + (dx * 0.04); 
      const vy = (Math.random() - 0.5) * 1.5 + (dy * 0.04);
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({ x, y, vx, vy, radius, color, life: 1, decay: Math.random() * 0.02 + 0.015 });
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.radius *= 0.97;
        p.life -= p.decay;
        
        if (p.life <= 0 || p.radius < 0.1) {
          particles.splice(i, 1);
          i--;
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.life * 0.7;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(magnetTimer);
    };
  }, []);

  return (
    <>
      {/* Particle trail canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 99999
        }}
      />
      {/* Magnetic dot (inner) */}
      <div ref={dotRef} className="cursor-dot" />
      {/* Magnetic ring (outer)  */}
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default Cursor;
