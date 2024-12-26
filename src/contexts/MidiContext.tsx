import { WebMidi } from "webmidi";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface MidiPortData {
  id: string;
  name?: string;
  manufacturer?: string;
}

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
export const MidiContextProvider = ({ children }: PropsWithChildren) => {
  const [enableData, setEnableData] = useState<MidiContextEnableData>({
    enabled: false,
    enableSuccess: null,
    enableError: null,
  });
  
  const [availableInputs, setAvailableInputs] = useState<MidiPortData[]>([]);
  const [selectedInput, setSelectedInput] = useState<MidiPortData | null>(null);
  const [availableOutputs, setAvailableOutputs] = useState<MidiPortData[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<MidiPortData | null>(null);

  const initialize = () => {
    console.log("MidiContext Initialize");
    WebMidi.enable()
      .then(() => {
        console.log("MidiContext Initialize Successful");
        setEnableData({
          enabled: true,
          enableSuccess: true,
          enableError: null,
        });
        setAvailableInputs(WebMidi.inputs.map((i) => ({ id: i.id, name: i.name, manufacturer: i.manufacturer })));
        setAvailableOutputs(WebMidi.outputs.map((o) => ({ id: o.id, name: o.name, manufacturer: o.manufacturer })));
      })
      .catch((err) => {
        console.log("MidiContext Initialize Failure:", err);
        setEnableData({
          enabled: false,
          enableSuccess: false,
          enableError: err,
        });
        setAvailableInputs([]);
        setAvailableOutputs([]);
      });
  };

  const midiContext = useMemo<MidiContext>(() => ({
    ...enableData,
    availableInputs,
    selectedInput,
    selectInput: setSelectedInput,
    availableOutputs,
    selectedOutput,
    selectOutput: setSelectedOutput,
    initialize,
  }), [enableData, availableInputs, selectedInput, selectedInput, availableOutputs, selectedOutput, setSelectedInput]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <MidiContext.Provider value={midiContext}>{children}</MidiContext.Provider>
  );
};

export const useMidiContext = () => useContext(MidiContext);
