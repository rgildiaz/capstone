import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import config from "../../config.json";

// import TrackElement from "./TrackElement";

/**
 * An audio track responsible for rendering and playing one sample.
 * Generates a number of element nodes to fill the track based on the length of the associated sample.
 */
const Track = (props) => {
  // Audio
  /** The audio file to use for the player */
  const [audio, setAudio] = useState(null);
  /** The Tone.Player object */
  const player = useRef(null);
  const [loaded, setLoaded] = useState(false);
  // prevent the sample from playing too often
  const lastPlayedRef = useRef(0);

  // Position
  /** How far the sample has been played, in 1/10 s */
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(100);
  const startupOffset = useRef(0);
  const speed = 0.01;
  // The time between each sample, in 1/10 s
  const [interSampleTime, setInterSampleTime] = useState(0);

  // Animation
  /** The requestAnimationFrame ID */
  const requestRef = useRef();
  const lastFrameTimeRef = useRef(0);
  /** Startup animation timeout */
  const animationTimeout = useRef(400);

  useEffect(() => {
    async function start() {
      const a = await checkAudio();
      const fx = await setupFX();
      const p = await setupPlayer(a, fx);

      player.current = p;
    }
    start();

    return () => {
      // cleanup
      if (player.current) {
        if (player.current.state === "started") {
          player.current.stop();
        }
        player.current.dispose();
      }
      player.current = null;
      setAudio(null);
      setPosition(0);
      setMaxPosition(100);
      cancelAnimationFrame(requestRef.current);
      startupOffset.current = 0;
    };
  }, []);

  // unmount and remount this track component when the audio file changes
  // useEffect(() => {
    
  // }, [props.audio]);

  // Animation frames
  const animate = (timestamp) => {
    // Calculate the time since the last frame
    const currentTime = timestamp;
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    if (animationTimeout.current > 0) {
      // Wait for the sample to load before starting the animation countdown
      if (loaded) {
        animationTimeout.current -= deltaTime;
      }
    } else if (startupOffset.current > 0) {
      // Startup animation
      setPosition((prevPosition) => {
        return prevPosition + deltaTime * speed;
      });
      startupOffset.current -= deltaTime * speed;
    } else {
      setPosition((prevPosition) => {
        // Trigger the sample if position is 0
        if (Math.round(prevPosition) === 0 && loaded) {
          const currentTime = Date.now();
          // use the lastPlayedRef to prevent the sample from playing too often
          if (currentTime - lastPlayedRef.current > 150) {
            if (player.current.state === "started") {
              player.current.restart();
            } else {
              player.current.start();
            }
            lastPlayedRef.current = currentTime;
          }
        }
        return (prevPosition + deltaTime * speed) % maxPosition;
      });
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  // This is the actual animation loop.
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

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
   * Setup the effects chain for this track.
   * @returns {Promise} Resolves with an array of Tone.Effect objects
   * @param {Array} config - a dict representing settings for each effect
   */
  const setupFX = async (config) => {
    const reverb = new Tone.Reverb(Math.random() * 6).toDestination();
    const delay = new Tone.FeedbackDelay(0.5, 0.5).toDestination();
    const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
    const distortion = new Tone.Distortion(0.5).toDestination();

    // FAKE PANNING
    const panner = new Tone.Panner(1).toDestination();
    panner.pan.value = Math.random() - 0.5;

    return {
      reverb: reverb,
      delay: delay,
      chorus: chorus,
      // distortion: distortion,
      panner: panner,
    };
  };

  /**
   * Setup the Tone.Player object for this track.
   * @returns {Promise} Resolves with a Tone.Player object
   * @param {AudioBuffer} audioFile - the audio file to use for the player
   * @param {Array} fx - an array of Tone.Effect objects
   * @param {Array} config - an array of strings representing the effects to use
   */
  const setupPlayer = async (audioFile, fx, config) => {
    if (!player.current) {
      const p = new Tone.Player(audioFile, () => {
        // Set the startup wait/position
        if (props.id === 0) {
          // shouldn't have a long startup offset for the first track
          startupOffset.current = 5;
        } else {
          startupOffset.current = Math.random() * p.buffer.duration * 5;
        }
        setPosition((prev) => {
          return prev - startupOffset.current;
        });

        // Set the max position and inter-sample time
        const inter =
          (20 / p.buffer.duration) * Math.random() + // random offset inverse to sample length
          0.5 * p.buffer.duration + // minimum offset
          100 * Math.random() + // relatively long random offset
          25; // minimum inter-sample time
        setMaxPosition(p.buffer.duration * 10 + inter);
        setInterSampleTime(inter);
        player.current = p;
        setLoaded(true);
      });

      // Setup the effects chain
      // Always connect to the panner first
      p.connect(fx["panner"]);
      let last = fx["panner"];

      // if no config is passed, randomly select effects and randomize their order
      if (!config) {
        // Randomly select effects
        const effects = Object.keys(fx);
        // remove panning
        effects.splice(effects.indexOf("panner"), 1);
        const numEffects = Math.floor(Math.random() * effects.length);
        const selectedEffects = [];
        for (let i = 0; i < numEffects; i++) {
          const effect = effects[Math.floor(Math.random() * effects.length)];
          selectedEffects.push(effect);
          effects.splice(effects.indexOf(effect), 1);
        }

        // Randomize the order of the effects
        selectedEffects.sort(() => Math.random() - 0.5);

        config = selectedEffects;
      }

      // Connect the effects in the order they appear in the config
      for (let i = 0; i < config.length; i++) {
        const effect = config[i];
        last.connect(fx[effect]);
        last = fx[effect];
      }

      // Set the player properties
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
    const [r, g, b] = props.color;
    const buf = player.current.buffer;
    if (buf !== null && buf.duration !== 0) {
      // Render enough elements to always fill the screen
      for (
        let i = 0;
        i <= config.track_length + buf.duration;
        i += buf.duration
      ) {
        const elementStyle = {
          width: `${(buf.duration / config.track_length) * 100}vw`,
          marginRight: `${
            (interSampleTime / config.track_length) * 10 - 0.5
          }vw`,
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
        };
        out.push(
          <div className={"element"} key={i} style={{ ...elementStyle }}></div>
          // // Use the custom TrackElement component
          // <TrackElement key={i} calcStyle={elementStyle} mounted={true}/>
        );
      }
    } else {
      console.log("Buffer not loaded: ", player.current.buf);
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

  // dynamic styles
  const style = {
    backgroundColor: `rgba(150, 149, 140, 0.5)`,
  };

  const resetFX = async () => {
    return new Promise((resolve) => {
      const fx = setupFX();
      resolve(fx);
    });
  };

  const resetPlayer = async (audioFile, fx) => {
    return new Promise((resolve) => {
      const p = setupPlayer(audioFile, fx);
      resolve(p);
    });
  };

  // Rerender track on click
  const handleClick = () => {
    // Reset the track
    async function reset() {
      return new Promise((resolve) => {
        if (player.current) {
          player.current.stop();
          player.current.dispose();
          player.current = null;
        }

        setPosition(0);
        setLoaded(false);
        setAudio(null);
        setMaxPosition(0);
        setInterSampleTime(0);
        startupOffset.current = 100;

        resolve();
      });
    }

    async function start() {
      await reset();

      // Get the new audio file
      const a = await props.onClick(props.id);
      const fx = await resetFX();
      const p = await resetPlayer(a, fx);

      player.current = p;
    }
    start();
  };

  useEffect(() => {
    if (props.reset) {
      handleClick();
    }
  }, [props.reset])

  return (
    <div className="track" style={{ ...style }} onClick={handleClick}>
      {!loaded ? "..." : renderElements()}
      {/* <div>{loaded ? "true" : "false"}</div> */}
    </div>
  );
};

export default Track;
