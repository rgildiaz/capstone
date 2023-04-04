import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

import Controller from "../Controller";
import { StartupOverlay, AboutOverlay } from "../Layout";

import "./App.css";
import { setup, score } from "../../scripts";
import Tracks from "../Tracks";

function App(props) {
  const [isLoaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [aboutClass, setAboutClass] = useState("hidden");

  /** A reference to the sound-generating elements that have been set up */
  const s = useRef(null);

  /** A reference to the loops that have been set up */
  const l = useRef(null);

  useEffect(() => {
    // Setup is handled in the Track.js element instead
    // [s.current, l.current] = setup();
    Tone.loaded().then(() => {
      setLoaded(true);
      console.log("Loaded!");
    });
  }, []);

  const handleClick = async () => {
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
          <StartupOverlay className="startup" onClick={handleClick} onAboutClick={showAbout}/>
          <AboutOverlay class={"about-overlay " + aboutClass} close={showAbout}/>
          <Controller />
          <Tracks started={started}/>
        </>
      )}
    </div>
  );
}

export default App;
