import { Button } from "@mantine/core";
import { IconPower } from "@tabler/icons-react";
import { useMidiContext } from "../hooks/useMidiContext";

export const InitializeMidiContextButton = () => {
  const midiContext = useMidiContext();

  return (
    <Button
      title="Retry"
      variant="juno"
      onClick={() => midiContext.initialize()}
      px="xs"
    >
      <IconPower />
    </Button>
  );
};
