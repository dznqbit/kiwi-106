import { WebMidi } from "webmidi";
import { Button } from "@mantine/core";
import { useConfigStore } from "../stores/configStore";
import { IconMusic } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export const NoteButton = () => {
  const configStore = useConfigStore();
  const [isPlaying, { open, close }] = useDisclosure(false);

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
    <Button
      variant="juno"
      color={isPlaying ? "blue.8" : "blue"}
      onClick={() => {
        if (isPlaying) {
          noteOff();
          close();
        } else {
          noteOn();
          open();
        }
      }}
    >
      <IconMusic />
    </Button>
  );
};
