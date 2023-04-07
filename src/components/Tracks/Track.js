import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import config from "../../config.json";

/**
 * An audio track responsible for rendering and playing one sample.
 */
const Track = (props) => {
  // The Tone.Player object for this track
  const [player, setPlayer] = useState(null);
  // The position of the sample in this track
  const [position, setPosition] = useState(100);
  const [loaded, setLoaded] = useState(false);
  // Audio
  const [audio, setAudio] = useState(props.audio[props.id]);
  const [speed, setSpeed] = useState(0.1);
  const requestRef = useRef();

  useEffect(() => {
    // setup
    async function start() {
      await checkAudio();
      const p = await setupPlayer();
      setPlayer(p);
      console.log(p.buffer)
    }
    start();

    return () => {
      // cleanup
      setPlayer(null);
      setAudio(null);
      setPosition(100);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    setAudio(props.audio[props.id]);
  }, [props.audio]);

  useEffect(() => {
    if (player !== null) {
      async function run() {
        await player.load(audio);
        setLoaded(true);
      }
      run();
    }
  }, [player]);

  // Animation frames
  const animate = (timestamp) => {
    setPosition((prevPosition) => (prevPosition - speed) % 100);
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

  const renderElements = () => {
    let out = [];
    const buf = player.buffer;
    if (buf !== null && buf.duration !== 0) {
      // console.log(buf.duration, config.track_length);
      
      for (let i = 0; i <= config.track_length; i += buf.duration) {
        const elementStyle = {
          // width: `${(buf.duration / config.track_length) * 100}%`,
          // left: `${(position / config.track_length) * 100}%`,
          width: `${(buf.duration / config.track_length) * 100}%`,
          left: `${position}%`,
        };
        out.push(
          <div className={"element"} key={i} style={{ ...elementStyle }}></div>
        );
      }
    }
    return out;
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
      {!loaded ? "..." : renderElements()}
    </div>
  );
};

export default Track;
