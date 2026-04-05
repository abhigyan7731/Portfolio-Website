import { lazy, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TechStack = lazy(() => import("./TechStack"));

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
        opacity: 0,
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
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
