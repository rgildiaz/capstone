import { React, useState, useEffect, useRef } from "react";
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

  /** A reference to the sound-generating elements that have been setup */
  const s = useRef(null);

  /** A reference to the loops that have been setup */
  const l = useRef(null);

  useEffect(() => {
    [s.current, l.current] = setup();
    Tone.loaded().then(() => {
      setLoaded(true);
      console.log("Loaded!");
    });
  }, []);

  // onclick
  const play = () => {
    s.current["hmm"].triggerAttack(["C3", "E4"], Tone.now());
    console.log(s.current["hmm"]);
  };

  const handleClick = async () => {
    console.log(Tone.Transport.state);
    if (firstClick) {
      await Tone.start();
      await Tone.Transport.start();
      setFirstClick(false);
    }

    setStarted(true);

    // play();
    console.log(score([1,2,4], 16))
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
          <StartupOverlay onClick={handleClick} onAboutClick={showAbout}/>
          <AboutOverlay class={"about-overlay " + aboutClass} close={showAbout}/>
          <Controller />
          <Tracks started={started}/>
        </>
      )}
    </div>
  );
}

export default App;
