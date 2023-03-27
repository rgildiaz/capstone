import config from "../../config.json";

const Track = (props) => {
  const { trackNum, track } = props;

  let rgb = config.rgb.map((c) => c * ((trackNum + 1) / config.tracks));
  console.log(rgb);
  const [r, g, b] = rgb;

  const style = {
    width: "100vw",
    maxHeight: "10vh",
    minHeight: "2vh",
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
  };

  return <div className="track" style={{ ...style }}></div>;
};

export default Track;
