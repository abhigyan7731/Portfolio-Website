const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech, Computer Science and Engineering</h4>
                <h5>SRM IST Ghaziabad</h5>
              </div>
              <h3>2023-2027</h3>
            </div>
            <p>
              Current CGPA: 8.88/10. Built multiple full-stack and machine
              learning projects, with strong focus on software engineering,
              data structures, and practical product development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Class XII (PCM), CBSE</h4>
                <h5>Kendriya Vidyalaya Kankarbagh No.1</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Completed higher secondary education with 79.3%, strengthening my
              foundation in mathematics, science, and problem-solving.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Class X, CBSE</h4>
                <h5>Bradford International School</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Completed secondary education with 78.5% and developed strong
              interest in technology, computing, and engineering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
