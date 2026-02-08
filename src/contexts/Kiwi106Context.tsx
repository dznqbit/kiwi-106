import { createContext } from "react";
import { KiwiMidi } from "../types/KiwiMidi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";

type DisabledKiwi106Context = {
  active: false;
  error: string | null;
};

type EnabledKiwi106Context = {
  active: true;
  error: string | null;
  connected: boolean;
  programVersion: string;
  bootloaderVersion: string;
  buildNumber: string;
  kiwiMidi: KiwiMidi;
  kiwiGlobalData: KiwiGlobalData;
};

export type Kiwi106Context = EnabledKiwi106Context | DisabledKiwi106Context;

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  error: null,
};

export const Kiwi106Context = createContext<Kiwi106Context>(
  defaultKiwi106Context,
);
