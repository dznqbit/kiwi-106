import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MidiChannel, MidiPortData } from "../contexts/MidiContext";

interface ConfigState {
  availableInputs: MidiPortData[];
  input: MidiPortData | null;
  inputChannel: MidiChannel;

  availableOutputs: MidiPortData[];
  output: MidiPortData | null;
  outputChannel: MidiChannel;
}

interface ConfigActions {
  setAvailablePorts: (i: MidiPortData[], o: MidiPortData[]) => void;
  setInput: (input: MidiPortData | null) => void;
  setInputChannel: (inputChannel: MidiChannel) => void;
  setOutput: (output: MidiPortData | null) => void;
  setOutputChannel: (inputChannel: MidiChannel) => void;
}

type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      availableInputs: [],
      availableOutputs: [],
      input: null,
      inputChannel: 1,
      output: null,
      outputChannel: 1,

      setAvailablePorts: (i: MidiPortData[], o: MidiPortData[]) =>
        set((prev) => ({ ...prev, availableInputs: i, availableOutputs: o })),
      setInput: (input: MidiPortData | null) =>
        set((prev) => ({ ...prev, input })),
      setInputChannel: (inputChannel: MidiChannel) =>
        set((prev) => ({ ...prev, inputChannel })),
      setOutput: (output: MidiPortData | null) =>
        set((prev) => ({ ...prev, output })),
      setOutputChannel: (outputChannel: MidiChannel) =>
        set((prev) => ({ ...prev, outputChannel })),
    }),
    {
      name: "config",
    },
  ),
);
