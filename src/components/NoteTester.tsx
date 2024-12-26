import { WebMidi } from "webmidi";
import { useMidiContext } from "../hooks/useMidiContext";

export const NoteTester = () => {
  const midiContext = useMidiContext();

  const noteOn = () => {
    const outputId = midiContext.selectedOutput?.id;
    if (outputId == null) {
      return;
    }
    const output = WebMidi.getOutputById(outputId);
    if (output == null) {
      return;
    }
    const channel = output.channels[1];
    channel.playNote("C3");
  };

  const noteOff = () => {
    const outputId = midiContext.selectedOutput?.id;
    if (outputId == null) {
      return;
    }
    const output = WebMidi.getOutputById(outputId);
    if (output == null) {
      return;
    }
    output.sendAllSoundOff();
  };

  return (
    <div className="card">
      <button onClick={noteOn}>Note On</button>
      <button onClick={noteOff}>Note Off</button>
    </div>
  );
};
