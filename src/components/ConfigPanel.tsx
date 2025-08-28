import {
  Button,
  Fieldset,
  Group,
  List,
  ListItem,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";
import { SelectMidiChannel } from "./SelectMidiChannel";
import { IconRefresh, IconBrain } from "@tabler/icons-react";
import { useConfigStore } from "../stores/configStore";
import { isMidiChannel } from "../types/Midi";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { Selector } from "./Selector";
import { kiwi106MessageModes } from "../types/KiwiGlobalData";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const kiwi106Context = useKiwi106Context();
  const configStore = useConfigStore();

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const requestGlobalDumpSysex = () => {
    kiwi106Context.kiwiMidi?.requestSysexGlobalDump();
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
                (i) => `${i.manufacturer} ${i.name}`
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
                (i) => `${i.manufacturer} ${i.name}`
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
        <List>
          <ListItem>Program version {kiwi106Context.programVersion}</ListItem>

          <ListItem>
            Bootloader version {kiwi106Context.bootloaderVersion}
          </ListItem>

          <ListItem>Build number {kiwi106Context.buildNumber}</ListItem>

          <Group>
            <Selector
              label="Midi CC"
              values={kiwi106MessageModes}
              selected={kiwi106Context.kiwiGlobalData?.enableMidiCc ?? null}
              onSelect={(x) => console.log(`Select Midi CC ${x}`)}
            />
          </Group>
        </List>
      </Stack>
    </Stack>
  );
};
