import { lazy, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import SkillConstellation from "./SkillConstellation";
import Work from "./Work";
import TrophyRoom3D from "./TrophyRoom3D";
import SkillMatrix from "./SkillMatrix";
import GitCity3D from "./GitCity3D";
import Certifications from "./Certifications";
import TechBlog from "./TechBlog";
import ScrollProgressBar from "./ScrollProgressBar";
import GlobalBackground from "./GlobalBackground";
import setSplitText from "./utils/splitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



const MainContainer = ({ children }) => {
  const [isDesktopView, setIsDesktopView] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1024 : true
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Fade out the 3D character when scrolling past the landing section
  useEffect(() => {
    if (!isDesktopView) return;

    // Small delay to let the character DOM render
    const timeout = setTimeout(() => {
      const charModel = document.querySelector(".character-model");
      if (!charModel) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          id: "character-fade",
        },
      });

      tl.to(charModel, {
        autoAlpha: 0,
        scale: 0.92,
        pointerEvents: "none",
        ease: "none",
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getById("character-fade")?.kill();
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <ScrollProgressBar />
      <GlobalBackground />
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <TrophyRoom3D />
            <WhatIDo />
            <SkillConstellation />
            <SkillMatrix />
            <Career />
            <Work />
            <GitCity3D />
            <Certifications />
            <TechBlog />

            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
