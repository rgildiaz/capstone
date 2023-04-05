import React, { useEffect, useState } from "react";
import * as Tone from "tone";

import Controller from "../Controller";
import { AboutOverlay, StartupOverlay } from "../Layout";

import { setup } from "../../scripts";
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
  const [fx, setFx] = useState(null);

  useEffect(() => {
    async function run() {
      // setup returns the effects on the destination node
      const s = await setup();
      setFx(s);

      await Tone.loaded();
      setLoaded(true);
      console.log("Loaded!");
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
    console.log(Tone.Transport.state);
  };

  const showAbout = () => {
    if (aboutClass === "hidden") {
      setAboutClass("show");
    } else {
      setAboutClass("hidden");
    }
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
            close={showAbout}
          />
          <Controller fx={fx} />
          <Tracks started={started} />
        </>
      )}
    </div>
  );
}

export default App;
