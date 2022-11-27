import "./App.css";
import * as Tone from "tone";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
    };
  }

  handleClick() {
    const player = new Tone.Player({
      url: "https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3",
      loop: true,
      autostart: true,
    })
    //create a distortion effect
    const distortion = new Tone.Distortion(0.4).toDestination();
    //connect a player to the distortion
    player.connect(distortion);
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>Click this</button>
      </div>
    );
  }
}

export default App;
