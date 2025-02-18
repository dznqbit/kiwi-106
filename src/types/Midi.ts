// Local convenience types

import { IntRange } from "./IntRange";

export type MidiMessageType = "noteon" | "noteoff" | "controlchange" | "programchange" | "pitchbend";
export type MidiCcValue = IntRange<0, 127>

export const isMidiMessageType = (messageType: string): messageType is MidiMessageType => {
  const messageTypes = new Set(["noteon", "noteoff", "controlchange", "programchange", "pitchbend"])
  return messageTypes.has(messageType);
}