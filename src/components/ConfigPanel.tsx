import {
  Code,
  Fieldset,
  Group,
  Select,
  Stack,
  Tooltip,
  Title,
} from "@mantine/core";
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
import { IconAlertCircle } from "@tabler/icons-react";

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

  return (
    <Stack>
      <Stack>
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
              <ConfigFader
                title="Internal Clock Rate"
                value={kiwiGlobalData.intClockRate}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    intClockRate: trimIntRange(v, { min: 5, max: 300 }),
                  })
                }
                min={5}
                max={300}
              />

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
              <ConfigFader
                title="Pattern Level"
                value={kiwiGlobalData.patternLevel}
                max={4095}
                onChange={(v) =>
                  setKiwiGlobalData({
                    ...kiwiGlobalData,
                    patternLevel: v,
                  })
                }
              />

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
            <ConfigFader
              title="Internal Velocity"
              value={kiwiGlobalData.internalVelocity}
              min={63}
              onChange={(v) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  internalVelocity: trimMidiCcValue(v),
                })
              }
            />

            <ConfigFader
              title="Internal Tune"
              value={kiwiGlobalData.internalTune}
              isFlaky
              onChange={(v) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  internalTune: trimMidiCcValue(v),
                })
              }
              max={127}
            />

            <ConfigFader
              title="Mod Wheel Level"
              value={kiwiGlobalData.mwLevel}
              isFlaky
              onChange={(v) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  mwLevel: trimMidiCcValue(v),
                })
              }
            />

            <ConfigFader
              title="Aftertouch Level"
              value={kiwiGlobalData.atLevel}
              isFlaky
              onChange={(v) =>
                setKiwiGlobalData({
                  ...kiwiGlobalData,
                  atLevel: trimMidiCcValue(v),
                })
              }
            />
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

interface ConfigFaderProps {
  title: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  isFlaky?: boolean;
  flakyDescription?: string;
}

function ConfigFader({
  title,
  value,
  onChange,
  min,
  max,
  isFlaky,
  flakyDescription,
}: ConfigFaderProps) {
  return (
    <Stack align="center">
      <FaderTitle label={title} {...{ isFlaky, flakyDescription }} />
      <VerticalSlider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={isFlaky}
      />
      <Code>{value}</Code>
    </Stack>
  );
}
