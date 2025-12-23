import { create } from "zustand";
import { KiwiPatch } from "../types/KiwiPatch";

// How state was most recently updated
type UpdatedBy = undefined | "Sysex Dump" | "Control Change" | "Editor Change";

interface KiwiPatchState {
  updatedBy: UpdatedBy;
  kiwiPatch: KiwiPatch;
}

interface KiwiPatchActions {
  setKiwiPatch: (
    kiwiPatch: KiwiPatch,
    options: { updatedBy: UpdatedBy },
  ) => void;
  setKiwiPatchProperty: (
    key: keyof KiwiPatch,
    value: KiwiPatch[keyof KiwiPatch],
    options: { updatedBy: UpdatedBy },
  ) => void;
}

type KiwiPatchStore = KiwiPatchState & KiwiPatchActions;

const blankKiwiPatchState: KiwiPatchState = {
  updatedBy: undefined,
  kiwiPatch: {
    patchName: "Default",

    portamentoTime: 0,
    volume: 0,
    dcoRange: "16",
    dcoWave: "off",
    dcoPwmModAmount: 0,
    dcoPwmControl: "manual",
    dcoLfoModAmount: 0,
    dcoLfoSource: "lfo1",
    dcoEnvelopeModAmount: 0,
    dcoEnvelopeSource: 0,

    lfo1Wave: 0,
    lfo1Rate: 0,
    lfo1Delay: 0,
    lfo2Wave: 0,
    lfo2Rate: 0,
    lfo2Delay: 0,
    lfo1Mode: "normal",
    lfo2Mode: "normal",

    subLevel: 0,
    noiseLevel: 0,

    vcfLowPassCutoff: 0,
    vcfLowPassResonance: 0,
    vcfPitchFollow: 0,
    vcfHiPassCutoff: 0,
    vcfLfoModAmount: 0,
    vcfLfoSource: "lfo1",
    vcfEnvelopeModAmount: 0,
    vcfEnvelopeSource: 0,

    env1Attack: 0,
    env1Decay: 0,
    env1Sustain: 0,
    env1Release: 0,
    chorusMode: 0,
    vcaLfoModAmount: 0,
    vcaLfoSource: "lfo1",
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

  setKiwiPatch: (kiwiPatch, { updatedBy }) => {
    set((store) => ({
      ...store,
      updatedBy,
      kiwiPatch,
    }));
  },

  setKiwiPatchProperty: (key, value, { updatedBy }) =>
    set(({ kiwiPatch, ...rest }) => ({
      ...rest,
      updatedBy,
      kiwiPatch: { ...kiwiPatch, [key]: value },
    })),
}));
