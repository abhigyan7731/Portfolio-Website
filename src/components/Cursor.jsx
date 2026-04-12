import { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Canvas sizing setup
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    const particles = [];
    const colors = ["#00f2fe", "#4facfe", "#c2a4ff", "#f093fb"]; // Neon Blue & Purple palette
    
    const mouse = { x: width / 2, y: height / 2, moved: false };
    const lastMouse = { x: width / 2, y: height / 2 };

    const onMouseMove = (e) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moved = true;
      
      // Spawn particles based on distance traveled (velocity interpolation)
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const spawnRate = Math.min(dist * 0.5, 10); // cap max spawn per frame
      for (let i = 0; i < spawnRate; i++) {
        // Linearly interpolate position to fill gaps in rapid mouse movement
        const ix = lastMouse.x + dx * (i / spawnRate);
        const iy = lastMouse.y + dy * (i / spawnRate);
        spawnParticle(ix, iy, dx, dy);
      }
    };
    
    // Also support touch for mobile
    const onTouchMove = (e) => {
      if(e.touches.length > 0) {
        onMouseMove(e.touches[0]);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    function spawnParticle(x, y, dx, dy) {
      const radius = Math.random() * 8 + 2; 
      // Add slight random scatter to velocity base
      const vx = (Math.random() - 0.5) * 2 + (dx * 0.05); 
      const vy = (Math.random() - 0.5) * 2 + (dy * 0.05);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particles.push({
        x,
        y,
        vx,
        vy,
        radius,
        color,
        life: 1, // 1 to 0
        decay: Math.random() * 0.015 + 0.015 // how fast it fades
      });
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render fluid particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        
        // Friction / Fluid drag
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        p.radius *= 0.96; // shrink dynamically
        p.life -= p.decay;
        
        if (p.life <= 0 || p.radius < 0.1) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add neon glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.life;
        
        ctx.fill();
      }
      
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", () => {});
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 2D Canvas completely overrides old CSS cursor dot */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999
        }}
      />
    </>
  );
};

export default Cursor;
