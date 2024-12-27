import { WebMidi } from "webmidi";
import { useMidiContext } from "../hooks/useMidiContext";
import { Button } from "@mantine/core";

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
    const myOutput = WebMidi.outputs[0];
    const channel = myOutput.channels[midiContext.outputChannel];
    console.log("playit sam", { channel, output, outputId, myOutput });
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
      <Button onClick={noteOn}>Note On</Button>
      <Button onClick={noteOff}>Note Off</Button>
    </div>
  );
};
