import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Loading = ({ percent, setIsLoading }) => {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const wrapRef = useRef(null);
  const pillRef = useRef(null);

  // Track mouse for the glow hover effect
  const handleMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // When percent hits 100, mark as loaded
  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
    }
  }, [percent, loaded]);

  // When loaded, auto-click after a brief moment
  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      setClicked(true);

      // Animate the pill expanding to fill the screen — fast & snappy
      if (wrapRef.current) {
        gsap.to(wrapRef.current, {
          scale: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.in",
        });
      }

      // After transition, fire initialFX and unmount
      setTimeout(() => {
        import("./utils/initialFX").then((module) => {
          if (module.initialFX) {
            module.initialFX();
          }
          if (setIsLoading) {
            setIsLoading(false);
          }
        });
      }, 600);
    }, 300);

    return () => clearTimeout(timer);
  }, [loaded, setIsLoading]);

  // Pill entry animation
  useEffect(() => {
    if (pillRef.current) {
      gsap.fromTo(
        pillRef.current,
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  const displayPercent = Math.min(percent, 100);

  return (
    <div className="loading-pill-screen">
      {/* Subtle ambient background particles */}
      <div className="pill-bg-orb pill-bg-orb-1" />
      <div className="pill-bg-orb pill-bg-orb-2" />

      {/* Welcome text above the pill */}
      <div className="pill-welcome-text" style={{ opacity: clicked ? 0 : 1 }}>
        WELCOME
      </div>

      {/* The Pill */}
      <div
        className={`loading-pill-wrap ${loaded ? "pill-complete" : ""} ${clicked ? "pill-clicked" : ""}`}
        ref={wrapRef}
        onMouseMove={handleMouseMove}
      >
        {/* Hover glow */}
        <div className="pill-hover-glow" />

        <div className="loading-pill" ref={pillRef}>
          {/* Progress fill bar */}
          <div
            className="pill-progress-fill"
            style={{ width: `${displayPercent}%` }}
          />

          {/* Content overlay */}
          <div className="pill-content">
            <span className="pill-label">LOADING</span>
            <span className="pill-percent">{displayPercent}%</span>
            <div className="pill-cursor-blink" />
          </div>
        </div>
      </div>

      {/* Subtitle below */}
      <div className="pill-subtitle" style={{ opacity: clicked ? 0 : 1 }}>
        PORTFOLIO • 2026
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading) => {
  let percent = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 8) + 2; // faster jumps
      percent = Math.min(percent + rand, 100);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(percent + Math.round(Math.random() * 3) + 1, 100);
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 200); // was 2000ms — now 200ms, 10x faster
    }
  }, 60); // was 100ms — now 60ms

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent += 2; // double tick speed
          percent = Math.min(percent, 100);
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
