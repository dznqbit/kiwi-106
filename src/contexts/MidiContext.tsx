import { createContext } from "react";

export interface MidiPortData {
  id: string;
  name?: string;
  manufacturer?: string;
}

export interface MidiContextEnableData {
  enabled: boolean;
  enableSuccess: boolean | null;
  enableError: string | null;
}

export interface MidiContext extends MidiContextEnableData {
  initialize: () => void;

  availableInputs: MidiPortData[];
  selectedInput: MidiPortData | null;
  selectInput: (i: MidiPortData | null) => void;

  availableOutputs: MidiPortData[];
  selectedOutput: MidiPortData | null;
  selectOutput: (o: MidiPortData | null) => void;
}

const defaultMidiContext: MidiContext = {
  enabled: false,
  enableSuccess: null,
  enableError: null,
  initialize: () => {},
  availableInputs: [],
  selectedInput: null,
  selectInput: () => {},
  availableOutputs: [],
  selectedOutput: null,
  selectOutput: () => {},
};

export const MidiContext = createContext(defaultMidiContext);
