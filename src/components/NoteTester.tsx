import { WebMidi } from "webmidi";
import { Button } from "@mantine/core";
import { useConfigStore } from "../stores/configStore";

export const NoteTester = () => {
  const configStore = useConfigStore();

  const noteOn = () => {
    const outputId = configStore.output?.id;
    if (outputId == null) {
      return;
    }
    const output = WebMidi.getOutputById(outputId);
    if (output == null) {
      return;
    }
    const channel = output.channels[configStore.outputChannel];
    channel.playNote("C3");
  };

  const noteOff = () => {
    const outputId = configStore.output?.id;
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
