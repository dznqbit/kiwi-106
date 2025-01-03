import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MidiPortData } from "../contexts/MidiContext";

interface ConfigState {
  availableInputs: MidiPortData[];
  // input: MidiPortData;
  // inputChannel: MidiChannel;

  availableOutputs: MidiPortData[];
  // output: MidiPortData;
  // outputChannel: MidiChannel;
}

interface ConfigActions {
  setAvailablePorts: (i: MidiPortData[], o: MidiPortData[]) => void;
}

type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      availableInputs: [],
      availableOutputs: [],
      setAvailablePorts: (i: MidiPortData[], o: MidiPortData[]) =>
        set((prev) => ({ ...prev, availableInputs: i, availableOutputs: o })),
    }),
    {
      name: "config",
    },
  ),
);
