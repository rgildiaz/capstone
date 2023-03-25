/**
 * Generate a score to play.
 * @param {Array} loopdurs The duration in seconds of each loop for which a track will be generated.
 * @param {int} length The total length of the score in seconds
 *
 * @returns a 2D array containing the start times of each instrument.
 */
function score(loopdurs=[], length=16) {
  /** A 2D array containing a representation of each track */
  let out = [];

  if (loopdurs.length < 1) {
    return out;
  }

  loopdurs.forEach((dur) => {
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
}

export { score };
