import { Input, Output, WebMidi } from "webmidi";
import { PropsWithChildren, useState, useMemo, useCallback } from "react";
import {
  MidiChannel,
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
    enableSuccess: null,
    enableError: null,
  });

  const [selectedInput, setSelectedInput] = useState<MidiPortData | null>(null);
  const [inputChannel, setInputChannel] = useState<MidiChannel>(1);
  const [selectedOutput, setSelectedOutput] = useState<MidiPortData | null>(
    null,
  );
  const [outputChannel, setOutputChannel] = useState<MidiChannel>(1);

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
          enableSuccess: true,
          enableError: null,
        });
      })
      .catch((err) => {
        console.log("MidiContext Initialize Failure:", err);
        setEnableData({
          enabled: false,
          enableSuccess: false,
          enableError: err,
        });
      });
  }, [configStore]);

  const midiContext = useMemo<MidiContext>(
    () => ({
      ...enableData,
      selectedInput,
      selectInput: setSelectedInput,
      inputChannel,
      setInputChannel,

      selectedOutput,
      selectOutput: setSelectedOutput,
      initialize,
      outputChannel,
      setOutputChannel,
    }),
    [
      enableData,
      selectedInput,
      setSelectedInput,
      inputChannel,
      setInputChannel,
      selectedOutput,
      setSelectedOutput,
      outputChannel,
      setOutputChannel,
      initialize,
    ],
  );

  // Temp commented out – was causing infinite loop?
  // useEffect(() => {
  //   initialize();
  // });

  return (
    <MidiContext.Provider value={midiContext}>{children}</MidiContext.Provider>
  );
};
