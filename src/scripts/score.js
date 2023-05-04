// I kind of think this is overcomplicating things.

/**
 * Generate a score to play.
 * @param {Array} samples An array of the Tone.Player objects that will be used.
 * @param {int} length The total length of the score in seconds
 *
 * @returns a 2D array containing the start times of each instrument.
 */
function score(samples=[], length=16) {
  /** A 2D array containing a representation of each track */
  let out = [];

  if (samples.length < 1) {
    return out;
  }

  samples.forEach((dur) => {
    if (typeof dur !== "number") {
      return;
    }

    let track = [];
    let i = 0;
    while (i < length) {
      track.push(i);
      i += dur;
    }
    out.push(track);
  });

  return out;
};

// function score_track(sample, )

export { score };
