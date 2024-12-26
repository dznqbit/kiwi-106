import { useEffect, useState } from 'react'
import { WebMidi } from 'webmidi'
import './App.css'


function onEnabled() {
  // Inputs
  WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));
}

function App() {
  useEffect(() => {
    WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));
  }, []);

  const deviceName = "mioXC";

  const noteOn = () => {
    const myOutput = WebMidi.getOutputByName(deviceName);
    let output = WebMidi.outputs[0];
    let channel = output.channels[1];
    channel.playNote("C3");
  }

  const noteOff = ()  => {
    const myOutput = WebMidi.getOutputByName(deviceName);
    // Panic
    myOutput.sendAllSoundOff();
  }

  return (
    <>
      <h1>Kiwi 106 Programmer</h1>
      <div className="card">
        <button onClick={noteOn}>
          Note On
        </button>
        <button onClick={noteOff}>
          Note Off
        </button>
      </div>
    </>
  )
}

export default App