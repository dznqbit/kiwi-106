import { Input, Output, WebMidi } from "webmidi";
import { PropsWithChildren, useState, useMemo, useCallback } from "react";
import {
  MidiContext,
  MidiContextEnableData,
  MidiPortData,
} from "./MidiContext";
import { useConfigStore } from "../stores/configStore";

const mapWebmidiPort = (p: Input | Output): MidiPortData => ({
  id: p.id,
  name: p.name,
  manufacturer: p.manufacturer,
});

export const MidiContextProvider = ({ children }: PropsWithChildren) => {
  const configStore = useConfigStore();

  const [enableData, setEnableData] = useState<MidiContextEnableData>({
    enabled: false,
    enableError: null,
    status: "uninitialized",
  });

  const initialize = useCallback(() => {
    console.log("MidiContext Initialize");
    WebMidi.enable({
      sysex: true,
    })
      .then(() => {
        console.log("MidiContext Initialize Successful");
        const inputs = WebMidi.inputs.map(mapWebmidiPort);
        const outputs = WebMidi.outputs.map(mapWebmidiPort);
        configStore.setAvailablePorts(inputs, outputs);

        setEnableData({
          enabled: true,
          status: "enabled",
          enableError: null,
        });
      })
      .catch((err) => {
        console.log("MidiContext Initialize Failure:", err);
        setEnableData({
          enabled: false,
          status: "error",
          enableError: err,
        });
      });
  }, [configStore]);

  const midiContext = useMemo<MidiContext>(
    () => ({
      ...enableData,
      initialize,
    }),
    [enableData, initialize],
  );

  return (
    <MidiContext.Provider value={midiContext}>{children}</MidiContext.Provider>
  );
};
