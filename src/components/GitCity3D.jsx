import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WEEKS = 52;
const DAYS = 7;
const TOTAL_BLOCKS = WEEKS * DAYS;

const GitCity3D = () => {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  // Generate mock data for the commits
  const data = useMemo(() => {
    const list = [];
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
        const week = Math.floor(i / DAYS);
        const day = i % DAYS;
        
        let activity = Math.sin(week * 0.2) * 5 + Math.cos(day * 0.5) * 3 + Math.random() * 5;
        activity = Math.max(0, activity); 
        
        if (Math.random() > 0.95) activity += 12; // Rare huge commit days

        // Map into simple levels 0-4
        let level = 0;
        if (activity > 0.5 && activity < 3) level = 1;
        else if (activity >= 3 && activity < 6) level = 2;
        else if (activity >= 6 && activity < 10) level = 3;
        else if (activity >= 10) level = 4;

        list.push({ id: i, week, day, level });
    }
    return list;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for the container
      gsap.from(".gh-card", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

      // Staggered fade in for the contribution blocks
      gsap.fromTo(".gh-block", 
        { opacity: 0, scale: 0.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: {
            amount: 1.5,
            from: "random"
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="gh-section" ref={containerRef}>
      <div className="gh-card">
        <div className="gh-header">
          <div className="gh-header-left">
            <h2 className="gh-title">2,104 contributions in the last year</h2>
          </div>
          <div className="gh-header-right">
            <span className="gh-year-badge">2026</span>
          </div>
        </div>

        <div className="gh-grid-wrapper">
          {/* Months pseudo-labels */}
          <div className="gh-months">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
          
          <div className="gh-grid-body">
            {/* Days pseudo-labels */}
            <div className="gh-days">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="gh-grid" ref={gridRef}>
              {data.map((block) => (
                <div 
                  key={block.id} 
                  className={`gh-block gh-lvl-${block.level}`}
                  title={`${Math.floor(Math.random() * 15)} contributions on this day`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="gh-footer">
          <span className="gh-link">Learn how we count contributions</span>
          <div className="gh-legend">
            <span>Less</span>
            <div className="gh-block gh-lvl-0"></div>
            <div className="gh-block gh-lvl-1"></div>
            <div className="gh-block gh-lvl-2"></div>
            <div className="gh-block gh-lvl-3"></div>
            <div className="gh-block gh-lvl-4"></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitCity3D;
