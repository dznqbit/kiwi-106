import { createContext } from "react";
import { KiwiMidi, KiwiMidiFatalError } from "../types/KiwiMidi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";

type BaseKiwi106Context = {
  active: false;
  error: string | null;
  fatalError: KiwiMidiFatalError | null;
};

type ConnectedKiwi106Context = {
  active: true;
  error: string | null;
  connected: boolean;
  programVersion: string;
  bootloaderVersion: string;
  buildNumber: string;
  kiwiMidi: KiwiMidi;
  kiwiGlobalData: KiwiGlobalData;
};

export type Kiwi106Context = ConnectedKiwi106Context | BaseKiwi106Context;

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  error: null,
  fatalError: null,
};

export const Kiwi106Context = createContext<Kiwi106Context>(
  defaultKiwi106Context,
);
