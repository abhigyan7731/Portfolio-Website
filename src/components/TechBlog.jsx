import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    title: "Reaching 98% Accuracy on Clinical Data",
    desc: "A deep dive into hyperparameter tuning XGBoost and Random Forest classifiers for predictive healthcare models.",
    date: "12 MAR 2026",
    link: "#",
    color: "#43e97b"
  },
  {
    title: "Building a Multi-Tenant Supabase Architecture",
    desc: "How I designed the database schema and RLS policies for an expense tracking clone handling thousands of transactions.",
    date: "05 FEB 2026",
    link: "#",
    color: "#4facfe"
  },
  {
    title: "Optimizing React Three Fiber for Low-End Devices",
    desc: "Techniques for pausing requestAnimationFrame loops and using IntersectionObservers to maintain 60FPS.",
    date: "28 JAN 2026",
    link: "#",
    color: "#f093fb"
  }
];

const TechBlog = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tb-header", {
        y: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      });

      gsap.from(".tb-card", {
        y: 150,
        z: -300,
        rotateX: 45,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".tb-grid",
          start: "top 75%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e, idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 30,
      rotateX: -y * 30,
      z: 50,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)"
    });
  };

  return (
    <div className="tb-section" ref={sectionRef}>
      <div className="tb-header">
        <h2 className="tb-title">Datapad Archives</h2>
        <p style={{ color: "#888", letterSpacing: "2px" }}>ENGINEERING INSIGHTS & PROCESSES</p>
      </div>

      <div className="tb-grid">
        {articles.map((article, i) => (
          <a 
            href={article.link}
            className="tb-card" 
            key={i}
            ref={el => cardsRef.current[i] = el}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            style={{ "--card-color": article.color }}
          >
            <div className="tb-card-border" />
            <div className="tb-date">{article.date}</div>
            <h3 className="tb-card-title">{article.title}</h3>
            <p className="tb-desc">{article.desc}</p>
            <div className="tb-read-more">DECRYPT FILE {'>'}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechBlog;
