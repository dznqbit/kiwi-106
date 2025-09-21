import { Button, ButtonProps } from "@mantine/core";
import { IconSettingsUp } from "@tabler/icons-react";
import { useKiwi106Context } from "../../hooks/useKiwi106Context";
import { useKiwiPatchStore } from "../../stores/kiwiPatchStore";

export const SendPatchBufferDumpButton = ({
  title,
  ...props
}: ButtonProps & { title: string }) => {
  const kiwi106Context = useKiwi106Context();
  const kiwiPatchStore = useKiwiPatchStore();

  return (
    <Button
      title={title}
      aria-label={title}
      {...props}
      disabled={!kiwi106Context.active}
      onClick={() => {
        if (kiwi106Context.active) {
          kiwi106Context.kiwiMidi.sendSysexPatchBufferDump(
            kiwiPatchStore.kiwiPatch,
          );
        }
      }}
      variant="juno"
    >
      <IconSettingsUp />
    </Button>
  );
};
