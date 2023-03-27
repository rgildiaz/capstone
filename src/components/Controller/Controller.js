import { useState, useEffect } from "react";

import useMousePosition from "../../hooks/useMousePosition";
import * as scripts from "../../scripts";

/**
 * Read courser and scroll position and send messages to Tone and Two.
 */
const Controller = (props) => {
  const [score, setScore] = useState(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    // console.log(config);
    const s = scripts.score([1, 2, 4], 16);
    setScore(s);
  }, []);
};

export default Controller;
