import React, { useEffect, useState } from "react";
import "./tracks.css";
import Track from "./Track";

/**
 * A container for all the audio tracks.
 */
const AudioTracks = (props) => {
  // This isn't really used right now, but I'm leaving it in in case
  // I want to add functionality for adding/removing tracks
  const [numTracks, setNumTracks] = useState(props.numTracks);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Load the audio files to be passed to children
    const context = require.context("../../audio/hmm", true, /\.wav$/);
    setAudio(context.keys().map(context));
  }, []);

  const renderTracks = () => {
    let out = [];
    for (let i = 0; i < numTracks; i++) {
      out.push(
        <Track
          id={i}
          key={i}
          numTracks={numTracks}
          started={props.started}
          audio={audio}
        />
      );
    }
    return out;
  };

  return (
    <div className="tracks-container">
      {/* Wait for the app to start and for audio to load before rendering */}
      {(!props.started || !audio) ? null : renderTracks()}
    </div>
  );
};

export default AudioTracks;
