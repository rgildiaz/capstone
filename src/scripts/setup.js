import * as Tone from "tone";

/**
 * Setup the Tone.js environment.
 */
const setup = async () => {
  return new Promise((resolve, reject) => {
    try {
      // Tone Transport properties
      Tone.Transport.bpm.value = 120;
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = "0:0:0";
      Tone.Transport.loopEnd = "4:0:0";
    } catch (err) {
      console.log("Tone Transport could not be set up");
      reject("Tone Transport could not be set up");
    }

    let fx = {};

    const verb = new Tone.Reverb().toDestination();

    fx["reverb"] = verb;
    
    resolve(fx);
  });
};

export { setup };
