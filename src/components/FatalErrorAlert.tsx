import { Alert, Code } from "@mantine/core";
import { KiwiMidiFatalError } from "../types/KiwiMidi";
import { IconExclamationCircle } from "@tabler/icons-react";

export const FatalErrorAlert = ({
  fatalError,
}: {
  fatalError: KiwiMidiFatalError;
}) => {
  return (
    <Alert
      variant="filled"
      color="red"
      title="Fatal Error"
      icon={<IconExclamationCircle />}
    >
      Kiwi-106 encountered a fatal error <Code>{fatalError}</Code> and cannot recover. You
      should restart your browser to try again.
    </Alert>
  );
};
