import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import config from "../../config.json";

import TrackElement from "./TrackElement";

/**
 * An audio track responsible for rendering and playing one sample.
 * Generates a number of element nodes to fill the track, based on the length of the associated sample.
 * @todo Fix scrolling animation
 *  @todo speed
 *  @todo fix position reset
 * @todo Fix audio playback
 */
const Track = (props) => {
  // Audio
  const [audio, setAudio] = useState(props.audio[props.id]);
  const [player, setPlayer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Animation
  const [speed, setSpeed] = useState(0.01);
  /** How far the sample has been played, in 1/10 s */
  const [position, setPosition] = useState(-50);
  const [maxPosition, setMaxPosition] = useState(100);
  // Sort of working?????
  const [startOffset, setStartOffset] = useState(0);
  const requestRef = useRef();
  const lastFrameTimeRef = useRef(0);
  const animationTimeout = useRef(1000);

  useEffect(() => {
    // checkAudio and setupPlayer are awaited to let the audio load
    async function start() {
      await checkAudio();
      const p = await setupPlayer();
      setPlayer(p);
    }
    start();

    return () => {
      // cleanup
      if (player && player.state === "started") {
        player.stop();
      }
      setPlayer(null);
      setAudio(props.audio[props.id]);
      setPosition(-50);
      setMaxPosition(100);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // useEffect(() => {
  //   if (player !== null) {
  //     async function run() {
  //       console.log(audio);
  //       await player.load(audio);
  //       setLoaded(true);
  //     }
  //     run();
  //   }
  // }, [player]);

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
        return (prevPosition + (deltaTime * speed)) % maxPosition;
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
        console.log(props.id, position);
        player.start();
        lastPlayedRef.current = currentTime;
      }
    }
  }, [position, loaded]);

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
        // FAKE PANNING
        const panner = new Tone.Panner(1).toDestination();
        panner.pan.value = Math.random() - 0.5;
        const p = new Tone.Player(
          audio,
          () => {
            console.log("loaded");
            console.log("buf duration: ", p.buffer.duration * 1000);
            setPosition((prevPosition) => 
              (prevPosition - startOffset)
            )
            setMaxPosition(p.buffer.duration*10);
            setLoaded(true);
            resolve(p);
          }
        )
        p.connect(panner);
        p.fadeIn = 0.1;
        p.fadeOut = 0.1;
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
