import { createContext } from "react";
import { KiwiMidi } from "../types/KiwiMidi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";

export interface Kiwi106Context {
  active: boolean;
  midiError: string | null;
  programVersion: string | null;
  bootloaderVersion: string | null;
  buildNumber: string | null;
  kiwiMidi: KiwiMidi | null;
  kiwiGlobalData: KiwiGlobalData | null;
}

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  midiError: null,
  programVersion: null,
  bootloaderVersion: null,
  buildNumber: null,
  kiwiMidi: null,
  kiwiGlobalData: null,
};

export const Kiwi106Context = createContext(defaultKiwi106Context);
