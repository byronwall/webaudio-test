import "./App.css";

import React, { Component } from "react";

import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line
} from "recharts";

interface AppState {
  shouldStart: boolean;
  shouldStop: boolean;
  isPlaying: boolean;
  data: any[];
}

class App extends Component<{}, AppState> {
  audioCtx: AudioContext;
  sines: AudioBufferSourceNode[] = [];
  analyzer: AnalyserNode;
  constructor(props: {}) {
    super(props);

    this.audioCtx = new AudioContext();
    this.analyzer = this.audioCtx.createAnalyser();

    this.state = {
      shouldStart: false,
      shouldStop: false,
      isPlaying: false,
      data: []
    };
  }

  render() {
    return (
      <div className="App">
        <button
          onClick={() => {
            if (this.state.isPlaying) {
              this.setState({ shouldStop: true });
            } else {
              this.setState({ shouldStart: true });
            }
          }}
        >
          play
        </button>
        <button onClick={() => this.updateFft()}>fft</button>
        audio testing
        <LineChart
          width={800}
          height={500}
          data={this.state.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="freq" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amp"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
  updateFft(): void {
    this.analyzer.fftSize = 2048;
    var bufferLength = this.analyzer.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    this.analyzer.getByteFrequencyData(dataArray);

    const dataOut: any[] = [];
    for (let index = 0; index < bufferLength; index++) {
      const element = dataArray[index];

      dataOut.push({
        freq: (index * this.audioCtx.sampleRate) / bufferLength,
        amp: element
      });
    }

    this.setState({ data: dataOut });

    console.log("data", dataArray);
  }

  componentDidUpdate() {
    this.checkAudio();
  }

  componentDidMount() {
    this.checkAudio();
  }

  private checkAudio() {
    if (this.state.shouldStart) {
      //create the context for the web audio

      // Create an empty three-second stereo buffer at the sample rate of the AudioContext
      var myArrayBuffer = this.audioCtx.createBuffer(
        2,
        this.audioCtx.sampleRate * 3,
        this.audioCtx.sampleRate
      );

      const sampRate = this.audioCtx.sampleRate;

      // Fill the buffer with white noise;
      // just random values between -1.0 and 1.0
      for (
        var channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        // This gives us the actual ArrayBuffer that contains the data
        var nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < myArrayBuffer.length; i++) {
          // Math.random() is in [0; 1.0]
          // audio needs to be in [-1.0; 1.0]
          nowBuffering[i] =
            Math.sin(((1000 * i) / sampRate) * 3.14) +
            (Math.random() - 0.5) / 4;
        }
      }

      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      var source = this.audioCtx.createBufferSource();
      // set the buffer in the AudioBufferSourceNode
      source.buffer = myArrayBuffer;
      source.loop = true;

      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      source.connect(this.analyzer);
      this.analyzer.connect(this.audioCtx.destination);
      // start the source playing
      source.start();

      this.sines = [source];

      this.setState({ isPlaying: true, shouldStart: false });
    }

    if (this.state.shouldStop) {
      try {
        this.sines.forEach(sine => sine.stop());
        this.setState({ isPlaying: false, shouldStop: false });
      } catch {}
    }
  }
}

export default App;
