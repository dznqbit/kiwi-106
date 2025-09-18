// Local convenience types
import { Message } from "webmidi";
import { IntRange } from "./IntRange";

// TODO: swap all messages over to MidiMessage type
export type MidiMessage = Pick<
  Message,
  "data" | "isChannelMessage" | "isSystemMessage"
>;
export type MidiMessageType =
  | "noteon"
  | "noteoff"
  | "controlchange"
  | "programchange"
  | "pitchbend"
  | "sysex"
  | "channelaftertouch"
  | "keyaftertouch";

export const midiCcValues = [...new Array(128)].map((_, i) => i);
export type MidiCcValue = IntRange<0, 128>;
export const midiChannels = [...new Array(16)].map((_, i) => i + 1);
export type MidiChannel = IntRange<1, 17>;
export const nibbleValues = [...new Array(16)].map((_, i) => i);
export type Nibble = IntRange<0, 16>;

export const isMidiCcValue = (x: unknown): x is MidiCcValue => {
  return (
    typeof x === "number" && !x.toString().includes(".") && x >= 0 && x <= 127
  );
};

export const isMidiChannel = (x: unknown): x is MidiChannel => {
  return (
    typeof x === "number" && !x.toString().includes(".") && x >= 1 && x <= 16
  );
};

export const isNibble = (x: unknown): x is Nibble => {
  return (
    typeof x === "number" && !x.toString().includes(".") && x >= 0 && x <= 15
  );
};

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
