import "./about.css";

const AboutOverlay = (props) => {
  return (
    <div className={props.class}>
      <div className="about-wrapper">
        <div className="close" onClick={props.close}>X</div>
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
