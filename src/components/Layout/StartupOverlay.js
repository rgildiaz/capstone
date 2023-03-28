import "./startup.css";
import { React, useState } from "react";

const StartupOverlay = (props) => {
  const [overlayClass, setClass] = useState("");
  const [textClass, setTextClass] = useState("");

  const handleClick = () => {
    props.onClick();
    
    // fade out on click
    setClass(" disappear")
    setTextClass(" text-disappear")
  };

  return (
    <div className={"startup" + overlayClass}>
      <div className={"title-container" + textClass} onClick={handleClick}>
        <h1 className="title">MUSIC FOR WEB BROWSERS</h1>
        <h3 className="subtitle">subtitle :)</h3>
      </div>
      <footer className={textClass}>
        <p>&copy; <a href="https://rafi.web.illinois.edu">Rafi Gil Diaz</a> 2023 | <a onClick={props.onAboutClick}>About</a></p>
      </footer>
    </div>
  );
};

export default StartupOverlay;
