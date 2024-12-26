import { createContext } from "react";
import { MidiPortData } from "../types/MidiPortData";
interface MidiContextEnableData {
  enabled: boolean;
  enableSuccess: boolean | null;
  enableError: string | null;
}

interface MidiContext extends MidiContextEnableData {
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
