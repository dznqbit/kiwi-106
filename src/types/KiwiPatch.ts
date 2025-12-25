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
};

const pwmControlSources = [
  "manual",
  "lfo1",
  "lfo2",
  "env1",
  "env2",
  "env1-inverted",
  "env2-inverted",
] as const;
export type PwmControlSource = (typeof pwmControlSources)[number];
export const isPwmControlSource = (x: unknown): x is PwmControlSource => {
  return (
    typeof x === "string" && pwmControlSources.includes(x as PwmControlSource)
  );
};

const envelopeSources = [
  "env1",
  "env2",
  "env1-inverted",
  "env2-inverted",
] as const;
export type EnvelopeSource = (typeof envelopeSources)[number];
export const isEnvelopeSource = (x: unknown): x is EnvelopeSource => {
  return typeof x === "string" && envelopeSources.includes(x as EnvelopeSource);
};

const lfoWaveforms = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
  "reverse-sawtooth",
  "random",
] as const;
export type LfoWaveform = (typeof lfoWaveforms)[number];
export const isLfoWaveform = (x: unknown): x is LfoWaveform => {
  return typeof x === "string" && lfoWaveforms.includes(x as LfoWaveform);
};

const lfoModes = ["normal", "plus"] as const;
export type LfoMode = (typeof lfoModes)[number];
export const isLfoMode = (x: unknown): x is LfoMode => {
  return typeof x === "string" && lfoModes.includes(x as LfoMode);
};

const chorusModes = ["off", "chorus1", "chorus2"] as const;
export type ChorusMode = (typeof chorusModes)[number];
export const isChorusMode = (x: unknown): x is ChorusMode => {
  return typeof x === "string" && chorusModes.includes(x as ChorusMode);
};

const vcaModes = ["gate", "env1", "env2"] as const;
export type VcaMode = (typeof vcaModes)[number];
export const isVcaMode = (x: unknown): x is VcaMode => {
  return typeof x === "string" && vcaModes.includes(x as VcaMode);
};

const keyModes = [
  "poly1",
  "poly2",
  "unison-legato",
  "unison-staccato",
  "mono-legato",
  "mono-staccato",
] as const;
export type KeyMode = (typeof keyModes)[number];
export const isKeyMode = (x: unknown): x is KeyMode => {
  return typeof x === "string" && keyModes.includes(x as KeyMode);
};

const keyAssignDetuneModes = ["mono", "all"] as const;
export type DetuneMode = (typeof keyAssignDetuneModes)[number];
export const isKeyAssignDetuneMode = (x: unknown): x is DetuneMode => {
  return typeof x === "string" && keyAssignDetuneModes.includes(x as DetuneMode);
};

export interface KiwiPatch {
  patchName: string;
  portamentoTime: MidiCcValue;
  volume: MidiCcValue;

  dcoRange: DcoRange;
  dcoWave: DcoWave;
  dcoPwmModAmount: MidiCcValue;
  // Can select MAN, LFO1, LFO2, but not env?
  dcoPwmControl: PwmControlSource;
  dcoLfoModAmount: MidiCcValue;
  dcoLfoSource: LfoSource;
  dcoEnvelopeModAmount: MidiCcValue;
  dcoEnvelopeSource: EnvelopeSource;

  lfo1Wave: LfoWaveform;
  // TODO: lfo1SyncMode "free-running", "sync-2-notes", etc.
  lfo1Rate: MidiCcValue;
  lfo1Delay: MidiCcValue;
  lfo1Mode: LfoMode;

  lfo2Wave: LfoWaveform;
  // TODO: lfo2SyncMode "free-running", "sync-2-notes", etc.
  lfo2Rate: MidiCcValue;
  // TODO: lfo2Delay seems to be busted over the control panel
  lfo2Delay: MidiCcValue;
  lfo2Mode: LfoMode;

  subLevel: MidiCcValue;
  noiseLevel: MidiCcValue;

  vcfLowPassCutoff: MidiCcValue;
  vcfLowPassResonance: MidiCcValue;
  vcfPitchFollow: MidiCcValue;
  vcfHiPassCutoff: MidiCcValue;
  vcfLfoModAmount: MidiCcValue;
  vcfLfoSource: LfoSource;
  vcfEnvelopeModAmount: MidiCcValue;
  vcfEnvelopeSource: EnvelopeSource;

  env1Attack: MidiCcValue;
  env1Decay: MidiCcValue;
  env1Sustain: MidiCcValue;
  env1Release: MidiCcValue;

  chorusMode: ChorusMode;
  vcaLfoModAmount: MidiCcValue;
  vcaLfoSource: LfoSource;
  vcaMode: VcaMode;

  env2Attack: MidiCcValue;
  env2Decay: MidiCcValue;
  env2Sustain: MidiCcValue;
  env2Release: MidiCcValue;

  dcoBendAmount: MidiCcValue;
  vcfBendAmount: MidiCcValue;
  lfoModWheelAmount: MidiCcValue;

  keyMode: KeyMode;
  keyAssignDetune: MidiCcValue;
  keyAssignDetuneMode: DetuneMode;
}
