import React, { useEffect, useState } from "react";
import * as Tone from "tone";

// import Controller from "../Controller";
import { AboutOverlay, MenuBar, StartupOverlay } from "../Layout";

import { setup } from "../../scripts";
import config from "../../config.json";
import Tracks from "../Tracks";
import "./App.css";

/**
 * Make ambient music in your web browser!
 */
function App(props) {
  const [isLoaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  // numTracks isn't used right now.
  const [numTracks, setNumTracks] = useState(config.tracks);
  const [aboutClass, setAboutClass] = useState("hidden");
  const [fx, setFx] = useState(null);

  useEffect(() => {
    async function run() {
      // setup returns the effects on the destination node
      // const s = await setup();
      // setFx(s);

      await Tone.loaded();
      setLoaded(true);
      console.log(`
----------------------------------------
         Music for Web Browsers
                  ***
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

  return (
    <div className="App">
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
          {/* <Controller fx={fx} /> */}
          <>
            <MenuBar started={started} />
            <Tracks started={started} numTracks={numTracks}/>
          </>
        </>
      )}
    </div>
  );
}

export default App;
