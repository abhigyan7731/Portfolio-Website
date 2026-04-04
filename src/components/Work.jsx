import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Expense Tracker",
    category: "Full Stack Web Development",
    tools: "Next.js, React, Supabase, Clerk, Gemini AI, REST APIs",
    image: "/images/next2.webp",
  },
  {
    title: "E-Commerce Website",
    category: "Full Stack Web Development",
    tools: "React, Next.js, Node.js, PostgreSQL, Prisma, JavaScript",
    image: "/images/react2.webp",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    tools: "React, Node.js, HTML, CSS, JavaScript",
    image: "/images/placeholder.webp",
  },
  {
    title: "Predictive CKD Classifier",
    category: "Machine Learning",
    tools: "Python, Scikit-learn, SHAP, LIME, Flask, Streamlit",
    image: "/images/typescript.webp",
  },
];

const Work = () => {
  useEffect(() => {
    let translateX = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const rectLeft = document
        .querySelector(".work-container")
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement.getBoundingClientRect().width;
      let padding = parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
