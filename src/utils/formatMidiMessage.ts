import { MessageEvent } from "webmidi";
import { isMidiMessageType, MidiMessageType } from "../types/Midi";
import { kiwiCcLabel } from "./kiwiCcLabel";
import { noteLabel } from "./noteLabel";
import { isSysexDeviceEnquiryReply, kiwiTechnicsSysexId } from "./sysexUtils";
import * as _ from 'lodash'

interface BaseFormattedMidiMessage {
  messageType: MidiMessageType;
  label: string;
  channel: number | null;
  data: number[];
}

interface ControlChangeMidiMessage extends BaseFormattedMidiMessage {
  messageType: 'controlchange';
  controllerName: string;  // Formatted name
  controllerValue: string; // Formatted value label
}

export const isControlChangeMidiMessage = (x: FormattedMidiMessage): x is ControlChangeMidiMessage => {
  return x.messageType === 'controlchange'
}

interface NoteMidiMessage extends BaseFormattedMidiMessage {
  messageType: 'noteon' | 'noteoff';
  note: number;
  noteLabel: string;
  velocity: number;
}

export const isNoteMidiMessage = (x: FormattedMidiMessage): x is NoteMidiMessage => {
  return ['noteon', 'noteoff'].includes(x.messageType)
}

interface BaseSysexMidiMessage extends BaseFormattedMidiMessage {
  messageType: 'sysex';
}

interface DeviceEnquirySysexMidiMessage extends BaseSysexMidiMessage {
  manufacturer: string;
  productFamilyId: number;
  productId: number;
  programVersion: number;
  bootloaderVersion: number;
  buildNumber: number;
  decideId: number; // Global Parameter 3 ???
}

type SysexMidiMessage = BaseSysexMidiMessage;
export type FormattedMidiMessage = BaseFormattedMidiMessage | ControlChangeMidiMessage | NoteMidiMessage | SysexMidiMessage;

const midiMessageLabels: Record<MidiMessageType, string | undefined> = {
  'noteon': 'NoteOn',
  'noteoff': 'NoteOff',
  'pitchbend': 'PitchBend',
  'controlchange': 'ControlChange',
  'programchange': 'ProgramChange',
  'channelaftertouch': 'ChannelAftertouch',
  'keyaftertouch': 'KeyAftertouch',
  'sysex': 'Sysex'
}

const midiMessageType = (messageType: string): MidiMessageType => {
  if (isMidiMessageType(messageType)) {
    return messageType;
  } else {
    throw new Error(`Unknown messageType: ${messageType}`);
  }
}

// format MessageEvent for our message log
export const formatMidiMessage = (messageEvent: MessageEvent): FormattedMidiMessage => {
  const message = messageEvent.message;
  const messageData = messageEvent.message.data;
  const messageType = midiMessageType(message.type);

  // const firstByte = messageData[0];
  // const firstFourBits = firstByte >> 4;
  // const channel = firstByte & 0b00001111 + 1;
  const channel = message.isChannelMessage ? message.channel : null;
  // const messageLabel = midiMessageLabels[messageType] ?? messageType;

  const baseMessageData = {
    messageType,
    label: midiMessageLabels[messageType] ?? 'Unknown',
    channel,
    data: messageData
  };

  switch (messageType) {
    case 'controlchange':
      return {
        ...baseMessageData,
        controllerName: kiwiCcLabel(messageData[1]),
        controllerValue: String(messageData[2]),
      };
    case 'noteon':
    case 'noteoff':
      return {
        ...baseMessageData,
        note: messageData[0],
        noteLabel: noteLabel(messageData[0]),
        velocity: messageData[1]
      };
    case 'sysex':
      if (isSysexDeviceEnquiryReply(message)) {
        const manufacturerId = messageData.slice(5, 8) 
        if (_.isEqual(manufacturerId, kiwiTechnicsSysexId)) {
          const deviceEnquiryReply: DeviceEnquirySysexMidiMessage = {
            ...baseMessageData,
            messageType,
            manufacturer: "Kiwitechnics",
            productFamilyId: messageData[9],
            productId: messageData[10],
            programVersion: (messageData[11] << 4) + messageData[12],
            bootloaderVersion: (messageData[13] << 4) + messageData[14],
            buildNumber: messageData[15],
            decideId: messageData[16],
          }

          console.log({ deviceEnquiryReply })
          return deviceEnquiryReply
        } else {
          throw new Error("Received unexpected Sysex")
        }
        return {
          ...baseMessageData,
        }
      } else {
        return {
          ...baseMessageData,
        }
      }
    default:
      return baseMessageData
  }
}