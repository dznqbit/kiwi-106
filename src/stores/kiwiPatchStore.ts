import { create } from "zustand";
import { KiwiPatch } from "../types/KiwiPatch";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";

type SetMidiCcValue = (v: number) => void;
interface KiwiPatchState {
  kiwiPatch: KiwiPatch;
}

interface KiwiPatchActions {
  setPortamentoTime: SetMidiCcValue;
  setVolume: SetMidiCcValue;
}

type KiwiPatchStore = KiwiPatchState & KiwiPatchActions;

const blankKiwiPatchState: KiwiPatchState = {
  kiwiPatch: {
    portamentoTime: 0,
    volume: 0,
  }
}

export const useKiwiPatchStore = create<KiwiPatchStore>()(
  (set) => ({
    ...blankKiwiPatchState,

    setPortamentoTime: (v: number) => set(({ kiwiPatch, ...rest }) => ({ ...rest, kiwiPatch: { ...kiwiPatch, portamentoTime: trimMidiCcValue(v) }})),
    setVolume: (v: number) => set(({ kiwiPatch, ...rest }) => ({ ...rest, kiwiPatch: { ...kiwiPatch, volume: trimMidiCcValue(v) }})),
  }),
);