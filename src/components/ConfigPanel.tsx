import { Button, Fieldset, Group, Select, Stack } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";
import { SelectMidiChannel } from "./SelectMidiChannel";
import { IconRefresh, IconBrain } from "@tabler/icons-react";
import { useConfigStore } from "../stores/configStore";
import { isMidiChannel } from "../types/Midi";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const kiwi106Context = useKiwi106Context();
  const configStore = useConfigStore();
  const kiwiPatchStore = useKiwiPatchStore();

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const requestGlobalDumpSysex = () => {
    kiwi106Context.kiwiMidi?.requestSysexGlobalDump();
  };

  const requestEditBufferDumpSysex = () => {
    console.log("request edit buffer from", kiwi106Context.kiwiMidi);
    kiwi106Context.kiwiMidi?.requestSysexEditBufferDump();
  };

  const sendPatchBufferDumpSysex = () => {
    kiwi106Context.kiwiMidi?.sendSysexPatchBufferDump(kiwiPatchStore.kiwiPatch);
  };

  const requestPatchNameSysex = () => {
    kiwi106Context.kiwiMidi?.requestSysexPatchName();
    console.log("Requested patch name");
  };

  return (
    <Stack>
      <Group>
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
              onChange={(c) => {
                if (isMidiChannel(c)) {
                  configStore.setInputChannel(c);
                }
              }}
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
              onChange={(c) => {
                if (isMidiChannel(c)) {
                  configStore.setOutputChannel(c);
                }
              }}
            />
          </Group>
        </Fieldset>
      </Group>
      <Stack>
        <Button
          onClick={() => midiContext.initialize()}
          leftSection={<IconRefresh />}
        >
          Scan
        </Button>
        <Button onClick={requestGlobalDumpSysex} leftSection={<IconBrain />}>
          Request Global Dump
        </Button>
        <Button
          onClick={requestEditBufferDumpSysex}
          leftSection={<IconBrain />}
        >
          Request Patch Dump
        </Button>
        <Button onClick={sendPatchBufferDumpSysex} leftSection={<IconBrain />}>
          Send Patch Dump
        </Button>
        <Button onClick={requestPatchNameSysex} leftSection={<IconBrain />}>
          Request Patch Name
        </Button>
      </Stack>
    </Stack>
  );
};
