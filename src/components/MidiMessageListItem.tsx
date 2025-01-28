import { MessageEvent, Enumerations } from "webmidi";
import { Group, List , Text } from "@mantine/core";
import { noteLabel } from "../utils/noteLabel";

interface MidiMessageListItemParams {
  messageEvent: MessageEvent;
}

const midiMessageLabels: Record<number, string | undefined> = {
  [Enumerations.CHANNEL_MESSAGES.noteon]: 'NoteOn',
  [Enumerations.CHANNEL_MESSAGES.noteoff]: 'NoteOff',
  [Enumerations.CHANNEL_MESSAGES.pitchbend]: 'PitchBend',
  [Enumerations.CHANNEL_MESSAGES.controlchange]: 'ControlChange',
  [Enumerations.CHANNEL_MESSAGES.programchange]: 'ProgramChange',
  [Enumerations.CHANNEL_MESSAGES.channelaftertouch]: 'ChannelAftertouch',
  [Enumerations.CHANNEL_MESSAGES.keyaftertouch]: 'KeyAftertouch',
}

const X = List.Item;

const NoteOn = ({ messageEvent }: MidiMessageListItemParams) => {
  const [_, note, velocity] = messageEvent.message.data;

  return <X>
    <Group>
      <Text>NoteOn</Text>
      <Text>{noteLabel(note)}</Text>
      <Text>{velocity}</Text>
    </Group>
  </X>
}

const NoteOff = ({ messageEvent }: MidiMessageListItemParams) => {
  const [_, note, velocity] = messageEvent.message.data;

  return <X>
    <Group>
      <Text>NoteOff</Text>
      <Text>{noteLabel(note)}</Text>
      <Text>{velocity}</Text>
    </Group>
  </X>
}

const ControlChange = ({ messageEvent }: MidiMessageListItemParams) => {
  const [_, b1, b2] = messageEvent.message.data;

  return <X>
    <Group>
      <Text>CC</Text>
      <Text>{b1}</Text>
      <Text>{b2}</Text>
    </Group>
  </X>
}

const ProgramChange = ({ messageEvent }: MidiMessageListItemParams) => {
  const [_, b1, b2] = messageEvent.message.data;

  return <X>
    <Group>
      <Text>PC</Text>
      <Text>{b1}</Text>
      <Text>{b2}</Text>
    </Group>
  </X>
}

const GenericMessage = ({ messageEvent }: MidiMessageListItemParams) => {
  const messageData = messageEvent.message.data;
  return <X>
    <Text>
      {messageData.map(b => b.toString(16).toUpperCase()).join(", ")}
    </Text>
  </X>
}

export const MidiMessageListItem = ({ messageEvent }: MidiMessageListItemParams) => {
  const messageData = messageEvent.message.data;

  const firstByte = messageData[0];
  const messageType = firstByte >> 4;
  const channel = firstByte & 0b00001111 + 1;
  const messageLabel = midiMessageLabels[messageType] ?? messageType;

  switch (messageType) {
    case Enumerations.CHANNEL_MESSAGES.noteon:
      return NoteOn({ messageEvent });
    case Enumerations.CHANNEL_MESSAGES.noteoff:
      return NoteOff({ messageEvent });
    case Enumerations.CHANNEL_MESSAGES.controlchange:
      return ControlChange({ messageEvent });
    case Enumerations.CHANNEL_MESSAGES.programchange:
        return ProgramChange({ messageEvent });
    default:
      return GenericMessage({ messageEvent });
  }
}