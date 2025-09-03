import {
  isMidiCcValue,
  isMidiChannel,
  MidiCcValue,
  MidiChannel,
} from "../types/Midi";

export const trimMidiChannel: (v: number) => MidiChannel = (v) => {
  const midiChannel = Math.min(15, Math.max(0, v)) + 1;
  if (isMidiChannel(midiChannel)) {
    return midiChannel;
  } else {
    throw new Error(`Invalid MidiChannel value (${v})`);
  }
};

export const trimMidiCcValue: (n: number) => MidiCcValue = (n) => {
  const trimmed = trimIntRange(n, { min: 0, max: 127 });
  if (isMidiCcValue(trimmed)) {
    return trimmed;
  } else {
    throw new Error("what the hell");
  }
};

const trimIntRange = (
  n: number,
  { min, max }: { min: number; max: number },
) => {
  return Math.min(max, Math.max(min, n));
};
