import { WebMidi } from "webmidi";
import { PropsWithChildren, useState, useMemo, useEffect } from "react";
import {
  MidiChannel,
  MidiContext,
  MidiContextEnableData,
  MidiPortData,
} from "./MidiContext";

export const MidiContextProvider = ({ children }: PropsWithChildren) => {
  const [enableData, setEnableData] = useState<MidiContextEnableData>({
    enabled: false,
    enableSuccess: null,
    enableError: null,
  });

  const [availableInputs, setAvailableInputs] = useState<MidiPortData[]>([]);
  const [selectedInput, setSelectedInput] = useState<MidiPortData | null>(null);
  const [inputChannel, setInputChannel] = useState<MidiChannel>(1);

  const [availableOutputs, setAvailableOutputs] = useState<MidiPortData[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<MidiPortData | null>(
    null,
  );
  const [outputChannel, setOutputChannel] = useState<MidiChannel>(1);

  const initialize = () => {
    console.log("MidiContext Initialize");
    WebMidi.enable({
      sysex: true,
    })
      .then(() => {
        console.log("MidiContext Initialize Successful");
        setEnableData({
          enabled: true,
          enableSuccess: true,
          enableError: null,
        });
        setAvailableInputs(
          WebMidi.inputs.map((i) => ({
            id: i.id,
            name: i.name,
            manufacturer: i.manufacturer,
          })),
        );
        setAvailableOutputs(
          WebMidi.outputs.map((o) => ({
            id: o.id,
            name: o.name,
            manufacturer: o.manufacturer,
          })),
        );
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

  const midiContext = useMemo<MidiContext>(
    () => ({
      ...enableData,
      availableInputs,
      selectedInput,
      selectInput: setSelectedInput,
      inputChannel,
      setInputChannel,

      availableOutputs,
      selectedOutput,
      selectOutput: setSelectedOutput,
      initialize,
      outputChannel,
      setOutputChannel,
    }),
    [
      enableData,
      availableInputs,
      selectedInput,
      setSelectedInput,
      inputChannel,
      setInputChannel,
      availableOutputs,
      selectedOutput,
      setSelectedOutput,
      outputChannel,
      setOutputChannel,
    ],
  );

  useEffect(() => {
    initialize();
  }, []);

  return (
    <MidiContext.Provider value={midiContext}>{children}</MidiContext.Provider>
  );
};
