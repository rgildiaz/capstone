import "./App.css";
import { React, useRef } from "react";
import * as Tone from "tone";

import setup from "./scripts/setup";
import { StartupOverlay } from "../Layout";

const styles = {
  backgroundColor: "lightgray",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
};

function App(props) {
  // using refs persists these elements across re-renders.
  const oscs = useRef();

  // onclick
  const play = () => {
    // oscs.current['ugens']['hmm'].triggerAttackRelease(["C3", "E3", "G3", "B3"], 0.5);
    let loop = oscs.current["loops"]["hmm"];
    if (loop.state === "started") {
      loop.stop();
    } else {
      loop.start();
    }

    // console.log(oscs.current);
    console.log(`loop state:      ${loop.state}`);
    console.log(`oscs loop state: ${oscs.current["loops"]["hmm"].state}`);
  };

  const handleClick = () => {
    if (Tone.Transport.state !== "started") {
      console.log("not started")
      oscs.current = setup();
      Tone.Transport.start();
    } else {
      console.log('should be playing')
      play();
    }
    console.log(Tone.Transport.state)
  };

  return (
    <div className="App" style={{ ...styles }}>
      <StartupOverlay onClick={handleClick} />
    </div>
  );
}

export default App;
