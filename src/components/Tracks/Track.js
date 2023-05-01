import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import config from "../../config.json";

import TrackElement from "./TrackElement";

/**
 * An audio track responsible for rendering and playing one sample.
 * Generates a number of element nodes to fill the track, based on the length of the associated sample.
 */
const Track = (props) => {
  // Audio
  /** The audio file to use for the player */
  const [audio, setAudio] = useState(null);
  /** The Tone.Player object */
  const [player, setPlayer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Position
  /** How far the sample has been played, in 1/10 s */
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(100);
  const speed = 0.01;

  // Animation
  /** The requestAnimationFrame ID */
  const requestRef = useRef();
  const lastFrameTimeRef = useRef(0);
  /** Startup animation timeout */
  const animationTimeout = useRef(1000);

  useEffect(() => {
    async function start() {
      const a = await checkAudio();
      const p = await setupPlayer(a);

      // Set the startup wait
      const startOffset = Math.random() * p.buffer.duration;
      console.log(p.buffer, startOffset);
      // Broken right now
      setPosition((prev) => {
        return prev + startOffset * -1;
      });

      setPlayer(p);
    }
    start();

    return () => {
      // cleanup
      if (player && player.state === "started") {
        player.stop();
      }
      setPlayer(null);
      setAudio(null);
      setPosition(0);
      setMaxPosition(100);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Animation frames
  const animate = (timestamp) => {
    // Calculate the time since the last frame
    const currentTime = timestamp;
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    if (animationTimeout.current > 0) {
      // Wait for the sample to load before starting the animation countdown
      if (loaded) {
        console.log(animationTimeout.current);
        animationTimeout.current -= deltaTime;
      }
    } else {
      setPosition((prevPosition) => {
        return (prevPosition + deltaTime * speed) % maxPosition;
      });
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Play the sample when position reaches 0
  const lastPlayedRef = useRef(0);
  useEffect(() => {
    if (Math.round(position) === 0 && loaded) {
      const currentTime = Date.now();
      // use the lastPlayedRef to prevent the sample from playing too often
      if (currentTime - lastPlayedRef.current > 150) {
        player.start();
        lastPlayedRef.current = currentTime;
      }
    }
  }, [position, loaded]);

  /**
   * Load the audio file and return it
   */
  const checkAudio = async () => {
    // require() actually loads the audio file
    // const file = await require(props.audio[0]);
    const file = props.audio[props.id];
    setAudio(file);

    return file;
  };

  /**
   * Setup the Tone.Player object for this track.
   * @returns {Promise} Resolves with a Tone.Player object
   */
  const setupPlayer = async (audioFile) => {
    if (!player) {
      // FAKE PANNING
      const panner = new Tone.Panner(1).toDestination();
      panner.pan.value = Math.random() - 0.5;

      const startOffset = 0;
      console.log("startOffset: ", startOffset);

      const p = new Tone.Player(audioFile, () => {
        setPosition((prevPosition) => prevPosition - (p.buffer.duration * Math.random()));
        setMaxPosition(p.buffer.duration * 10);
        setPlayer(p);
        setLoaded(true);
      });
      p.connect(panner);
      p.fadeIn = 0.1;
      p.fadeOut = 0.1;

      return p;
    } else {
      console.log("Player already exists");
    }
  };

  /**
   * Render the elements that fill the track.
   */
  const renderElements = () => {
    let out = [];
    const buf = player.buffer;
    if (buf !== null && buf.duration !== 0) {
      // Render enough elements to always fill the screen
      for (
        let i = 0;
        i <= config.track_length + buf.duration;
        i += buf.duration
      ) {
        const elementStyle = {
          width: `${(buf.duration / config.track_length) * 100}vw`,
        };
        out.push(
          <div className={"element"} key={i} style={{ ...elementStyle }}></div>
          // // Use the custom TrackElement component
          // <TrackElement key={i} calcStyle={elementStyle} mounted={true}/>
        );
      }
    } else {
      console.log("Buffer not loaded: ", player.buf);
    }

    return (
      // Using position on the element-wrapper instead of the element makes animation easier.
      // Only need to load one screen-ful of elements, then can snap the position back to start
      // when the animation reaches the end.
      <div className="element-wrapper" style={{ left: `${-position}%` }}>
        {out}
      </div>
    );
  };

  const [r, g, b] = config.rgb;

  // dynamic styles
  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  // Change sample bank on click
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
