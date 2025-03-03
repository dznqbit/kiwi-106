import { MessageEvent, WebMidi } from "webmidi";
import { Button, Group, Stack, Table, Title, Text } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";
import { useMidiMessageStore } from "../stores/midiMessageStore";
import { formatMidiMessage, FormattedMidiMessage, isControlChangeMidiMessage, isNoteMidiMessage } from "../utils/formatMidiMessage";
import { IconTrash } from "@tabler/icons-react";

export const MidiMessageTable = () => {
  const configStore = useConfigStore();
  const midiMessageStore = useMidiMessageStore();
  const midiContext = useMidiContext();

  useEffect(() => {
    if (!midiContext.enabled) {
      console.log("MessageLog: WebMidi not enabled, dropping");
      return;
    }

    if (configStore.input == null) {
      console.log("MessageLog: No input selected, dropping");
      return;
    }

    const input = WebMidi.getInputById(configStore.input.id);
    if (!input) {
      console.log("MessageLog: cannot listen, dropping out");
      return;
    }

    const logMessage = (e: MessageEvent) => {
      const messageType = e.message.type;

      if (messageType === "clock") {
        return;
      }

      console.log(e.type, messageType, e);
      midiMessageStore.addMessageEvent(e);
    };

    input.addListener("midimessage", logMessage);
    console.log("MessageLog: now listening...");

    return () => {
      input.removeListener("midimessage", logMessage);
    };
  }, [midiContext.enabled, configStore.input, configStore.inputChannel]);

  const { messageEvents, clear: clearMidiMessages } = midiMessageStore;
  return (
    <Stack>
      <Group>
        <Title>Message Log ({messageEvents.length})</Title>
        <Button onClick={() => clearMidiMessages()} leftSection={<IconTrash />}>Clear</Button>
      </Group>
      
      <Table.ScrollContainer h={256} minWidth={512}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={128}>Type</Table.Th>
              <Table.Th w={32}>Channel</Table.Th>
              <Table.Th>Message</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {messageEvents.slice(0, 20).map((me) => (
              <MidiMessageRow messageEvent={me} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
};

interface MidiMessageRowParams {
  messageEvent: MessageEvent;
}

const MidiMessageRow = ({ messageEvent }: MidiMessageRowParams) => {
  const formattedMessage = formatMidiMessage(messageEvent);

  return (<Table.Tr>
    <Table.Td>{formattedMessage.label}</Table.Td>
    <Table.Td>{formattedMessage.channel ?? 'ALL'}</Table.Td>
    <Table.Td><MessageData messageEvent={messageEvent} formattedMessage={formattedMessage} /></Table.Td>
  </Table.Tr>);
}

interface MessageDataParams {
  messageEvent: MessageEvent
  formattedMessage: FormattedMidiMessage
}

const MessageData = ({ messageEvent, formattedMessage }: MessageDataParams) => {
  if (isControlChangeMidiMessage(formattedMessage)) {
    return <Group>
      <Text>{formattedMessage.controllerName}</Text>
      <Text>{formattedMessage.controllerValue}</Text>
    </Group>
  }

  if (isNoteMidiMessage(formattedMessage)) {
    return <Group>
      <Text>{formattedMessage.noteLabel}</Text>
      <Text>{formattedMessage.velocity}</Text>
    </Group>
  }

  return <Text>{messageEvent.data.map(b => b.toString(16).toUpperCase()).join(", ")}</Text>
}