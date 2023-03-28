import * as Tone from "tone";
import C3 from "../audio/hmm/C3.wav";
import G3 from "../audio/hmm/G3.wav";
import C4 from "../audio/hmm/C4.wav";

/**
 * Setup the Tone.js environment and the audio elements that will be played.
 * @todo generate score
 */
const setup = () => {
  try {
    // Tone Transport properties
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = "0:0:0";
    Tone.Transport.loopEnd = "4:0:0";
  } catch (err) {
    console.log("Tone Transport could not be set up");
  }

  let out = [
    {}, // Audio units
    {}, // loops
  ];

  try {
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
    out[0]["hmm"] = hmm;
  } catch (err) {
    console.log("Could not load hmm sampler");
    console.log(err)
  }

  try {
    const hmmloop = new Tone.Loop((time) => {
      // triggered every whole note.
      console.log(time);
    }, "1n");
    out[1]["hmm"] = hmmloop;
  } catch (err) {
    console.log("Could not load hmm loop");
  }

  console.log(out)
  return out;
};

export { setup };
