import { MidiCcValue, MidiChannel } from "../types/Midi";

export const trimMidiChannel: (n: number) => MidiChannel = (v) => {
  return Math.min(15, Math.max(0, v)) as MidiChannel;
}

export const trimMidiCcValue: (n: number) => MidiCcValue = (v) => {
  return Math.min(127, Math.max(0, v)) as MidiCcValue;
}
