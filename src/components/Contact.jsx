import { MdArrowOutward, MdCopyright } from "react-icons/md";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:abhigyankumar268@gmail.com" data-cursor="disable">
                abhigyankumar268@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+9199999999" data-cursor="disable">
                +91 8987209472
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/abhigyan7731"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/abhigyan-kumar-gupta"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://leetcode.com/abhigyan7731"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LeetCode <MdArrowOutward />
            </a>
            <h4>Resume</h4>
            <a
              href="/images/Abhigyan_Kumar_Gupta_ATS_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              View Resume <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Abhigyan Kumar Gupta</span>
            </h2>
            <h5>
              <MdCopyright /> 2026 All rights reserved.
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
