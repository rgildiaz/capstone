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


  useEffect(() => {
    // This has to be done manually with string literals since require.context happens at compile time
    // pain
    // surely there's a better way to do this?????
    let music_box = require.context("../../audio/music_box/", false, /\.wav$/);
    music_box = music_box.keys().map(music_box);

    let mel = require.context("../../audio/mel/", false, /\.wav$/);
    mel = mel.keys().map(mel);

    let perc = require.context("../../audio/perc/", false, /\.wav$/);
    perc = perc.keys().map(perc);

    let noise = require.context("../../audio/noise/", false, /\.wav$/);
    noise = noise.keys().map(noise);

    let vox = require.context("../../audio/vox/", false, /\.wav$/);
    vox = vox.keys().map(vox);
    
    const all = [
      music_box,
      mel,
      perc,
      noise,
      vox
    ]
    
    console.log(all);

    setChildren(startupRandomChildren(all));

    return () => {
      // cleanup
      setChildren(Array(props.numTracks).fill(null));
      setNumTracks(props.numTracks);
    }
  }, []);

  /**
   * Select a random files to start with.
   * @param {Array} dirs - an array of arrays of files
   * @returns an array of files
   */
  const startupRandomChildren = (dirs) => {
    let out = [];
    for (let i = 0; i < props.numTracks; i++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const file = dir[Math.floor(Math.random() * dir.length)];

      // remove the file from the array so it can't be selected again
      dir.splice(dir.indexOf(file), 1);

      out.push(file);
    }
    return out;
  }  

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
