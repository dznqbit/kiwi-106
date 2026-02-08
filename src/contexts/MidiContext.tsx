import { createContext } from "react";

export type MidiContextStatus = 'uninitialized' | 'error' | 'enabled';
export interface MidiPortData {
  id: string;
  name: string | null;
  manufacturer: string | null;
}

export interface MidiContextEnableData {
  enabled: boolean;
  status: MidiContextStatus;
  enableError: string | null;
}

export interface MidiContext extends MidiContextEnableData {
  initialize: () => void;
}

const defaultMidiContext: MidiContext = {
  enabled: false,
  enableError: null,
  status: 'uninitialized',

  initialize: () => {},
};

export const MidiContext = createContext(defaultMidiContext);
