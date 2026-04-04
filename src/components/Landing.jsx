const Landing = ({ children }) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <p className="landing-kicker">B.Tech CSE Student</p>
            <h1>
              ABHIGYAN <br />
              <span>KUMAR GUPTA</span>
            </h1>
            <p className="landing-summary">
              Full-stack developer and machine learning enthusiast focused on
              building practical products with React, Next.js, Node.js,
              PostgreSQL, Supabase, and Python.
            </p>
          </div>
          <div className="landing-info">
            <div className="landing-chip">
              <span>Full Stack</span>
              <strong>Developer</strong>
            </div>
            <div className="landing-chip landing-chip-alt">
              <span>Machine Learning</span>
              <strong>Enthusiast</strong>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
