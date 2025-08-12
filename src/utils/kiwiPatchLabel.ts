import { KiwiPatch } from "../types/KiwiPatch";

export const labelMapping: Record<keyof KiwiPatch, string> = {
  portamentoTime: "Portamento Time",
  volume: "Volume",
  dcoRange: "DCO Range",
  dcoWave: "DCO Wave",
  dcoPwmModAmount: "DCO PWM Mod Amount",
  dcoPwmControl: "DCO PWM Control",
  dcoLfoModAmount: "DCO LFO Mod Amount",
  dcoLfoSource: "DCO LFO Source",
  dcoEnvelopeModAmount: "DCO Envelope Mod Amount",
  dcoEnvelopeSource: "DCO Envelope Source",

  lfoMode: "LFO Mode",
  lfo1Wave: "LFO 1 Wave",
  lfo1Rate: "LFO 1 Rate",
  lfo1Delay: "LFO 1 Delay",
  lfo2Wave: "LFO 2 Wave",
  lfo2Rate: "LFO 2 Rate",
  lfo2Delay: "LFO 2 Delay",
  lfo1Mode: "LFO 1 Mode",
  lfo2Mode: "LFO 2 Mode",

  subLevel: "Sub Level",
  noiseLevel: "Noise Level",
  vcfLowPassCutoff: "VCF Low Pass Cutoff",
  vcfLowPassResonance: "VCF Low Pass Resonance",
  vcfPitchFollow: "VCF Pitch Follow",
  vcfHiPassCutoff: "VCF Hi Pass Cutoff",
  vcfLfoModAmount: "VCF LFO Mod Amount",
  vcfLfoSource: "VCF LFO Source",
  vcfEnvelopeModAmount: "VCF Envelope Mod Amount",

  vcfEnvelopeSource: "VCF Envelope Source",
  env1Attack: "Env 1 Attack",
  env1Decay: "Env 1 Decay",
  env1Sustain: "Env 1 Sustain",
  env1Release: "Env 1 Release",
  chorusMode: "Chorus Off / I / II",
  vcaLfoModAmount: "VCA LFO Mod Amount",
  vcaLfoSource: "VCA LFO Source",
  vcaMode: "VCA Mode",

  env2Attack: "Env 2 Attack",
  env2Decay: "Env 2 Decay",
  env2Sustain: "Env 2 Sustain",
  env2Release: "Env 2 Release",
  dcoBendAmount: "DCO Bend Amount",
  vcfBendAmount: "VCF Bend Amount",
  lfoModWheelAmount: "DCO LFO Mod Amount",

  keyMode: "Key Mode",
  keyAssignDetune: "Key Assign Detune",
  keyAssignDetuneMode: "Key Assign Detune Mode",
};

export const kiwiPatchLabel = (k: keyof KiwiPatch) => {
  return labelMapping[k];
};
