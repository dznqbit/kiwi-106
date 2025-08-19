import { createContext } from "react";

export interface Kiwi106Context {
  active: boolean;
  programVersion: string | null;
  bootloaderVersion: string | null;
}

const defaultKiwi106Context: Kiwi106Context = {
  active: false,
  programVersion: null,
  bootloaderVersion: null,
};

export const Kiwi106Context = createContext(defaultKiwi106Context);
