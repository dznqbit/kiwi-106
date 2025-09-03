import { createContext } from "react";
import { KiwiMidi } from "../types/KiwiMidi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";

type DisabledKiwi106Context = {
  active: false;
  midiError: string | null;
};

type EnabledKiwi106Context = {
  active: true;
  midiError: string | null;
  programVersion: string;
  bootloaderVersion: string;
  buildNumber: string;
  kiwiMidi: KiwiMidi;
  kiwiGlobalData: KiwiGlobalData;
};

export type Kiwi106Context = EnabledKiwi106Context | DisabledKiwi106Context;

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  midiError: null,
};

export const Kiwi106Context = createContext<Kiwi106Context>(
  defaultKiwi106Context,
);
