import * as Tone from "tone";
import C3 from "../../../audio/hmm/C3.wav";
import G3 from "../../../audio/hmm/G3.wav";
import C4 from "../../../audio/hmm/C4.wav";

/**
 * Setup the Tone.js environment and the audio elements that will be played.
 * @todo generate score
 */
const setup = () => {
  // Setup the audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCTX = new AudioContext();
  Tone.setContext(audioCTX);

  // Tone Transport properties
  Tone.Transport.bpm.value = 120;
  Tone.Transport.loop = true;
  Tone.Transport.loopStart = "0:0:0";
  Tone.Transport.loopEnd = "4:0:0";

  let out = [
    {}, // Audio units
    {}, // loops
  ];

  const hmm = new Tone.Sampler({
    urls: {
      C3: C3,
      G3: G3,
      C4: C4,
    },
    onload: () => {
      // hmm.triggerAttackRelease(["C3", "E3", "G3", "B3"], 2);
      console.log("hmmsampload");
    },
  }).toDestination();

  const simple = new Tone.Oscillator(440, "sine").toDestination();

  out[0]["hmm"] = hmm;
  out[0]["simple"] = simple;

  const hmmloop = new Tone.Loop((time) => {
    // triggered every whole note.
    console.log(time);
  }, "1n");

  out[1]["hmm"] = hmmloop;

  return out;
};

export { setup };
