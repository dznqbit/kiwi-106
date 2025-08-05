import { create } from "zustand";
import { KiwiPatch } from "../types/KiwiPatch";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";
import { MidiCcValue } from "../types/Midi";

type SetMidiCcValue = (v: number) => void;
interface KiwiPatchState {
  kiwiPatch: KiwiPatch;
}

interface KiwiPatchActions {
  setPortamentoTime: SetMidiCcValue;
  setVolume: SetMidiCcValue;
  setKiwiPatchProperty: (key: keyof KiwiPatch, value: MidiCcValue) => void;
}

type KiwiPatchStore = KiwiPatchState & KiwiPatchActions;

const blankKiwiPatchState: KiwiPatchState = {
  kiwiPatch: {
    portamentoTime: 0,
    volume: 0,
    dcoRange: 0,
    dcoWave: 0,
    dcoPwmModAmount: 0,
    dcoPwmControl: 0,
    dcoLfoModAmount: 0,
    dcoLfoSource: 0,
    dcoEnvelopeModAmount: 0,
    dcoEnvelopeSource: 0,

    lfoMode: 0,
    lfo1Wave: 0,
    lfo1Rate: 0,
    lfo1Delay: 0,
    lfo2Wave: 0,
    lfo2Rate: 0,
    lfo2Delay: 0,
    lfo1Mode: 0,
    lfo2Mode: 0,

    subLevel: 0,
    noiseLevel: 0,

    vcfLowPassCutoff: 0,
    vcfLowPassResonance: 0,
    vcfPitchFollow: 0,
    vcfHiPassCutoff: 0,
    vcfLfoModAmount: 0,
    vcfLfoSource: 0,
    vcfEnvelopeModAmount: 0,
    vcfEnvelopeSource: 0,

    env1Attack: 0,
    env1Decay: 0,
    env1Sustain: 0,
    env1Release: 0,
    chorusMode: 0,
    vcaLfoModAmount: 0,
    vcaLfoSource: 0,
    vcaMode: 0,

    env2Attack: 0,
    env2Decay: 0,
    env2Sustain: 0,
    env2Release: 0,

    dcoBendAmount: 0,
    vcfBendAmount: 0,
    lfoModWheelAmount: 0,

    keyMode: 0,
    keyAssignDetune: 0,
    keyAssignDetuneMode: 0,
  },
};

export const useKiwiPatchStore = create<KiwiPatchStore>()((set) => ({
  ...blankKiwiPatchState,

  setKiwiPatchProperty: (key, value) =>
    set(({ kiwiPatch, ...rest }) => ({
      ...rest,
      kiwiPatch: { ...kiwiPatch, [key]: value },
    })),
  setPortamentoTime: (v) =>
    set(({ kiwiPatch, ...rest }) => ({
      ...rest,
      kiwiPatch: { ...kiwiPatch, portamentoTime: trimMidiCcValue(v) },
    })),
  setVolume: (v) =>
    set(({ kiwiPatch, ...rest }) => ({
      ...rest,
      kiwiPatch: { ...kiwiPatch, volume: trimMidiCcValue(v) },
    })),
}));
