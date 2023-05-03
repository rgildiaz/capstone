import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddTrack = (props) => {
  return (
    <div className="add" onClick={props.onClick}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
};

export default AddTrack;
