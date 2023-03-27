import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import "./tracks.css"

const AudioTracks = ( props ) => {
  const [position, setPosition] = useState(0);
  const tracks = [
    {
      id: 1,
      audioFile: '../../audio/hmm/C3.wav',
    }
  ];

  useEffect(() => {
    // Set the Transport bpm based on the speed state variable
    Tone.Transport.bpm.value = 120;

    // Create a Player instance for each track and schedule it to start
    tracks.forEach((track, i) => {
      const player = new Tone.Player(track.audioFile).toDestination();
      Tone.Transport.schedule(() => player.start(), `+${i}`);
    });

    // Draw the component at a specific time interval
    Tone.Draw.schedule(() => {
      setPosition(Tone.Transport.seconds * 100);
    }, 0);
  }, []);

  useEffect(() => {
    if (props.started) {

    }
  }, [props.started])

  return (
    <div className="audio-tracks">
      {tracks.map((track) => (
        <div className="track" key={track.id} style={{ backgroundColor: 'lightgray' }}>
          <div
            className="audio-track-element"
            style={{ left: `${position}%`, backgroundColor: 'red' }}
          ></div>
          <audio
            src={track.audioFile}
            onEnded={() => console.log('Audio ended for track', track.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default AudioTracks;
