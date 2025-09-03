import { IntRange } from "./IntRange";
import { MidiChannel, Nibble } from "./Midi";

export const kiwi106MessageModes = ["off", "rx", "tx", "rx-tx"] as const;
export type Kiwi106MessageMode = (typeof kiwi106MessageModes)[number];

export const kiwi106MidiSoftThroughModes = [
  "stop-all",
  "pass-all",
  "pass-only-non-cc",
  "stop-only-cc-used",
] as const;
export type Kiwi106MidiSoftThroughMode =
  (typeof kiwi106MidiSoftThroughModes)[number];

export const kiwi106MidiClockGenModes = [
  "internal",
  "midi",
  "ext step",
  "ext 24ppqn",
  "ext 48ppqn",
] as const;
export type Kiwi106MidiClockGenMode = (typeof kiwi106MidiClockGenModes)[number];

/**
 * Sysex Global Dump data
 */
export interface KiwiGlobalData {
  midiChannelIn: MidiChannel;
  midiChannelOut: MidiChannel;
  sequencerMidiChannelOut: MidiChannel;
  deviceId: Nibble;
  enableControlChange: Kiwi106MessageMode;
  enableSysex: boolean;
  enableProgramChange: Kiwi106MessageMode;
  midiSoftThrough: Kiwi106MidiSoftThroughMode;
  enableMidiClockGen: boolean;
  internalVelocity: IntRange<0, 128>;
  masterClockSource: Kiwi106MidiClockGenMode;
  // xx= 000-Internal
  // 001-Midi
  // 010-Ext Step
  // 011-Ext 24ppqn
  // 100-Ext 48ppqn
  // Note – Master Clock will be divided according to the
  // Arp/Seq/LFO Clock Divide options

  patternLevel: number; // 12 bit word
  patternDestinationVca: boolean;
  patternDestinationVcf: boolean;
  patternClockSource: "arp" | "seq";

  intClockRate: number; // Range is 0-255 for 5-300 BPM
  mwLevel: number; // I have NO IDEA what this is
  atLevel: number; // I have NO IDEA what this is
  keyTransposeDisable: boolean;
  clockDisplay: boolean;
  scrollingDisplay: boolean;
  internalTune: number; // 0=use fine tune knob
  // 1-127=override fine tune
  externalPedalPolarity: "normal" | "inverse";
}
