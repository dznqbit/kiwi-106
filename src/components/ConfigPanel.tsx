import {
  Code,
  Fieldset,
  Group,
  List,
  ListItem,
  Select,
  Stack,
  Tooltip,
  Title,
  Box,
} from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
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
import {
  trimIntRange,
  trimMidiCcValue,
  trimMidiChannel,
} from "../utils/trimMidiCcValue";
import { IconAlertCircle, IconPlugConnectedX } from "@tabler/icons-react";

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

const externalPedalPolarityData = [
  { value: "normal" as const, label: "normal" },
  { value: "inverse" as const, label: "inverse" },
];

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
          <ListItem>Device ID {kiwiGlobalData.deviceId}</ListItem>
        </List>

        <Group>
          <Select
            label="MIDI Ch In"
            data={midiChannelData}
            value={kiwiGlobalData.midiChannelIn.toString()}
            onChange={(d) =>
              setKiwiGlobalData({
                ...kiwiGlobalData,
                midiChannelIn: trimMidiChannel(Number(d)),
              })
            }
          />

          <Select
            label="MIDI Ch Out"
            data={midiChannelData}
            value={kiwiGlobalData.midiChannelOut.toString()}
            onChange={(d) =>
              setKiwiGlobalData({
                ...kiwiGlobalData,
                midiChannelOut: trimMidiChannel(Number(d)),
              })
            }
          />

          <Select
            label="Seq MIDI Ch Out"
            data={midiChannelData}
            value={kiwiGlobalData.sequencerMidiChannelOut.toString()}
            onChange={(d) =>
              setKiwiGlobalData({
                ...kiwiGlobalData,
                sequencerMidiChannelOut: trimMidiChannel(Number(d)),
              })
            }
          />
        </Group>

        <Group align="flex-start">
          <Fieldset w="52%" legend="Message Routing">
            <Group wrap="nowrap" align="flex-start">
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
                data={[
                  { value: true, label: "rx-tx" },
                  { value: false, label: "tx" },
                ]}
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
            </Group>
          </Fieldset>

          <Fieldset w="44%" legend="Clock">
            <Group justify="flex-start" align="flex-start">
              <Stack align="center">
                <Title order={5}>Internal Clock Rate</Title>
                <VerticalSlider
                  value={kiwiGlobalData.intClockRate}
                  max={300}
                  onChange={(v) =>
                    setKiwiGlobalData({
                      ...kiwiGlobalData,
                      intClockRate: trimIntRange(v, { min: 5, max: 300 }),
                    })
                  }
                />
                <Code>{kiwiGlobalData.intClockRate}</Code>
              </Stack>

              <Stack align="flex-start">
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
              </Stack>
            </Group>
          </Fieldset>
        </Group>

        <Group align="flex-start">
          <Fieldset w="52%" legend="Misc">
            <Stack justify="flex-start">
              <JunoToggleSwitch
                isFlaky
                label="External Pedal Polarity"
                data={externalPedalPolarityData}
                selected={kiwiGlobalData.externalPedalPolarity}
                onSelect={(d) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    externalPedalPolarity: d,
                  })
                }
              />

              <JunoToggleSwitch
                isFlaky
                label="Key Transpose Disable"
                data={enabledData}
                selected={kiwiGlobalData.keyTransposeDisable}
                onSelect={(d) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    keyTransposeDisable: d,
                  })
                }
              />

              <JunoToggleSwitch
                isFlaky
                label="Clock Display"
                data={enabledData}
                selected={kiwiGlobalData.clockDisplay}
                onSelect={(d) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    clockDisplay: d,
                  })
                }
              />

              <JunoToggleSwitch
                isFlaky
                label="Scrolling Display"
                data={enabledData}
                selected={kiwiGlobalData.scrollingDisplay}
                onSelect={(d) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    scrollingDisplay: d,
                  })
                }
              />
            </Stack>
          </Fieldset>

          <Fieldset w="44%" legend="Pattern Control">
            <Group align="flex-start">
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

              <Stack align="center">
                <JunoToggleSwitch
                  isFlaky
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
                  isFlaky
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
                  isFlaky
                  label="Pattern Clock Source"
                  data={[
                    { value: "seq" as const, label: "seq" },
                    { value: "arp" as const, label: "arp" },
                  ]}
                  selected={kiwiGlobalData.patternClockSource}
                  onSelect={(d) =>
                    setKiwiGlobalData({
                      ...kiwiGlobalData,
                      patternClockSource: d,
                    })
                  }
                />
              </Stack>
            </Group>
          </Fieldset>
        </Group>

        <Fieldset legend="Levels">
          <Group>
            <Stack align="center">
              <FaderTitle label="Internal Velocity" />
              <VerticalSlider
                value={kiwiGlobalData.internalVelocity}
                min={63}
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
              <FaderTitle isFlaky label="Internal Tune" />
              <VerticalSlider
                value={kiwiGlobalData.internalTune}
                max={127}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    internalTune: trimMidiCcValue(v),
                  })
                }
              />
              <Code>{kiwiGlobalData.internalTune}</Code>
            </Stack>

            <Stack align="center">
              <FaderTitle isFlaky label="Mod Wheel Level" />
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
              <FaderTitle isFlaky label="Aftertouch Level" />
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
          </Group>
        </Fieldset>
      </Stack>
    </Stack>
  );
};

interface FaderTitleProps {
  flakyDescription?: string;
  isFlaky?: boolean;
  label: string;
  tooltip?: string;
}

function FaderTitle({
  flakyDescription,
  isFlaky,
  label,
  tooltip,
}: FaderTitleProps) {
  const titleNode = (
    <Group gap="xs">
      <Title order={5}>{label}</Title>
      {isFlaky && (
        <Tooltip
          label={
            flakyDescription ??
            "This setting is read-only, and cannot be written to the Kiwi106"
          }
        >
          <IconAlertCircle />
        </Tooltip>
      )}
    </Group>
  );

  return (
    <>{tooltip ? <Tooltip label={tooltip}>{titleNode}</Tooltip> : titleNode}</>
  );
}
