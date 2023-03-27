import config from "../../config.json";

const Track = (props) => {
  const { trackNum, track } = props;

  let rgb = config.rgb.map((c) => c * ((trackNum + 1) / config.tracks));
  const [r, g, b] = rgb;

  const style = {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };

  return <div className="track" style={{ ...style }}></div>;
};

export default Track;
