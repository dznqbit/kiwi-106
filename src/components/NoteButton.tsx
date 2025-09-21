import { WebMidi } from "webmidi";
import { Button, ButtonProps } from "@mantine/core";
import { useConfigStore } from "../stores/configStore";
import { IconMusic } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useKiwi106Context } from "../hooks/useKiwi106Context";

export const NoteButton = ({
  title,
  ...props
}: ButtonProps & { title: string }) => {
  const kiwi106Context = useKiwi106Context();
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
      {...props}
      title={title}
      aria-label={title}
      disabled={!kiwi106Context.active}
      variant="juno"
      color={isPlaying ? "blue.8" : "blue"}
      onClick={() => {
        if (!kiwi106Context.active) {
          return;
        }

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
