import { React, useState, useEffect } from "react";
import useMousePosition from "../../hooks/useMousePosition";

/**
 * Read courser and scroll position and send messages to Tone and Two.
 */
const Controller = (props) => {
  // This triggers a rerender
  const mousePosition = useMousePosition();

  useEffect(() => {}, []);

  return (
    <>
      <h2>{mousePosition.y}</h2>
    </>
  );
};



export default Controller;
