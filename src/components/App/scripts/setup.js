import * as Tone from "tone";
import C3 from "../../../audio/hmm/C3.wav";
import G3 from "../../../audio/hmm/G3.wav";
import C4 from "../../../audio/hmm/C4.wav";

/**
 * Setup the Tone.js environment and the audio elements that will be played.
 */
const setup = () => {
  // Setup the audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCTX = new AudioContext();
  Tone.setContext(audioCTX);

  // These oscs will be returned to be used in the main thread
  let out = {
    ugens: {},
    loops: {},
  };

  const hmm = new Tone.Sampler({
    urls: {
      C3: C3,
      G3: G3,
      C4: C4,
    },
    onload: () => {
      hmm.triggerAttackRelease(["C3", "E3", "G3", "B3"], 0.5);
    },
  });

  out["ugens"]["hmm"] = hmm;

  const hmmloop = new Tone.Loop((time) => {
    // triggered every whole note.
    console.log(time);
  }, "1n");

  out["loops"]["hmm"] = hmmloop;

  return out;
};

export default setup;
