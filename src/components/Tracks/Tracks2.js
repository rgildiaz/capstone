import React, { useEffect, useState } from "react";
import "./tracks.css";
import config from "../../config.json";
import Track from "./Track";

const AudioTracks = (props) => {
  // This isn't really used right now, but I'm leaving it in in case 
  // I want to add functionality for adding/removing tracks
  const [numTracks, setNumTracks] = useState(config.tracks);

  useEffect(() => {
    // setNumTracks(config.tracks);
  }, []);

  const renderTracks = () => {
    for (let i = 0; i < numTracks; i++) {
      return <Track id={i} numTracks={numTracks} started={props.started}/>;
    }
  }

  return (
    <div className="tracks-container">
      {renderTracks()}
    </div>
  );
};

export default AudioTracks;
