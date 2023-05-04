import "./about.css";
import React, { useEffect } from "react";

/**
 * An overlay displaying information about the app.
 */
const AboutOverlay = (props) => {
  // Close the overlay when the esc key is pressed
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        props.close();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <div className={props.class}>
      <div className="about-wrapper">
        <div className="close" onClick={props.close}>
          X
        </div>
        <div className="about-content">
          <h2>About</h2>
          <div className="text">
            <p>This is all about it!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
