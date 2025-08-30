import { isMidiChannel, MidiCcValue, MidiChannel } from "../types/Midi";

export const trimMidiChannel: (v: number) => MidiChannel = (v) => {
  const midiChannel = Math.min(15, Math.max(0, v)) + 1;
  if (isMidiChannel(midiChannel)) {
    return midiChannel;
  } else {
    throw new Error(`Invalid MidiChannel value (${v})`);
  }
};

export const trimMidiCcValue: (n: number) => MidiCcValue = (v) => {
  return Math.min(127, Math.max(0, v)) as MidiCcValue;
};
