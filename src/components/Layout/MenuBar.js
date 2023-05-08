import React, { useState } from "react";
import * as Tone from "tone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faVolumeMute, faVolumeDown, faRotateRight } from "@fortawesome/free-solid-svg-icons";

import "./menu.css";

const MenuBar = (props) => {
  const [magic, setMagic] = useState(false);
  const [magicClass, setMagicClass] = useState("");

  const [mute, setMute] = useState(false);
  const [muteClass, setMuteClass] = useState("");

  const magicOnClick = () => {
    if (magic) {
      setMagic(false);
      setMagicClass("");
      props.magicToggle(false);
    } else {
      setMagic(true);
      setMagicClass("enabled");
      props.magicToggle(true);
    }
  };

  const resetOnClick = () => {
    props.reset();
    setMagic(false);
    setMagicClass("");
  }

  const muteOnClick = () => {
    if (mute) {
      setMute(false);
      Tone.Destination.mute = false;
      setMuteClass("");
    } else {
      setMute(true);
      Tone.Destination.mute = true;
      setMuteClass("enabled");
    }
  };

  return (
    <>
      {!props.started ? null : (
        <div className="menu-bar">
          <div className={"menu-bar-item " + magicClass} onClick={magicOnClick}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <div className="menu-bar-item reset" onClick={resetOnClick}>
            <div className="rotate-wrapper">
              <FontAwesomeIcon icon={faRotateRight} />
            </div>
          </div>
          <div className={"menu-bar-item " + muteClass} onClick={muteOnClick}>
            {
              mute ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeDown} />
              )
            }
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;
