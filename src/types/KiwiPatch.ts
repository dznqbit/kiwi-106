import { MidiCcValue } from "./Midi";

export type KiwiPatchIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const isKiwiPatchIndex = (n: unknown): n is KiwiPatchIndex => {
  return typeof n === "number" && n >= 1 && n <= 8;
};

export type KiwiPatchAddress = {
  group: KiwiPatchIndex;
  bank: KiwiPatchIndex;
  patch: KiwiPatchIndex;
};

export type DcoRange = "16" | "8" | "4";
export const isDcoRange = (x: unknown): x is DcoRange => {
  return typeof x === "string" && ["16", "8", "4"].includes(x);
};

const dcoWaves = ["off", "ramp", "pulse", "ramp-and-pulse"] as const;
export type DcoWave = (typeof dcoWaves)[number];
export const isDcoWave = (x: unknown): x is DcoWave => {
  return typeof x === "string" && dcoWaves.includes(x as DcoWave);
};

const lfoSources = ["lfo1", "lfo2", "lfo1-inverted", "lfo2-inverted"] as const;
export type LfoSource = (typeof lfoSources)[number];
export const isLfoSource = (x: unknown): x is LfoSource => {
  return typeof x === "string" && lfoSources.includes(x as LfoSource);
}

export type PwmControlSource =
  | "manual"
  | "lfo1"
  | "lfo2"
  | "env1"
  | "env2"
  | "env1-inverted"
  | "env2-inverted";
export type EnvelopeSource =
  | "env1"
  | "env2"
  | "env1-inverted"
  | "env2-inverted";
export type LfoWaveform =
  | "sine"
  | "square"
  | "sawtooth"
  | "triangle"
  | "reverse-sawtooth"
  | "random";

export interface KiwiPatch {
  patchName: string;

  portamentoTime: MidiCcValue;
  volume: MidiCcValue;

  dcoRange: DcoRange;
  dcoWave: DcoWave;
  dcoPwmModAmount: MidiCcValue;
  dcoPwmControl: MidiCcValue;
  dcoLfoModAmount: MidiCcValue;
  dcoLfoSource: LfoSource;
  dcoEnvelopeModAmount: MidiCcValue;
  dcoEnvelopeSource: MidiCcValue;

  lfoMode: MidiCcValue;
  lfo1Wave: MidiCcValue;
  lfo1Rate: MidiCcValue;
  lfo1Delay: MidiCcValue;
  lfo2Wave: MidiCcValue;
  lfo2Rate: MidiCcValue;
  lfo2Delay: MidiCcValue;
  lfo1Mode: MidiCcValue;
  lfo2Mode: MidiCcValue;

  subLevel: MidiCcValue;
  noiseLevel: MidiCcValue;

  vcfLowPassCutoff: MidiCcValue;
  vcfLowPassResonance: MidiCcValue;
  vcfPitchFollow: MidiCcValue;
  vcfHiPassCutoff: MidiCcValue;
  vcfLfoModAmount: MidiCcValue;
  vcfLfoSource: LfoSource;
  vcfEnvelopeModAmount: MidiCcValue;
  vcfEnvelopeSource: MidiCcValue;

  env1Attack: MidiCcValue;
  env1Decay: MidiCcValue;
  env1Sustain: MidiCcValue;
  env1Release: MidiCcValue;

  chorusMode: MidiCcValue;
  vcaLfoModAmount: MidiCcValue;
  vcaLfoSource: LfoSource;
  vcaMode: MidiCcValue;

  env2Attack: MidiCcValue;
  env2Decay: MidiCcValue;
  env2Sustain: MidiCcValue;
  env2Release: MidiCcValue;

  dcoBendAmount: MidiCcValue;
  vcfBendAmount: MidiCcValue;
  lfoModWheelAmount: MidiCcValue;

  keyMode: MidiCcValue;
  keyAssignDetune: MidiCcValue;
  keyAssignDetuneMode: MidiCcValue;
}
