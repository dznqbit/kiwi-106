import { Button, ButtonProps } from "@mantine/core";
import { IconSettingsDown } from "@tabler/icons-react";
import { useKiwi106Context } from "../../hooks/useKiwi106Context";

export const RequestPatchBufferDumpButton = (props: ButtonProps & { title: string }) => {
  const kiwi106Context = useKiwi106Context();

  return (
    <Button
      {...props}
      onClick={() => kiwi106Context.kiwiMidi?.requestSysexEditBufferDump()}
      variant="juno"
    >
      <IconSettingsDown />
    </Button>
  );
};
