import {
  Code,
  Group,
  List,
  ListItem,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { Selector } from "./Selector";
import {
  kiwi106MessageModes,
  Kiwi106MasterClockSource,
  masterClockSources,
  Kiwi106MidiSoftThroughMode,
  kiwi106MidiSoftThroughModes,
  KiwiGlobalData,
} from "../types/KiwiGlobalData";
import { midiChannels } from "../types/Midi";
import { JunoToggleSwitch } from "./JunoToggleSwitch";
import { VerticalSlider } from "./VerticalSlider";
import { trimIntRange, trimMidiCcValue } from "../utils/trimMidiCcValue";

interface ConfigPanelProps {
  kiwiGlobalData: KiwiGlobalData;
  setKiwiGlobalData: (kgd: KiwiGlobalData) => void;
}

const midiSoftThroughDataLabels: Record<Kiwi106MidiSoftThroughMode, string> = {
  "stop-all": "Stop all",
  "pass-all": "Pass all",
  "pass-only-non-cc": "Pass non-CC",
  "stop-only-cc-used": "Stop used CC",
};
const midiSoftThroughData = kiwi106MidiSoftThroughModes.map((value) => ({
  value,
  label: midiSoftThroughDataLabels[value],
}));

const masterClockSourceLabels: Record<Kiwi106MasterClockSource, string> = {
  internal: "int",
  midi: "midi",
  "ext step": "ext step",
  "ext 24ppqn": "ext 24ppqn",
  "ext 48ppqn": "ext 48ppqn",
};

export const ConfigPanel = ({
  kiwiGlobalData,
  setKiwiGlobalData,
}: ConfigPanelProps) => {
  const kiwi106Context = useKiwi106Context();
  const midiChannelData = midiChannels.map((c) => ({
    value: c.toString(),
    label: c.toString(),
  }));

  const kiwi106MessageData = kiwi106MessageModes
    .map((mm) => ({
      value: mm,
      label: mm,
    }))
    .reverse();

  const enabledData = [
    { value: true, label: "on" },
    { value: false, label: "off" },
  ];

  if (!kiwi106Context.active) {
    return <></>;
  }

  return (
    <Stack>
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
              data={midiChannelData}
              value={
                kiwi106Context.kiwiGlobalData?.midiChannelIn?.toString() ?? null
              }
              onChange={(value) =>
                console.log(`Select MIDI Channel In ${value}`)
              }
            />

            <Select
              label="MIDI Ch Out"
              data={midiChannelData}
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
              data={midiChannelData}
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

          <Group align="flex-start">
            <JunoToggleSwitch
              label="CC"
              data={kiwi106MessageData}
              selected={kiwiGlobalData.enableControlChange}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  enableControlChange: d,
                })
              }
            />

            <JunoToggleSwitch
              label="PC"
              data={kiwi106MessageData}
              selected={kiwiGlobalData.enableProgramChange}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  enableProgramChange: d,
                })
              }
            />

            <JunoToggleSwitch
              label="Sysex"
              data={enabledData}
              selected={kiwiGlobalData.enableSysex}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  enableSysex: d,
                })
              }
            />

            <JunoToggleSwitch
              label="MIDI Thru"
              data={midiSoftThroughData}
              selected={kiwiGlobalData.midiSoftThrough}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  midiSoftThrough: d,
                })
              }
            />

            <JunoToggleSwitch
              label="MIDI Clock Gen"
              tooltip="Output the internally generated clock as a midi clock command."
              data={enabledData}
              selected={kiwiGlobalData.enableMidiClockGen}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  enableMidiClockGen: d,
                })
              }
            />

            <JunoToggleSwitch
              label="Clock Source"
              data={masterClockSources.map((value) => ({
                value,
                label: masterClockSourceLabels[value],
              }))}
              selected={kiwiGlobalData.masterClockSource}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  masterClockSource: d,
                })
              }
            />

            <Stack align="center">
              <Title order={5}>Internal Clock Rate</Title>
              <VerticalSlider
                value={kiwiGlobalData.intClockRate}
                max={255}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    intClockRate: trimIntRange(v, { min: 0, max: 255 }),
                  })
                }
              />
              <Code>{kiwiGlobalData.intClockRate}</Code>
            </Stack>
          </Group>
          <Group align="flex-start">
            <Stack align="center">
              <Title order={5}>Internal Velocity</Title>
              <VerticalSlider
                value={kiwiGlobalData.internalVelocity}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    internalVelocity: trimMidiCcValue(v),
                  })
                }
              />
              <Code>{kiwiGlobalData.internalVelocity}</Code>
            </Stack>

            <Stack align="center">
              <Title order={5}>Pattern Level</Title>
              <VerticalSlider
                value={kiwiGlobalData.patternLevel}
                max={4095}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    patternLevel: v,
                  })
                }
              />
              <Code>{kiwiGlobalData.patternLevel}</Code>
            </Stack>

            <JunoToggleSwitch
              label="Pattern > VCA"
              data={enabledData}
              selected={kiwiGlobalData.patternDestinationVca}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  patternDestinationVca: d,
                })
              }
            />

            <JunoToggleSwitch
              label="Pattern > VCF"
              data={enabledData}
              selected={kiwiGlobalData.patternDestinationVcf}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  patternDestinationVcf: d,
                })
              }
            />

            <JunoToggleSwitch
              label="Pattern Clock Source"
              data={[
                { value: "arp" as const, label: "arp" },
                { value: "seq" as const, label: "seq" },
              ]}
              selected={kiwiGlobalData.patternClockSource}
              onSelect={(d) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  patternClockSource: d,
                })
              }
            />
          </Group>
          <Group>
            <Stack align="center">
              <Title order={5}>MW Level</Title>
              <VerticalSlider
                value={kiwiGlobalData.mwLevel}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    mwLevel: trimMidiCcValue(v),
                  })
                }
              />
              <Code>{kiwiGlobalData.mwLevel}</Code>
            </Stack>

            <Stack align="center">
              <Title order={5}>AT Level</Title>
              <VerticalSlider
                value={kiwiGlobalData.atLevel}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    atLevel: trimMidiCcValue(v),
                  })
                }
              />
              <Code>{kiwiGlobalData.atLevel}</Code>
            </Stack>
            
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
