import { createContext } from "react";

export type MidiChannel = number;

export interface MidiPortData {
  id: string;
  name: string | null;
  manufacturer: string | null;
}

export interface MidiContextEnableData {
  enabled: boolean;
  enableSuccess: boolean | null;
  enableError: string | null;
}

export interface MidiContext extends MidiContextEnableData {
  initialize: () => void;
}

const defaultMidiContext: MidiContext = {
  enabled: false,
  enableSuccess: null,
  enableError: null,
  initialize: () => {},
};

export const MidiContext = createContext(defaultMidiContext);
