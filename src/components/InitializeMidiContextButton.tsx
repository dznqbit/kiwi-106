import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useMidiContext } from "../hooks/useMidiContext";

export const InitializeMidiContextButton = () => {
  const midiContext = useMidiContext();
  
  return <Button
    title="Retry"
    variant="juno"
    onClick={() => midiContext.initialize()}
    px="xs"
  ><IconRefresh /></Button>;
};
