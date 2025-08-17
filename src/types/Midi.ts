// Local convenience types
import { Message } from "webmidi";
import { IntRange } from "./IntRange";

// TODO: swap all messages over to MidiMessage typeo
export type MidiMessage = Message;
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

export const isMidiCcValue = (x: unknown): x is MidiCcValue => {
  return (
    typeof x === "number" && !x.toString().includes(".") && x >= 0 && x < 128
  );
};

export const isMidiChannel = (x: unknown): x is MidiChannel => {
  return (
    typeof x === "number" && !x.toString().includes(".") && x >= 0 && x < 16
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
