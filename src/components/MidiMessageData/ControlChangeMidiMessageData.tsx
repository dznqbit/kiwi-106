import { Group, Text } from "@mantine/core";
import { ControlChangeMidiMessage } from "../../utils/formatMidiMessage";

export const ControlChangeMidiMessageData = ({
  formattedMessage,
}: {
  formattedMessage: ControlChangeMidiMessage;
}) => {
  return (
    <Group>
      <Text>{formattedMessage.controllerName}</Text>
      <Text>{formattedMessage.controllerValue}</Text>
    </Group>
  );
};
