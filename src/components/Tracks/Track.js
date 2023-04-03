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
      const p = new Tone.Player(config.url + "/hmm/C4.wav").toDestination();
      p.loop = true;
      return p;
    });

    setStarted(props.started);
  }, []);

  useEffect(() => {
    if (started) {
      player.start();
    }
  }, [started]);

  // Update the buffer when the player updates
  useEffect(() => {
    if (player) {
      setBuf(player.buffer);
    }
  }, [player]);

  let rgb = config.rgb.map((c) => c * ((props.id + 1) / props.numTracks));
  const [r, g, b] = rgb;

  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  return <div className="track" style={{ ...style }}></div>;
};

export default Track;
