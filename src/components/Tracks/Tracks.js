import React, { useEffect, useState } from "react";
import "./tracks.css";
import config from "../../config.json";
import Track from "./Track";

const AudioTracks = (props) => {
  // This isn't really used right now, but I'm leaving it in in case
  // I want to add functionality for adding/removing tracks
  // TODO calculate track height based on num tracks
  const [numTracks, setNumTracks] = useState(config.tracks);
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
      {(!props.started || !audio) ? null : renderTracks()}
    </div>
  );
};

export default AudioTracks;
