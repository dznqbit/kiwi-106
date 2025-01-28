import { MessageEvent, WebMidi } from "webmidi";
import { Button, Group, Stack, Table, Title, Text } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";
import { useMidiMessageStore } from "../stores/midiMessageStore";
import { formatMidiMessage } from "../utils/formatMidiMessage";
import { IconTrash } from "@tabler/icons-react";
import { noteLabel } from "../utils/noteLabel";
import { kiwiCcLabel } from "../utils/kiwiCcLabel";

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
            {messageEvents.map((me) => (
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
  const { messageType, channel } = formatMidiMessage(messageEvent);
  // const channel = firstByte & 0b00001111 + 1;
  // const messageLabel = midiMessageLabels[messageType] ?? messageType;

  return (<Table.Tr>
    <Table.Td>{messageType}</Table.Td>
    <Table.Td>{channel ?? 'ALL'}</Table.Td>
    <Table.Td><MessageData messageEvent={messageEvent} /></Table.Td>
  </Table.Tr>);
}

const MessageData = ({ messageEvent }: MidiMessageRowParams) => {
  switch (messageEvent.message.type) {
    case 'noteon':
      return <NoteOn messageEvent={messageEvent} />;
    case 'noteoff':
      return <NoteOff messageEvent={messageEvent} />;
    case 'controlchange':
      return <ControlChange messageEvent={messageEvent} />;
    case 'programchange':
      return <ProgramChange messageEvent={messageEvent} />;
    default:
      return <GenericMessage messageEvent={messageEvent} />;
  }
}

const NoteOn = ({ messageEvent }: MidiMessageRowParams) => {
  const [_, note, velocity] = messageEvent.message.data;

  return (
    <Group>
      <Text>{noteLabel(note)}</Text>
      <Text>{velocity}</Text>
    </Group>
  )
}

const NoteOff = ({ messageEvent }: MidiMessageRowParams) => {
  const [_, note, velocity] = messageEvent.message.data;

  return (
    <Group>
      <Text>{noteLabel(note)}</Text>
      <Text>{velocity}</Text>
    </Group>
  )
}

const ControlChange = ({ messageEvent }: MidiMessageRowParams) => {
  const [_, b1, b2] = messageEvent.message.data;

  return (
    <Group>
      <Text>{kiwiCcLabel(b1)}</Text>
      <Text>{b2}</Text>
    </Group>
  )
}

const ProgramChange = ({ messageEvent }: MidiMessageRowParams) => {
  const [_, b1, b2] = messageEvent.message.data;

  return (
    <Group>
      <Text>{b1}</Text>
      <Text>{b2}</Text>
    </Group>
  )
}

const GenericMessage = ({ messageEvent }: MidiMessageRowParams) => {
  const messageData = messageEvent.message.data;
  return (
    <Text>
      {messageData.map(b => b.toString(16).toUpperCase()).join(", ")}
    </Text>
  )
}