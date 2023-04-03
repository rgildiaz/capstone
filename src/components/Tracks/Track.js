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
  const [started, setStarted] = useState(false);
  // The buffer used by this track's player, convenience
  const [buf, setBuf] = useState(null);

  useEffect(() => {
    setPlayer(() => {
      const p = new Tone.Player(
        props.audio[0],
        () => {
          // onload
          setStarted(props.started);
          console.log(props.audio[0])
        }
        ).toDestination();
      p.loop = true;
      return p;
    });
  }, []);

  // This is broken...
  useEffect(() => {
    if (started && player) {
      // player.current.start();
    } else if (player && player.current.state === "started") {
      // player.current.stop();
    }
  }, [started]);

  // Update the buffer when the player updates
  useEffect(() => {
    if (player) {
      setBuf(player.buffer);
    } else {
      setBuf(null);
    }
  }, [player]);

  const renderElements = () => {
    let out = [];
    if (buf && buf.duration !== 0) {
      console.log(buf.duration)
      const elementStyle = {
        width: `${(buf.duration / config.track_length) * 100}%`,
      }
      for (let i = 0; i <= config.track_length; i += buf.duration) {
        out.push(
          <div className={"element"} key={i} style={{ ...elementStyle }}></div>
        )
      }
    }
    return out;
  };

  let rgb = config.rgb
  // .map((c) => c * ((props.id + 1) / props.numTracks));
  const [r, g, b] = rgb;

  // dynamic styles
  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  return <div className="track" style={{ ...style }}>
    {renderElements()}
  </div>;
};

export default Track;
