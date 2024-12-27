import { createContext } from "react";

export type MidiChannel = number;

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
  inputChannel: number;
  setInputChannel: (c: number) => void;

  availableOutputs: MidiPortData[];
  selectedOutput: MidiPortData | null;
  selectOutput: (o: MidiPortData | null) => void;
  outputChannel: number;
  setOutputChannel: (c: number) => void;
}

const defaultMidiContext: MidiContext = {
  enabled: false,
  enableSuccess: null,
  enableError: null,
  initialize: () => {},

  availableInputs: [],
  selectedInput: null,
  selectInput: () => {},
  inputChannel: 1,
  setInputChannel: () => {},

  availableOutputs: [],
  selectedOutput: null,
  selectOutput: () => {},
  outputChannel: 1,
  setOutputChannel: () => {},
};

export const MidiContext = createContext(defaultMidiContext);
