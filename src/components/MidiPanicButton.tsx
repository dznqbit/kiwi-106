import { Button, ButtonProps } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { WebMidi } from "webmidi";

export const MidiPanicButton = (props: ButtonProps & { title: string }) => {
  const midiPanic = () => {
    for (const output of WebMidi.outputs) {
      output.sendAllSoundOff();
    }
  };

  return (
    <Button color="red" variant="juno" onClick={midiPanic} {...props}>
      <IconExclamationCircle />
    </Button>
  );
};
