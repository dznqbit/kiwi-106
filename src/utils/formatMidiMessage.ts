import { MessageEvent } from "webmidi";
import { isMidiMessageType, MidiChannel, MidiMessageType } from "../types/Midi";
import { kiwiCcLabel } from "./kiwiCcLabel";
import { noteLabel } from "./noteLabel";
import { isKiwi106GlobalDumpSysexMessage, isSysexDeviceEnquiryReply, kiwiTechnicsSysexId } from "./sysexUtils";
import * as _ from 'lodash'
import { trimMidiChannel } from "./trimMidiCcValue";

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

interface Kiwi106GlobalDumpSysexMidiMessage extends BaseSysexMidiMessage {
   midiChannelIn: MidiChannel;
   midiChannelOut: MidiChannel;
   sequencerMidiChannelOut: MidiChannel;
   deviceId: number;
   enableMidiCc: number;
   enableSysex: number;
   enableProgramChange: number;
   midiSoftThrough: number;
   enableMidiClockGen: number;
   internalVelocity: number;
   masterClockSource: number;

   patternLevelHi: number;
   patternLevelLo: number;
   patternControl: number;

   clockRateHi: number;
   clockRateLo: number;

   mwLevel: number;
   atLevel: number;
   keyTransposeDisable: number;
   displayMode: number;
   memoryProtect: number;
   internalTune: number;
   externalPedalPolarity: number;
}

interface Kiwi106PatchDumpSysexMidiMessage extends BaseSysexMidiMessage {
  midiChannelIn: MidiChannel;
  midiChannelOut: MidiChannel;
  sequencerMidiChannelOut: MidiChannel;
  deviceId: number;
  enableMidiCc: number;
  enableSysex: number;
  enableProgramChange: number;
  midiSoftThrough: number;
  enableMidiClockGen: number;
  internalVelocity: number;
  masterClockSource: number;

  patternLevelHi: number;
  patternLevelLo: number;
  patternControl: number;

  clockRateHi: number;
  clockRateLo: number;

  mwLevel: number;
  atLevel: number;
  keyTransposeDisable: number;
  displayMode: number;
  memoryProtect: number;
  internalTune: number;
  externalPedalPolarity: number;
}

type SysexMidiMessage = DeviceEnquirySysexMidiMessage | Kiwi106GlobalDumpSysexMidiMessage;
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
  const channel = message.isChannelMessage ? message.channel : null;

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
        noteLabel: noteLabel(messageData[1]),
        velocity: messageData[2]
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
      }

      if (isKiwi106GlobalDumpSysexMessage(message)) {
        const kiwi106GlobalDump: Kiwi106GlobalDumpSysexMidiMessage = {
          ...baseMessageData,
          messageType,
          midiChannelIn: trimMidiChannel(messageData[8]),
          midiChannelOut: trimMidiChannel(messageData[9]),
          sequencerMidiChannelOut: trimMidiChannel(messageData[10]),
          deviceId: messageData[11],
          enableMidiCc: messageData[12],
          enableSysex: messageData[13],
          enableProgramChange: messageData[14],
          midiSoftThrough: messageData[15],
          enableMidiClockGen: messageData[16],
          internalVelocity: messageData[17],
          masterClockSource: messageData[18],
          patternLevelHi: messageData[22],
          patternLevelLo: messageData[23],
          patternControl: messageData[24],
          clockRateHi: messageData[25],
          clockRateLo: messageData[26],
          mwLevel: messageData[27],
          atLevel: messageData[28],
          keyTransposeDisable: messageData[29],
          displayMode: messageData[30],
          memoryProtect: messageData[31],
          internalTune: messageData[33],
          externalPedalPolarity: messageData[34]
        }

        console.log(kiwi106GlobalDump)
        return kiwi106GlobalDump
      }

      return {
        ...baseMessageData,
      }
    default:
      return baseMessageData
  }
}