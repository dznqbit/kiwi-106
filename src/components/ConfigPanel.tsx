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
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    // Universal
    const universalNonRealtimeIdentification = [0x7e];
    const universalData: number[] = [
      0x7f, // ALL devices
      0x06, // General information
      0x01  // Device Inquiry request
    ];

    output.sendSysex(universalNonRealtimeIdentification, universalData);
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
            value={formatName(configStore.input)}
            data={configStore.availableInputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              configStore.setInput(findInputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={configStore.inputChannel}
            onChange={(c) => configStore.setInputChannel(c)}
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
            value={formatName(configStore.output)}
            data={configStore.availableOutputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              configStore.setOutput(findOutputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={configStore.outputChannel}
            onChange={(c) => configStore.setOutputChannel(c)}
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
