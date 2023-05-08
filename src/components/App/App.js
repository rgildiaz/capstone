import React, { useEffect, useState } from "react";
import * as Tone from "tone";

import { AboutOverlay, MenuBar, StartupOverlay } from "../Layout";

import Tracks from "../Tracks";
import "./App.css";

/**
 * Make ambient music in your web browser!
 */
function App(props) {
  const [isLoaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [aboutClass, setAboutClass] = useState("hidden");
  const [reset, setReset] = useState(false);
  const [magic, setMagic] = useState(false);

  useEffect(() => {
    async function run() {
      await Tone.loaded();
      setLoaded(true);

      console.log(`
----------------------------------------
         Music for Web Browsers
                ༻ * ༺
  https://github.com/rgildiaz/capstone
----------------------------------------
      `);
    }
    run();
  }, []);

  const handleClick = async () => {
    // firstClick prevents spam clicking
    if (firstClick) {
      await Tone.start();
      Tone.Transport.start();
      setFirstClick(false);
    }

    setStarted(true);
  };

  const showAbout = () => {
    if (aboutClass === "hidden") {
      setAboutClass("show");
    } else {
      setAboutClass("hidden");
    }
  };

  const closeAbout = () => {
    setAboutClass("hidden");
  };

  const resetOnClick = () => {
    setReset(true);
    setMagic(false);
    setTimeout(() => {
      setReset(false);
    }, 50);
  };

  const magicToggle = (state) => {
    setMagic(state);
  }

  return (
    <div className={"App" + (magic ? " magic": "")}>
      {!isLoaded ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <StartupOverlay
            className="startup"
            onClick={handleClick}
            onAboutClick={showAbout}
          />
          <AboutOverlay
            class={"about-overlay " + aboutClass}
            close={closeAbout}
          />
          <>
            <MenuBar started={started} reset={resetOnClick} magicToggle={magicToggle} />
            <Tracks started={started} reset={reset} magic={magic} />
          </>
        </>
      )}
    </div>
  );
}

export default App;
