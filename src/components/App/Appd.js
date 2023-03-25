import React, { useState, useRef, useEffect } from "react";
import { Sampler } from "tone";
import C3 from "../../audio/hmm/C3.wav";

export const App = () => {
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef(null);

  useEffect(() => {
    sampler.current = new Sampler(
      { C3 },
      {
        onload: () => {
          setLoaded(true);
        }
      }
    ).toDestination();
  }, []);

  const handleClick = () => sampler.current.triggerAttack("C3");

  return (
    <div>
      <button disabled={!isLoaded} onClick={handleClick}>
        start
      </button>
    </div>
  );
};

export default App;