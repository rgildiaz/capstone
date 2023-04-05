import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import config from "../../config.json";

/**
 * An audio track responsible for rendering and playing one sample.
 */
const Track = (props) => {
  // The Tone.Player object for this track
  const [player, setPlayer] = useState(null);
  // The position of the sample in this track
  const [position, setPosition] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // Audio
  const [audio, setAudio] = useState(props.audio[props.id]);

  useEffect(() => {
    // setup
    async function start() {
      await checkAudio();
      const p = await setupPlayer();
      setPlayer(p);
      console.log("lodade?", p.buffer)
    }
    start();

    return () => {
      setPlayer(null);
      setAudio(null);
      setPosition(0);
    };
  }, []);

  useEffect(() => {
    setAudio(props.audio[props.id]);
  }, [props.audio]);

  useEffect(() => {
    if (player !== null) {
      async function run() {
        await player.load(audio);
        console.log("running?/??")
        setLoaded(true);
      }
      run();
    }
  }, [player]);

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
      console.log(buf.duration);
      const elementStyle = {
        // width: `${(buf.duration / config.track_length) * 100}%`,
        // left: `${(position / config.track_length) * 100}%`,
        width: "10vw",
        left: "10vw",
      };
      for (let i = 0; i <= config.track_length; i += buf.duration) {
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
