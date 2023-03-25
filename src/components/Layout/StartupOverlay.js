import "./startup.css";
import { React, useState } from "react";

const StartupOverlay = (props) => {
  const [overlayClass, setClass] = useState("overlay");
  const handleClick = () => {
    props.onClick();
    
    // fade out on click
    setClass((current) => {
        return current + " disappear"
    })
  };

  return (
    <div className={overlayClass}>
      <div onClick={handleClick}>
        <h1 className="title">start</h1>
      </div>
    </div>
  );
};

export default StartupOverlay;
