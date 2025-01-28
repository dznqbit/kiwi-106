import { MessageEvent, Enumerations } from "webmidi";
import { MidiMessageType } from "../types/Midi";
import { format } from "date-fns";

interface FormattedMidiMessage {
  messageType: MidiMessageType;
  channel: number | null;
  messageData: string; // inside the messagedata we might format further... humm
  label: string;
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

// format MessageEvent for our message log
export const formatMidiMessage = (messageEvent: MessageEvent): FormattedMidiMessage => {
  const message = messageEvent.message;
  const messageData = messageEvent.message.data;
  const messageType = message.type;

  const firstByte = messageData[0];
  const firstFourBits = firstByte >> 4;
  // const channel = firstByte & 0b00001111 + 1;
  const channel = message.isChannelMessage ? message.channel : null;
  const messageLabel = midiMessageLabels[messageType] ?? messageType;
  
  return {
    messageType,
    channel,
    messageData: messageData.map(b => b.toString(16).toUpperCase()).join(", "),
    label: midiMessageLabels[firstFourBits] ?? '???',
  }
}