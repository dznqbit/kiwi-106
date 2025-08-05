import { KiwiPatch } from "../types/KiwiPatch";

// Return a machine-readable value for a given Kiwi106 param
const kiwiControllerValues: Record<keyof KiwiPatch, number> = {
  portamentoTime: 0x05,
  volume: 0x07,

  dcoRange: 0x08,
  dcoWave: 0x09,
  dcoPwmModAmount: 0x0a,
  dcoPwmControl: 0x0b,
  dcoLfoModAmount: 0x0c,
  dcoLfoSource: 0x0d,
  dcoEnvelopeModAmount: 0x0e,
  dcoEnvelopeSource: 0x0f,

  lfoMode: 0x10,
  lfo1Wave: 0x12,
  lfo1Rate: 0x13,
  lfo1Delay: 0x14,
  lfo2Wave: 0x15,
  lfo2Rate: 0x16,
  lfo2Delay: 0x17,
  lfo1Mode: 0x18,
  lfo2Mode: 0x19,

  subLevel: 0x21,
  noiseLevel: 0x22,

  vcfLowPassCutoff: 0x29,
  vcfLowPassResonance: 0x2a,
  vcfPitchFollow: 0x2b,
  vcfHiPassCutoff: 0x2c,
  vcfLfoModAmount: 0x2d,
  vcfLfoSource: 0x2e,
  vcfEnvelopeModAmount: 0x2f,
  vcfEnvelopeSource: 0x30,

  env1Attack: 0x33,
  env1Decay: 0x34,
  env1Sustain: 0x35,
  env1Release: 0x36,
  chorusMode: 0x39,
  vcaLfoModAmount: 0x3b,
  vcaLfoSource: 0x3c,
  vcaMode: 0x3d,

  env2Attack: 0x41,
  env2Decay: 0x42,
  env2Sustain: 0x43,
  env2Release: 0x44,
  dcoBendAmount: 0x45,
  vcfBendAmount: 0x46,
  lfoModWheelAmount: 0x47,

  keyMode: 0x68,
  keyAssignDetune: 0x69,
  keyAssignDetuneMode: 0x6a,
};

export const kiwiCcController = (k: keyof KiwiPatch): number => {
  return kiwiControllerValues[k];
};

export const kiwiPatchKey = (cc: number): keyof KiwiPatch | undefined => {
  return Object.keys(kiwiControllerValues).find(
    (k) => kiwiControllerValues[k as keyof KiwiPatch] === cc,
  ) as keyof KiwiPatch | undefined;
};
