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
  // The buffer used by this track's player, convenience
  const [buf, setBuf] = useState(null);
  // Audio
  const [audio, setAudio] = useState(props.audio[props.id]);

  useEffect(() => {
    console.log(player, position, loaded, buf, audio);

    // setup
    async function start() {
      await checkAudio();
      const p = await setupPlayer();
      setBuf(p.buffer);
      setLoaded(true);
    }
    start();

    return () => {
      if (player) {
        player.current.stop();
        setPlayer(null);
        setAudio(null);
        setPosition(0);
        setBuf(null);
      }
    };
  }, []);

  useEffect(() => {
    setAudio(props.audio[props.id]);
  }, [props.audio]);

  // Update the buffer when the player updates
  useEffect(() => {
    if (player && player.current) {
      if (player.current.buffer !== buf) {
        setBuf(player.current.buffer);
      }
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
        const p = new Tone.Player(audio).toDestination();
        p.loop = true;

        setPlayer(p);
        resolve(p);
      }
    });
  };

  const renderElements = () => {
    let out = [];
    if (buf && buf.duration !== 0) {
      console.log(buf.duration); 
      const elementStyle = {
        width: `${(buf.duration / config.track_length) * 100}%`,
        left: `${(position / config.track_length) * 100}%`,
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
  // .map((c) => c * ((props.id + 1) / props.numTracks));
  const [r, g, b] = rgb;

  // dynamic styles
  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  const handleClick = () => {
    console.log(player, position, loaded, buf, audio);
  };

  return (
    <div className="track" style={{ ...style }} onClick={handleClick}>
      {!loaded ? null : renderElements()}
    </div>
  );
};

export default Track;
