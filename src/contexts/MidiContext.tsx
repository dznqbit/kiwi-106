import { createContext } from "react";

export interface MidiPortData {
  id: string;
  name: string | null;
  manufacturer: string | null;
}

export interface MidiContextEnableData {
  enabled: boolean;
  enableError: string | null;
}

export interface MidiContext extends MidiContextEnableData {
  initialize: () => void;
}

const defaultMidiContext: MidiContext = {
  enabled: false,
  enableError: null,
  
  initialize: () => {},
};

export const MidiContext = createContext(defaultMidiContext);
