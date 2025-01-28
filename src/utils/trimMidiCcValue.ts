import { MidiCcValue } from "../types/Midi";

export const trimMidiCcValue: (n: number) => MidiCcValue = (v) => {
  return Math.min(127, Math.max(0, v)) as MidiCcValue;
}