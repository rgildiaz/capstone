import React, { useEffect, useState, useRef } from "react";
import "./tracks.css";
import Track from "./Track";
import AddTrack from "./AddTrack";

import config from "../../config";

/**
 * A container for all the audio tracks.
 */
const AudioTracks = (props) => {
  // This isn't really used right now, but I'm leaving it in in case
  // I want to add functionality for adding/removing tracks
  const [numTracks, setNumTracks] = useState(config.tracks);
  const maxTracks = 12;

  // all possible audio files
  const [files, setFiles] = useState(null);
  const [children, setChildren] = useState(Array(config.tracks).fill(null));

  const colors = useRef(Array(config.tracks).fill(config.colors[0]));

  const [reset, setReset] = useState(false);
  const [magic, setMagic] = useState(props.magic);

  useEffect(() => {
    // This has to be done manually with string literals since require.context happens at compile time
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

    setFiles(all);
    setChildren(startupRandomChildren(all, config.tracks));

    return () => {
      // cleanup
      setChildren(Array(config.tracks).fill(null));
      setNumTracks(config.tracks);
      setFiles(null);
    };
  }, []);

  /**
   * Listen for reset events from the parent component.
   */
  useEffect(() => {
    if (props.reset) {
      setChildren([getRandomFile(files.slice(), 0)]);
      setNumTracks(1);
      setReset(true);
      setTimeout(() => {
        setReset(false);
      }, 100)
    }
  }, [props.reset]);

  /**
   * Listen for magic events from the parent component.
   */
  useEffect(() => {
    if (props.magic) {
      setMagic(true);
    } else {
      setMagic(false);
    }
  }, [props.magic]);

  /**
   * Select a random files to start with.
   * @param {Array} dirs - an array of arrays of files
   * @returns an array of files
   */
  const startupRandomChildren = (dirs, numFiles) => {
    let out = [];
    for (let i = 0; i < numFiles; i++) {
      const file = getRandomFile(dirs, i);
      out.push(file);
    }
    return out;
  };

  /**
   * Select a random file from the given array of arrays of files.
   * Also updates the colors array to match the file.
   * @param {Array} dirs - an array of arrays of files
   * @param {number} index - the index of the track
   * @returns a file
   */
  const getRandomFile = (dirs, index) => {
    const dir_index = Math.floor(Math.random() * dirs.length);
    const dir = dirs[dir_index];
    const file = dir[Math.floor(Math.random() * dir.length)];

    // update colors
    colors.current[index] = config.colors[dir_index];

    return file;
  };

  /**
   * Handle a click on a Track component. Set a new audio file for that track.
   * @param {number} id - the id of the Track component
   */
  const handleTrackClick = (id) => {
    const newChildren = [...children];
    const newChild = getRandomFile(files.slice(), id);
    newChildren[id] = newChild;
    setChildren(newChildren);

    console.log("clicked track " + id);

    // This is used in the child Track component to update audio
    return newChild;
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
          color={colors.current[i]}
          reset={reset}
          magic={magic}
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
    return (
      <AddTrack
        onClick={() => {
          setNumTracks(numTracks + 1);
          setChildren([...children, getRandomFile(files, numTracks)]);
        }}
      />
    );
  };

  return (
    <div className="tracks-container">
      {!props.started || !children || props.reset ? null : (
        <>
          {renderTracks()}
          {numTracks < maxTracks ? renderAddTrackButton() : null}
        </>
      )}
    </div>
  );
};

export default AudioTracks;
