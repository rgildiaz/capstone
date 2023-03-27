import { useState, useEffect } from "react";

import Track from "./Track";
import * as scripts from "../../scripts";

const Tracks = (props) => {
  const [isLoaded, setLoaded] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    // console.log(config);
    const s = scripts.score([1, 2, 4], 16);
    setScore(s);
  }, []);

  useEffect(() => {
    if (score) {
      setLoaded(true);
    }
  }, [score]);

  /** @todo: this is a placeholder */
  const renderTracks = () => {
    console.log(score);
    if (score) {
      return score.map((track, i) => {
        return <Track key={i} trackNum={i} track={track} />;
      });
    }
  };

  return (
    <>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <>
          <div
            className="tracks-container"
            style={{ minWidth: "100vw", minHeight: "fit-content" }}
          >
            {renderTracks()}
          </div>
        </>
      )}
    </>
  );
};

export default Tracks;
