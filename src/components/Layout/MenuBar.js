import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import "./menu.css";

const MenuBar = (props) => {
  const [magicClass, setMagicClass] = useState("");

  const magicOnClick = () => {
    if (magicClass === "") {
      setMagicClass("enabled");
    } else {
      setMagicClass("");
    }
  };

  return (
    <>
      {!props.started ? null : (
        <div className="menu-bar">
          <div className={"menu-bar-item " + magicClass} onClick={magicOnClick}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;
