const Landing = ({ children }) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ABHIGYAN 
              <br />
              <span>KUMAR GUPTA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>B.Tech CSE Student</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Full Stack</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Machine Learning</div>
              <div className="landing-h2-info-1">Enthusiast</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
