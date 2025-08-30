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
import { IconRefresh, IconWorldDown, IconWorldUp } from "@tabler/icons-react";
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
        <List>
          <ListItem>Program version {kiwi106Context.programVersion}</ListItem>

          <ListItem>
            Bootloader version {kiwi106Context.bootloaderVersion}
          </ListItem>

          <ListItem>Build number {kiwi106Context.buildNumber}</ListItem>

          <Group>
            <Select
              label="MIDI Ch In"
              data={Array.from({ length: 16 }, (_, i) => ({
                value: (i + 1).toString(),
                label: (i + 1).toString(),
              }))}
              value={
                kiwi106Context.kiwiGlobalData?.midiChannelIn?.toString() ?? null
              }
              onChange={(value) =>
                console.log(`Select MIDI Channel In ${value}`)
              }
            />

            <Select
              label="MIDI Ch Out"
              data={Array.from({ length: 16 }, (_, i) => ({
                value: (i + 1).toString(),
                label: (i + 1).toString(),
              }))}
              value={
                kiwi106Context.kiwiGlobalData?.midiChannelOut?.toString() ??
                null
              }
              onChange={(value) =>
                console.log(`Select MIDI Channel Out ${value}`)
              }
            />

            <Select
              label="Seq MIDI Ch Out"
              data={Array.from({ length: 16 }, (_, i) => ({
                value: (i + 1).toString(),
                label: (i + 1).toString(),
              }))}
              value={
                kiwi106Context.kiwiGlobalData?.sequencerMidiChannelOut?.toString() ??
                null
              }
              onChange={(value) =>
                console.log(`Select Sequencer MIDI Channel Out ${value}`)
              }
            />
            <Text>
              Device ID: {kiwi106Context.kiwiGlobalData?.deviceId ?? "Unknown"}
            </Text>
          </Group>

          <Group>
            <Selector
              label="Enable CC"
              values={kiwi106MessageModes}
              selected={kiwi106Context.kiwiGlobalData?.enableMidiCc ?? null}
              onSelect={(x) => console.log(`Select MIDI CC ${x}`)}
            />

            <Selector
              label="Enable SysEx"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.enableSysex ?? null}
              onSelect={(x) => console.log(`Select Enable SysEx ${x}`)}
            />

            <Selector
              label="Enable PC"
              values={kiwi106MessageModes}
              selected={
                kiwi106Context.kiwiGlobalData?.enableProgramChange ?? null
              }
              onSelect={(x) => console.log(`Select Enable Program Change ${x}`)}
            />
          </Group>
          <Group>
            <Selector
              label="MIDI Soft Through"
              values={[
                "stop-all",
                "pass-all",
                "pass-only-non-cc",
                "stop-only-cc-used",
              ]}
              selected={kiwi106Context.kiwiGlobalData?.midiSoftThrough ?? null}
              onSelect={(x) => console.log(`Select MIDI Soft Through ${x}`)}
            />

            <Selector
              label="Enable MIDI Clock Gen"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.enableMidiClockGen ?? null
              }
              onSelect={(x) => console.log(`Select Enable MIDI Clock Gen ${x}`)}
            />

            <Text>
              Internal Velocity:{" "}
              {kiwi106Context.kiwiGlobalData?.internalVelocity ?? "Unknown"}
            </Text>

            <Selector
              label="Master Clock Source"
              values={[
                "internal",
                "midi",
                "ext step",
                "ext 24ppqn",
                "ext 48ppqn",
              ]}
              selected={
                kiwi106Context.kiwiGlobalData?.masterClockSource ?? null
              }
              onSelect={(x) => console.log(`Select Master Clock Source ${x}`)}
            />

            <Text>
              Pattern Level:{" "}
              {kiwi106Context.kiwiGlobalData?.patternLevel ?? "Unknown"}
            </Text>

            <Selector
              label="Pattern Destination VCA"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternDestinationVca ?? null
              }
              onSelect={(x) =>
                console.log(`Select Pattern Destination VCA ${x}`)
              }
            />

            <Selector
              label="Pattern Destination VCF"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternDestinationVcf ?? null
              }
              onSelect={(x) =>
                console.log(`Select Pattern Destination VCF ${x}`)
              }
            />

            <Selector
              label="Pattern Clock Source"
              values={["arp", "seq"]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternClockSource ?? null
              }
              onSelect={(x) => console.log(`Select Pattern Clock Source ${x}`)}
            />

            <Text>
              Internal Clock Rate:{" "}
              {kiwi106Context.kiwiGlobalData?.intClockRate ?? "Unknown"}
            </Text>

            <Text>
              MW Level: {kiwi106Context.kiwiGlobalData?.mwLevel ?? "Unknown"}
            </Text>

            <Text>
              AT Level: {kiwi106Context.kiwiGlobalData?.atLevel ?? "Unknown"}
            </Text>

            <Selector
              label="Key Transpose Disable"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.keyTransposeDisable ?? null
              }
              onSelect={(x) => console.log(`Select Key Transpose Disable ${x}`)}
            />

            <Selector
              label="Clock Display"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.clockDisplay ?? null}
              onSelect={(x) => console.log(`Select Clock Display ${x}`)}
            />

            <Selector
              label="Scrolling Display"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.scrollingDisplay ?? null}
              onSelect={(x) => console.log(`Select Scrolling Display ${x}`)}
            />

            <Text>
              Internal Tune:{" "}
              {kiwi106Context.kiwiGlobalData?.internalTune ?? "Unknown"}
            </Text>

            <Selector
              label="External Pedal Polarity"
              values={["normal", "inverse"]}
              selected={
                kiwi106Context.kiwiGlobalData?.externalPedalPolarity ?? null
              }
              onSelect={(x) =>
                console.log(`Select External Pedal Polarity ${x}`)
              }
            />
          </Group>
        </List>
      </Stack>
    </Stack>
  );
};
