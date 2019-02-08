import "./App.css";

import React, { Component } from "react";

interface AppState {
  isPlaying: boolean;
}

class App extends Component<{}, AppState> {
  audioCtx: AudioContext;
  sines: OscillatorNode[] = [];
  constructor(props: {}) {
    super(props);

    this.audioCtx = new AudioContext();

    this.state = {
      isPlaying: false
    };
  }

  render() {
    return (
      <div className="App">
        <button
          onClick={() => this.setState({ isPlaying: !this.state.isPlaying })}
        >
          play
        </button>
        audio testing
      </div>
    );
  }

  componentDidUpdate() {
    this.checkAudio();
  }

  componentDidMount() {
    this.checkAudio();
  }

  private checkAudio() {
    if (this.state.isPlaying) {
      //create the context for the web audio

      //create, tune, start and connect each oscillator sinea, sineb and sinec
      var sinea = this.audioCtx.createOscillator();
      sinea.frequency.value = 440;
      sinea.type = "sine";
      sinea.start();
      sinea.connect(this.audioCtx.destination);
      var sineb = this.audioCtx.createOscillator();
      sineb.frequency.value = 523.25;
      sineb.type = "sine";
      sineb.start();
      sineb.connect(this.audioCtx.destination);
      var sinec = this.audioCtx.createOscillator();
      sinec.frequency.value = 698.46;
      sinec.type = "sine";
      sinec.start();
      sinec.connect(this.audioCtx.destination);

      this.sines = [sinea, sineb, sinec];
    } else {
      try {
        this.sines.forEach(sine => sine.stop());
      } catch {}
    }
  }
}

export default App;
