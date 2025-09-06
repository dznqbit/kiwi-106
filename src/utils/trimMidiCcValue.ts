import {
  isMidiCcValue,
  isMidiChannel,
  isNibble,
  MidiCcValue,
  MidiChannel,
  Nibble,
} from "../types/Midi";

export const trimNibble: (n: number) => Nibble = (n) => {
  const trimmed = trimIntRange(n, { min: 0, max: 15 });
  if (isNibble(trimmed)) {
    return trimmed;
  } else {
    throw new Error(`Invalid nibble value (${n})`);
  }
}

export const trimMidiChannel: (n: number) => MidiChannel = (n) => {
  const midiChannel = trimIntRange(n, { min: 1, max: 16 });
  if (isMidiChannel(midiChannel)) {
    return midiChannel;
  } else {
    throw new Error(`Invalid MidiChannel (${n})`);
  }
};

export const trimMidiCcValue: (n: number) => MidiCcValue = (n) => {
  const trimmed = trimIntRange(n, { min: 0, max: 127 });
  if (isMidiCcValue(trimmed)) {
    return trimmed;
  } else {
    throw new Error(`${trimmed} is not a MidiCcValue`);
  }
};

export const trimIntRange = (
  n: number,
  { min = 0, max }: { min: number; max: number },
) => {
  return Math.floor(Math.min(max, Math.max(min, n)));
};
