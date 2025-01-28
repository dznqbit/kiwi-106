import { MidiCcValue } from "../types/Midi";

export const trimMidiCcValue: (n: number) => MidiCcValue = (v) => Math.min(127, Math.max(0, v)) as MidiCcValue;