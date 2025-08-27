import { Button, ButtonProps } from "@mantine/core";
import { IconSettingsUp } from "@tabler/icons-react";
import { useKiwi106Context } from "../../hooks/useKiwi106Context";
import { useKiwiPatchStore } from "../../stores/kiwiPatchStore";

export const SendPatchBufferDumpButton = (props: ButtonProps & { title: string }) => {
  const kiwi106Context = useKiwi106Context();
  const kiwiPatchStore = useKiwiPatchStore();

  return (
    <Button
      {...props}
      onClick={() => kiwi106Context.kiwiMidi?.sendSysexPatchBufferDump(kiwiPatchStore.kiwiPatch)}
      variant="juno"
    >
      <IconSettingsUp />
    </Button>
  );
};
