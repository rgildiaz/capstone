import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import config from "../../config.json";

import TrackElement from "./TrackElement";

/**
 * An audio track responsible for rendering and playing one sample.
 * Generates a number of element nodes to fill the track, based on the length of the associated sample.
 * @todo Fix scrolling animation
 * @todo Fix audio playback
 */
const Track = (props) => {
  // Audio
  const [audio, setAudio] = useState(props.audio[props.id]);
  const [player, setPlayer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Animation
  const [speed, setSpeed] = useState(0.1);
  /** How far the sample has been played, in % */
  const [position, setPosition] = useState(-50);
  const requestRef = useRef();
  const animationTimeout = useRef(200);

  useEffect(() => {
    // checkAudio and setupPlayer are awaited to let the audio load
    async function start() {
      await checkAudio();
      const p = await setupPlayer();
      setPlayer(p);
      console.log(p.buffer);
    }
    start();

    return () => {
      // cleanup
      setPlayer(null);
      setAudio(props.audio[props.id]);
      setPosition(-50);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (player !== null) {
      async function run() {
        console.log(audio);
        await player.load(audio);
        setLoaded(true);
      }
      run();
    }
  }, [player]);

  /** Set a timeout */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Animation frames
  // Position should not be updated this way
  const animate = (timestamp) => {
    setPosition((prevPosition) => (prevPosition + speed) % 100);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  /**
   * Check that the audio file has been loaded.
   * @returns {Promise} Resolves if audio is loaded, rejects if not
   */
  const checkAudio = () => {
    return new Promise((resolve, reject) => {
      if (audio) {
        resolve(`Track ${props.id} loaded`);
      } else if (props.audio) {
        setAudio(props.audio[props.id]);
        resolve(`Track ${props.id} loaded`);
      } else {
        reject("No audio");
      }
    });
  };

  /**
   * Setup the Tone.Player object for this track.
   * @returns {Promise} Resolves with a Tone.Player object
   */
  const setupPlayer = () => {
    return new Promise((resolve, reject) => {
      if (!player) {
        const p = new Tone.Player().toDestination();
        p.loop = true;
        resolve(p);
      }
    });
  };

  /**
   * Render the elements that fill the track.
   */
  const renderElements = () => {
    let out = [];
    const buf = player.buffer;

    if (buf !== null && buf.duration !== 0) {
      // Render enough elements to always fill the screen
      for (let i = 0; i <= config.track_length + buf.duration; i += buf.duration) {
        const elementStyle = {
          width: `${(buf.duration / config.track_length) * 100}vw`,
        };
        out.push(
          <div className={"element"} key={i} style={{ ...elementStyle }}></div>
          // <TrackElement key={i} calcStyle={elementStyle} mounted={true}/>
        );
      }
    } else {
      console.log("Buffer not loaded: ", player.buf);
    }

    return (
      <div className="element-wrapper" style={{ left: `${-position}%` }}>
        {out}
      </div>
    );
  };

  let rgb = config.rgb;
  const [r, g, b] = rgb;

  // dynamic styles
  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  const handleClick = () => {
    console.log(player, position, loaded, audio);
  };

  return (
    <div className="track" style={{ ...style }} onClick={handleClick}>
      {/* Wait to render until audio is loaded */}
      {!loaded ? "..." : renderElements()}
    </div>
  );
};

export default Track;
