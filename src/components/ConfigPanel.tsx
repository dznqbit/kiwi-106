import { WebMidi } from "webmidi";
import { Button, Fieldset, Group, Select } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";
import { SelectMidiChannel } from "./SelectMidiChannel";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    midiContext.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    midiContext.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const midiPanic = () => {
    for (const output of WebMidi.outputs) {
      output.sendAllSoundOff();
    }
  };

  return (
    <Group wrap="nowrap">
      <Fieldset legend="Input">
        <Group wrap="nowrap">
          <Select
            label="Device"
            clearable
            allowDeselect={false}
            placeholder={
              midiContext.enabled ? "Select an input" : "Not available"
            }
            value={formatName(midiContext.selectedInput)}
            data={midiContext.availableInputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              midiContext.selectInput(findInputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={midiContext.inputChannel}
            onChange={(c) => midiContext.setInputChannel(c)}
          />
        </Group>
      </Fieldset>

      <Fieldset legend="Output">
        <Group wrap="nowrap">
          <Select
            label="Device"
            clearable
            allowDeselect={false}
            placeholder={
              midiContext.enabled ? "Select an output" : "Not available"
            }
            value={formatName(midiContext.selectedOutput)}
            data={midiContext.availableOutputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              midiContext.selectOutput(findOutputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={midiContext.outputChannel}
            onChange={(c) => midiContext.setOutputChannel(c)}
          />
        </Group>
      </Fieldset>

      <Button onClick={() => midiContext.initialize()}>Reset</Button>
      <Button onClick={midiPanic}>Panic</Button>
    </Group>
  );
};
