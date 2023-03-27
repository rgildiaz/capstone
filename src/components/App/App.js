import { React, useState, useEffect, useRef } from "react";
import * as Tone from "tone";

import Controller from "../Controller";
import { StartupOverlay } from "../Layout";

import "./App.css";
import { setup, score } from "../../scripts";
import Tracks from "../Tracks";

function App(props) {
  const [isLoaded, setLoaded] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

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

    // play();
    console.log(score([1,2,4], 16))
  };

  return (
    <div className="App">
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <>
          <StartupOverlay onClick={handleClick} />
          <Controller />
          <Tracks />
        </>
      )}
    </div>
  );
}

export default App;
