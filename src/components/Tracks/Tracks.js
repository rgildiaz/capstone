import React, { useEffect, useState } from "react";
import "./tracks.css";
import Track from "./Track";
import AddTrack from "./AddTrack";

/**
 * A container for all the audio tracks.
 */
const AudioTracks = (props) => {
  // This isn't really used right now, but I'm leaving it in in case
  // I want to add functionality for adding/removing tracks
  const [numTracks, setNumTracks] = useState(props.numTracks);

  // all possible audio files
  const [files, setFiles] = useState(null);

  const maxTracks = 9;

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

    const all = [music_box, mel, perc, noise, vox];

    console.log(all);

    setFiles(all);
    setChildren(startupRandomChildren(all));

    return () => {
      // cleanup
      setChildren(Array(props.numTracks).fill(null));
      setNumTracks(props.numTracks);
      setFiles(null);
    };
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

      // remove the dir from the array if it's empty
      if (dir.length === 0) {
        dirs.splice(dirs.indexOf(dir), 1);
      }

      out.push(file);
    }
    return out;
  };

  /**
   * Select a random file from the given array of arrays of files.
   * @param {Array} dirs - an array of arrays of files
   * @returns a file
   */
  const getRandomFile = (dirs) => {
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const file = dir[Math.floor(Math.random() * dir.length)];

    // remove the file from the array so it can't be selected again
    dir.splice(dir.indexOf(file), 1);

    // remove the dir from the array if it's empty
    if (dir.length === 0) {
      dirs.splice(dirs.indexOf(dir), 1);
    }

    return file;
  };

  /**
   * Handle a click on a Track component. Set a new audio file for that track.
   * @param {number} id - the id of the Track component
   */
  const handleTrackClick = (id) => {
    console.log("clicked track " + id);
    const newChildren = [...children];
    newChildren[id] = getRandomFile(files);
    setChildren(newChildren);
  };

  const deleteTrack = (id) => {
    console.log("deleting track " + id);
    const newChildren = [...children];
    newChildren[id] = null;
    setChildren(newChildren);
  };

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
          onClick={handleTrackClick}
          deleteTrack={deleteTrack}
        />
      );
    }
    return out;
  };

  /**
   * Render the button to add a track.
   * @returns a button element
   */
  const renderAddTrackButton = () => {
    console.log("rendering add track button");
    return (
      <AddTrack
        onClick={() => {
          setNumTracks(numTracks + 1);
          setChildren([...children, getRandomFile(files)]);
        }}
      />
    );
  };

  return (
    <div className="tracks-container">
      {!props.started || !children ? null : (
        <>
          {renderTracks()}
          {numTracks < maxTracks ? renderAddTrackButton() : null}
        </>
      )}
    </div>
  );
};

export default AudioTracks;
