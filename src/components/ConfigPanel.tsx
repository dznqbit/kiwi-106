import { WebMidi } from "webmidi";
import { Button, Fieldset, Group, Select, Stack } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";
import { SelectMidiChannel } from "./SelectMidiChannel";
import {
  IconRefresh,
  IconExclamationCircle,
  IconBrain,
} from "@tabler/icons-react";
import { useConfigStore } from "../stores/configStore";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const midiPanic = () => {
    for (const output of WebMidi.outputs) {
      output.sendAllSoundOff();
    }
  };

  const sendProgramChangeSysex = () => {
    console.log("Send sysex message");
    if (!midiContext.selectedOutput?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(midiContext.selectedOutput?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    // const identification = [0x00, 0x21, 0x16]; // Kiwitechnics manufacturer id
    const identification = [0x7e];
    const data: number[] = [0x7f, 0x06, 0x01];

    output.sendSysex(identification, data);
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
            data={configStore.availableInputs.map(
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
            data={configStore.availableOutputs.map(
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

      <Stack>
        <Button
          onClick={() => midiContext.initialize()}
          leftSection={<IconRefresh />}
        >
          Scan
        </Button>
        <Button onClick={midiPanic} leftSection={<IconExclamationCircle />}>
          Panic
        </Button>
        <Button onClick={sendProgramChangeSysex} leftSection={<IconBrain />}>
          Sysex
        </Button>
      </Stack>
    </Group>
  );
};
