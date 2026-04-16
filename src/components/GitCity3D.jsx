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

  const [data, setData] = useState([]);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://github-contributions-api.deno.dev/abhigyan7731.json");
        const json = await res.json();
        
        const list = [];
        let idCounter = 0;
        let total = 0;

        // "contributions" is an array of weeks, each containing an array of days
        json.contributions.forEach((weekArr, weekIdx) => {
          weekArr.forEach((dayObj, dayIdx) => {
            let level = 0;
            const lvlMap = {
              "NONE": 0,
              "FIRST_QUARTILE": 1,
              "SECOND_QUARTILE": 2,
              "THIRD_QUARTILE": 3,
              "FOURTH_QUARTILE": 4
            };
            if (lvlMap[dayObj.contributionLevel] !== undefined) {
              level = lvlMap[dayObj.contributionLevel];
            }
            
            total += dayObj.contributionCount;

            list.push({
              id: idCounter++,
              week: weekIdx,
              day: dayIdx,
              level: level,
              count: dayObj.contributionCount,
              date: dayObj.date
            });
          });
        });

        // The grid expects 52 weeks * 7 days = 364 blocks, we can just use the provided data directly.
        setData(list);
        
        // Summing up total automatically or trusting the endpoint's total:
        setTotalHits(json.totalContributions || total);
      } catch (err) {
        console.error("Failed to fetch Github data", err);
      }
    }
    fetchData();
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
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "50px", zIndex: 10 }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "5px" }}>GITHUB LOGS</h2>
        <p style={{ color: "#c2a4ff", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", marginTop: "10px" }}>Open Source Contributions</p>
      </div>

      <div className="gh-card">
        <div className="gh-header">
          <div className="gh-header-left">
            <h2 className="gh-title">
              {totalHits > 0 ? `${totalHits.toLocaleString()} contributions in the last year` : "Loading contributions..."}
            </h2>
          </div>
          <div className="gh-header-right">
            <span className="gh-year-badge">{new Date().getFullYear()}</span>
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
                  title={`${block.count} contributions on ${block.date}`}
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
