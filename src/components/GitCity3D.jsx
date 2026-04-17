import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GitCity3D = () => {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const [activeTab, setActiveTab] = useState("github");

  const [ghData, setGhData] = useState([]);
  const [ghTotal, setGhTotal] = useState(0);

  const [lcData, setLcData] = useState([]);
  const [lcTotal, setLcTotal] = useState(0);
  const [lcStreak, setLcStreak] = useState({ current: 0, max: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Github Data
        const ghRes = await fetch("https://github-contributions-api.deno.dev/abhigyan7731.json");
        const ghJson = await ghRes.json();

        let ghList = [];
        let ghIdCounter = 0;
        let ghTot = 0;

        // Fetch Leetcode Data
        let lcJson = null;
        try {
          const lcRes = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/Abhigyan007");
          lcJson = await lcRes.json();
        } catch (lcErr) {
          console.error("Failed to fetch Leetcode data", lcErr);
        }

        // Map Leetcode Timestamps to Dates
        const lcDatesMap = {};
        if (lcJson && lcJson.submissionCalendar) {
          Object.entries(lcJson.submissionCalendar).forEach(([timestamp, count]) => {
            const d = new Date(parseInt(timestamp) * 1000);
            const dateStr = d.toISOString().split('T')[0];
            lcDatesMap[dateStr] = count;
          });
        }

        let lcList = [];
        let lcIdCounter = 0;
        let lcTot = lcJson ? lcJson.totalSolved : 0;

        // Use GitHub contributions structure to define our calendar baseline
        ghJson.contributions.forEach((weekArr) => {
          weekArr.forEach((dayObj) => {

            // GitHub Processing
            let ghLevel = 0;
            const lvlMap = {
              "NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2, "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4
            };
            if (lvlMap[dayObj.contributionLevel] !== undefined) {
              ghLevel = lvlMap[dayObj.contributionLevel];
            }
            ghTot += dayObj.contributionCount;

            ghList.push({
              id: ghIdCounter++,
              level: ghLevel,
              count: dayObj.contributionCount,
              date: dayObj.date
            });

            // LeetCode Processing (Align to exactly the same grid structure)
            let lcCount = lcDatesMap[dayObj.date] || 0;
            let lcLevel = 0;
            if (lcCount > 0) lcLevel = 1;
            if (lcCount >= 3) lcLevel = 2;
            if (lcCount >= 6) lcLevel = 3;
            if (lcCount >= 10) lcLevel = 4;

            lcList.push({
              id: lcIdCounter++,
              level: lcLevel,
              count: lcCount,
              date: dayObj.date
            });
          });
        });

        // LeetCode Streak Calculation
        let maxStreak = 0;
        let tempStreak = 0;

        // Iterate forward to calculate max streak overall in the past year
        lcList.forEach(day => {
          if (day.count > 0) {
            tempStreak++;
            if (tempStreak > maxStreak) maxStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        });

        // Current Streak: check backwards from today
        let cStreak = 0;
        for (let i = 0; i < 365; i++) {
          let d = new Date();
          d.setDate(d.getDate() - i);
          let dStr = d.toISOString().split('T')[0];

          if (lcDatesMap[dStr] > 0) {
            cStreak++;
          } else {
            if (i === 0) continue; // It's fine if they haven't solved today yet
            break; // Streak broken yesterday or prior
          }
        }

        setGhData(ghList);
        setGhTotal(ghJson.totalContributions || ghTot);

        setLcData(lcList);
        setLcTotal(lcTot);
        setLcStreak({ current: cStreak, max: maxStreak });

      } catch (err) {
        console.error("Failed to fetch Github/Leetcode data", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  // Re-trigger animation when tab changes
  useEffect(() => {
    if (gridRef.current && (ghData.length > 0 || lcData.length > 0)) {
      gsap.fromTo(gridRef.current.children,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: { amount: 0.8, from: "random" }, ease: "back.out(2)" }
      );
    }
  }, [activeTab, ghData, lcData]);

  const isLc = activeTab === "leetcode";
  const activeData = isLc ? lcData : ghData;

  return (
    <div className="gh-section" ref={containerRef}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px", zIndex: 10 }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "5px" }}>
          CONTRIBUTION LOGS
        </h2>
        <p style={{ color: "#c2a4ff", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", marginTop: "10px" }}>
          Daily Activity & Progress
        </p>
      </div>

      {/* Tabs */}
      <div className="log-tabs">
        <button
          className={`log-tab-btn ${!isLc ? "active-github" : ""}`}
          onClick={() => setActiveTab("github")}
        >
          <span>GitHub</span>
        </button>
        <button
          className={`log-tab-btn ${isLc ? "active-leetcode" : ""}`}
          onClick={() => setActiveTab("leetcode")}
        >
          <span>LeetCode</span>
        </button>
      </div>

      <div className="gh-card">
        <div className="gh-header">
          <div className="gh-header-left">
            <h2 className="gh-title">
              {!isLc ? (
                ghTotal > 0 ? `${ghTotal.toLocaleString()} contributions in the last year` : "Loading GitHub contributions..."
              ) : (
                lcTotal > 0 ? (
                  <span>
                    <span style={{ color: '#ffa116', fontWeight: 'bold' }}>{lcTotal}</span> Problems Solved |
                    Streak: <span style={{ color: '#ffa116' }}>{lcStreak.current}</span> Days (Max: {lcStreak.max})
                  </span>
                ) : "Loading LeetCode stats..."
              )}
            </h2>
          </div>
          <div className="gh-header-right">
            <span className="gh-year-badge">{new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="gh-grid-wrapper">
          <div className="gh-months">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>

          <div className="gh-grid-body">
            <div className="gh-days">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="gh-grid" ref={gridRef}>
              {activeData.map((block) => (
                <div
                  key={block.id}
                  className={`gh-block ${isLc ? `lc-lvl-${block.level}` : `gh-lvl-${block.level}`}`}
                  title={`${block.count} ${isLc ? "submissions" : "contributions"} on ${block.date}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="gh-footer">
          <span className="gh-link">Learn how we count {isLc ? "submissions" : "contributions"}</span>
          <div className="gh-legend">
            <span>Less</span>
            <div className={`gh-block ${isLc ? 'lc-lvl-0' : 'gh-lvl-0'}`}></div>
            <div className={`gh-block ${isLc ? 'lc-lvl-1' : 'gh-lvl-1'}`}></div>
            <div className={`gh-block ${isLc ? 'lc-lvl-2' : 'gh-lvl-2'}`}></div>
            <div className={`gh-block ${isLc ? 'lc-lvl-3' : 'gh-lvl-3'}`}></div>
            <div className={`gh-block ${isLc ? 'lc-lvl-4' : 'gh-lvl-4'}`}></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitCity3D;
