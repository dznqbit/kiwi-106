import { Button, Group, Select } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    midiContext.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    midiContext.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  return (
    <Group>
      <Select
        label="Input"
        placeholder={midiContext.enabled ? "Select an input" : "Not available"}
        value={formatName(midiContext.selectedInput)}
        data={midiContext.availableInputs.map(
          (i) => `${i.manufacturer} ${i.name}`,
        )}
        onChange={(fn) => midiContext.selectInput(findInputByFormattedName(fn))}
      ></Select>
      <Select
        label="Output"
        placeholder={midiContext.enabled ? "Select an output" : "Not available"}
        value={formatName(midiContext.selectedOutput)}
        data={midiContext.availableOutputs.map(
          (i) => `${i.manufacturer} ${i.name}`,
        )}
        onChange={(fn) =>
          midiContext.selectOutput(findOutputByFormattedName(fn))
        }
      ></Select>
      <Button onClick={() => midiContext.initialize()}>Reset</Button>
    </Group>
  );
};
