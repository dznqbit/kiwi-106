import { Group, Text } from "@mantine/core";
import { NoteMidiMessage } from "../../utils/formatMidiMessage";

export const NoteMidiMessageData = ({
  formattedMessage,
}: {
  formattedMessage: NoteMidiMessage;
}) => {
  return (
    <Group>
      <Text>{formattedMessage.noteLabel}</Text>
      <Text>{formattedMessage.velocity}</Text>
    </Group>
  );
};
