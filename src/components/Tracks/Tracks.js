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

  // Keep track of the audio files for each child
  const [children, setChildren] = useState(Array(props.numTracks).fill(null));

  // This has to be done manually (I think?) since React doesn't have access to file structure
  const audioDir = "../../audio/";
  const audioCategories = [
    "hmm",
    "mel",
    "music_box",
    "noise",
    "perc",
    "vox"
  ]

  useEffect(() => {
    // Create the URLS for audio files to be passed to children
    const files = audioDir.concat(audioCategories[2]);
    const x = require.context("../../audio/music_box/", false, /\.wav$/)
    const y = x.keys().map(x);
    setChildren(y);
    // console.log(y);

    return () => {
      // cleanup
      setChildren(Array(props.numTracks).fill(null));
      setNumTracks(props.numTracks);
    }
  }, []);

  /**
   * Render the Track components.
   * @returns an array of Track components to render
   */
  const renderTracks = () => {
    let out = [];
    for (let i = 0; i < numTracks; i++) {
      out.push(
        <Track
          id={i}
          key={i}
          numTracks={numTracks}
          started={props.started}
          audio={children}
        />
      );
    }
    return out;
  };

  return (
    <div className="tracks-container">
      {/* Wait for the app to start and for audio to load before rendering */}
      {(!props.started || !children) ? null : renderTracks()}
    </div>
  );
};

export default AudioTracks;
