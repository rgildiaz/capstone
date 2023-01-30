import "./App.css";
import React from "react";
import Canvas from "./Canvas";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
    };
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
