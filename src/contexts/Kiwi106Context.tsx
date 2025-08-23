import { createContext } from "react";
import { KiwiMidi } from "../types/KiwiMidi";

export interface Kiwi106Context {
  active: boolean;
  midiError: string | null;
  programVersion: string | null;
  bootloaderVersion: string | null;
  kiwiMidi: KiwiMidi | null;
}

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  midiError: null,
  programVersion: null,
  bootloaderVersion: null,
  kiwiMidi: null,
};

export const Kiwi106Context = createContext(defaultKiwi106Context);
