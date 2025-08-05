// Local convenience types

import { IntRange } from "./IntRange";

export type MidiMessageType =
  | "noteon"
  | "noteoff"
  | "controlchange"
  | "programchange"
  | "pitchbend"
  | "sysex"
  | "channelaftertouch"
  | "keyaftertouch";
export type MidiCcValue = IntRange<0, 128>;
export type MidiChannel = IntRange<0, 16>;

export const isMidiMessageType = (
  messageType: string,
): messageType is MidiMessageType => {
  const messageTypes = new Set([
    "noteon",
    "noteoff",
    "controlchange",
    "programchange",
    "pitchbend",
    "sysex",
  ]);
  return messageTypes.has(messageType);
};
