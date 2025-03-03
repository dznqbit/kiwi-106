import { MidiCcValue } from "./Midi";

export interface KiwiPatch {
  portamentoTime: MidiCcValue;
  volume: MidiCcValue;
  
  dcoRange: MidiCcValue;
  dcoWave: MidiCcValue;
  dcoPwmModAmount: MidiCcValue;
  dcoPwmControl: MidiCcValue;
  dcoLfoModAmount: MidiCcValue;
  dcoLfoSource: MidiCcValue;
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
  vcfLfoSource: MidiCcValue;
  vcfEnvelopeModAmount: MidiCcValue;
  vcfEnvelopeSource: MidiCcValue;

  env1Attack: MidiCcValue;
  env1Decay: MidiCcValue;
  env1Sustain: MidiCcValue;
  env1Release: MidiCcValue;
  
  chorusMode: MidiCcValue;
  vcaLfoModAmount: MidiCcValue;
  vcaLfoSource: MidiCcValue;
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